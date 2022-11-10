import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'marketplace-viewpack',
  templateUrl: './viewpack.component.html',
  styleUrls: ['./viewpack.component.css']
})
export class MarketPlaceViewpackComponent implements OnInit {

  @Input() packs:any[] = [];

  @Output() buttonOperation: EventEmitter<number> = new EventEmitter();

  viewPrice: boolean = false;
  namePack:string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  show(pack:any) {
    this.viewPrice = !this.viewPrice;
    this.namePack = pack.name;
  }

  acquista(taglia:number) {
    this.buttonOperation.emit(taglia);
  }

}
