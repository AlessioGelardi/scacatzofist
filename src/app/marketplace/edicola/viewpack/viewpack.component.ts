import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'marketplace-viewpack',
  templateUrl: './viewpack.component.html',
  styleUrls: ['./viewpack.component.css']
})
export class MarketPlaceViewpackComponent implements OnInit {

  @Input() packs:any[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  viewPrice: boolean = false;
  selectPack: any | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  show(pack:any) {
    this.viewPrice = !this.viewPrice;
    this.selectPack = pack;
  }

  acquista(taglia:number, baseCost:number, type:number, monster:boolean, level:number) {
    this.buttonOperation.emit({"taglia":taglia,"baseCost":baseCost, "typePack":type, "monster":monster, "level":level});
  }

  calculatePrezzo(taglia:number, baseCost:number):number {
    let cost = taglia*baseCost;
    switch(taglia) {
      case 3:
        cost = cost;
        break;
      case 7:
        cost = (cost-baseCost);
        break;
      case 12:
        cost = (cost-(baseCost*2));
        break;
      case 15:
        cost = (cost-(baseCost*3));
        break;
    }
    return cost;
  }

}
