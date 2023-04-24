import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, SellCard } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import Swal from 'sweetalert2';
import { StateMarketService } from '../../services/state/state-market.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;
  marketPlace: SellCard[] | undefined;

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
        class: "fa fa-briefcase"
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
