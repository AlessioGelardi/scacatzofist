import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { FilterCardComponent } from '../filter-card/filter-card.component';
import { StateDatabaseService } from '../../services/state/state-database.service';

@Component({
  selector: 'app-yugiohdex',
  templateUrl: './yugiohdex.component.html',
  styleUrls: ['./yugiohdex.component.css']
})
export class YugiohdexComponent {

  @ViewChild(FilterCardComponent) filterCard: FilterCardComponent | undefined;
  
  player:Player | undefined;

  zaino: Card[]=[];

  cards: Card[] = [];
  viewSearchResult: boolean = false;

  page:number = 1;

  searchFilter: any | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private databaseStateService: StateDatabaseService,
    private playerStateService: StatePlayerService) {
  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')!;
    
    this.takePlayer(playerId);
  }

  retrieveCards(searchFilter: any) {
    if(searchFilter) {

      if(searchFilter.resetPage) {
        this.page = 1;
      }

      this.databaseStateService.getCards(searchFilter.filter, this.page).then((resp) => {
        if(resp) {
          this.cards=resp;
          this.viewSearchResult=true;
          this.searchFilter = searchFilter;
        }
      });
    }
  }

  home() {
    this.router.navigate(['/home',{id:this.player?._id!}]);
  }

  back() {
    this.page--;
    this.filterCard?.search(false);
  }

  continue() {
    this.page++;
    this.filterCard?.search(false);
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.takeZaino();
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getPlayer','error');
      }
    });
  }

  private takeZaino() {
    this.playerStateService.getZaino(this.player?._id!).then((resp) => {
      if(resp) {
        this.zaino = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */
  
        this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
      }
    });
  }
}