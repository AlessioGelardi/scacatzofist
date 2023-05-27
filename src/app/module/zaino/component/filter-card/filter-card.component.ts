import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attributi } from '../../enum/attribute';

@Component({
  selector: 'filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.css']
})
export class FilterCardComponent implements OnInit {

  filterCardForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    domanda: new FormControl('', Validators.required),
    risposta: new FormControl('', Validators.required)
  });

  questions = Object.keys(Attributi).filter(key => isNaN(Number(key)));

  constructor() {
  }

  ngOnInit(): void {
    
  }

  search() {
    alert('soooca')
    console.log(this.filterCardForm)
  }

}
