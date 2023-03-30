import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, SellCard } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/services/state/state-player.service';
import { MessageService } from 'src/app/services/swalAlert/message.service';
import Swal from 'sweetalert2';
import { StateMarketService } from '../../services/state/state-market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;
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

    const playerId = "63459b3a4b4c877f5a46f43e"; //this.route.snapshot.paramMap.get('id') 

    this.takeMarketPlace();
    this.takePlayer(playerId);

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
        this.marketStateService.buyCard(sellCard,this.player?._id!).then((resp) => {
          if(resp) {
            this.messageService.alert('Fatto!','Carta acquistata!','success');
          } else {
            this.messageService.alert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
          }
        });
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
          this.router.navigate(['/home']);
          break;
        case 'SELL':
          this.router.navigate(['/sell']);
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola']);
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
