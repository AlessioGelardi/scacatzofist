import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attributi } from '../../enum/attribute';
import { Razze } from '../../enum/races';
import { Tipologie, TipologieMagia, TipologieTrappola } from '../../enum/types';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { Categorie } from '../../enum/category';
import { StateDatabaseService } from '../../services/state/state-database.service';
import { Card } from 'src/app/module/interface/card';

@Component({
  selector: 'filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.css']
})
export class FilterCardComponent implements OnInit {

  viewMoreFilter: boolean = false;

  filterCardForm = new FormGroup({
    category: new FormControl('MOSTRO'),
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

  categories = Object.keys(Categorie).filter(key => isNaN(Number(key)));
  attributes = Object.keys(Attributi).filter(key => isNaN(Number(key)));
  races = Object.keys(Razze).filter(key => isNaN(Number(key)));
  types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));

  cards: Card[] = [];
  viewSearchResult: boolean = false;

  constructor(private messageService: MessageService, private databaseStateService: StateDatabaseService) { }

  ngOnInit(): void {
    
  }

  doMoreFilter() {
    this.viewMoreFilter = !this.viewMoreFilter;
  }

  getEnumValue(enumObject: any, key: string): number | undefined {
    return enumObject[key];
  }

  changeCategory() {
    if(this.filterCardForm.value.category) {
      const index = this.getEnumValue(Categorie, this.filterCardForm.value.category);
      switch(index) {
        case Categorie.MOSTRO:

          break;
        case Categorie.MAGIA:
          this.types = Object.keys(TipologieMagia).filter(key => isNaN(Number(key)));
          break;
        case Categorie.TRAPPOLA:
          this.types = Object.keys(TipologieTrappola).filter(key => isNaN(Number(key)));
          break;
        default:
          this.messageService.alert('Attenzione!','La categoria deve essere scelta','info');
          break;
      }
    } else {
      this.messageService.alert('Attenzione!','La categoria deve essere scelta','info');
    }
  }

  search() {
    
    if (this.filterCardForm.valid) {

      this.databaseStateService.getCards(this.filterCardForm.value).then((resp) => {
        if(resp) {
          this.viewSearchResult = true; 
          this.cards=resp;
        }
      });
      
    } else {
      if(this.filterCardForm.controls['name'].errors) {
        if (this.filterCardForm.controls['name'].errors['minlength']) {
          this.messageService.alert('Attenzione!','Il nome minimo consentito è 5 lettere','info');
        }
      }
      
    }
  }

}
