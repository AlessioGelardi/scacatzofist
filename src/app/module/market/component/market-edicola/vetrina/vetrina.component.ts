import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';
import { Deck } from 'src/app/module/interface/card';

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
  showOnlyTaglia = false;
  isDeck: boolean = false;
  selectDeck: Deck | undefined;

  constructor(private deckStateService: StateDeckService) { }

  ngOnInit(): void {
    if(this.packs.length>0 && (this.packs[0].dailyPack || this.packs[0].race)) {
      this.showOnlyTaglia = true;
    }
    
    if(this.packs.length>0 && this.packs[0].dailyPack) {
      this.dailyPack = true;
    } else if(this.packs.length>0 && this.packs[0].deck) {
      this.packs.sort((a, b) => a.baseCost - b.baseCost);
      this.dailyPack = false;
      this.isDeck = true;
    } else {
      this.dailyPack = false;
      this.isDeck = false;
    }
  }

  show(pack:any) {
    this.viewPrice = !this.viewPrice;
    this.selectPack = pack;
    if(this.selectPack && this.isDeck) {
      this.deckStateService.getStarterDeck(this.selectPack.deckId).then((resp) => {
        this.selectDeck = resp;
      });
    }
  }

  acquista(name:string, taglia:number, baseCost:number, type:number, monster:boolean, level:number, race:number,src:string,attribute:number) {
    if(this.dailyPack) {
      this.confirmBuyEmitter.emit({"name":name,"dailyPack":true, "src":src});
    } else {
      this.confirmBuyEmitter.emit({"name":name,"taglia":taglia,"baseCost":baseCost, "typePack":type, "monster":monster, "level":level, "race":race,"src":src,"attribute":attribute});
    }
  }

  acquistaDeck(name:string, baseCost:number, src:string, id:string) {
    this.confirmBuyEmitter.emit({"name":name,"deck":true, "baseCost":baseCost, "src":src, "deckId": id});
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
