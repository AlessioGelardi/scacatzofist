import { Component, OnInit } from '@angular/core';
import { Status } from 'src/app/module/notifier/enum/status';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Reqs } from 'src/app/module/interface/reqs';
import Swal from 'sweetalert2';
import { StateNotifierService } from '../../services/state/state-notifier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { Button } from 'src/app/module/interface/button';
import { Card } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['../../styles/notifier.css','./notifier.component.css']
})
export class NotifierComponent implements OnInit {

  player:Player | undefined;

  buttons: Button[] = [];

  playerId:string | undefined;
  typeMode:number | undefined;
  playerRole:number | undefined;

  maxPageNum: number = 1;
  reqs: Reqs[] = [];
  pageSelected: string = "1";

  showMoreDetail: boolean = false;
  selectReq: Reqs | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService,
    private notifierStateService: StateNotifierService,
    private socket: Socket) { }

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
        name: "REFRESH-BUTTON",
        code: "REFRESH",
        class: "fa fa-refresh"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.typeMode = Number(this.route.snapshot.paramMap.get('typeMode')!);
    this.playerRole = Number(this.route.snapshot.paramMap.get('playerRole')!);

    this.takePlayer(this.playerId);
    this.takeReqs();

    this.getUpdateRequests().subscribe(updateRequests => {
      if(updateRequests && updateRequests.length>0) {
        for(let request of updateRequests) {
          if(request["playerIdReq"] === this.player?._id! || request["playerIdOppo"] === this.player?._id) {
            this.buttonOperationHandler("REFRESH");
            if(request["status"]===Status.COMPLETATO) {
              this.playerStateService.resetPlayerState();
              this.takePlayer(this.playerId!);
            }
            this.socket.emit('refresh_requests', request["id"]);
            break;
          }
        }
      }
    })
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.playerId!}]);
          break;
        case 'BACK':
          if(this.showMoreDetail) {
            this.showMoreDetail = false;
          } else {
            window.history.back();
          }
          break;
        case 'MYREQS':
          this.showMoreDetail = false;
          this.takeReqs();
          break;
        case 'REFRESH':
          this.showMoreDetail = false;
          this.reqs=[]
          this.takeReqs();
          break;
      }
    }
  }

  confirm() {
    let newstatus = 0;
    this.playerStateService.getPlayer(this.playerId!).then((resp) => {
      if(resp) {
        const player = resp;

        if(this.selectReq!.vincita.credits > player.credits! || this.selectReq!.vincita.coin > player.coin!) {
          newstatus = 4;
          this.messageService.alert('Attenzione!','Non hai abbastanza coin o crediti per accettare questa richiesta, per questo motivo verrà RIFIUTATA','info');
        } else {
          newstatus = 2;
          this.updateReqs(this.selectReq!,newstatus);
        }
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

  rifiuting() {
    this.updateReqs(this.selectReq!,4);
  }

  selectPage(page: number) {
    this.pageSelected = page.toString();
  }

  doDetail(req:Reqs) {

    this.selectReq = req;
    
    const richiedente = req.playerRichiedente;
    const ricevente = req.playerRicevente;
    const typeMod = req.typeMod;
    const vincita = req.vincita;
    const perdita = req.perdita;
    const vincitore = req.vincitore;

    let nota="";
    if(typeMod===TypeMod.SCONTRO) {
      nota = 'Se non è presente il "-" davanti la sconfitta significa che se perdi, il tuo credito verrà comunque incrementato, in questo caso di <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i> </strong><br><br>';
    } else if(typeMod===TypeMod.PUNTATA) {
      nota = 'Comprese le carte messe in palio e accettate in richiesta!'
    }

    if(req.status === Status.INVIATO) {
      if(req.playerIdReq !== this.playerId) {
        if(typeMod===TypeMod.PUNTATA) {
          this.showMoreDetail = true;
        } else {
          Swal.fire({
            title: 'Dettaglio Richiesta',
            icon: 'info',
            html:
            '<label>'+richiedente+'<strong> VS </strong>'+ricevente+' <br><br>'+
            'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong><br><br>'+
            'Sconfitta: <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i></strong><br><br>'+nota,
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
      
            this.updateReqs(req,newstatus); 
          })
        } 
      } else {
        this.messageService.alert('Info',"In attesa di risposta da parte di "+ricevente,'info');
      }
      
    } else if (req.status === Status.ACCETTATO) {
      Swal.fire({
        title: 'Decreta il vincitore',
        icon: 'info',
        html:
        '<label>'+richiedente+'<strong> VS </strong>'+ricevente+' <br><br>'+
        'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong><br><br>'+
        'Sconfitta: <strong>'+perdita.coin+' <i class="fa fa fa-database"></i> '+perdita.credits+' <i class="fa fa fa-diamond"></i></strong><br><br>'+nota,
        showDenyButton: false,
        confirmButtonColor: '#46a9c9',
        confirmButtonText:
          'OTTIENI RICOMPENSA',
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
        }
  
        if(vincitore !== "") {
          let request:any = {}
          request.requestId = req.id;
          request.playerIdvincitore = playerIdvincitore;
          request.vincitore = vincitore;
          request.playerIdperdente = playerIdperdente;
          request.perdente = perdente;
          request.status = Status.COMPLETATO;
          request.role = this.playerRole;
          request.typeMod = typeMod;
          request.expBonus = this.playerStateService.getGuadagniBonus();
          this.notifierStateService.updateRequest(request).then((resp) => {
            if(resp === true) {
              //this.notifierStateService.resetState();
              req.status = Status.COMPLETATO;
              req.vincitore = vincitore;
              this.messageService.alert('Partita Conclusa!','Richiesta aggiornata con successo!','success');
              request.playerIdReq = request.playerIdvincitore;
              request.playerIdOppo = request.playerIdperdente;
              this.socket.emit('newRequestGame', request);
            } else {
              if(resp) {
                const statusError = resp.status;
                if(statusError === 404) {
                  this.messageService.alert('Attenzione!','Completa la tua partita prima di ottenere la ricompensa!','error');
                } else {
                  this.messageService.alert('Attenzione!',"Problema durante l'aggiornamento della richiesta",'error');
                }
              }
            }
          });
        }
      })
    } else if(req.status === Status.COMPLETATO) {
      if(vincitore!) {
        this.messageService.alert('Info',"Partita conclusa! <br> Il vincitore: <strong>"+vincitore+'</strong><br><br>' + 'Vincita: <strong>'+vincita.coin+' <i class="fa fa fa-database"></i> '+vincita.credits+' <i class="fa fa fa-diamond"></i></strong>','info');
      }
    }else {
      this.messageService.alert('Info',"Questa richiesta è stata rifiutata, creane una nuova!",'info');
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

  getUpdateRequests() {
    return this.socket.fromEvent('current_requests').pipe(map((data: any) => data))
  }

  private updateReqs(req: Reqs, newstatus: number) {
    if(newstatus !== 0) {
      let request:any = {}
      request.requestId = req.id;
      request.status = newstatus;
      request.playerIdReq = req.playerIdReq;
      request.playerIdOppo = req.playerIdOppo;
      request.expBonus = this.playerStateService.getGuadagniBonus();
      this.notifierStateService.updateRequest(request).then((resp) => {
        if(resp) {
          //this.notifierStateService.resetState();
          req.status = newstatus;
          this.messageService.alert('Aggiornato!','Richiesta aggiornata con successo! Torna più tardi per vedere gli aggiornamenti','success');
          this.showMoreDetail = false;
          this.socket.emit('newRequestGame', request);
        } else {
          this.messageService.alert('Errore',"Qualcosa è andato storto durante l'aggiornamento della richiesta",'error');
        }
      });
    }
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  private takeReqs() {
    this.pageSelected = "1";
    this.notifierStateService.getReqs(this.playerId!,false,false,this.typeMode!).then((resp) => {
      if(resp) {
        this.reqs.push(...resp.reqs![this.pageSelected]);

        this.notifierStateService.getReqs(this.playerId!,false,true,this.typeMode!).then((resp) => {
          if(resp) {
            this.reqs.push(...resp.reqs![this.pageSelected]);
          } else {
            this.messageService.alert('Attenzione!','Errore durante la chiamata getReqs','error');
          }
        });

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
