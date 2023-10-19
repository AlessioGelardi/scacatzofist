import { Component } from '@angular/core';
import { StatePlayerService } from './module/player/services/state/state-player.service';
import { Player } from './module/interface/player';
import Swal from 'sweetalert2';
import { MessageService } from './module/swalAlert/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  viewSideBar = false;
  player: Player | undefined;

  constructor(
    private playerStateService: StatePlayerService,
    private messageService: MessageService)
  {
    this.playerStateService.getLoginPlayer().subscribe((value:Player | undefined) => {
      this.player = value;
      if(this.player?.level!%5==0 && !this.player?.reward) {
        Swal.fire({
          title: 'Complimenti',
          backdrop: false,
          icon: 'success',
          html:
          '<label> Sei arrivato a livello <strong>'+ this.player?.level! +'</strong><br><br>'+
          'Ti meriti una ricompensa',
          showDenyButton: false,
          confirmButtonColor: '#46a9c9',
          confirmButtonText: 'OTTIENI RICOMPENSA',
        }).then((result) => {
          if (result.isConfirmed) {
            let request:any = {}
            request.playerId = this.player?._id!;
            request.level = this.player?.level!;

            this.playerStateService.rewardLevel(request).then((resp) => {
              if(resp === true) {
                this.messageService.alert('Fatto!','Hai ricevuto una grande ricompensa, controlla il tuo inventario!','success');
                this.playerStateService.resetPlayerState();
                this.playerStateService.getPlayer(this.player?._id!);
              } else {
                this.messageService.alert('Attenzione!','Errore durante la chiamata rewardLevel','error');
              }
            });
          }
        })
      }
    });
  }

  /* turnHome() {
    window.history.back();
  } */

  openSideBar() {
    this.viewSideBar = !this.viewSideBar;
  }
  
}
