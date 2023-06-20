import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { TypeMod } from '../../enum/typeMod';

@Component({
  selector: 'app-play-now-puntata',
  templateUrl: './play-now-puntata.component.html',
  styleUrls: ['./play-now-puntata.component.css']
})
export class PlayNowPuntataComponent {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private notifierStateService: StateNotifierService,
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
