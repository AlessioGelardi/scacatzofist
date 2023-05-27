import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attributi } from '../../enum/attribute';
import { Razze } from '../../enum/races';
import { Tipologie } from '../../enum/types';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.css']
})
export class FilterCardComponent implements OnInit {

  viewMoreFilter: boolean = false;

  filterCardForm = new FormGroup({
    name: new FormControl('',[
      Validators.minLength(5)
    ]),
    attribute: new FormControl(''),
    type: new FormControl(''),
    race: new FormControl(''),
    level: new FormControl(0),
    atk: new FormControl(0),
    def: new FormControl(0),
  });

  attributes = Object.keys(Attributi).filter(key => isNaN(Number(key)));
  races = Object.keys(Razze).filter(key => isNaN(Number(key)));
  types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    
  }

  doMoreFilter() {
    this.viewMoreFilter = !this.viewMoreFilter;
  }

  search() {
    console.log(this.filterCardForm);
    if (this.filterCardForm.valid) {
    } else {
      if(this.filterCardForm.controls['name'].errors) {
        if (this.filterCardForm.controls['name'].errors['minlength']) {
          this.messageService.alert('Attenzione!','Il nome minimo consentito è 5 lettere','info');
        }
      }
      
    }
  }

}
