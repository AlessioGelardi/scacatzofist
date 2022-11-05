import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { throws } from 'assert';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card, Pack } from 'src/app/interface/card';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'marketplace-edicola',
  templateUrl: './edicola.component.html',
  styleUrls: ['./edicola.component.css']
})
export class MarketPlaceEdicolaComponent implements OnInit {

  @Input() playerId:string | undefined;
  @Input() viewPack: boolean = false;
  @Input() finishPurchase: boolean = false;
  @Output() buttonTypePack: EventEmitter<boolean> = new EventEmitter();
  @Output() buttonFinishP: EventEmitter<boolean> = new EventEmitter();

  typePack:number = 0;
  namePack:string | undefined;

  newPacks: Pack[] = []
  quantityPack: number[] = [];
  viewCards: Card[] = []

  constructor(private httpPlayerService: HttpPlayer, private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  setTypePack(typePack:number) {
    this.viewPack = !this.viewPack;
    this.buttonTypePack.emit(this.viewPack)
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

      Swal.fire({
        title: 'Acquista il tuo pack',
        text: 'Scegli il numero di pack da acquistare',
        input: 'number',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Acquista'
      }).then((result) => {
        if (result.isConfirmed) {

          const myBudget = 3000;
          let prezzo = -1;
          switch(this.typePack) {
            case 1: //monster
              prezzo = this.calculatePrezzo(taglia,5,result.value);
              break;
            case 2: //magic
              prezzo = this.calculatePrezzo(taglia,5,result.value);
              break;
            case 3: //trap
              prezzo = this.calculatePrezzo(taglia,5,result.value);
              break;
          }

          if(this.checkBudget(myBudget, prezzo)) {
            this.spinnerService.show();
            this.httpPlayerService.acquistaPacchetti(this.playerId!,this.typePack,taglia,result.value,prezzo).subscribe({
              next: (result:Pack[]) => {
                this.swalAlert('Fatto!','Acquistato!','success');
                this.finishPurchase = true;
                this.buttonFinishP.emit(this.finishPurchase)
                this.newPacks = result;
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
            this.swalAlert('Attenzione!','Il tuo budget non può sostenere questa spesa','error');
          }
        }
      })
    } else {
      this.swalAlert('Attenzione!','Scegliere il pack e la taglia','error');
    }
  }

  show(pack:Pack) {
    this.viewCards = pack.cards;
  }

  private calculatePrezzo(taglia:number, baseCost:number, quantity:number):number {
    let cost = taglia*baseCost;
    switch(taglia) {
      case 3:
        cost = cost*quantity;
        break;
      case 7:
        cost = (cost-baseCost)*quantity;
        break;
      case 12:
        cost = (cost-(baseCost*2))*quantity;
        break;
      case 15:
        cost = (cost-(baseCost*3))*quantity;
        break;
    }
    return cost;
  }

  private checkBudget(budget:number, prezzo:number):boolean {
    return budget-prezzo>0;
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
