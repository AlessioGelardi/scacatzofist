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

  viewUpdateDeck: boolean = false;

  zaino: Card[] | undefined;

  constructor(private route: ActivatedRoute,private spinnerService: NgxSpinnerService,private httpPlayerService: HttpPlayer) { }

  ngOnInit(): void {
    this.deckName = "Ingranaggio Antico";
    //const playerId = this.route.snapshot.paramMap.get('id');
    const playerId = '63459b3a4b4c877f5a46f43e'
    this.spinnerService.show();
    if(playerId) {
      this.httpPlayerService.getDeckById(playerId).subscribe({
        next: (result:Deck) => {
          if(result) {
            this.deck = result;
            //this.deck.main.sort((a, b) => a.type - b.type)
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

  //Button Deck Edit
  updateDeck() {
    this.viewUpdateDeck = true;
    //const playerId = this.route.snapshot.paramMap.get('id');
    const playerId = '63459b3a4b4c877f5a46f43e'
    if(playerId && this.viewUpdateDeck) {
      this.spinnerService.show();
      this.httpPlayerService.getZainoById(playerId).subscribe({
        next: (result:Card[]) => {
          if(result) {
            this.zaino = result;
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

  newDeck() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  back() {
    this.viewUpdateDeck = false;
  }

  import() {
    //this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
    Swal.fire({
      title: 'Importa il tuo deck!',
      html: this.selectFileHTML(),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Importa Deck',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        
        let inputPathFile:any = document.getElementById('myDiv');

        this.readImportDeck(inputPathFile).then(async (result) => {
          if(result) {
            this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
          }
        });
        
        /*
        this.readThis(inputPathFile).then(async (result) => {
          if(result) {

            const groups = JSON.stringify(this.result.groups);
            const members = JSON.stringify(this.result.members);
            const papelle = JSON.stringify(this.result.papelle);

            //const resultImport = await this.httpBackupService.importAll(groups,members,papelle);

            if(resultImport) {
              this.swalAlert('Fatto!','Import effettuato con successo','success');
              window.location.reload();
            }
          } else {
            this.swalAlert('Attenzione!','Scegliere obbligatoriamente il file di import','error');
          }
        }); */

      }
    })
  }

  save() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  viewCard(card:Card) {
    this.showCard(card.name,card.description,card.id)
  }

  //Manage deck
  add(card:Card) {
    if(card && true) { //se è da extra o da side
      this.deck?.main.push(card)
    }
  }

  remove(card:Card) {
    if(card && true) { //se è da extra o da side
      const index = this.deck?.main.indexOf(card, 0);
      if (index && index > -1) {
        this.deck?.main.splice(index, 1);
      }
    }
  }

  async readImportDeck(inputValue: any):Promise<boolean> {
    if(inputValue.files && inputValue.files.length>0) {
      var file:File = inputValue.files[0];

      return new Promise<boolean>((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = (evt: any) => {
          if(evt && evt.target) {
            const importDeck = (evt.target.result as string);

            //TO-DO da completare
            //importDeck.split('#main')
            //console.log(importDeck)

            resolve(true);
          }
        };
        reader.readAsText(file);
      });
    } else {
      return false;
    }
  }

  private selectFileHTML(): string {
    const html = '<input class="form-control" type="file" id="myDiv">';
    return html;
  }

  private showCard(title: string, text: string, cardId: string) {
    Swal.fire({
    title: title,
    color: '#3e3d3c',
    background: '#cdcccc',
    html: '<label style="font-size:14px">'+text+'</label>',
    imageUrl: 'https://storage.googleapis.com/ygoprodeck.com/pics/'+cardId+'.jpg',
    imageWidth: 160
    })
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
