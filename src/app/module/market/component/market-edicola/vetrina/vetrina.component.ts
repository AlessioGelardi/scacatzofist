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

  dailyPack: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(this.packs[0].dailyPack) {
      this.dailyPack = true;
    } else {
      this.dailyPack = false;
    }
  }

  show(pack:any) {
    this.viewPrice = !this.viewPrice;
    this.selectPack = pack;
  }

  acquista(name:string, taglia:number, baseCost:number, type:number, monster:boolean, level:number, src:string) {
    if(this.dailyPack) {
      this.confirmBuyEmitter.emit({"name":name,"dailyPack":true, "src":src});
    } else {
      this.confirmBuyEmitter.emit({"name":name,"taglia":taglia,"baseCost":baseCost, "typePack":type, "monster":monster, "level":level, "src":src});
    }
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
