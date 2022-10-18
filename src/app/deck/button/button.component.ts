import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'deck-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class DeckButtonComponent implements OnInit {

  @Input() viewDetail: boolean = false;
  
  @Input() viewUpdate: boolean = false;

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  newDeck() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  homeDeck() {
    this.buttonOperation.emit({"viewDeck":false,"updateDeck":false});
    //this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  back() {
    if(this.viewUpdate) {
      this.buttonOperation.emit({"viewDeck":true,"updateDeck":false});
    }
  }

  updateDeck() {
    if(this.viewDetail) {
      this.buttonOperation.emit({"viewDeck":false,"updateDeck":true});
    } else {
      this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
    }
    /*
    //const playerId = this.route.snapshot.paramMap.get('id');
    const playerId = '63459b3a4b4c877f5a46f43e'
    if(playerId && this.viewUpdate) {
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
    }*/
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

      }
    })
  }

  save() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  private selectFileHTML(): string {
    const html = '<input class="form-control" type="file" id="myDiv">';
    return html;
  }

  private async readImportDeck(inputValue: any):Promise<boolean> {
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

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
