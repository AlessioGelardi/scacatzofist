import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom, map } from 'rxjs';
import { Card, Deck } from 'src/app/module/interface/card';
import { DeckService } from '../httpservices/deck.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Injectable({
  providedIn: 'root'
})
export class StateDeckService {

  private deck?: Deck;
  private playerDecks?: Deck[];
  private actualDeck?: string;

  constructor(private spinnerService: NgxSpinnerService,
    private deckService: DeckService,
    private messageService: MessageService) {

  }

  resetState() {
    this.resetDeck();
    this.resetPlayerDecks();
    this.resetActualDeck();
  }

  resetDeck() {
    this.deck=undefined;
  }

  resetPlayerDecks() {
    this.playerDecks=undefined;
  }

  resetActualDeck() {
    this.actualDeck=undefined;
  }

  async newDeck(deck:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.deckService.newDeck(deck));
      this.spinnerService.hide();
    } catch (error: any) {
      response = error;
      this.spinnerService.hide();
    }

    return response
  }

  async addDeck(deck:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.deckService.addDeck(deck));
      this.spinnerService.hide();
    } catch (error: any) {
      response = error;
      this.spinnerService.hide();
    }

    return response
  }

  async getDecks(playerId:string) {
    this.spinnerService.show();

    if(!this.playerDecks) {
      try {
        const response = await firstValueFrom(this.deckService.getDecksById(playerId));
        this.playerDecks = response;
        this.spinnerService.hide();
      } catch (error: any) {
        this.spinnerService.hide();
        if(error.status===402) {
          this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente non hai nessun deck','error');
        } else {
          this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del deck','error');
        }
        return this.playerDecks;
      }
    } else {
      this.spinnerService.hide();
    }

    return this.playerDecks;
  }

  async getDeck(id:string) {
    this.spinnerService.show();

    if (!this.deck || id != this.actualDeck) {
      this.actualDeck = id;
      try {
        const response = await firstValueFrom(this.deckService.getDeckById(id));
        this.deck = response;
        this.spinnerService.hide();
      } catch (error: any) {
        this.spinnerService.hide();
        if(error.status===402) {
          this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        } else {
          this.messageService.alert('Attenzione!','Errore durante la chiamata getDeckById','error');
        }
      }

    } else {
      this.spinnerService.hide();
    }

    return this.deck;
  }

  async saveName(oldDeckName:string,newDeckName:string) {
    this.spinnerService.show();
    let response;

    if(this.playerDecks) {
      let deck = this.playerDecks.find(i => i.name === oldDeckName);
      if(deck) {
        try {
          deck.name = newDeckName;
          response = await firstValueFrom(this.deckService.saveNameDeck(deck));
          this.spinnerService.hide();
        } catch (error: any) {
          /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
          response = error;
          this.spinnerService.hide();
        }  
      }
    }


    return response;
  }

  async deleteDeck(id:string) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.deckService.deleteDeck(id));
      this.spinnerService.hide();
    } catch (error: any) {
      response = error;
      this.spinnerService.hide();
    }

    return response
  }

  async updateDeck(deck:Deck, id:string) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.deckService.updateDeck(deck,id));
      this.spinnerService.hide();
    } catch (error: any) {
      response = error;
      this.spinnerService.hide();
    }

    return response;
  }
}
