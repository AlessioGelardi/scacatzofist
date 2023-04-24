import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, SellCard } from 'src/app/module/interface/card';
import { StateMarketService } from '../../services/state/state-market.service';
import Swal from 'sweetalert2';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-market-sell',
  templateUrl: './market-sell.component.html',
  styleUrls: ['./market-sell.component.css','../../styles/market.css']
})
export class MarketSellComponent implements OnInit {

  buttons: Button[] = [];

  history: SellCard[] | undefined;

  playerId:string | undefined;

  viewFilter = false;
  filterName:string | undefined;

  viewCard: boolean = false;
  zaino: Card[]=[];

  sliceLimit: number | undefined;
  sliceStart: number = 0;
  sliceEnd: number = 60;
  slice: number = 60;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
      },
      {
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-briefcase"
      },
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;

    this.playerStateService.getZaino(this.playerId!).then((resp) => {
      if(resp) {
        this.zaino = resp;
        this.sliceLimit = this.zaino.length;
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

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/market',{id:this.playerId!}]);
          break;
        case 'SELL':
          this.viewCard = !this.viewCard;
          this.takeHistory();
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.playerId!}]);
          break;
      }
    }
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  sellCard(card:Card) {
    Swal.fire({
      title: 'Vendi la tua carta',
      text: 'Scegli il prezzo',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Vendi',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.marketStateService.venditaCard(this.playerId!,card.id,result.value).then((resp) => {
          if(resp === true) {
            this.messageService.alert('Fatto!','Vendita creata con successo!','success');

            let cardDelete = this.zaino!.find(i => i.id === card.id);
            if(cardDelete) {
              const index = this.zaino!.indexOf(cardDelete, 0);
              this.zaino!.splice(index,1);
            }
            this.takeHistory();

          } else {
            if(resp && resp.status !== 200) {
              if(resp.status === 403) {
                let msg = "";
                resp.error.forEach((z: any) => msg=z.name+" x"+z.count);
                this.messageService.alert('Attenzione','Carta presente nel deck '+msg,'error');
              } else {
                this.messageService.alert('Errore','Qualcosa è andato storto durante la creazione della vendita','error');
              }
            }
          }
        });
      }
    })
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

  doFilter() {
    this.viewFilter=!this.viewFilter;
  }

  backSlice() {
    this.sliceEnd -= this.slice;
    this.sliceStart -= this.slice;
  }

  continueSlice() {
    this.sliceStart += this.slice;
    this.sliceEnd += this.slice;
  }

  private takeHistory() {
    this.marketStateService.getSellHistory(this.playerId!).then((resp) => {
      this.history = resp!;
    });
  }

}
