import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { Player } from 'src/app/module/interface/player';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent {
  buttons: Button[] = [];

  player: Player | undefined;

  showModify = false;

  modForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    domanda: new FormControl('', Validators.required),
    risposta: new FormControl('', Validators.required)
  });

  questions = [
    "Cibo preferito?",
    "Nome della tua maestra dell'elementari?",
    "Nome del tuo animale preferito?",
    "Anno di nascita di un tuo genitore?",
    "Parola segreta?"
  ]

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
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-arrow-left"
      },
      {
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-suitcase"
      },
      {
        name: "EDIT-BUTTON",
        code: "EDIT",
        class: "fa fa-pencil"
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
        case 'EDIT':
          if(this.showModify) {
            this.showModify = false;
          } else {
            this.showModify = true;
            this.modForm.patchValue({
              name: this.player?.name,
              password: this.player?.pss,
              email: this.player?.email,
              domanda: this.player?.domanda,
              risposta: this.player?.risposta
            });
          }
          break;
      }
    }
  }

  modify() {
    if(this.modForm.valid) {
      let request:any = {};
      request.id = this.player?._id;
      request.name = this.modForm.value.name;
      request.email = this.modForm.value.email;
      request.pss = this.modForm.value.password;
      request.domanda = this.modForm.value.domanda;
      request.risposta = this.modForm.value.risposta;
      this.playerStateService.updatePlayer(request).then((resp) => {
        if(resp === true) {
          this.messageService.alert('Fatto!','Dati aggiornati!','success');
          this.playerStateService.resetPlayerState();
          this.takePlayer(request.id);
          this.showModify = false;
        } else {
          this.messageService.alert('Attenzione!','Errore durante la chiamata updatePlayer','error');
        }
      });
    } else {
      this.messageService.alert('Attenzione!','Tutti i campi sono obbligatori','warning');
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
