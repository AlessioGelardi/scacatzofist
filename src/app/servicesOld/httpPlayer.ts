import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Player } from '../module/interface/player';
import { Card, Deck, Pack, SellCard } from '../module/interface/card';
import { Reqs } from '../module/interface/reqs';

@Injectable({
providedIn: 'root'
})

export class HttpPlayer {
    //apiUrlPlayer: string = environment.baseUrlLogin + "player";
    //apiUrlPlayers: string = environment.baseUrlLogin + "players";
    apiUrlDecksById: string = environment.baseUrlLogin + "decksById"; //idplayer
    apiUrlDeckById: string = environment.baseUrlLogin + "deckById";
    apiUrlDeck: string = environment.baseUrlLogin + "deck";
    apiUrlSaveNameDeck: string= environment.baseUrlLogin + "savedeck";
    apiUrlZainoById: string = environment.baseUrlLogin + "zainoById";

    apiUrlMarket: string = environment.baseUrlLogin + "marketplace";
    marketplaceById: string = environment.baseUrlLogin + "marketplaceById";

    apiUrlEdicola: string = environment.baseUrlLogin + "edicola";


    apiUrlPlaynow: string = environment.baseUrlLogin + "playnow";

    apiUrlNotify:string = environment.baseUrlLogin + "notify";

    constructor(private http: HttpClient) {}

    /* getPlayers(id:string){ //escludo id
        return this.http.get<Player[]>(this.apiUrlPlayers+'?id='+id);
    } */

    /* getPlayer(id:string){
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
    } */

    venditaCard(playerId:string, cardId:string, prezzo:number) {
        let vendita:any = {};
        vendita.playerId = playerId;
        vendita.cardId = cardId;
        vendita.prezzo = prezzo;

        vendita.today = this.takeFormatToday();
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

        acquisto.dataUpdate = this.takeFormatToday();

        return this.http.put<boolean>(this.apiUrlMarket+'?id='+sellCard.id,acquisto,this.generateOptions());
    }

    acquistaPacchetti(playerId:string, level:number, typePack:number,taglia:number, quantity:number, prezzo:number, monster:boolean) {
        let pack:any = {};
        pack.type = typePack;
        pack.level = level;
        pack.taglia = taglia;
        pack.quantity = quantity;
        pack.prezzo = prezzo;
        pack.playerId = playerId;
        pack.monster = monster;
        return this.http.put<Pack[]>(this.apiUrlEdicola,pack,this.generateOptions());
    }

    //Playnow
    newRequest(request:any) {
        request.dataIns = this.takeFormatToday();
        return this.http.post<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
    }

    updateRequest(request:any) {
        request.dataUpdate = this.takeFormatToday();
        return this.http.put<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
    }

    getReqs(id:string, typeMod?:number) {
        let req:any = {};
        req.id = id;
         if(typeMod) {
            req.typeMod = typeMod!;
        }
        return this.http.get<any>(this.apiUrlPlaynow,{params:req});
    }

    getNumberNotify(id:string){
        return this.http.get<number>(this.apiUrlNotify+'?id='+id);
    }

    private takeFormatToday() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return dd + '/' + mm + '/' + yyyy
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
