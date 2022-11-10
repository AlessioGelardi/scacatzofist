import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Player } from '../interface/player';
import { Card, Deck, Pack, SellCard } from '../interface/card';

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

    apiUrlMarket: string = environment.baseUrlLogin + "marketplace";
    marketplaceById: string = environment.baseUrlLogin + "marketplaceById";

    apiUrlEdicola: string = environment.baseUrlLogin + "edicola";

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

    venditaCard(playerId:string, cardId:string, prezzo:number) {
        let vendita:any = {};
        vendita.playerId = playerId;
        vendita.cardId = cardId;
        vendita.prezzo = prezzo;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        vendita.today = dd + '/' + mm + '/' + yyyy
        return this.http.post<boolean>(this.apiUrlMarket,vendita,this.generateOptions());
    }

    getMarketplace() {
        return this.http.get<SellCard[]>(this.apiUrlMarket);
    }

    getMarketPlaceById(playerId:string) {
        return this.http.get<SellCard[]>(this.marketplaceById+'?id='+playerId);
    }

    deleteSellCard(sellCardId:string, cardId: string, playerId:string) {
        return this.http.delete<SellCard[]>(this.apiUrlMarket+'?id='+sellCardId+';'+cardId+';'+playerId);
    }

    acquistaCard(sellCard:SellCard, playerIdAcquista:string) {
        let acquisto:any = {};
        acquisto.card = {}
        acquisto.card.playerId = sellCard.playerId;
        acquisto.card.cardId = sellCard.card.id;
        acquisto.card.prezzo = sellCard.prezzo;
        acquisto.card.venduto = true;
        acquisto.playerIdAcquista = playerIdAcquista;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        acquisto.dataUpdate = dd + '/' + mm + '/' + yyyy

        return this.http.put<boolean>(this.apiUrlMarket+'?id='+sellCard.id,acquisto,this.generateOptions());
    }

    acquistaPacchetti(playerId:string, typePack:number,taglia:number, quantity:number, prezzo:number) {
        let pack:any = {};
        pack.type = typePack;
        pack.taglia = taglia;
        pack.quantity = quantity;
        pack.prezzo = prezzo;
        pack.playerId = playerId;
        return this.http.put<Pack[]>(this.apiUrlEdicola,pack,this.generateOptions());
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
