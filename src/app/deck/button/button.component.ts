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

  @Input() viewImport: boolean = false;

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  fileName: string | undefined;

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  newDeck() {
    this.buttonOperation.emit({"newDeck":true});
  }

  homeDeck() {
    this.buttonOperation.emit({"viewDeck":false,"updateDeck":false});
  }

  back() {
    if(this.viewUpdate) {
      this.buttonOperation.emit({"viewDeck":true,"updateDeck":false});
    } else if (!this.viewDetail && !this.viewUpdate){
      this.buttonOperation.emit({"backToHome":true});
    }
  }

  updateDeck() {
    if(this.viewDetail) {
      this.buttonOperation.emit({"viewDeck":false,"updateDeck":true});
    } else {
      this.buttonOperation.emit({"viewDeck":false,"updateDeck":false, "updateNameDeck":true});
    }
  }

  import() {
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
            this.buttonOperation.emit({"importDeck":true, "fileResult":result});
          }
        });

      }
    })
  }

  save() {
    this.buttonOperation.emit({"saveDeck":true});
  }

  private selectFileHTML(): string {
    const html = '<input class="form-control" type="file" id="myDiv">';
    return html;
  }

  private async readImportDeck(inputValue: any):Promise<boolean> {
    if(inputValue.files && inputValue.files.length>0) {
      var file:File = inputValue.files[0];
      this.fileName = (file.name as any).replaceAll(".ydk",'');

      return new Promise<boolean>((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = (evt: any) => {
          if(evt && evt.target) {
            let importDeck = (evt.target.result.replaceAll('\r\n',',') as string);

            let newDeck:any = {};
            newDeck["deck"] = {};
            newDeck["deck"]["main"] = importDeck.split("#main")[1].split("#extra")[0].split(',');
            newDeck["deck"]["extra"] = importDeck.split("#extra")[1].split("!side")[0].split(',');
            newDeck["deck"]["side"] = importDeck.split("!side")[1].split(",");
            newDeck["name"] = this.fileName;

            resolve(newDeck);
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
