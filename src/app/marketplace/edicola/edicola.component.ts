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
          
          let realConfirm:boolean = false;
          switch(this.typePack) {
            case 1: //monster
              realConfirm = this.checkBudget(taglia,5,result.value);
              break;
            case 2: //magic
              realConfirm = this.checkBudget(taglia,15,result.value);
              break;
            case 3: //trap
              realConfirm = this.checkBudget(taglia,15,result.value);
              break;
          }

          if(realConfirm) {
            this.spinnerService.show();
            this.httpPlayerService.acquistaPacchetti(this.typePack,taglia,result.value).subscribe({
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

  private checkBudget(taglia:number, baseCost:number, quantity:number):boolean {
    const myBudget = 3000;
    let cost = (taglia*baseCost)
    let rest = -1;
    switch(taglia) {
      case 3:
        rest = (myBudget - (cost*quantity))
        break;
      case 7:
        rest = (myBudget - ((cost-baseCost)*quantity))
        break;
      case 12:
        rest = (myBudget - ((cost-(baseCost*2))*quantity))
        break;
      case 15:
        rest = (myBudget - ((cost-(baseCost*3))*quantity))
        break;
    }
    return rest>0;
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
