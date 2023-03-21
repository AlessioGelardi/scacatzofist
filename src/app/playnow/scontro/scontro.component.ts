import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Player } from 'src/app/interface/player';
import { HttpPlayer } from 'src/app/servicesOld/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'playnow-scontro',
  templateUrl: './scontro.component.html',
  styleUrls: ['./scontro.component.css']
})
export class PlaynowScontroComponent implements OnInit {

  players: Player[] = [];

  @Input() playerId:string | undefined;

  constructor(private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.takePlayers();
  }

  private takePlayers() {
    this.spinnerService.show();
    this.httpPlayerService.getPlayers(this.playerId!).subscribe({
      next: (result:Player[]) => {
        this.players = result;
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

  inviaRichiesta(playerId:string,playerName:string) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Confermando invierai la richiesta di modalità 'Scontro' a "+playerName+"!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, invia richiesta!'
    }).then((result) => {
      if (result.isConfirmed) {
        let request: any = {};
        request.typeMod = 1;
        request.playerIdReq = this.playerId;
        request.playerIdOppo = playerId;
        request.status = 1;

        this.spinnerService.show();
        this.httpPlayerService.newRequest(request).subscribe({
          next: (result:any) => {
            if(result) {
              this.swalAlert('Fatto!','Richiesta inviata!','success');
            }
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===402) {
              this.swalAlert('Attenzione!','Richiesta gia inviata, controlla nelle tue richieste','error');
            }
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
      }
    })
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }


}
