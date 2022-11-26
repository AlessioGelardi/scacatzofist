import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Reqs } from '../interface/reqs';
import { HttpPlayer } from '../services/httpPlayer';
import { Status } from "../enum/status";
import { TypeMod } from "../enum/typeMod";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {

  myReqs: Reqs[] = [];
  reqs: Reqs[] = [];

  @Input() typeMod:number | undefined;
  @Input() playerId:string | undefined;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.takeReqs()
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
            this.spinnerService.show();
            let request:any = {}
            request.requestId = req.id;
            request.status = newstatus;
            this.httpPlayerService.updateRequest(request).subscribe(
              result => {
                this.spinnerService.hide();
                if(result) {
                  req.status = newstatus;
                  this.swalAlert('Aggiornato!','Richiesta aggiornata con successo! Torna più tardi per vedere gli aggiornamenti','success');
                }
                else
                  this.swalAlert('Errore',"Qualcosa è andato storto durante l'aggiornamento della richiesta",'error');
              }
            );
          }
        })
      } else {
        this.swalAlert('Info',"In attesa di risposta da parte di "+ricevente,'info');
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
          this.spinnerService.show();
          let request:any = {}
          request.requestId = req.id;
          request.playerIdvincitore = playerIdvincitore;
          request.vincitore = vincitore;
          request.playerIdperdente = playerIdperdente;
          request.perdente = perdente;
          request.status = 3;
          this.httpPlayerService.updateRequest(request).subscribe({
            next: (result:boolean) => {
              req.status = 3;
              req.vincitore = vincitore;
              this.swalAlert('Partita Conclusa!','Richiesta aggiornata con successo!','success');
            }, // completeHandler
            error: (error: any) => {
              this.spinnerService.hide();
              if(error.status===404) {
                this.swalAlert('Attenzione!','Non fare il furbo seleziona correttamente il vincitore... sporco ladro!','error');
              } else {
                this.swalAlert('Attenzione!',"Problema durante l'aggiornamento della richiesta",'error');
              }
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
        }
      })
    } else if(req.status === 3) {
      if(vincitore!) {
        this.swalAlert('Info',"Partita conclusa! <br> Il vincitore: <strong>"+vincitore+'</strong><br><br>' + 'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong>','info');
      }
    }else {
      this.swalAlert('Info',"Questa richiesta è stata annullata, creane una nuova!",'info');
    }
    
  }

  private takeReqs() {
    this.spinnerService.show();
    this.httpPlayerService.getReqs(this.playerId!,this.typeMod).subscribe({
      next: (result:any) => {
        this.myReqs = result["myReqs"] as Reqs[];
        this.reqs = result["reqs"] as Reqs[];
      },
      error: (error: any) => {
        this.spinnerService.hide();
        if(error.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });
  }

  public get Status() {
    return Status; 
  }

  public get TypeMod() {
    return TypeMod; 
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
