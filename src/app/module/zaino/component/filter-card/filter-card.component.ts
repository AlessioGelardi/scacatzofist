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
    effect: new FormControl(true)
  });

  categories = Object.keys(Categorie).filter(key => isNaN(Number(key)));
  attributes = Object.keys(Attributi).filter(key => isNaN(Number(key)));
  races = Object.keys(Razze).filter(key => isNaN(Number(key)));
  types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));

  defaultTypes: any;

  cards: Card[] = [];
  viewSearchResult: boolean = false;

  page:number = 1;

  constructor(private messageService: MessageService, private databaseStateService: StateDatabaseService) {
    this.types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));
    this.defaultTypes = [17,33,545,1057,2081,4129,5153,2097185,2101281,4194337,8388641];
  }

  ngOnInit(): void {
    
  }

  doMoreFilter() {
    this.viewMoreFilter = !this.viewMoreFilter;
  }

  changeCategory() {
    if(this.filterCardForm.value.category) {
      const index = this.getEnumValue(Categorie, this.filterCardForm.value.category);
      switch(index) {
        case Categorie.MOSTRO:
          this.types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));
          this.defaultTypes = [1,33,545,1057,2081,4129,5153,2097185,2101281,4194337];
          break;
        case Categorie.MAGIA:
          this.types = Object.keys(TipologieMagia).filter(key => isNaN(Number(key)));
          this.defaultTypes = Object.values(TipologieMagia).filter((value) => typeof value === 'number').map(Number);
          break;
        case Categorie.TRAPPOLA:
          this.types = Object.keys(TipologieTrappola).filter(key => isNaN(Number(key)));
          this.defaultTypes = Object.values(TipologieTrappola).filter((value) => typeof value === 'number').map(Number);
          break;
        default:
          this.messageService.alert('Attenzione!','La categoria deve essere scelta','info');
          break;
      }
    } else {
      this.messageService.alert('Attenzione!','La categoria deve essere scelta','info');
    }
  }

  back() {
    this.page--;
    this.search(true);
  }

  continue() {
    this.page++;
    this.search(true);
  }

  search(resetPage:boolean) {
    if(resetPage) {
      this.page = 1;
    }

    if (this.filterCardForm.valid) {

      if(!this.filterCardForm.value.type || this.filterCardForm.value.type === "" ) {
        this.filterCardForm.value.type = this.defaultTypes;
      } else {
        let typeSelected:any;
        if(this.filterCardForm.value.category==="MAGIA") {
          typeSelected = [this.getEnumValue(TipologieMagia, this.filterCardForm.value.type!)];
        } else if (this.filterCardForm.value.category==="TRAPPOLA") {
          typeSelected = [this.getEnumValue(TipologieTrappola, this.filterCardForm.value.type!)];
        }
        
        if(typeSelected) {
          this.filterCardForm.value.type = typeSelected;
        }
      }

      this.databaseStateService.getCards(this.filterCardForm.value,this.page).then((resp) => {
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

  private getEnumValue(enumObject: any, key: string): number | undefined {
    return enumObject[key];
  }

}
