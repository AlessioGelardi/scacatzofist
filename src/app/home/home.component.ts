import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Player } from '../module/interface/player';
import { HttpPlayer } from '../servicesOld/httpPlayer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  player:Player | undefined;
  numberNotify:number | undefined;

  constructor(private route: ActivatedRoute,private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService,private router: Router) {

  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')

    this.takePlayer(playerId!);
    this.takeNumberNotify(playerId!);
  }

  modificaDeck() {
    this.router.navigate(['/deckedit',{id:this.player?._id}]);
  }

  marketPlace() {
    this.router.navigate(['/marketplace',{id:this.player?._id}]);
  }

  giocaAdesso() {
    this.router.navigate(['/playnow',{id:this.player?._id}]);
  }

  private takePlayer(playerId: string) {
    /*this.spinnerService.show();
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
    });*/
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
