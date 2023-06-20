import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-play-now-scontro',
  templateUrl: './play-now-scontro.component.html',
  styleUrls: ['./play-now-scontro.component.css']
})
export class PlayNowScontroComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  viewFilter = false;

  vincita:any;
  perdita:any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService) { }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-arrow-left"
      },
      {
        name: "REQUEST-BUTTON",
        code: "REQUEST",
        class: "fa fa-list"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(this.playerId);

    this.perdita = {
      "credits": 5,
      "coin": 200
    }
    this.vincita = {
      "credits": 2,
      "coin": 100
    }
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/playnow',{id:this.playerId}]);
          break;
        case 'REQUEST':
          this.router.navigate(['/request',{id:this.playerId,typeMode:TypeMod.SCONTRO, playerRole: this.player?.ruolo!}]);
          break;
      }
    }
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
  }

  public get TypeMod() {
    return TypeMod; 
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getPlayer','error');
      }
    });
  }

}
