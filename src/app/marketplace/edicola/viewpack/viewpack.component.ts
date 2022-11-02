import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'marketplace-viewpack',
  templateUrl: './viewpack.component.html',
  styleUrls: ['./viewpack.component.css']
})
export class MarketPlaceViewpackComponent implements OnInit {

  @Input() typePack:number=0;

  constructor() { }

  ngOnInit(): void {
  }

}
