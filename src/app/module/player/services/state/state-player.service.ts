import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { Card } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { PlayerService } from '../httpservices/player.service';

@Injectable({
  providedIn: 'root'
})
export class StatePlayerService {

  private player?: Player;
  private allplayers?: Player[];
  private zaino?: Card[];

  constructor(private spinnerService: NgxSpinnerService,
    private playerService: PlayerService) {

  }

  resetZaino() {
    this.zaino = undefined;
  }

  resetState() {
    this.player = undefined;
    this.allplayers = undefined;
    this.zaino = undefined;
  }

  resetPlayerState() {
    this.player = undefined;
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

    return this.player;
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
}
