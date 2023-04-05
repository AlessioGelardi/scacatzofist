import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeMod } from 'src/app/module/play-now/enum/typeMod';
import { Player } from 'src/app/module/interface/player';

@Component({
  selector: 'player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['../../styles/player.css']
})
export class PlayerStatusComponent implements OnInit {

  @Input() player:Player | undefined;

  numberNotify:number | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  readNotify() {
    this.router.navigate(['/request',{id:this.player?._id!,typeMode:TypeMod.ALL}]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
