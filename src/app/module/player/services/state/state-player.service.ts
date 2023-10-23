import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { PlayerService } from '../httpservices/player.service';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';

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

  resetState() {
    this.player = undefined;
    this.allplayers = undefined;
    this.zaino = undefined;
    this.inventory = undefined;
    this.etichette = undefined;
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
    this.getNumCardZaino(id,true);
  }

  async getZainoAll(id:string,cache:boolean=false,pageSize = 20) {
    this.spinnerService.show();
    if (!cache && this.currZainoIndex >= this.numCardZaino) {
      return;
    } else if(cache && this.currZainoNoCacheIndex >= this.numCardZainoNoCache) {
      return;
    }

    const observables = [];
    for (let page = this.currPageZaino; page <= this.currPageZaino + 4; page++) {
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
          this.checkZaino.next(this.zaino!);

          // Verifica se ci sono ulteriori dati
          this.currZainoIndex += newData.length;
          this.currPageZaino += observables.length;
        } else {
          if(!this.zainoNoCache) {
            this.zainoNoCache = [];
          }
          this.zainoNoCache!.push(...newData);
          this.checkZainoNoCache.next(this.zainoNoCache!);

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
          this.getZainoAll(id);
          this.spinnerService.hide();
        } catch(error:any) {
          this.spinnerService.hide();
        }
      } else {
        this.getZainoAll(id);
        this.spinnerService.hide();
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


}
