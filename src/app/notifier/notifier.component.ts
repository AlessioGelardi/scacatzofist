import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Reqs } from '../interface/reqs';
import { HttpPlayer } from '../services/httpPlayer';
import { Status } from "../enum/status";
import { TypeMod } from "../enum/typeMod";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {

  myReqs: Reqs[] = [];
  reqs: Reqs[] = [];

  @Input() typeMod:number | undefined;
  @Input() playerId:string | undefined;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.takeReqs()
  }

  doDetail() {
    this.swalAlert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  private takeReqs() {
    this.spinnerService.show();
    this.httpPlayerService.getReqs(this.playerId!,this.typeMod).subscribe({
      next: (result:any) => {
        this.myReqs = result["myReqs"] as Reqs[];
        this.reqs = result["reqs"] as Reqs[];
      },
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

  public get Status() {
    return Status; 
  }

  public get TypeMod() {
    return TypeMod; 
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
