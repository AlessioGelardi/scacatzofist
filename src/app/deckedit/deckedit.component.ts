import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Deck } from '../interface/card';
import { HttpPlayer } from '../services/httpPlayer';

@Component({
  selector: 'app-deckedit',
  templateUrl: './deckedit.component.html',
  styleUrls: ['./deckedit.component.css']
})
export class DeckeditComponent implements OnInit {

  deck: Deck | undefined;

  deckName: string = "";

  constructor(private route: ActivatedRoute,private spinnerService: NgxSpinnerService,private httpPlayerService: HttpPlayer) { }

  ngOnInit(): void {
    this.deckName = "Ingranaggio Antico";
    const playerId = this.route.snapshot.paramMap.get('id');
    if(playerId) {
      this.httpPlayerService.getDeckById(playerId).subscribe({
        next: (result:Deck) => {
          if(result) {
            this.deck = result;
            console.log(this.deck)
          }
        }, // completeHandler
        error: (error: any) => {
          this.spinnerService.hide();
          if(error.status===402) {
            //devi far comparire la possibilita di registrarsi.
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
