import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateTradeService } from '../../services/state/state-trade.service';
import { Trade } from 'src/app/module/interface/trade';

@Component({
  selector: 'trade',
  templateUrl: './trade.component.html',
  styleUrls: ['../../styles/trade.css','./trade.component.css']
})
export class TradeComponent {

  buttons: Button[] = [];

  player:Player | undefined;

  showPrivateTrade: boolean = false;
  privateTrades: Trade[] | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private tradeStateService: StateTradeService,
    private playerStateService: StatePlayerService) { }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "NEW-BUTTON",
        code: "NEW",
        class: "fa fa-plus"
      },
      {
        name: "REQUEST-BUTTON",
        code: "REQUEST",
        class: "fa fa-list"
      } 
    ];

    const playerId = this.route.snapshot.paramMap.get('id')!; 
    this.takePlayer(playerId);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home']);
          break;
        case 'NEW':
          this.router.navigate(['/trade-new',{id:this.player?._id!}]);
          break;
        case 'REQUEST':
          this.showPrivateTrade=true;
          this.takePrivateTrade(this.player?._id!);
          break;
      }
    }
  }

  refresh() {
    this.tradeStateService.resetPrivateTrades();
    this.takePrivateTrade(this.player?._id!);
  }

  showDetail(trade: Trade) {
    this.router.navigate(['/trade-detail',{playerId:this.player?._id!, tradeId:trade?._id!}]);
  }

  deleteTrade(trade: Trade) {
    alert('cacca')
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

  private takePrivateTrade(playerId: string) {
    this.tradeStateService.getPrivateTrade(playerId).then((resp) => {
      if(resp) {
        this.privateTrades = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getPrivateTrade','error');
      }
    });
  }

}
