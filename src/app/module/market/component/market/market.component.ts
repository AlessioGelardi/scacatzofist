import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Pack, SellCard, SellPack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import Swal from 'sweetalert2';
import { StateMarketService } from '../../services/state/state-market.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['../../styles/market.css','./market.component.css']
})
export class MarketComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;
  marketPlace: SellCard[] | undefined;

  showPack:boolean = false;
  marketPack: SellPack[] | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private messageService: MessageService,
    private playerStateService: StatePlayerService) {

   }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-suitcase"
      },
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    
    this.takePlayer(this.playerId!);

  }

  refresh() {
    this.marketStateService.resetState();
    this.takeMarketPlace();
  }

  doShowPack() {
    this.showPack = !this.showPack;
    if(this.showPack) {
      this.takeMarketPack();
    } else {
      this.takeMarketPlace();
    }
  }

  async compraCard(sellCard:SellCard) {
    Swal.fire({
      title: sellCard.card.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> Sei sicur* di acquistare '+sellCard.card.name+' a <b>'+sellCard.prezzo+'</b> coin ?</label>',
      imageUrl: 'https://images.ygoprodeck.com/images/cards/'+sellCard.card.id+'.jpg',
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Acquista'
    }).then((result) => {
      if(result.isConfirmed) {
        if(this.player!.coin!-Number(sellCard.prezzo)>=0) {
          this.marketStateService.buyCard(sellCard,this.player?._id!).then((resp) => {
            if(resp) {
              this.player!.coin = this.player!.coin! - Number(sellCard.prezzo);
              this.messageService.alert('Fatto!','Carta acquistata!','success');
              this.takeMarketPlace();
            } else {
              this.messageService.alert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
            }
          });
        } else {
          this.messageService.alert('Errore','Non hai abbastanza coin','error');
        }

      }
    })
  }

  deleteSell(sellId:string,cardId:string, cardName: string) {
    Swal.fire({
      title: cardName,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> Sei sicur* di cancellare la vendita di <strong>'+cardName+'</strong> ?',
      imageUrl: 'https://images.ygoprodeck.com/images/cards/'+cardId+'.jpg',
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Togli la vendita'
    }).then((result) => {
      if(result.isConfirmed) {
        this.marketStateService.deleteSellCard(sellId,cardId,this.playerId!).then((resp) => {
          if(resp === true) {
            this.messageService.alert('Fatto!','Vendita eliminata con successo!','success');
            this.marketStateService.resetState();
            this.takeMarketPlace();
          } else {
            if(resp && resp.status !== 200) {
              this.messageService.alert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
            }
          }
        });
      }
    })
  }

  async compraPack(pack:SellPack) {
    Swal.fire({
      title: pack.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> Sei sicur* di acquistare '+pack.name+' a <b>'+pack.prezzo+'</b> coin ?</label>',
      imageUrl: pack.src,
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Acquista'
    }).then((result) => {
      if(result.isConfirmed) {
        if(this.player!.coin!-Number(pack.prezzo)>=0) {
          /*
          this.marketStateService.buyCard(sellCard,this.player?._id!).then((resp) => {
            if(resp) {
              this.player!.coin = this.player!.coin! - Number(sellCard.prezzo);
              this.messageService.alert('Fatto!','Carta acquistata!','success');
              this.takeMarketPlace();
            } else {
              this.messageService.alert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
            }
          });*/
        } else {
          this.messageService.alert('Errore','Non hai abbastanza coin','error');
        }

      }
    })
  }

  deleteSellPack(sellPack:SellPack) {
    Swal.fire({
      title: "PACK "+sellPack.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> Sei sicur* di cancellare la vendita del pack <strong>'+sellPack.name+'</strong> ?',
      imageUrl: sellPack.src,
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Togli la vendita'
    }).then((result) => {
      if(result.isConfirmed) {
        /*
        this.marketStateService.deleteSellPack(sellPack.id,this.playerId!).then((resp) => {
          if(resp === true) {
            this.messageService.alert('Fatto!','Vendita eliminata con successo!','success');
            this.marketStateService.resetState();
            this.takeMarketPlace();
          } else {
            if(resp && resp.status !== 200) {
              this.messageService.alert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
            }
          }
        });*/
      }
    })
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.playerId!}]);
          break;
        case 'SELL':
          this.router.navigate(['/sell',{id:this.playerId!}]);
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.playerId!}]);
          break;
      }
    }
  }

  private takeMarketPlace() {
    this.marketStateService.getMarketPlace().then((resp) => {
      this.marketPlace = resp!;
    });
  }

  private takeMarketPack() {
    this.marketStateService.getMarketPack().then((resp) => {
      this.marketPack = resp!;
    });
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.takeMarketPlace();
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
