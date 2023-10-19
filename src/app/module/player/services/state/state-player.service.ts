import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, firstValueFrom } from 'rxjs';
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
  private zaino?: Card[];
  private inventory?: Pack[];

  private etichette?:any;

  private bonus: boolean = false;

  private checkLogin = new BehaviorSubject<Player | undefined>(undefined);

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

  async getPlayer(id:string) {
    this.spinnerService.show();

    if(!this.player) {
      try {
        const response = await firstValueFrom(this.playerService.getPlayerById(id));
        this.player = response;
        this.checkLogin.next(this.player);
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

  async getZaino(id:string) {
    this.spinnerService.show();

    if(!this.zaino) {
      try {
        const response = await firstValueFrom(this.playerService.getZaino(id));
        this.zaino = response;
        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    return this.zaino;
  }

  async getZainoNoCache(id:string) {
    this.spinnerService.show();

    let zaino: Card[] = []

    try {
      const response = await firstValueFrom(this.playerService.getZaino(id));
      zaino = response;
      this.spinnerService.hide();
    } catch(error:any) {
      this.spinnerService.hide();
    }

    return zaino;
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


}
