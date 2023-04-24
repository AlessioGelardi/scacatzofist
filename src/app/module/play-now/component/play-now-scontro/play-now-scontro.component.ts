import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-play-now-scontro',
  templateUrl: './play-now-scontro.component.html',
  styleUrls: ['./play-now-scontro.component.css']
})
export class PlayNowScontroComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  players: Player[] = [];

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
        class: "fa fa-undo"
      },
      {
        name: "REQUEST-BUTTON",
        code: "REQUEST",
        class: "fa fa-list"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(this.playerId);
    this.takeAllPlayers(this.playerId);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/playnow']);
          break;
        case 'REQUEST':
          this.router.navigate(['/request',{id:this.playerId,typeMode:TypeMod.SCONTRO}]);
          break;
      }
    }
  }

  inviaRichiesta(playerId:string,playerName:string) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Confermando invierai la richiesta di modalità 'Scontro' a "+playerName+"!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, invia richiesta!'
    }).then((result) => {
      if (result.isConfirmed) {
        let request: any = {};
        request.typeMod = 1;
        request.playerIdReq = this.playerId;
        request.playerIdOppo = playerId;
        request.status = 1;

        this.notifierStateService.inviaRichiesta(request).then((resp) => {
          if(resp === true) {
            this.notifierStateService.resetState();
            this.messageService.alert('Fatto!','Richiesta inviata!','success');
          } else {
            if(resp) {
              const statusError = resp.status;
              if(statusError === 402) {
                this.messageService.alert('Attenzione!','Richiesta gia inviata, controlla nelle tue richieste','error');
              } else {
                this.messageService.alert('Errore','Richiesta gia inviata, controlla nelle tue richieste','error');
              }
            }
          }
        });
      }
    })
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

  private takeAllPlayers(id:string) {
    
    this.playerStateService.getAllPlayers(id).then((resp) => {
      if(resp) {
        this.players = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getAllPlayers','error');
      }
    });
  }

}
