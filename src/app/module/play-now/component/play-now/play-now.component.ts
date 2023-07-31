import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { TypeMod } from '../../enum/typeMod';

@Component({
  selector: 'app-play-now',
  templateUrl: './play-now.component.html',
  styleUrls: ['./play-now.component.css']
})
export class PlayNowComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService) { }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "REQUEST-BUTTON",
        code: "REQUEST",
        class: "fa fa-list"
      }
    ];

    const playerId = this.route.snapshot.paramMap.get('id')!; 
    this.takePlayer(playerId);

    const bonus:boolean = this.route.snapshot.paramMap.get('bonus') === "true";
    this.playerStateService.setBonus(bonus);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home']);
          break;
        case 'REQUEST':
          this.router.navigate(['/request',{id:this.player?._id!,typeMode:TypeMod.ALL, playerRole: this.player?.ruolo!}]);
          break;
      }
    }
  }

  singlePlayer() {
    this.messageService.alert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  scontro() {
    this.router.navigate(['/scontro',{id:this.player!._id}]);
  }

  training() {
    this.messageService.alert('In manutenzione',"Ci dispiace, in questo momento la funzionalità è in manutenzione! Riprova più tardi! ",'info');
    //this.router.navigate(['/training',{id:this.player!._id}]);
  }

  puntata() {
    this.router.navigate(['/puntata',{id:this.player!._id, playerRole: this.player?.ruolo!}]);
  }

  torneo() {
    this.router.navigate(['/torneo',{id:this.player!._id}]);
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
