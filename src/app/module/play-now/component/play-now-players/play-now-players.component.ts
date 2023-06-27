import { Component, Input } from '@angular/core';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';
import { TypeMod } from '../../enum/typeMod';
import { Card } from 'src/app/module/interface/card';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'play-now-players',
  templateUrl: './play-now-players.component.html',
  styleUrls: ['../../styles/play-now.css','./play-now-players.component.css']
})
export class PlayNowPlayersComponent {

  @Input() playerId!: string;
  @Input() typeMode!: number;
  @Input() rewardPerdita: any;
  @Input() rewardVincita: any;
  @Input() viewCardBet: boolean = false;

  players: Player[] = [];
  oppoPlayerId: string | undefined;
  oppoPlayerName:string | undefined;

  filterName:string | undefined;

  showZaini:boolean = false;
  myZaino: Card[] = [];
  oppoZaino: Card[] = [];
  myPlate: Card[] = [];
  oppoPlate: Card[] = [];

  dragging:boolean = false;

  constructor(private messageService: MessageService,
    private notifierStateService: StateNotifierService,
    private playerStateService: StatePlayerService) {

  }

  ngOnInit(): void {
    this.takeAllPlayers(this.playerId);
  }

  inviaRichiesta(playerId:string,playerName:string) {
    let playName = "";
    switch(this.typeMode) {
      case TypeMod.SCONTRO:
        playName = 'Scontro'
        break;
      case TypeMod.PUNTATA:
        playName = 'Puntata'
        break;
    }

    Swal.fire({
      title: 'Sei sicuro?',
      text: "Confermando invierai la richiesta di modalità "+ playName +" a "+playerName+"!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, invia richiesta!'
    }).then((result) => {
      if (result.isConfirmed) {
        let request: any = {};
        request.typeMod = this.typeMode;
        request.playerIdReq = this.playerId;
        request.playerIdOppo = playerId;
        request.status = 1;
        request.bonus = this.playerStateService.getBonus() && this.typeMode===TypeMod.SCONTRO;
        request.vincita = this.rewardVincita;
        request.perdita = this.rewardPerdita;

        if(this.typeMode===TypeMod.PUNTATA) {
          if(this.myPlate.length>0) {
            request.plateReq = []
            for(let card of this.myPlate) {
              request.plateReq.push(card.id)
            }
          }

          if(this.oppoPlate.length>0) {
            request.plateOppo = []
            for(let card of this.oppoPlate) {
              request.plateOppo.push(card.id)
            }
          }
        }

        this.notifierStateService.inviaRichiesta(request).then((resp) => {
          if(resp === true) {
            this.messageService.alert('Fatto!','Richiesta inviata!','success');
          } else {
            if(resp) {
              const statusError = resp.status;
              if(statusError === 402) {
                this.messageService.alert('Attenzione!','Richiesta gia inviata, controlla nelle tue richieste','error');
              } else if(statusError === 401) {
                this.messageService.alert('Attenzione!','User impegnato al momento! Riprova più tardi','error');
              } else {
                this.messageService.alert('Errore',"Errore durante l'invio della richiesta",'error');
              }
            }
          }
        });
      }
    })
  }

  public get TypeMod() {
    return TypeMod; 
  }

  viewZaini(oppoPlayerId:string,playerName:string) {
    this.showZaini=true;

    this.oppoPlayerId = oppoPlayerId;
    this.oppoPlayerName = playerName;

    this.takeZaino(this.oppoPlayerId);
    this.takeZaino(this.playerId);
  }

  showCard(card:Card) {
    if(!this.dragging) {
      this.messageService.showDetailCard(card);
    }
  }

  onDragStart(): void {
    this.dragging = true;
  }
  
  onDragEnd(): void {
    setTimeout(() => {
      this.dragging = false;
    }, 10);
  }

  onDrop(event: CdkDragDrop<Card[]>) {
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data,event.previousIndex,event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
  }

  private takeAllPlayers(id:string) {
    
    this.playerStateService.getAllPlayers(id).then((resp) => {
      if(resp) {
        this.players = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getAllPlayers','error');
      }
    });
  }

  private takeZaino(playerId:string) {
    if(this.playerId === playerId) {
      this.playerStateService.getZaino(playerId).then((resp) => {
        if(resp) {
          this.myZaino=resp
        } else {
          //TO-DO gestione degli errori
          /*
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
          */
  
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    } else {
      this.playerStateService.getZainoNoCache(playerId).then((resp) => {
        if(resp) {
          this.oppoZaino=resp
        } else {
          //TO-DO gestione degli errori
          /*
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
          */
  
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    }

  }

}