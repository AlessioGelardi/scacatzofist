import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';
import { TypeMod } from '../../enum/typeMod';

@Component({
  selector: 'app-play-now-training',
  templateUrl: './play-now-training.component.html',
  styleUrls: ['./play-now-training.component.css']
})
export class PlayNowTrainingComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  start:boolean = false;
  startDate: Date | undefined;

  finishTraning:boolean=false;

  duelRecs:any;
  totalReward:number = 0;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private notifierStateService: StateNotifierService,
    private playerStateService: StatePlayerService) { }

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
        name: "REQUEST-BUTTON",
        code: "REQUEST",
        class: "fa fa-list"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer();
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          if(this.start) {
            this.stopTimer("Timer in corso, vuoi veramente terminare il traning?")
          } else {
            this.router.navigate(['/home']);
          }
          break;
        case 'BACK':
          if(this.start) {
            this.stopTimer("Timer in corso, vuoi veramente terminare il traning?")
          } else {
            if(this.finishTraning) {
              this.finishTraning=false
            } else {
              this.router.navigate(['/playnow',{id:this.playerId}]);
            }
          }
          break;
        case 'REQUEST':
          if(this.start) {
            this.stopTimer("Timer in corso, vuoi veramente terminare il traning?")
          } else {
            if(this.finishTraning) {
              this.finishTraning=false;
            } else {
              this.finishTraning=true;
              this.takeDuelRec();
            }
          }
          break;
      }
    }
  }

  startTraining() {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Confermando l'inizio del traning verranno registrate le tue partite, ricordati di cliccare il tasto FINE TRANING!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, inizia training!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.start=true;
        const dataIns = new Date();

        let request:any = {}
        request.playerIdReq = this.player?._id!;
        request.main = true;
        request.status = 1;
        request.typeMod = TypeMod.TRAINING;
        request.dataIns = this.takeFormatToday(dataIns);
        this.notifierStateService.createTraining(request).then((resp) => {
          if(resp == true) {
            this.startDate=dataIns;
          }
        });
      }
    })
  }

  private takeFormatToday(startDate:Date) {
    var dd = String(startDate.getDate()).padStart(2, '0');
    var mm = String(startDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = startDate.getFullYear();

    var formatDate = dd + '/' + mm + '/' + yyyy;

    return formatDate+'-'+startDate.getHours()+':'+startDate.getMinutes()+':'+startDate.getSeconds();
  }

  stopTraining() {
    const endTraining = new Date();
    const differenceInMilliseconds = endTraining.getTime() - this.startDate!.getTime();

    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if(minutes>10 || hours>=1 || days>=1) {
      let request: any = {};
      request.playerIdReq = this.playerId!;
      request.playerName = this.player?.name!;
      request.typeMod = TypeMod.TRAINING;
      request.status = 1;
      request.playerName = this.player?.name;
      request.bonus = this.playerStateService.getGuadagniBonus();
      request.expBonus = this.playerStateService.getExpBonus();
      this.stopTrainingReq();
      this.notifierStateService.createDuelRec(request).then((resp) => {
        if(resp == true) {
          this.finishTraning=true;
          this.start=false;
          this.takeDuelRec();
        } else {
          //TO-DO gestione degli errori
          if(resp && resp.status===402) {
            this.stopTimer("Non sono state trovate partite registrate, sei sicuro di voler terminare il traning ?");
          } else {
            this.messageService.alert('Attenzione!','Errore durante la chiamata createDuelRec','error');
          }
        }
      });
    } else {
      this.messageService.alert('Attenzione!','Devi terminare almeno 10 minuti di traning prima di poter confermare la fine','info');
    }
    
  }

  awardTraining() {
    let request: any = {};
    request.playerIdReq = this.playerId!;
    request.typeMod = 2;
    request.status = 2;

    this.notifierStateService.updateDuelRec(request).then((resp) => {
      if(resp == true) {

        this.playerStateService.resetPlayerState();
        this.takePlayer();
        this.takeDuelRec();

      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata updateDuelRec','error');
      }
    });
  }

  private stopTrainingReq() {
    let request:any = {}
    request.playerIdReq = this.player?._id!;
    this.notifierStateService.stopTraining(request).then((resp) => {
      if(resp == true) {
        this.start=false;
      }
    });
  }

  private stopTimer(message:string) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, stop training!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stopTrainingReq();
      }
    })
  }

  private takePlayer() {
    this.playerStateService.getPlayer(this.playerId!).then((resp) => {
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

  private takeDuelRec() {
    this.notifierStateService.getDuelRec(this.playerId!).then((resp) => {
      if(resp) {
        this.duelRecs = resp;
        this.totalReward = 0;
        for(let duel of this.duelRecs) {
          this.totalReward += duel.reward;
        }
      } else {
        this.messageService.alert('Attenzione!','Errore durante la chiamata getDuelRec','error');
      }
    });
  }

}
