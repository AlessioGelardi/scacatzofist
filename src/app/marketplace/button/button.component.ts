import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'marketplace-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class MarketplaceButtonComponent implements OnInit {

  @Input() viewCard: boolean = false;
  @Input() viewEdicola: boolean = false;
  @Input() viewPack: boolean = false;
  @Input() viewHistory: boolean = false;

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  back() {
    if(this.viewHistory && this.viewCard) {
      this.buttonOperation.emit({"viewCard":true,"viewHistory":false});
    }
    else if(this.viewCard) {
      this.buttonOperation.emit({"viewCard":false});
    } else if (this.viewPack) {
      this.buttonOperation.emit({"viewCard":false,"viewEdicola":true, "viewPack":false});
    } else if (this.viewEdicola) {
      this.buttonOperation.emit({"viewCard":false,"viewEdicola":false});
    } else {
      this.buttonOperation.emit({"backToHome":true});
    }
  }

  newVendita() {
    this.buttonOperation.emit({"viewCard":true});
  }

  history() {
    this.buttonOperation.emit({"viewCard":true,"viewHistory":true})
    //this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  edicola() {
    this.buttonOperation.emit({"viewCard":false,"viewEdicola":true});
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }
}
