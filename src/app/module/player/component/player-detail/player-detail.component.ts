import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { Player } from 'src/app/module/interface/player';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Reqs } from 'src/app/module/interface/reqs';
import { forkJoin, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

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
  history: Reqs[] = [];
  selectHistory: Reqs[] = [];
  currentPage: number = 1;
  currentDuel: number = 0;

  numDuelli:number = 0;
  numVittorie:number = 0;
  numSconfitte:number = 0;

  showPassword = false;
  showConfirmPassword = false;

  constructor(private route: ActivatedRoute,
    private router: Router, private spinnerService: NgxSpinnerService,
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
    this.takeDuelCounter(playerId);
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
    // Calcola l'indice di inizio in base alla pagina corrente e alla dimensione della pagina
    let pageSize = 10
    let startIndex = 0
    if(this.history!.length>10) {
      startIndex = (Math.floor(page) - 1) * pageSize;
    }

    // Estrai i dati visibili dalla tua array completa
    const endIndex = startIndex + pageSize;

    this.selectHistory = this.history.slice(startIndex, endIndex);
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

  private setCounters() {
    for(let x of this.history) {
      if(this.checkWin(x.vincitore!)) {
        this.numVittorie++;
      } else {
        this.numSconfitte++;
      }
    }
  }

  private takeDuelCounter(playerId:string) {
    this.notifierStateService.getNumberDuels(playerId,true,false,TypeMod.ALL).then((resp) => {
      if(resp) {
        this.numDuelli = resp;
        this.takeHistory(playerId);
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

  private takeHistory(playerId:string,pageSize = 10) {
    this.spinnerService.show();
    if (this.currentDuel >= this.numDuelli) {
      this.setCounters();
      this.selectPage(1);
      this.spinnerService.hide();
      return;
    }

    const observables = [];
    for (let page = this.currentPage; page <= this.currentPage + 4; page++) {
      observables.push(
        this.notifierStateService.getHistory(playerId,true,false,TypeMod.ALL,page,pageSize)
      );
    }

    forkJoin(observables).pipe(
        map((responses: any[]) => responses.map(response => response))
      ).subscribe((response: any[]) => {

        const newData = response.reduce((acc, response) => acc.concat(response), []);

        this.history.push(...newData);

        // Verifica se ci sono ulteriori dati
        this.currentDuel += newData.length;
        this.currentPage += observables.length;

        // Continua a caricare dati se ci sono ulteriori pagine
        this.takeHistory(playerId);
      });

/*

    const observables = [];
    let noMoreData = false;
  
    for (let page = 1; !noMoreData; page++) {
      observables.push(
        this.notifierStateService.getHistory(this.player?._id!,true,false,TypeMod.ALL,page,pageSize)
          .pipe(
            tap((response: any) => {
              if (response.length === pageSize) {
                noMoreData = true;
              }
            })
          )
      );
    }
  
    forkJoin(observables)
      .subscribe((responses: any[]) => {
        this.history.push(...responses);

        if(this.selectHistory.length==0) {
          this.selectPage(1);
        }

        
      });


     this.notifierStateService.getHistory(this.player?._id!,true,false,TypeMod.ALL,page,pageSize).subscribe((response: any) => {
      


      // Controlla se ci sono più pagine di dati da ottenere
      if (response.length === pageSize) {
        // Se ci sono più dati disponibili, carica la pagina successiva
        this.takeHistory(page + 1, pageSize);
      } else {
        this.setCounters();
        this.maxPage = page;
        this.numDuelli = this.history.length;
      }
    }); */
  }
  
  /* private takeHistory() {
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
        

        this.messageService.alert('Attenzione!','Errore durante la chiamata getReqs','error');
      }
    });
  }*/
}
