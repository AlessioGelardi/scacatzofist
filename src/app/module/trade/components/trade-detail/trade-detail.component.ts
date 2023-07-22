import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateTradeService } from '../../services/state/state-trade.service';
import { Player } from 'src/app/module/interface/player';
import { Trade } from 'src/app/module/interface/trade';
import { Card } from 'src/app/module/interface/card';

@Component({
  selector: 'app-trade-detail',
  templateUrl: './trade-detail.component.html',
  styleUrls: ['../../styles/trade.css','./trade-detail.component.css']
})
export class TradeDetailComponent {

  buttons: Button[] = [];

  player:Player | undefined;
  trade: Trade | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
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
    let request: any = {};
    request.status = 2; //accettato
    this.tradeStateService.createTrade(request).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Trade accettato!','success');
        this.tradeStateService.resetPrivateTrades();
        this.router.navigate(['/trade']);
      } else {
        this.messageService.alert('Errore',"Errore durante l'aggiornamento del trade",'error');
      }
    });
  }

  rifiuta() {
    let request: any = {};
    request.status = 3; //rifiutato
    this.tradeStateService.createTrade(request).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Trade rifiutato!','success');
        this.tradeStateService.resetPrivateTrades();
        this.router.navigate(['/trade']);
      } else {
        this.messageService.alert('Errore',"Errore durante l'aggiornamento del trade",'error');
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
