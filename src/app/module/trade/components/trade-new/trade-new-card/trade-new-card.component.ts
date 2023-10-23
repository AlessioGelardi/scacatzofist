import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateTradeService } from '../../../services/state/state-trade.service';
import { Card, Deck } from 'src/app/module/interface/card';
import Swal from 'sweetalert2';
import { FormGroup, FormControl } from '@angular/forms';
import { Player } from 'src/app/module/interface/player';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FilterZainoService } from 'src/app/module/zaino/services/filter-zaino.service';

@Component({
  selector: 'trade-new-card',
  templateUrl: './trade-new-card.component.html',
  styleUrls: ['../../../styles/trade.css','./trade-new-card.component.css']
})
export class TradeNewCardComponent {

  @Input() player: Player | undefined;
  @Input() selectPlayerId: string | undefined;
  @Input() selectPlayerName: string | undefined;

  players: Player[] = [];

  createMyTrade = new FormGroup({
    coins: new FormControl(0),
    credits: new FormControl(0),
    cards: new FormControl([])
  });

  createYourTrade = new FormGroup({
    coins: new FormControl(0),
    credits: new FormControl(0),
    cards: new FormControl([])
  });

  myZaino: Card[] = [];
  myZainoBackup: Card[] = [];

  oppoZaino: Card[] = [];
  oppoZainoBackup: Card[] = [];

  myPlate: Card[] = [];
  oppoPlate: Card[] = [];

  dragging: boolean = false;

  viewFilterZaino: boolean = false;
  viewFilterOppo: boolean = false;
  searchFilterZaino:any | undefined;
  searchFilterOppo:any | undefined;

  myDecks:Deck[] = [];
  oppoDecks:Deck[] = [];

  etichette:any= {};
  
  constructor(private router: Router,
    private messageService: MessageService,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService,
    private tradeStateService: StateTradeService,
    private filterZainoService: FilterZainoService) {

  }

  ngOnInit(): void {
    this.takeDecksByIdPlayer(this.player?._id!);
    this.takeDecksByIdPlayer(this.selectPlayerId!);
    this.takeEtichette();
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


  create() {
    if(this.myPlate.length>0 && this.oppoPlate.length>0) {
      Swal.fire({
        title: 'Sei sicuro?',
        text: "Se sicuro di confermare il trade?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, conferma trade!'
      }).then((result) => {
        if (result.isConfirmed) {

          let cardsRequest = []
          for(let card of this.myPlate) {
            cardsRequest.push(card.id)
          }

          let request: any = {};
          request.playerIdReq = this.player?._id;
          request.playerNameReq = this.player?.name;
          request.offerta = {
            "coin": this.createMyTrade.value.coins,
            "credits": this.createMyTrade.value.credits,
            "cards": cardsRequest
          }

          let cardsOffert = []
          for(let card of this.oppoPlate) {
            cardsOffert.push(card.id)
          }

          request.playerIdOppo = this.selectPlayerId;
          request.playerNameOppo = this.selectPlayerName;
          request.richiesta = {
            "coin": this.createYourTrade.value.coins,
            "credits": this.createYourTrade.value.credits,
            "cards": cardsOffert
          }
          request.status = 1;
          request.type = 1;
          request.dataIns = this.takeFormatToday(new Date());
    
          this.tradeStateService.createTrade(request).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Trade creato!','success');
              this.router.navigate(['/trade']);
            } else {
              this.messageService.alert('Errore',"Errore durante la creazione del trade",'error');
            }
          });

        }
      })
    } else {
      this.messageService.alert('Attenzione!','Inserire almeno delle carte per creare il trade!','error');
    }
  }

  private takeFormatToday(startDate:Date) {
    var dd = String(startDate.getDate()).padStart(2, '0');
    var mm = String(startDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = startDate.getFullYear();

    var formatDate = dd + '/' + mm + '/' + yyyy;

    return formatDate+'-'+startDate.getHours()+':'+startDate.getMinutes()+':'+startDate.getSeconds();
  }

   private takeZaino(playerId:string) {
    if(this.player!._id === playerId) {
      this.playerStateService.getZaino().subscribe((value:Card[] | undefined) => {
        if(value) {
          this.myZaino=[]
          for (const card of value) {
            let checkId = card.id
            let inUse = false;
    
            for(const deck of this.myDecks) {
              if (deck.main.concat(deck.extra, deck.side).some(obj => obj.id === checkId)) {
                inUse = true;
              }
            }
    
            if(!inUse) {
              this.myZaino.push(card);
              this.myZainoBackup.push(card);
            }
          }
        } else {
          //TO-DO gestione degli errori
          /*
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }*/
  
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    } else {
      this.playerStateService.getZainoPlayer(playerId);
      this.playerStateService.getZainoNoCache().subscribe((resp:Card[] | undefined) => {
        if(resp) {
          this.oppoZaino=[];
          for (const card of resp) {
            let checkId = card.id
            let inUse = false;
    
            for(const deck of this.oppoDecks) {
              if (deck.main.concat(deck.extra, deck.side).some(obj => obj.id === checkId)) {
                inUse = true;
              }
            }
    
            if(!inUse) {
              this.oppoZaino.push(card);
              this.oppoZainoBackup.push(card);
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
    if(this.player!._id === playerId) {
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
    this.playerStateService.getEtichette(this.player?._id!).then((resp) => {
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

