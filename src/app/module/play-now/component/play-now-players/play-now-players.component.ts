import { Component, Input } from '@angular/core';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';
import { TypeMod } from '../../enum/typeMod';

@Component({
  selector: 'play-now-players',
  templateUrl: './play-now-players.component.html',
  styleUrls: ['./play-now-players.component.css']
})
export class PlayNowPlayersComponent {

  @Input() playerId!: string;
  @Input() typeMode!: number;

  players: Player[] = [];

  filterName:string | undefined;

  constructor(private messageService: MessageService,
    private notifierStateService: StateNotifierService,
    private playerStateService: StatePlayerService) {

  }

  ngOnInit(): void {
    this.takeAllPlayers(this.playerId);
  }

  inviaRichiesta(playerId:string,playerName:string) {
    if(this.typeMode===TypeMod.PUNTATA) {
      
    } else {
      this.sendPlayRequest(playerId, playerName);
    }
    
  }

  private sendPlayRequest(playerId:string,playerName:string) {
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
        request.typeMod = this.typeMode;
        request.playerIdReq = this.playerId;
        request.playerIdOppo = playerId;
        request.status = 1;
        request.bonus = this.playerStateService.getBonus() && this.typeMode===1;

        this.notifierStateService.inviaRichiesta(request).then((resp) => {
          if(resp === true) {
            this.messageService.alert('Fatto!','Richiesta inviata!','success');
          } else {
            if(resp) {
              const statusError = resp.status;
              if(statusError === 402) {
                this.messageService.alert('Attenzione!','Richiesta gia inviata, controlla nelle tue richieste','error');
              } else if(statusError === 401) {
                this.messageService.alert('Attenzione!','User impegnato al momento! Riprova più tardi','error');
              } else {
                this.messageService.alert('Errore',"Errore durante l'invio della richiesta",'error');
              }
            }
          }
        });
      }
    })
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
