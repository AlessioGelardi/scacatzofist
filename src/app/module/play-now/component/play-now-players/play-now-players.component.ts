import { Component, Input } from '@angular/core';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';
import { TypeMod } from '../../enum/typeMod';
import { Card, Deck } from 'src/app/module/interface/card';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { FilterZainoService } from 'src/app/module/zaino/services/filter-zaino.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'play-now-players',
  templateUrl: './play-now-players.component.html',
  styleUrls: ['../../styles/play-now.css','./play-now-players.component.css']
})
export class PlayNowPlayersComponent {

  @Input() playerId!: string;
  @Input() playerName!: string;
  @Input() typeMode!: number;
  @Input() rewardPerdita: any;
  @Input() rewardVincita: any;
  @Input() viewCardBet: boolean = false;

  players: Player[] = [];
  oppoPlayerId: string | undefined;
  oppoPlayerName:string | undefined;

  filterName:string | undefined;

  showZaini:boolean = false;
  myZaino: Card[] | undefined = [];
  myZainoBackup: Card[] = [];
  oppoZaino: Card[] = [];
  oppoZainoBackup: Card[] = [];
  myPlate: Card[] = [];
  oppoPlate: Card[] = [];

  myDecks:Deck[] = [];
  oppoDecks:Deck[] = [];

  dragging:boolean = false;

  viewFilterZaino: boolean = false;
  viewFilterOppo: boolean = false;
  searchFilterZaino:any | undefined;
  searchFilterOppo:any | undefined;

  etichette:any= {};

  constructor(private messageService: MessageService,
    private notifierStateService: StateNotifierService,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService,
    private filterZainoService: FilterZainoService,
    private socket: Socket) {

  }

  ngOnInit(): void {
    this.takeAllPlayers(this.playerId);
    this.takeEtichette();
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
        request.playerNameReq = this.playerName;
        request.playerIdOppo = playerId;
        request.playerNameOppo = playerName;
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
          if(resp && typeof resp === "string") {
            this.messageService.alert('Fatto!','Richiesta inviata!','success');
            request.requestId = resp;
            this.socket.emit('newRequestGame', request);
          } else {
            if(resp) {
              const statusError = resp.status;
              if(statusError === 403) {
                this.messageService.alert('Attenzione!','Sei impegnato in un torneo, non puoi inviare richieste al momento!','error');
              } else if(statusError === 402) {
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

    this.takeDecksByIdPlayer(this.oppoPlayerId); 
    this.takeDecksByIdPlayer(this.playerId);
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

  doFilterZaino() {
    this.viewFilterZaino = !this.viewFilterZaino;
    if(!this.viewFilterZaino) {
      this.retrieveCardsMyZaino(undefined);
    }
  }

  doFilterOppo() {
    this.viewFilterOppo = !this.viewFilterOppo;
    if(!this.viewFilterOppo) {
      this.retrieveCardsOppo(undefined);
    }
  }

  retrieveCardsMyZaino(searchFilter: any) {
    this.searchFilterZaino = searchFilter;

    this.myZaino = this.filterZainoService.transform(this.myZainoBackup,searchFilter);
  }

  retrieveCardsOppo(searchFilter: any) {
    this.searchFilterOppo = searchFilter;

    this.oppoZaino = this.filterZainoService.transform(this.oppoZainoBackup,searchFilter);
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
      this.playerStateService.getZaino().subscribe((value:Card[] | undefined) => {
        this.myZaino = value;
        for (const card of value!) {
          let checkId = card.id
          let inUse = false;
  
          for(const deck of this.myDecks) {
            if (deck.main.concat(deck.extra, deck.side).some(obj => obj.id === checkId)) {
              inUse = true;
            }
          }
  
          if(!inUse) {
            this.myZaino!.push(card)
          }
        }
      });
    } else {
      this.playerStateService.getZainoPlayer(playerId!);
      this.playerStateService.getZainoNoCache().subscribe((resp:Card[] | undefined) => {
        if(resp) {
          this.oppoZaino=[]
          for (const card of resp) {
            let checkId = card.id
            let inUse = false;
    
            for(const deck of this.oppoDecks) {
              if (deck.main.concat(deck.extra, deck.side).some(obj => obj.id === checkId)) {
                inUse = true;
              }
            }
    
            if(!inUse) {
              this.oppoZaino.push(card)
            }
          }
        }
      });
    }
  }

  private takeDecksByIdPlayer(playerId:string) {
    let decks:any = {}
    this.deckStateService.resetPlayerDecks();
    this.deckStateService.getDecks(playerId).then((resp) => {
      decks = resp!;

      for(let x of decks) {
        this.takeDeck(x["id"],playerId)
      }
      this.takeZaino(playerId);
    });
  }

  private takeDeck(deckId:string,playerId:string) {
    this.deckStateService.resetDeck();
    if(this.playerId === playerId) {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          this.myDecks.push(resp);
        }
      });
    } else {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          this.oppoDecks.push(resp);
        }
      });
    }
  }

  private takeEtichette() {
    this.playerStateService.getEtichette(this.playerId!).then((resp) => {
      if(resp) {
        this.etichette = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getEtichette','error');
      }
    });
  }

}
