import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, SellCard } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/module/services/swalAlert/message.service';
import { StateMarketService } from '../../services/state/state-market.service';

@Component({
  selector: 'app-market-sell',
  templateUrl: './market-sell.component.html',
  styleUrls: ['./market-sell.component.css']
})
export class MarketSellComponent implements OnInit {

  buttons: Button[] = [];

  history: SellCard[] | undefined;

  playerId:string | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
      },
      /* {
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-briefcase"
      }, */
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      }
    ];

    this.playerId = "63459b3a4b4c877f5a46f43e"; //this.route.snapshot.paramMap.get('id') 

    this.marketStateService.getSellHistory(this.playerId).then((resp) => {
      this.history = resp!;
    });
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/market']);
          break;
        /* case 'SELL':
          this.router.navigate(['/sell']);
          break; */
        case 'EDICOLA':
          this.router.navigate(['/edicola']);
          break;
      }
    }
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  deleteSell(sellId:string,cardId:string) {
    this.marketStateService.deleteSellCard(sellId,cardId,this.playerId!).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Vendita eliminata con successo!','success');
      } else {
        if(resp && resp.status !== 200) {
          this.messageService.alert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
        }
      }
    });
  }

}
