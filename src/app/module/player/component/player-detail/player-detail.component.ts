import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { Player } from 'src/app/module/interface/player';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { DictReqs } from 'src/app/module/interface/reqs';

@Component({
  selector: 'player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent {
  buttons: Button[] = [];

  player: Player | undefined;

  showModify = false;
  changeName = false;

  modForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmpassword: new FormControl('', Validators.required),
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

  pageSelected: string = "1";
  history: DictReqs | undefined;

  numDuelli:number = 0;
  numVittorie:number = 0;
  numSconfitte:number = 0;

  showPassword = false;
  showConfirmPassword = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService,
    private notifierStateService: StateNotifierService) {

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
            this.changeName = false;
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
      request.changeName = this.changeName ? 1 : 0;

      if(this.changeName && this.player?.name === request.name) {
        this.messageService.alert('Attenzione!','Hai deciso di cambiare il nome, ma il nome non è stato cambiato','warning');
      } else {
        if(this.modForm.value.password === this.modForm.value.confirmpassword) {
          this.playerStateService.updatePlayer(request).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Dati aggiornati!','success');
              this.playerStateService.resetPlayerState();
              this.takePlayer(request.id);
              this.showModify = false;
            } else {
              if(resp && resp.status===401) {
                this.messageService.alert('Nome già in uso!','Inserisci un nome diverso!','info');
              } else {
                this.messageService.alert('Attenzione!','Errore durante la chiamata updatePlayer','error');
              }
            }
          });
        } else {
          this.messageService.alert('Attenzione!','Le password devono combaciare','warning');
        }
      }

    } else {
      if(this.modForm.controls['email'].errors) {
        this.messageService.alert('Attenzione!','Inserisci una email valida','warning');
      } else {
        this.messageService.alert('Attenzione!','Tutti i campi sono obbligatori','warning');
      }
    }
  }

  getNumberRange(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index + 1);
  }

  selectPage(page: number) {
    this.pageSelected = page.toString();
  }

  checkWin(vincitore: string) {
    return vincitore === this.player?.name ? true : false;
  }

  showPss() {
    this.showPassword = !this.showPassword;
  }

  changeMyName() {
    this.changeName = !this.changeName;
  }

  showConfirmPss() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  public get TypeMod() {
    return TypeMod; 
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.takeHistory();
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

  private setCounters(index:number) {
    for(let x of this.history!.reqs![index]) {
      if(this.checkWin(x.vincitore!)) {
        this.numVittorie++;
      } else {
        this.numSconfitte++;
      }
    }
  }
  
  private takeHistory() {
    this.pageSelected = "1";
    this.numDuelli = 0;
    this.numSconfitte = 0;
    this.numVittorie = 0;
    this.notifierStateService.getReqs(this.player?._id!,true,false,TypeMod.ALL).then((resp) => {
      if(resp) {
        this.history = resp;
        let index = 1;
        let repet = true
        do {
          if(this.history!.reqs![index] && this.history!.reqs![index].length>0) {
            this.numDuelli += this.history!.reqs![index].length;
            this.setCounters(index);
            if(this.history!.reqs![index].length>=10) {
              index++;
            } else {
              repet = false;
            }
          } else {
            repet = false;
          }
        } while(repet);

      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getReqs','error');
      }
    });
  }
}
