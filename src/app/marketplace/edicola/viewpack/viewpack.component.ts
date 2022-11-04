import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'marketplace-viewpack',
  templateUrl: './viewpack.component.html',
  styleUrls: ['./viewpack.component.css']
})
export class MarketPlaceViewpackComponent implements OnInit {

  @Input() namePack:string | undefined;

  @Output() buttonOperation: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  acquista(taglia:number) {
    this.buttonOperation.emit(taglia);
  }

}
