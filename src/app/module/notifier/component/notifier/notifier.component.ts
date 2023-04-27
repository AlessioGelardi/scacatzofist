import { Component, OnInit } from '@angular/core';
import { Status } from 'src/app/module/notifier/enum/status';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Reqs } from 'src/app/module/interface/reqs';
import Swal from 'sweetalert2';
import { StateNotifierService } from '../../services/state/state-notifier.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {

  myReqs: Reqs[] = [];
  reqs: Reqs[] = [];

  playerId:string | undefined;
  typeMode:number | undefined;
  playerRole:number | undefined;

  constructor(private route: ActivatedRoute,
    private messageService: MessageService,
    private notifierStateService: StateNotifierService) { }

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.typeMode = Number(this.route.snapshot.paramMap.get('typeMode')!);

    if(this.route.snapshot.paramMap.get('playerRole') !== 'undefined') {
      this.playerRole = Number(this.route.snapshot.paramMap.get('playerRole'));
    }    

    this.takeReqs();
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
          'Perdita: <strong>'+perdita.coin+' <i class="fa fa fa-database"></i></strong><br><br>'+
          'Se non è presente il "-" davanti la perdita significa che se perdi, il tuo credito verrà comunque incrementato, in questo caso di '+perdita.coin+'!<br><br>',
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
                this.notifierStateService.resetState();
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
        'Perdita: <strong>'+perdita.coin+' <i class="fa fa fa-database"></i></strong><br><br>'+
        'Se non è presente il "-" davanti la perdita significa che se perdi, il tuo credito verrà comunque incrementato, in questo caso di '+perdita.coin+'!<br><br>',
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
              this.notifierStateService.resetState();
              req.status = 3;
              req.vincitore = vincitore;
              this.messageService.alert('Partita Conclusa!','Richiesta aggiornata con successo!','success');
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

  private takeReqs() {

    this.notifierStateService.getReqs(this.playerId!).then((resp) => {
      if(resp) {
        this.myReqs = resp["myReqs"] as Reqs[];
        this.reqs = resp["reqs"] as Reqs[];
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
