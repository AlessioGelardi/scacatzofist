import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { StateMarketService } from 'src/app/module/market/services/state/state-market.service';
import { StatePlayerService } from '../../services/state/state-player.service';

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
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService) { }

  ngOnInit(): void {
  }

  readNotify() {
    this.router.navigate(['/request',{id:this.player?._id!,typeMode:TypeMod.ALL}]);
  }

  logout() {
    this.deckStateService.resetState();
    this.marketStateService.resetState();
    this.playerStateService.resetState();
    this.router.navigate(['/']);
  }
}
