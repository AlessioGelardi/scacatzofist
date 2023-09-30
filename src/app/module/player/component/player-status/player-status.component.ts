import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from 'src/app/module/interface/player';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { StateMarketService } from 'src/app/module/market/services/state/state-market.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StateTradeService } from 'src/app/module/trade/services/state/state-trade.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['../../styles/player.css']
})
export class PlayerStatusComponent implements OnInit {

  @Input() player:Player | undefined;

  numberNotify:number | undefined;

  constructor(private router: Router,
    private deckStateService: StateDeckService,
    private notifierStateService: StateNotifierService,
    private marketStateService: StateMarketService,
    private tradeStateService: StateTradeService,
    private playerStateService: StatePlayerService,
    private socket: Socket) { }

  ngOnInit(): void {
  }

  detail() {
    this.router.navigate(['/playerdetail',{id:this.player?._id!}]);
  }

  readInventory() {
    this.router.navigate(['/inventory',{id:this.player?._id!}]);
  }

  logout() {
    this.deckStateService.resetState();
    this.marketStateService.resetState();
    this.playerStateService.resetState();
    this.notifierStateService.resetTournaments();
    this.tradeStateService.resetPrivateTrades();
    this.router.navigate(['/']);
    this.socket.emit('logout', this.player!.name);
  }
}
