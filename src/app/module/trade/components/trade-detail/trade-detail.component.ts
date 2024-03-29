import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateTradeService } from '../../services/state/state-trade.service';
import { Player } from 'src/app/module/interface/player';
import { Trade } from 'src/app/module/interface/trade';
import { Card, Deck } from 'src/app/module/interface/card';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';

@Component({
  selector: 'app-trade-detail',
  templateUrl: './trade-detail.component.html',
  styleUrls: ['../../styles/trade.css','./trade-detail.component.css']
})
export class TradeDetailComponent {

  buttons: Button[] = [];

  player:Player | undefined;
  trade: Trade | undefined;

  viewDeck: boolean = false;
  selectDeck: Deck | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService,
    private tradeStateService: StateTradeService) {

  }

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
      }
    ];

    const playerId = this.route.snapshot.paramMap.get('playerId')!;
    const tradeId = this.route.snapshot.paramMap.get('tradeId')!; 
    this.takePlayer(playerId);
    this.takeTrade(tradeId);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home']);
          break;
        case 'BACK':
          this.router.navigate(['/trade']);
          break;
      }
    }
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  accetta() {
    if(Number(this.player?.coin) >= this.trade?.richiesta['coin'] && Number(this.player?.credits) >= this.trade?.richiesta['credits']) {
      this.update(2);
    } else {
      this.messageService.alert('Attenzione!','Budget insufficente, i coin o i credits a disposizione non coprono la spesa','info');
    }
  }

  rifiuta() {
    this.update(3);
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
          this.deckStateService.resetDeck();
        }
      });
    }
  }

  alignDeck() {
    this.deckStateService.alignDecks(this.player?._id!).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','I deck sono stati allineati!','success');
        this.deckStateService.resetDeck();
        this.deckStateService.resetPlayerDecks();
        this.router.navigate(['/trade']);
      } else {
        this.messageService.alert('Errore',"Errore durante l'allineamento dei deck",'error');
      }
    });
  }

  private update(status:number) {
    let request: any = {};
    request.id = this.trade?._id!;
    request.status = status; //2 - accettato | 3 - rifiutato
    request.dataUpd = this.takeFormatToday(new Date())
    this.tradeStateService.updateTrade(request).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Trade '+(status===2?'accettato':'rifiutato')+'!','success');
        this.tradeStateService.resetPrivateTrades();
        this.router.navigate(['/trade']);
      } else {
        this.messageService.alert('Errore',"Errore durante l'aggiornamento del trade",'error');
      }
    });
  }

  private takeFormatToday(startDate:Date) {
    var dd = String(startDate.getDate()).padStart(2, '0');
    var mm = String(startDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = startDate.getFullYear();

    var formatDate = dd + '/' + mm + '/' + yyyy;

    return formatDate+'-'+startDate.getHours()+':'+startDate.getMinutes()+':'+startDate.getSeconds();
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
  
  private takeTrade(tradeId: string) {
    this.tradeStateService.getTrade(tradeId).then((resp) => {
      if(resp) {
        this.trade = resp;
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
