import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'marketplace-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class MarketplaceButtonComponent implements OnInit {

  @Input() viewCard: boolean = false;
  @Input() viewEdicola: boolean = false;
  @Input() viewPack: boolean = false;
  @Input() viewHistory: boolean = false;
  @Input() finishPurchase:boolean = false;

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  back() {
    if(this.viewHistory && this.viewCard) {
      this.buttonOperation.emit({"viewCard":true,"viewHistory":false});
    }
    else if(this.viewCard) {
      this.buttonOperation.emit({"viewCard":false});
    } else if (this.viewPack && this.finishPurchase) {
      this.buttonOperation.emit({"viewCard":false,"viewEdicola":true, "viewPack":false, "finishPurchase": false});
    } else if (this.viewPack) {
      this.buttonOperation.emit({"viewCard":false,"viewEdicola":true, "viewPack":false});
    } else if (this.viewEdicola) {
      this.buttonOperation.emit({"viewCard":false,"viewEdicola":false});
    } else {
      this.buttonOperation.emit({"backToHome":true});
    }
  }

  newVendita() {
    this.buttonOperation.emit({"viewCard":true});
  }

  history() {
    this.buttonOperation.emit({"viewCard":true,"viewHistory":true})
  }

  edicola() {
    this.buttonOperation.emit({"viewCard":false,"viewEdicola":true});
  }

  homeMarket() {
    this.buttonOperation.emit({"homeMarket":true});
  }
}
