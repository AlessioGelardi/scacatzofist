import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.createWheel();
  }

  createWheel() {
    this.slices = [];
    for (let i = 1; i <= 10; i++) {
      const slice: Slice = {
        label: `Slice ${i}`,
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

  toggleRotation() {
    //this.animationState = this.animationState === 'notRotated' ? 'rotated' : 'notRotated';
    for (let i = 0; i <= 10; i++) {
      this.slices[i].numTransform+=290;
    }
  }

}
