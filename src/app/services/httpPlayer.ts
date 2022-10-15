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
    apiUrlDeckById: string = environment.baseUrlLogin + "deckById";
    apiUrlZainoById: string = environment.baseUrlLogin + "zainoById";

    constructor(private http: HttpClient) {}

    getPlayer(id:string){
      return this.http.get<Player>(this.apiUrlPlayer+'?id='+id);
    }

    getDeckById(id:string) {
        return this.http.get<Deck>(this.apiUrlDeckById+'?id='+id);
    }

    getZainoById(id:string) {
        return this.http.get<Card[]>(this.apiUrlZainoById+'?id='+id);
    }
}
