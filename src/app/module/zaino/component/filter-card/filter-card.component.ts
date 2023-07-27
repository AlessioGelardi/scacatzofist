import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attributi } from '../../enum/attribute';
import { Razze } from '../../enum/races';
import { TipEff, TipFusEff, TipRitEff, TipSynchroEff, TipTunNorm, TipXYZEff, Tipologie, TipologieMagia, TipologieTrappola } from '../../enum/types';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { Categorie } from '../../enum/category';

@Component({
  selector: 'filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.css']
})
export class FilterCardComponent implements OnInit {

  @Output() cardsEmit: EventEmitter<any> = new EventEmitter();

  filterCardForm = new FormGroup({
    category: new FormControl('MOSTRO'),
    name: new FormControl('',[
      Validators.minLength(4)
    ]),
    attribute: new FormControl(''),
    type: new FormControl(''),
    race: new FormControl(''),
    level: new FormControl(0),
    atk: new FormControl(-50),
    def: new FormControl(-50),
    effect: new FormControl(true)
  });

  categories = Object.keys(Categorie).filter(key => isNaN(Number(key)));
  attributes = Object.keys(Attributi).filter(key => isNaN(Number(key)));
  races = Object.keys(Razze).filter(key => isNaN(Number(key)));
  types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));

  defaultTypes: any;

  constructor(private messageService: MessageService) {
    this.defaultMonster();
  }

  ngOnInit(): void {
  }

  changeCategory() {
    this.filterCardForm.patchValue({
      attribute: '',
      type: '',
      race: '',
      level: 0,
      atk: -50,
      def: -50,
      effect: true
    });
    if(this.filterCardForm.value.category) {
      const index = this.getEnumValue(Categorie, this.filterCardForm.value.category);
      switch(index) {
        case Categorie.MOSTRO:
          this.defaultMonster();
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

  search(resetPage:boolean) {
    if (this.filterCardForm.valid) {

      let searchFilter = {...this.filterCardForm.value }

      if(!this.filterCardForm.value.type || this.filterCardForm.value.type === "" ) {
        searchFilter.type = this.defaultTypes;
      } else {
        let typeSelected:any;
        if(this.filterCardForm.value.category==="MAGIA") {
          typeSelected = [this.getEnumValue(TipologieMagia, this.filterCardForm.value.type!)];
        } else if (this.filterCardForm.value.category==="TRAPPOLA") {
          typeSelected = [this.getEnumValue(TipologieTrappola, this.filterCardForm.value.type!)];
        } else {
          if(this.filterCardForm.value.effect) {

            const indexType = this.getEnumValue(Tipologie, this.filterCardForm.value.type);
            switch(indexType) {
              case Tipologie.NORMALE:
                typeSelected = Object.values(TipEff).filter((value) => typeof value === 'number').map(Number);
                break;
              case Tipologie.FUSIONE:
                typeSelected = Object.values(TipFusEff).filter((value) => typeof value === 'number').map(Number);
                break;
              case Tipologie.RITUALE:
                typeSelected = Object.values(TipRitEff).filter((value) => typeof value === 'number').map(Number);
                break;
              case Tipologie.SYNCHRO:
                typeSelected = Object.values(TipSynchroEff).filter((value) => typeof value === 'number').map(Number);
                break;
              case Tipologie.XYZ:
                typeSelected = Object.values(TipXYZEff).filter((value) => typeof value === 'number').map(Number);
                break;
              default:
                this.defaultMonster();
                break;
            }
            
          } else {
            typeSelected = [this.getEnumValue(Tipologie, this.filterCardForm.value.type!)];

            if(this.filterCardForm.value.type! === "FUSIONE") {
              typeSelected.push(TipTunNorm.FUSIONE)
            } else if (this.filterCardForm.value.type! === "NORMALE") {
              typeSelected.push(TipTunNorm.TUNER)
            }
          }
        }
        
        if(typeSelected) {
          searchFilter.type = typeSelected;
        }
      }

      if(this.filterCardForm.value.race) {
        const raceSelected:any = this.getEnumValue(Razze, this.filterCardForm.value.race!);
        searchFilter.race = raceSelected;
      }

      if(this.filterCardForm.value.attribute) {
        const attributeSelected:any = this.getEnumValue(Attributi, this.filterCardForm.value.attribute!);
        searchFilter.attribute = attributeSelected;
      }

      this.cardsEmit.emit({filter: searchFilter,resetPage:resetPage})
      
    } else {
      if(this.filterCardForm.controls['name'].errors) {
        if (this.filterCardForm.controls['name'].errors['minlength']) {
          this.messageService.alert('Attenzione!','Il nome minimo consentito è 4 lettere','info');
        }
      }
      
    }
  }

  private getEnumValue(enumObject: any, key: string): number | undefined {
    return enumObject[key];
  }

  private defaultMonster() {
    this.types = Object.keys(Tipologie).filter(key => isNaN(Number(key)));

    this.defaultTypes = [
      ...Object.values(Tipologie).filter((value) => typeof value === 'number').map(Number),
      ...Object.values(TipTunNorm).filter((value) => typeof value === 'number').map(Number),
      ...Object.values(TipEff).filter((value) => typeof value === 'number').map(Number),
      ...Object.values(TipFusEff).filter((value) => typeof value === 'number').map(Number),
      ...Object.values(TipRitEff).filter((value) => typeof value === 'number').map(Number),
      ...Object.values(TipSynchroEff).filter((value) => typeof value === 'number').map(Number),
      ...Object.values(TipXYZEff).filter((value) => typeof value === 'number').map(Number)
    ];
  }
}
