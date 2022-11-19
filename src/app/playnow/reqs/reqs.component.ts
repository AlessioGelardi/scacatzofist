import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'playnow-reqs',
  templateUrl: './reqs.component.html',
  styleUrls: ['./reqs.component.css']
})
export class PlaynowReqsComponent implements OnInit {

  @Input() typeMod:number | undefined;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
