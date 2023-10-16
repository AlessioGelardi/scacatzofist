import { Component } from '@angular/core';
import { StatePlayerService } from './module/player/services/state/state-player.service';
import { Player } from './module/interface/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  viewSideBar = false;
  player: Player | undefined;

  constructor(private playerStateService: StatePlayerService) {
    this.playerStateService.getLoginPlayer().subscribe((value:Player | undefined) => {
      this.player = value;
    });
  }

  /* turnHome() {
    window.history.back();
  } */

  openSideBar() {
    this.viewSideBar = !this.viewSideBar;
  }
  
}
