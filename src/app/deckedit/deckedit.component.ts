import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Card, Deck } from '../interface/card';
import { HttpPlayer } from '../services/httpPlayer';

@Component({
  selector: 'app-deckedit',
  templateUrl: './deckedit.component.html',
  styleUrls: ['./deckedit.component.css']
})
export class DeckeditComponent implements OnInit {

  deck: Deck | undefined;

  deckName: string = "";

  viewUpdateName: boolean = false;

  zaino: Card[] | undefined;

  constructor(private route: ActivatedRoute,private spinnerService: NgxSpinnerService,private httpPlayerService: HttpPlayer) { }

  ngOnInit(): void {
    this.deckName = "Ingranaggio Antico";
    const playerId = this.route.snapshot.paramMap.get('id');
    if(playerId) {
      this.httpPlayerService.getDeckById(playerId).subscribe({
        next: (result:Deck) => {
          if(result) {
            this.deck = result;
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

  //Button Deck Edit
  updateName() {
    this.viewUpdateName = !this.viewUpdateName;
    const playerId = this.route.snapshot.paramMap.get('id');
    if(playerId && this.viewUpdateName) {
      this.httpPlayerService.getZainoById(playerId).subscribe({
        next: (result:Card[]) => {
          if(result) {
            this.zaino = result;
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

  import() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  save() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  //Manage deck
  add(id?:string) {
    if(id && true) { //se è da extra o da side
      this.deck?.main.push(id)
    }
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
