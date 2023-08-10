import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Deck } from '../../../interface/card';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  apiUrlDecksById: string = environment.baseUrlDeck + "decksById"; //idplayer
  apiUrlDeckById: string = environment.baseUrlDeck + "deckById";
  apiUrlDeck: string = environment.baseUrlDeck + "deck";
  apiUrlAddDeck: string = environment.baseUrlDeck + "addDeck";
  apiUrlSaveNameDeck: string= environment.baseUrlDeck + "savedeck";
  apiUrlAlignDecks: string = environment.baseUrlDeck + "alignDecks";

  constructor(private http: HttpClient) { }

  getDecksById(id:string): Observable<Deck[]> {
    return this.http.get<Deck[]>(this.apiUrlDecksById+'?id='+id);
  }

  getDeckById(id:string): Observable<Deck> {
    return this.http.get<Deck>(this.apiUrlDeckById+'?id='+id);
  }

  addDeck(deck:any): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrlAddDeck,deck,this.generateOptions());
  }

  newDeck(deck:any): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrlDeck,deck,this.generateOptions());
  }

  saveNameDeck(deck:any): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrlSaveNameDeck,deck,this.generateOptions());
  }

  updateDeck(deck:Deck,id:string): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrlDeck+'?id='+id,deck,this.generateOptions());
  }

  deleteDeck(idDeck?: string): Observable<boolean>{
    return this.http.delete<boolean>(this.apiUrlDeck+'?id='+idDeck);
  }

  alignDecks(id:string) {
    return this.http.get<boolean>(this.apiUrlAlignDecks+'?id='+id);
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
