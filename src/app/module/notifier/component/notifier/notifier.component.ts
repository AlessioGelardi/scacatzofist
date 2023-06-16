import { Component, OnInit } from '@angular/core';
import { Status } from 'src/app/module/notifier/enum/status';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { DictReqs, Reqs } from 'src/app/module/interface/reqs';
import Swal from 'sweetalert2';
import { StateNotifierService } from '../../services/state/state-notifier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['../../styles/notifier.css','./notifier.component.css']
})
export class NotifierComponent implements OnInit {

  buttons: Button[] = [];

  playerId:string | undefined;
  typeMode:number | undefined;
  playerRole:number | undefined;

  history: boolean = false;
  viewMyReqs: boolean = false;

  maxPageNum: number = 1;
  dictReqs: DictReqs | undefined;
  pageSelected: string = "1";

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService,
    private notifierStateService: StateNotifierService) { }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-arrow-left"
      },
      {
        name: "REFRESH-BUTTON",
        code: "REFRESH",
        class: "fa fa-refresh"
      },
      {
        name: "MYREQS-BUTTON",
        code: "MYREQS",
        class: "fa fa-paper-plane"
      },
      {
        name: "HISTORY-BUTTON",
        code: "HISTORY",
        class: "fa fa-list"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.typeMode = Number(this.route.snapshot.paramMap.get('typeMode')!);
    this.playerRole = Number(this.route.snapshot.paramMap.get('playerRole')!);

    this.takeReqs(this.history);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          window.history.back();
          break;
        case 'HISTORY':
          this.history=true;
          //this.notifierStateService.resetState();
          this.takeReqs(this.history, this.viewMyReqs);
          break;
        case 'MYREQS':
          this.viewMyReqs = true;
          this.takeReqs(this.history, this.viewMyReqs);
          break;
        case 'REFRESH':
          this.history = false;
          this.viewMyReqs = false;
          //this.notifierStateService.resetState();
          this.takeReqs(this.history);
          break;
      }
    }
  }

  selectPage(page: number) {
    this.pageSelected = page.toString();
  }

  doDetail(req:Reqs) {
    const richiedente = req.playerRichiedente;
    const ricevente = req.playerRicevente;
    const typeMod = req.typeMod;
    const vincita = req.vincita;
    const perdita = req.perdita;
    const vincitore = req.vincitore;
    
    if(req.status === 1) {

      if(req.playerIdReq !== this.playerId) {
        Swal.fire({
          title: 'Dettaglio Richiesta',
          icon: 'info',
          html:
          '<strong>'+richiedente+'</strong> ti ha invitato in Modalità <strong>'+TypeMod[typeMod]+'</strong> <br><br>'+
          'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong><br>'+
          'Sconfitta: <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i></strong><br><br>'+
          'Se non è presente il "-" davanti la sconfitta significa che se perdi, il tuo credito verrà comunque incrementato, in questo caso di <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i> </strong><br><br>',
          showDenyButton: true,
          confirmButtonText:
            '<i class="fa fa-check"></i> Accetta!',
          denyButtonText:
          '<i class="fa fa-times-circle"></i> Rifiuta!'
        }).then((result) => {
          let newstatus = 0;
          if (result.isConfirmed) {
            newstatus = 2;
          } else if (result.isDenied) {
            newstatus = 4;
          }
    
          if(newstatus !== 0) {

            let request:any = {}
            request.requestId = req.id;
            request.status = newstatus;
            this.notifierStateService.updateRequest(request).then((resp) => {
              if(resp) {
                //this.notifierStateService.resetState();
                req.status = newstatus;
                this.messageService.alert('Aggiornato!','Richiesta aggiornata con successo! Torna più tardi per vedere gli aggiornamenti','success');
              } else {
                this.messageService.alert('Errore',"Qualcosa è andato storto durante l'aggiornamento della richiesta",'error');
              }
            });
          }
        })
      } else {
        this.messageService.alert('Info',"In attesa di risposta da parte di "+ricevente,'info');
      }
      
    } else if (req.status === 2) {
      Swal.fire({
        title: 'Decreta il vincitore',
        icon: 'info',
        html:
        '<label>'+richiedente+'<strong> VS </strong>'+ricevente+' <br><br>'+
        'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong><br>'+
        'Sconfitta: <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i></strong><br><br>'+
        'Se non è presente il "-" davanti la sconfitta significa che se perdi, il tuo credito verrà comunque incrementato, in questo caso di <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i> </strong><br><br>',
        showDenyButton: true,
        confirmButtonColor: '#46a9c9',
        denyButtonColor: '#46a9c9',
        confirmButtonText:
          richiedente,
        denyButtonText:
          ricevente
      }).then((result) => {
        let playerIdvincitore = "";
        let playerIdperdente = "";
        let vincitore = "";
        let perdente = "";
        if (result.isConfirmed) {
          playerIdvincitore = req.playerIdReq;
          vincitore = richiedente;
          playerIdperdente = req.playerIdOppo;
          perdente = ricevente;
        } else if (result.isDenied) {
          playerIdvincitore = req.playerIdOppo;
          vincitore = ricevente;
          playerIdperdente = req.playerIdReq;
          perdente = richiedente;
        }
  
        if(vincitore !== "") {
          let request:any = {}
          request.requestId = req.id;
          request.playerIdvincitore = playerIdvincitore;
          request.vincitore = vincitore;
          request.playerIdperdente = playerIdperdente;
          request.perdente = perdente;
          request.status = 3;
          request.role = this.playerRole;
          this.notifierStateService.updateRequest(request).then((resp) => {
            if(resp === true) {
              //this.notifierStateService.resetState();
              req.status = 3;
              req.vincitore = vincitore;
              this.messageService.alert('Partita Conclusa!','Richiesta aggiornata con successo!','success');
              this.playerStateService.resetPlayerState();
            } else {
              if(resp) {
                const statusError = resp.status;
                if(statusError === 404) {
                  this.messageService.alert('Attenzione!','Non fare il furbo seleziona correttamente il vincitore... piccolo delinquente!','error');
                } else {
                  this.messageService.alert('Attenzione!',"Problema durante l'aggiornamento della richiesta",'error');
                }
              }
            }
          });
        }
      })
    } else if(req.status === 3) {
      if(vincitore!) {
        this.messageService.alert('Info',"Partita conclusa! <br> Il vincitore: <strong>"+vincitore+'</strong><br><br>' + 'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong>','info');
      }
    }else {
      this.messageService.alert('Info',"Questa richiesta è stata annullata, creane una nuova!",'info');
    }
    
  }

  public get Status() {
    return Status; 
  }

  public get TypeMod() {
    return TypeMod; 
  }

  getNumberRange(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index + 1);
  }

  private takeReqs(history:boolean, myReqs: boolean = false) {
    this.pageSelected = "1";
    this.notifierStateService.getReqs(this.playerId!,history,myReqs).then((resp) => {
      if(resp) {
        this.dictReqs = resp;
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
