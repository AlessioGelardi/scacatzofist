import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from 'src/app/module/interface/player';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { StateMarketService } from 'src/app/module/market/services/state/state-market.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StateTradeService } from 'src/app/module/trade/services/state/state-trade.service';
import { Socket } from 'ngx-socket-io';
import Swal from 'sweetalert2';

@Component({
  selector: 'player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.css','../../styles/player.css']
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
    private socket: Socket) {
    }

  ngOnInit(): void {
  }

  detail() {
    this.router.navigate(['/playerdetail',{id:this.player?._id!}]);
  }

  showLvlReward() {
    const level = this.playerStateService.takeCorrectLevel(this.player!.level!)+5;
    this.playerStateService.getRewardLevel(level).then((resp) => {
      if(resp) {
        const nextReward = resp;
        let img="<div class='row d-flex justify-content-around text-center m-0'>"
        for(let pack of nextReward.packs) {
          for(let i = 0; i < pack.qnt; i++) {
            img = img + "<div class='col-4'><div class='row'><label>"+pack.taglia+"</label></div><div class='row' style='font-size:10px'><label>"+pack.name+"</label></div><div class='row mt-1 d-flex justify-content-around text-center'><img style='width: 160px' src="+pack.src+" /></div></div>"
          }
        }
        img = img + "</div>"

        Swal.fire({
          title: 'Ricompensa livello '+level,
          icon: 'info',
          html:
          'Riceverai <br><strong>'+ nextReward.coins +' <i class="fa fa fa-database"></i> '+ nextReward.credits +' <i class="fa fa fa-diamond"></i> </strong>'+img,
        })
      }
    });
  }

  readInventory() {
    this.router.navigate(['/inventory',{id:this.player?._id!}]);
  }

  home() {
    this.router.navigate(['/home',{id:this.player?._id!}]);
  }

  logout() {
    this.deckStateService.resetState();
    this.marketStateService.resetState();
    this.playerStateService.resetState();
    this.notifierStateService.resetTournaments();
    this.tradeStateService.resetPrivateTrades();
    this.playerStateService.getLoginPlayer().next(undefined)
    this.router.navigate(['/']);
    this.socket.emit('logout', this.player!.name);
  }
}
