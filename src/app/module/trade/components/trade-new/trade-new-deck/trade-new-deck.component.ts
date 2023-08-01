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

  probablyMyDecks:Deck[] = [];
  probablyOppoDecks:Deck[] = [];

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

  private takeDecksByIdPlayer(playerId:string) {
    let decks:any = {}
    this.deckStateService.resetPlayerDecks();
    this.deckStateService.getDecks(playerId).then((resp) => {
      decks = resp!;

      for(let x of decks) {
        this.takeDeck(x["id"],playerId)
      }
      //this.takeZaino(playerId);
    });
  }

  private takeDeck(deckId:string,playerId:string) {
    this.deckStateService.resetDeck();
    if(this.player!._id === playerId) {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          this.probablyMyDecks.push(resp);
        }
        this.checkDeck(this.probablyMyDecks);
      });
    } else {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          this.probablyOppoDecks.push(resp);
        }
      });
    }
  }

  private checkDeck(decks:Deck[]) {
    let allIdcard:string[]=[]
    for(let deck of decks) {
      if(allIdcard.length>0) {
        if (deck.main.concat(deck.extra, deck.side).some(obj => allIdcard.includes(obj.id))) {
          alert('aia')
        }
      } else {
        for(let card of deck.main.concat(deck.extra, deck.side)) {
          allIdcard.push(card.id)
        }
      }
    }
  }
}
