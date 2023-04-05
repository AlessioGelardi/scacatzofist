import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'market-vetrina',
  templateUrl: './vetrina.component.html',
  styleUrls: ['./vetrina.component.css','../../../styles/market.css']
})
export class VetrinaComponent implements OnInit {

  @Input() packs:any[] = [];

  @Output() confirmBuyEmitter: EventEmitter<any> = new EventEmitter();

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
    this.confirmBuyEmitter.emit({"taglia":taglia,"baseCost":baseCost, "typePack":type, "monster":monster, "level":level});
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
