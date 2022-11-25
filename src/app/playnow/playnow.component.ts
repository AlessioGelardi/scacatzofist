import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Player } from '../interface/player';
import { PlayerStatusComponent } from '../player-status/player-status.component';
import { HttpPlayer } from '../services/httpPlayer';

@Component({
  selector: 'app-playnow',
  templateUrl: './playnow.component.html',
  styleUrls: ['./playnow.component.css']
})
export class PlaynowComponent implements OnInit {

  player:Player | undefined;
  numberNotify:number | undefined;
  typeMod: number | undefined;

  viewModalita:boolean = true;
  
  viewScontro:boolean = false;

  viewReqs:boolean = false;

  constructor(private route: ActivatedRoute,private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);
    this.takeNumberNotify(playerId);
  }

  buttonOperationHandler(operation: any) {
    if(operation) {
      if(operation.backToHome) {
        this.router.navigate(['/home',{id:this.player?._id!}]);
      } else {
        if(operation.homePlaynow) {
          this.viewModalita = true;
          this.viewReqs = false;
          this.viewScontro = false;
        } else {
          this.viewModalita = false;
          this.viewReqs = operation.viewReqs ? operation.viewReqs:false;
          this.viewScontro = operation.viewScontro ? operation.viewScontro:false;
        }
      }
    }
  }

  scontro() {
    this.typeMod = 1;
    this.viewScontro = !this.viewScontro;
    this.viewModalita = !this.viewModalita
  }

  puntata() {
    this.swalAlert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  cardbettle() {
    this.swalAlert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  torneo() {
    this.swalAlert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  private takePlayer(playerId: string) {
    this.spinnerService.show();
    this.httpPlayerService.getPlayer(playerId).subscribe({
      next: (result:Player) => {
        this.player = result;
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

  private takeNumberNotify(playerId: string) {
    this.spinnerService.show();
    this.httpPlayerService.getNumberNotify(playerId).subscribe({
      next: (result) => {
        if(result>0){
          this.numberNotify = result;
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

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
