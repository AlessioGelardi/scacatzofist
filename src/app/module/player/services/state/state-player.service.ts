import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { PlayerService } from '../httpservices/player.service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class StatePlayerService {

  private player?: Player;
  private allplayers?: Player[];
  private zaino?: Card[];
  private inventory?: Pack[];

  private bonus: boolean = false;

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

  resetState() {
    this.player = undefined;
    this.allplayers = undefined;
    this.zaino = undefined;
    this.inventory = undefined;
  }

  async getPlayer(id:string) {
    this.spinnerService.show();

    if(!this.player) {
      try {
        const response = await firstValueFrom(this.playerService.getPlayerById(id));
        this.player = response;
        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    this.socket.emit('sign_in', this.player!.name);

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
}
