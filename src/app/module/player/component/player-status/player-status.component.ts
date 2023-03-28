import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/module/interface/player';

@Component({
  selector: 'player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.css']
})
export class PlayerStatusComponent implements OnInit {

  @Input() player:Player | undefined;

  numberNotify:number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  readNotify() {

  }

  logout() {

  }

  private takeNumberNotify(playerId: string) {
    /*this.spinnerService.show();
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
    });*/
  }
}
