import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { PlayerService } from '../httpservices/player.service';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatePlayerService {

  private player?: Player;
  private allplayers?: Player[];
  private zaino?: Card[] = [];
  private zainoNoCache?: Card[] = [];
  private inventory?: Pack[];

  private etichette?:any;

  private bonus: boolean = false;

  private checkLogin = new BehaviorSubject<Player | undefined>(undefined);
  private checkZaino = new BehaviorSubject<Card[] | undefined>(undefined);

  private currZainoIndex: number = 0;
  private currPageZaino: number = 1;
  private numCardZaino: number = 0;

  private checkZainoNoCache = new BehaviorSubject<Card[] | undefined>(undefined);
  private currZainoNoCacheIndex: number = 0;
  private currPageZainoNoCache: number = 1;
  private numCardZainoNoCache: number = 0;

  constructor(private spinnerService: NgxSpinnerService,
    private playerService: PlayerService,
    private socket: Socket) {

  }

  setBonus(bonus:boolean) {
    this.bonus = bonus;
  }

  getBonus() {
    return this.bonus;
  }

  resetZaino() {
    this.zaino = undefined;
  }

  resetPlayerState() {
    this.player = undefined;
  }

  resetInventory() {
    this.inventory = undefined;
  }

  resetEtichette() {
    this.etichette = undefined;
  }

  resetNumCardZaino() {
    this.numCardZaino = 0;
  }
  resetNumCardZainoNoCache() {
    this.numCardZainoNoCache = 0;
  }

  resetState() {
    this.player = undefined;
    this.allplayers = undefined;
    this.zaino = undefined;
    this.inventory = undefined;
    this.etichette = undefined;
    this.resetNumCardZaino();
    this.resetNumCardZainoNoCache();
  }

  getLoginPlayer() {
    return this.checkLogin;
  }

  getZaino() {
    return this.checkZaino;
  }

  getZainoNoCache() {
    return this.checkZainoNoCache;
  }

  async getPlayer(id:string) {
    this.spinnerService.show();

    if(!this.player) {
      try {
        const response = await firstValueFrom(this.playerService.getPlayerById(id));
        this.player = response;
        this.checkLogin.next(this.player);
        this.getNumCardZaino(this.player._id!);

        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    if(this.player?.ruolo!==3) {
      this.socket.emit('sign_in', this.player!.name);
    }

    return this.player;
  }

  async updatePlayer(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.playerService.updatePlayer(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async getAllPlayers(id:string) {
    this.spinnerService.show();

    if(!this.allplayers || this.allplayers.length===0) {
      try {
        this.allplayers = [];
        const response = await firstValueFrom(this.playerService.getAllPlayers());
        for(let player of response) {
          if(player._id! !== id) {
            this.allplayers.push(player);
          }
        }
        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    return this.allplayers;
  }

  async getZainoPlayer(id:string) {
    this.zainoNoCache=undefined;
    this.checkZainoNoCache.next(undefined);
    this.currZainoNoCacheIndex = 0;
    this.currPageZainoNoCache = 1;
    this.getNumCardZaino(id,true);
  }

  async getZainoAll(id:string,cache:boolean=false,pageSize = 20) {
    this.spinnerService.show();
    if (!cache && this.currZainoIndex >= this.numCardZaino) {
      this.ordinaZaino();
      this.spinnerService.hide();
      return;
    } else if(cache && this.currZainoNoCacheIndex >= this.numCardZainoNoCache) {
      this.checkZainoNoCache.next(this.zainoNoCache!);
      return;
    }

    const observables = [];
    let iter=0
    if(!cache) {
      iter =  Math.ceil(this.numCardZaino/pageSize);
    } else {
      iter =  Math.ceil(this.numCardZainoNoCache/pageSize);
    }

    for (let page = this.currPageZaino; page <= this.currPageZaino + iter; page++) {
      observables.push(
        this.playerService.getZaino(id,page,pageSize)
      );
    }

    forkJoin(observables).pipe(
        map((responses: any[]) => responses.map(response => response))
      ).subscribe((response: any[]) => {

        const newData = response.reduce((acc, response) => acc.concat(response), []);

        if(!cache) {
          if(!this.zaino) {
            this.zaino = [];
          }
          this.zaino!.push(...newData);

          // Verifica se ci sono ulteriori dati
          this.currZainoIndex += newData.length;
          this.currPageZaino += observables.length;
        } else {
          if(!this.zainoNoCache) {
            this.zainoNoCache = [];
          }
          this.zainoNoCache!.push(...newData);

          // Verifica se ci sono ulteriori dati
          this.currZainoNoCacheIndex += newData.length;
          this.currPageZainoNoCache += observables.length;
        }

        // Continua a caricare dati se ci sono ulteriori pagine
        this.getZainoAll(id,cache);
        this.spinnerService.hide();
      });
  }

  async getInventory(id:string) {
    this.spinnerService.show();

    if(!this.inventory) {
      try {
        const response = await firstValueFrom(this.playerService.getInventory(id));
        this.inventory = response;
        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    return this.inventory;
  }

  async addEtichetta(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.playerService.addEtichetta(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async getEtichette(id:string) {
    this.spinnerService.show();

    if(!this.etichette) {
      try {
        const response = await firstValueFrom(this.playerService.getEtichette(id));
        this.etichette = response;
        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    return this.etichette;
  }

  async assegnaEtichetta(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.playerService.assegnaEtichette(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async delEtichetta(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.playerService.delEtichetta(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async rewardLevel(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.playerService.rewardLevel(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;

  }

  async getNumCardZaino(id:string, cache:boolean=false) {
    this.spinnerService.show();

    if(!cache) {
      if(!this.numCardZaino) {
        try {
          const response = await firstValueFrom(this.playerService.getNumCardZaino(id));
          this.numCardZaino = response;
          this.currZainoIndex = 0;
          this.currPageZaino = 1;
          this.getZainoAll(id);
        } catch(error:any) {
          this.spinnerService.hide();
        }
      } else {
        this.currZainoIndex = 0;
        this.currPageZaino = 1;
        this.getZainoAll(id);
      }

      return this.numCardZaino;
    } else {
      if(!this.numCardZainoNoCache) {
        try {
          const response = await firstValueFrom(this.playerService.getNumCardZaino(id));
          this.numCardZainoNoCache = response;
          this.getZainoAll(id,cache);
          this.spinnerService.hide();
        } catch(error:any) {
          this.spinnerService.hide();
        }
      } else {
        this.getZainoAll(id,cache);
        this.spinnerService.hide();
      }
      return this.numCardZainoNoCache;
    }
  }

  private sortZaino(allcards:Card[], enumCard:number[]): Card[] {
    return allcards.sort((a, b) => {
      const indexA = enumCard.indexOf(a.type);
      const indexB = enumCard.indexOf(b.type);
    
      if (indexA < indexB) {
        return -1; // Mette a davanti a b se a viene prima in ordineTipo
      } else if (indexA > indexB) {
        return 1; // Mette b davanti a a se b viene prima in ordineTipo
      } else {
        return 0; // Lascia a e b nella loro posizione relativa
      }
    }).sort((a, b) => a.level - b.level);
  }

  private componiZaino(allcards:Card[], enumCard:number[]): Card[] {
    const filter = allcards.filter((oggetto) => enumCard.includes(oggetto.type))
    return this.sortZaino(filter,enumCard);
  }

  private ordinaZaino() {
    const xzyEnum = [8388609,8388641]
    const synchroEnum = [8193,8225,12321]
    const fusioneEnum = [65, 4161, 97, 4193]
    const ritualeEnum = [129,161,673,4257,2097313]
    const magiaEnum = [2,65538, 131074, 262146, 524290, 130]
    const noEffetto = [17,4113]
    const trappolaEnum = [4, 1048580, 131076]
    let allEnum:number[] = []
    allEnum.push(...xzyEnum)
    allEnum.push(...synchroEnum)
    allEnum.push(...fusioneEnum)
    allEnum.push(...ritualeEnum)
    allEnum.push(...magiaEnum)
    allEnum.push(...noEffetto)
    allEnum.push(...trappolaEnum)

    const confCopy = this.zaino!

    this.zaino = []
    this.zaino.push(...this.componiZaino(confCopy,xzyEnum))
    this.zaino.push(...this.componiZaino(confCopy,synchroEnum))
    this.zaino.push(...this.componiZaino(confCopy,fusioneEnum))
    this.zaino.push(...this.componiZaino(confCopy,ritualeEnum))
    this.zaino.push(...this.componiZaino(confCopy,noEffetto))
    this.zaino.push(...confCopy.filter((oggetto) => !allEnum.includes(oggetto.type)))
    this.zaino.push(...this.componiZaino(confCopy,magiaEnum))
    this.zaino.push(...this.componiZaino(confCopy,trappolaEnum))
    
    this.checkZaino.next(this.zaino!);
  }


}
