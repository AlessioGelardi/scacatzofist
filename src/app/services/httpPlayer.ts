import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Player } from '../interface/player';
import { Card, Deck } from '../interface/card';

@Injectable({
providedIn: 'root'
})

export class HttpPlayer {
    apiUrlPlayer: string = environment.baseUrlLogin + "player";
    apiUrlDecksById: string = environment.baseUrlLogin + "decksById"; //idplayer
    apiUrlDeckById: string = environment.baseUrlLogin + "deckById";
    apiUrlDeck: string = environment.baseUrlLogin + "deck";
    apiUrlSaveNameDeck: string= environment.baseUrlLogin + "savedeck";
    apiUrlZainoById: string = environment.baseUrlLogin + "zainoById";

    constructor(private http: HttpClient) {}

    getPlayer(id:string){
      return this.http.get<Player>(this.apiUrlPlayer+'?id='+id);
    }

    getDecksById(id:string) {
        return this.http.get<Deck>(this.apiUrlDecksById+'?id='+id);
    }

    getDeckById(id:string) {
        return this.http.get<Deck>(this.apiUrlDeckById+'?id='+id);
    }

    getZainoById(id:string) {
        return this.http.get<Card[]>(this.apiUrlZainoById+'?id='+id);
    }

    newDeck(deck:any) {
        return this.http.post<boolean>(this.apiUrlDeck,deck,this.generateOptions());
    }

    saveNameDeck(deck:any) {
        return this.http.put<boolean>(this.apiUrlSaveNameDeck,deck,this.generateOptions());
    }

    updateDeck(deck:Deck,id:string) {
        return this.http.put<boolean>(this.apiUrlDeck+'?id='+id,deck,this.generateOptions());
    }

    deleteDeck(idDeck?: string){
        return this.http.delete<boolean>(this.apiUrlDeck+'?id='+idDeck);
    }

    private generateOptions() {
        return {
          headers: new HttpHeaders({
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type':  'application/json'
          })
        };
      }
}
