import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { TypeMod } from '../../enum/typeMod';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-play-now-puntata',
  templateUrl: './play-now-puntata.component.html',
  styleUrls: ['../../styles/play-now.css','./play-now-puntata.component.css']
})
export class PlayNowPuntataComponent {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  vincita: any;
  perdita: any;

  viewPlayers = false;
  viewCardBet = false;

  puntataForm = new FormGroup({
    coin: new FormControl(0),
    credits: new FormControl(0),
    cards: new FormControl([]),
    iscards: new FormControl(false)
  });

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
  }

  confirmPuntata() {
    if(this.puntataForm.value.coin !== 0 || this.puntataForm.value.credits !== 0 || this.puntataForm.value.iscards !== false) {
      Swal.fire({
        title: 'Sei sicuro?',
        text: "Confermando metterai in palio "+ this.puntataForm.value.coin +" coin "+ this.puntataForm.value.credits +" credits!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, conferma puntata!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.vincita = {
            "coin": this.puntataForm.value.coin,
            "credits": this.puntataForm.value.credits
          }
          this.perdita = {
            "coin": -(this.vincita.coin),
            "credits": -(this.vincita.credits)
          };
          this.viewPlayers = true;
          this.viewCardBet = this.puntataForm.value.iscards!;
        }
      })
    } else {
      this.messageService.alert('Attenzione!','Devi mettere in puntata qualcosa!','error');
    }
    
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/playnow',{id:this.playerId}]);
          break;
        case 'REQUEST':
          this.router.navigate(['/request',{id:this.playerId,typeMode:TypeMod.PUNTATA, playerRole: this.player?.ruolo!}]);
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
