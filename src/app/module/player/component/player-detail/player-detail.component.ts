import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { Player } from 'src/app/module/interface/player';

@Component({
  selector: 'player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent {
  buttons: Button[] = [];

  player: Player | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService) {

  }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-suitcase"
      },
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-arrow-left"
      }
    ];

    const playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(playerId);
  }

  
  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.player?._id!}]);
          break;
        case 'BACK':
          window.history.back();
          break;
        case 'SELL':
          this.router.navigate(['/sell',{id:this.player?._id!}]);
          break;
      }
    }
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
