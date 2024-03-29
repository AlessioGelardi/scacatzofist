import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, SellCard, SellPack } from 'src/app/module/interface/card';
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

  dailyshop: SellCard[] | undefined;
  refreshDSFatto:boolean = false;

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
      },
      {
        name: "SKIN-BUTTON",
        code: "SKIN",
        class: "fa fa-film"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    
    this.takePlayer();
    this.takeDailyShop();

  }

  refresh() {
    if(!this.showPack) {
      this.marketStateService.resetMarketPlace();
      this.takeMarketPlace();
    } else {
      this.marketStateService.resetMarketPack();
      this.takeMarketPack();
    }

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
      background: '#9ec981',
      html: '<label style="font-size:14px"> Sei sicur* di acquistare '+sellCard.card.name+' a <b>'+sellCard.prezzo+'</b> coin ?</label>',
      imageUrl: 'https://images.ygoprodeck.com/images/cards/'+sellCard.card.id+'.jpg',
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Acquista'
    }).then((result) => {
      if(result.isConfirmed) {
        if(this.player!.coin!-Number(sellCard.prezzo)>=0) {
          if(sellCard.dailyShop) {
            let request:any = {}
            request.sellId = sellCard.id;
            request.cardId = sellCard.card.id;
            request.prezzo = sellCard.prezzo;
            request.playerId = this.playerId;
            this.marketStateService.buyCardDailyShop(request).then((resp) => {
              if(resp) {
                this.player!.coin = this.player!.coin! - Number(sellCard.prezzo);
                this.messageService.alert('Fatto!','Carta acquistata!','success');
                this.marketStateService.resetDailyShop();
                this.playerStateService.resetZaino();
                this.takeDailyShop();
              } else {
                this.messageService.alert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
              }
            });
          } else {
            this.marketStateService.buyCard(sellCard,this.player?._id!).then((resp) => {
              if(resp) {
                this.player!.coin = this.player!.coin! - Number(sellCard.prezzo);
                this.messageService.alert('Fatto!','Carta acquistata!','success');
                this.playerStateService.resetZaino();
                this.takeMarketPlace();
              } else {
                this.messageService.alert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
              }
            });
          }

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
      background: '#9ec981',
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
            this.playerStateService.resetZaino();
            this.playerStateService.resetInventory();
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
      background: '#9ec981',
      html: '<label style="font-size:14px"> Sei sicur* di acquistare '+pack.name+' a <b>'+pack.prezzo+'</b> coin ?</label>',
      imageUrl: pack.src,
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Acquista'
    }).then((result) => {
      if(result.isConfirmed) {
        if(this.player!.coin!-Number(pack.prezzo)>=0) {

          let request:any = {};
          request.id = pack.id;
          request.packId = pack.packId;
          request.playerId = pack.playerId;
          request.playerIdAcquista = this.player!._id!;
          request.prezzo = pack.prezzo;
          request.taglia = pack.taglia;
          request.level = pack.level;
          request.type = pack.type;
          request.monster = pack.monster;
          request.src = pack.src;
          request.name = pack.name;
          request.isDaily = pack.isDeck;
          request.isDeck = pack.isDeck;
          request.deckId = pack.deckId;

          this.marketStateService.buyPack(request,true).then((resp) => {
            if(resp === true) {
              //TO-DO gestire errori
              this.player!.coin = Number(this.player!.coin!) - Number(pack.prezzo);
              this.messageService.alert('Fatto!','Pack acquistato!','success');
              this.playerStateService.resetPlayerState();
              this.playerStateService.resetInventory();
              this.marketStateService.resetMarketPack();
              this.takeMarketPack();
            } else {
              this.messageService.alert('Attenzione!','Problema durante l"acquisto del deck','error');
            }
          });
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
      background: '#9ec981',
      html: '<label style="font-size:14px"> Sei sicur* di cancellare la vendita del pack <strong>'+sellPack.name+'</strong> ?',
      imageUrl: sellPack.src,
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Togli la vendita'
    }).then((result) => {
      if(result.isConfirmed) {
        
        this.marketStateService.deleteSellPack(sellPack.id).then((resp) => {
          if(resp === true) {
            this.messageService.alert('Fatto!','Vendita eliminata con successo!','success');
            this.marketStateService.resetMarketPack();
            this.playerStateService.resetInventory();
            this.takeMarketPack();
          } else {
            if(resp && resp.status !== 200) {
              this.messageService.alert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
            }
          }
        });
      }
    })
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  clickShowPack(pack:SellPack) {
    this.messageService.showDetailPack(pack);
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
        case 'SKIN':
          this.router.navigate(['/skin',{id:this.playerId!}]);
          break;
      }
    }
  }

  refreshDailyShop() {
    Swal.fire({
      title: 'Sei sicuro?',
      html: "Il daily shop attuale verrà sostituito con uno nuovo al prezzo di 25 <i class='fa fa-diamond'></i>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, sono sicuro!',
      cancelButtonText: 'No, annulla!'
    }).then((result) => {
      if (result.isConfirmed) {

        if(this.player!.credits!-25>=0) {
          let doppio = this.takeDoppio();
          this.marketStateService.refreshDailyShop(this.playerId!,doppio).then((resp) => {
            if(resp === true) {
              //TO-DO gestire errori
              this.player!.credits = Number(this.player!.credits!) - 25;
              this.marketStateService.resetDailyShop();
              this.takeDailyShop();
            } else {
              this.messageService.alert('Attenzione!','Problema durante il reset del daily shop','error');
            }
          });
        } else {
          this.messageService.alert('Errore','Non hai abbastanza crediti','error');
        }
      }
    })
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

  private takePlayer() {
    this.playerStateService.getPlayer(this.playerId!).then((resp) => {
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

  private takeDoppio():boolean {
    const oggi: Date = new Date();
    let doppio = false;
    if(oggi.getDay() === 1) {
      doppio = true;
    }
    return doppio;
  }

  private takeDailyShop() {
    let doppio = this.takeDoppio();
    this.marketStateService.getDailyShop(this.playerId!,doppio).then((resp) => {
      this.dailyshop = resp!;
      this.refreshDSFatto = this.dailyshop[0].refresh!;
    });
  }

}
