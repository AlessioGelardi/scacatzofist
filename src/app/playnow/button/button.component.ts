import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'playnow-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class PlaynowButtonComponent implements OnInit {

  @Input() viewScontro: boolean = false;
  @Input() viewReqs: boolean = false;

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  back() {
    if(this.viewReqs) {
      this.buttonOperation.emit({"viewScontro":true});
    } else {
      this.buttonOperation.emit({"homePlaynow":true});
    }
  }

  richieste() {
    this.buttonOperation.emit({"viewReqs":true});
  }

  homePlaynow() {
    this.buttonOperation.emit({"homePlaynow":true});
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
