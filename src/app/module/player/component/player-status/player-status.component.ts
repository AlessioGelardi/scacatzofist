import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';

@Component({
  selector: 'player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['../../styles/player.css']
})
export class PlayerStatusComponent implements OnInit {

  @Input() player:Player | undefined;

  numberNotify:number | undefined;

  constructor(private router: Router, private notifierStateService: StateNotifierService) { }

  ngOnInit(): void {
  }

  readNotify() {
    this.router.navigate(['/request',{id:this.player?._id!,typeMode:TypeMod.ALL}]);
  }

  logout() {
    //this.notifierStateService.resetState();
    this.router.navigate(['/']);
  }
}
