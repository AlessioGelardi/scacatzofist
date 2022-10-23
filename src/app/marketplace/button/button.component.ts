import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'marketplace-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class MarketplaceButtonComponent implements OnInit {

  @Input() viewCard: boolean = false;

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  back() {
    if(this.viewCard) {
      this.buttonOperation.emit({"viewCard":false});
    } else {
      this.buttonOperation.emit({"backToHome":true});
    }
  }

  newVendita() {
    this.buttonOperation.emit({"viewCard":true});
    //this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  edicola() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  zaino() {
    this.swalAlert('In progress...','Questa funzionalità è ancora in sviluppo... mi dispiace','info');
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }
}
