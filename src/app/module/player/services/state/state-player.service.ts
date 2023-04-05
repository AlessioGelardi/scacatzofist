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

  resetState() {
    this.player = undefined;
    this.allplayers = undefined;
    this.zaino = undefined;
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

    if(!this.allplayers) {
      try {
        const response = await firstValueFrom(this.playerService.getAllPlayers(id));
        this.allplayers = response;
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
