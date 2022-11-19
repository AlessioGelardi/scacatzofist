import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Reqs } from 'src/app/interface/reqs';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'playnow-reqs',
  templateUrl: './reqs.component.html',
  styleUrls: ['./reqs.component.css']
})
export class PlaynowReqsComponent implements OnInit {

  reqs: Reqs[] = [];

  @Input() typeMod:number | undefined;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    //takeReqs
  }

  doDetail() {
    this.swalAlert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
