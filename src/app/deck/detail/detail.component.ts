import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Deck } from 'src/app/interface/card';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'deck-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DeckDetailComponent implements OnInit {

  @Input() deckId: string | undefined;

  deck: Deck | undefined;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    if(this.deckId) {
      this.httpPlayerService.getDeckById(this.deckId).subscribe({
        next: (result:Deck) => {
          if(result) {
            this.deck = result;
          }
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    }
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
