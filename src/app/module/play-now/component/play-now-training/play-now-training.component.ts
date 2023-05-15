import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';

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
  intervalId:any | undefined;

  seconds:number = 0;
  finishTraning:boolean=false;

  duelRecs:any;
  countRec:number = 0;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private notifierStateService: StateNotifierService,
    private playerStateService: StatePlayerService) { }

  ngOnInit(): void {
    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
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

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/playnow']);
          break;
        case 'REQUEST':
          this.stopTraining();
          //this.router.navigate(['/request',{id:this.playerId,typeMode:TypeMod.SCONTRO, playerRole: this.player?.ruolo!}]);
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
      confirmButtonText: 'Si, inizia traning!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.start=true;
        this.intervalId = setInterval(() => {
          this.seconds++;
        }, 1000);
      }
    })
  }

  get hours(): number {
    return Math.floor(this.seconds / 3600);
  }

  get minutes(): number {
    return Math.floor((this.seconds % 3600) / 60);
  }

  get secondi(): number {
    return this.seconds % 60;
  }

  stopTraining() {
    let request: any = {};
    request.typeMod = 2;
    request.status = 1;

    this.notifierStateService.createDuelRec(request).then((resp) => {
      if(resp) {

        this.notifierStateService.getDuelRec(request).then((resp) => {

          if(resp) {
            this.duelRecs = resp;
            this.countRec = 3;
            this.seconds=0;
            this.finishTraning=true;
            clearTimeout(this.intervalId);
          } else {
            this.messageService.alert('Attenzione!','Errore durante la chiamata getDuelRec','error');
          }


        });
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata createDuelRec','error');
      }
    });
  }

  doDetail(duel:any) {
    console.log(duel)
    if(duel.status===1) {
      alert('evvai')
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
