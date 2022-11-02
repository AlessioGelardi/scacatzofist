import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card, SellCard } from 'src/app/interface/card';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'marketplace-vendita',
  templateUrl: './vendita.component.html',
  styleUrls: ['./vendita.component.css']
})
export class MarketPlaceVenditaComponent implements OnInit {

  @Input() playerId: string | undefined;

  @Input() viewHistory: boolean = false;
  @Input() history: SellCard[] = [];

  @Output() showCard: EventEmitter<Card> = new EventEmitter();
  @Output() sellCard: EventEmitter<Card> = new EventEmitter();

  zaino: Card[]=[];
  viewFilter = false;
  filterName:string | undefined;
  flagFilterGO = false;

  constructor(private spinnerService: NgxSpinnerService,private httpPlayerService: HttpPlayer) { }

  ngOnInit(): void {
    this.spinnerService.show();
    if(this.playerId) {
      this.takeZaino(this.playerId);
    }
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
  }

  sell(card: Card){
    this.sellCard.emit(card);
  }

  show(card: Card) {
    this.showCard.emit(card);
  }

  deleteSell(idSellCard:string) {
    this.spinnerService.show()
    this.httpPlayerService.deleteSellCard(idSellCard).subscribe(
      resultService => {
        this.spinnerService.hide();
        if(resultService) {
          this.swalAlert('Fatto!','Vendita eliminata con successo!','success');
        }
        else
          this.swalAlert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
      }
    );
  }

  private async takeZaino(playerId: string) {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
          this.httpPlayerService.getZainoById(playerId).subscribe({
            next: (result: Card[]) => {
              if (result) {
                this.zaino = result;
              }
            },
            error: (error: any) => {
              this.spinnerService.hide();
              if (error.status === 402) {
                this.swalAlert('Attenzione!', 'non ho trovato nulla con questo id, probabilmente è presente un problema con lo zaino', 'error');
              }
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
          resolve()
      }, 10);
    });
  }
  

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
