import { Component, OnInit } from '@angular/core';
import { Card, SellCard } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/module/services/swalAlert/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  marketPlace: SellCard[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
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
        /*
        this.httpPlayerService.acquistaCard(sellCard,this.player?._id!).subscribe(
          async resultService => {
            this.spinnerService.hide();
            if(resultService) {
              this.swalAlert('Fatto!','Acquistato!','success');
              await this.takePlayer(this.player?._id!);
              await this.takeZaino(this.player?._id!);
              await this.getMarketPlace();
            }
            else
              this.swalAlert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
          }
        );*/
      }
    })
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

}
