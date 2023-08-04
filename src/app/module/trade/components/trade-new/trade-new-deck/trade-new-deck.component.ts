import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateTradeService } from '../../../services/state/state-trade.service';
import { Card, Deck } from 'src/app/module/interface/card';

@Component({
  selector: 'trade-new-deck',
  templateUrl: './trade-new-deck.component.html',
  styleUrls: ['./trade-new-deck.component.css']
})
export class TradeNewDeckComponent {

  @Input() player: Player | undefined;
  @Input() selectPlayerId: string | undefined;
  @Input() selectPlayerName: string | undefined;

  viewDeck: boolean = false;
  selectDeck: Deck | undefined;

  myDecks:Deck[] = [];
  oppoDecks:Deck[] = [];

  tradeMyDeck: Deck | undefined;
  tradeOppoDeck: Deck | undefined;

  constructor(private router: Router,
    private messageService: MessageService,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService,
    private tradeStateService: StateTradeService) {

  }

  ngOnInit(): void {
    this.takeDecksByIdPlayer(this.player?._id!);
    this.takeDecksByIdPlayer(this.selectPlayerId!);
  }

  doViewDeck(id:string) {
    
    if(this.viewDeck) {
      this.viewDeck = false;
      this.selectDeck = undefined;
    } else {
      this.viewDeck = true;
      this.deckStateService.getDeck(id).then((resp) => {
        if(resp) {
          this.selectDeck = resp;
        }
      });
    }
  }

  choiseDeck(deck:Deck) {
    let checkFattibilita: boolean = false;
    if(this.player!._id === deck.playerId) {
      checkFattibilita = this.myDecks.length>1;
    } else {
      checkFattibilita = this.oppoDecks.length>1;
    }

    if(checkFattibilita) {
      this.tradeStateService.fattibilitaTrade(deck.id).then((resp) => {
        if(resp === true) {
          //this.messageService.alert('Fatto!','Trade cancellato!','success');
          if(this.player!._id === deck.playerId) {
            this.tradeMyDeck = deck;
          } else {
            this.tradeOppoDeck = deck;
          }
        } else {
          this.messageService.alert('Attenzione',"Impossibile effettuare questo trade perchè le carte contenute al suo interno sono presenti in altri deck",'info');
        }
      });
    }
  }


  private takeDecksByIdPlayer(playerId:string) {
    //let decks:any = {}
    this.deckStateService.resetPlayerDecks();
    if(this.player!._id === playerId) {

      this.deckStateService.getDecks(playerId).then((resp) => {
        this.myDecks = resp!;

        /* let allDecks:Deck[]=[]
        for(let x of decks) {
          this.takeDeck(x["id"],playerId,allDecks)
        }

        //this.takeZaino(playerId,allDecks); */
      });
    } else {
      this.deckStateService.getDecks(playerId).then((resp) => {
        this.oppoDecks = resp!;

        /* let allDecks:Deck[]=[]
        for(let x of decks) {
          this.takeDeck(x["id"],playerId,allDecks)
        }

        //this.takeZaino(playerId,allDecks); */
      });
    }
  }

  /*

  private takeDeck(deckId:string,playerId:string, decks:Deck[]) {
    this.deckStateService.resetDeck();
    if(this.player!._id === playerId) {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          //this.myDecks = resp;
        }
      });
    } else {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          decks.push(resp);
        }
      });
    }
    
  }

  private checkFeasibilityTrade(decks:Deck[], zainoCard: string[], playerId:string) {
    let invZaino: string[] = [ ...zainoCard];
    let cardNotIncludes: string[] = []
    
    for(let deck of decks) {
      let tradeItem:any={}
      
      tradeItem["name"] = deck.name;
      tradeItem["id"] = deck.id;
      tradeItem["tradable"] = true;

      for(let card of deck.main.concat(deck.extra, deck.side)) {
        if(invZaino.includes(card.id)) {
          let indice = invZaino.indexOf(card.id, 0)!;
          if (indice !== undefined && indice > -1) {
            invZaino.splice(indice, 1);
          }
        } else {
          tradeItem["tradable"] = true;
          cardNotIncludes.push(card.id)
        }
      }

      if(this.player!._id === playerId) {
        this.tradeMyDecks.push(tradeItem);
      } else {
        this.tradeOppoDecks.push(tradeItem);
      }
    
    }

    for(let deck of decks) {
      for(let card of deck.main.concat(deck.extra, deck.side)) {
        if(cardNotIncludes.includes(card.id)) {
          let tradeDeck = undefined;
          if(this.player!._id === playerId) {
            tradeDeck = this.tradeMyDecks.filter(deckT => deckT["name"]===deck.name);
          } else {
            tradeDeck = this.tradeOppoDecks.filter(deckT => deckT["name"]===deck.name);
          }
          
          if(tradeDeck && tradeDeck.length>0) {
            for(let trades of tradeDeck) {
              trades["tradable"]=false;
            }
          }
        }
      }
    }
  }

  private takeZaino(playerId:string, decks:Deck[]) {
    if(this.player!._id === playerId) {
      this.playerStateService.getZaino(playerId).then((resp) => {
        if(resp) {

          let zainoCard: string[] = [];
          for(let card of resp) {
            zainoCard.push(card.id!)
          }
          this.checkFeasibilityTrade(decks,zainoCard,playerId);

        } else {
          //TO-DO gestione degli errori
          /*
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    } else {
      this.playerStateService.getZainoNoCache(playerId).then((resp) => {
        if(resp) {

          let zainoCard: string[] = [];
          for(let card of resp) {
            zainoCard.push(card.id!)
          }
          this.checkFeasibilityTrade(decks,zainoCard,playerId);

        } else {
          //TO-DO gestione degli errori
          
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
          
  
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    }
  }*/
}
