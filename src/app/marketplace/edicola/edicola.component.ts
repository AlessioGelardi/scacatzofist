import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card } from 'src/app/interface/card';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'marketplace-edicola',
  templateUrl: './edicola.component.html',
  styleUrls: ['./edicola.component.css'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'none'
      })),
      state('flipped', style({
        transform: 'rotateY(180deg)'
      })),
      transition('default => flipped', [
        animate('400ms')
      ]),
      transition('flipped => default', [
        animate('200ms')
      ])
    ])
  ]
})
export class MarketPlaceEdicolaComponent implements OnInit {

  typePack:number = 0;
  namePack:string | undefined;
  viewPack:boolean = false;

  finishPurchase: boolean = false;
  newCards: Card[] = []

  constructor(private httpPlayerService: HttpPlayer, private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  setTypePack(typePack:number) {
    this.viewPack = !this.viewPack;
    this.typePack = typePack;
    switch(typePack){
      case 1:
        this.namePack = "MOSTRO";
        break;
      case 2:
        this.namePack = "MAGIA";
        break;
      case 3:
        this.namePack = "TRAPPOLA";
        break;
    }
  }

  acquista(taglia:number) {
    if(this.typePack!==0 && taglia!==0) {
      this.spinnerService.show();
      this.httpPlayerService.acquistaPacchetti(this.typePack,taglia).subscribe({
        next: (result:Card[]) => {
          this.swalAlert('Fatto!','Acquistato!','success');

          this.finishPurchase = true;
          this.newCards = result;
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            this.swalAlert('Attenzione!','Problema durante l"acquisto','error');
          }
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    } else {
      this.swalAlert('Attenzione!','Scegliere il pack e la taglia','error');
    }

  }

  cardClicked(card:Card) {
    if (card.state === "default") {
      card.state = "flipped";
    } else {
      card.state = "default";
    }
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
