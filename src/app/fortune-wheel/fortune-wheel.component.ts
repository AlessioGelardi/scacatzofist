import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Slice {
  label: string;
  color: string;
  numTransform: number;
}

@Component({
  selector: 'app-fortune-wheel',
  templateUrl: './fortune-wheel.component.html',
  styleUrls: ['./fortune-wheel.component.css']
})
export class FortuneWheelComponent implements OnInit {

  @Input() slices: Slice[] = [];

  arrow:number;

  viewStarter: boolean = false;
  nameDeck:string | undefined;

  constructor(private router: Router) {
    this.arrow=324;
  }

  ngOnInit(): void {
    this.createWheel();
    
  }

  createWheel() {
    this.slices = [];
    const deck=['acqua','amazzone','drago','EroeElementale','fuoco','goblin','guerriero','IngranaggioAntico','jinzo','luce'];
    for (let i = 0; i < 10; i++) {
      const slice: Slice = {
        label: deck[i],
        color: this.getRandomColor(),
        numTransform: i * (360 / 10)
      };
      this.slices.push(slice);
    }
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  doRotation() {
    const numRand = Math.floor(Math.random()*10);

    for (let i = 0; i < 10; i++) {
      this.slices[i].numTransform+=1440+this.orcaNumero(numRand);
    }

    setTimeout(() => {
      this.viewStarter=true;
      this.nameDeck=this.slices[numRand+1].label.toUpperCase();
    }, 2000);
    
  }

  orcaNumero(numRand:number) {
    let addCa = 0;
    const obj = [2,3,4,5,6,7,8,9,0,1];
    if(obj[numRand]!=0) {
      addCa = -(36*obj[numRand])
    }

    return addCa;
  }

  login() {
    this.router.navigate(['/login']);
  }

}
