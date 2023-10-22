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
      if(this.player?.level!>0) {
        const correctLevel = this.takeCorrectLevel(this.player!.level!)
        if(!this.player?.reward!.includes(correctLevel)) {
          Swal.fire({
            title: 'Complimenti',
            backdrop: false,
            icon: 'success',
            html:
            '<label> Hai raggiunto il livello <strong>'+ correctLevel +'</strong><br><br>'+
            'Ti meriti una ricompensa',
            showDenyButton: false,
            confirmButtonColor: '#46a9c9',
            confirmButtonText: 'OTTIENI RICOMPENSA',
          }).then((result) => {
            if (result.isConfirmed) {
              let request:any = {}
              request.playerId = this.player?._id!;
              request.level = correctLevel;
  
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
      }
      
    });
  }

  /* turnHome() {
    window.history.back();
  } */

  openSideBar() {
    this.viewSideBar = !this.viewSideBar;
  }

  private takeCorrectLevel(level:number) {
    let result = 0;
    if(level>=5 && level<10) {
      result=5;
    } else if(level>=10 && level<15) {
      result=10;
    } else if(level>=15 && level<20) {
      result=15;
    } else if(level>=20 && level<25) {
      result=20;
    } else if(level>=25 && level<30) {
      result=25;
    } else if(level>=30 && level<35) {
      result=30;
    } else if(level>=35 && level<40) {
      result=35;
    } else if(level>=40 && level<45) {
      result=40;
    } else if(level>=45 && level<50) {
      result=45;
    } else if(level>=50 && level<60) {
      result=50;
    } else if(level>=60 && level<70) {
      result=60;
    } else if(level>=60 && level<70) {
      result=70;
    }
    return result;
  }
  
}
