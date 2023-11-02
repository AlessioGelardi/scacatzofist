import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pack, SellCard, SellPack } from 'src/app/module/interface/card';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  apiUrlMarketPlace: string = environment.baseUrlMarket + "marketplace";
  apiUrlMarketPack: string = environment.baseUrlMarket + "marketpack";
  apiUrlMarketEdicola: string =  environment.baseUrlMarket + "edicola";
  apiUrlMarketCoins: string =  environment.baseUrlMarket + "coins";
  apiUrlMarketOpenPack: string =  environment.baseUrlMarket + "openpack";
  marketplaceById: string = environment.baseUrlMarket + "marketplaceById";
  apiUrlMarketDailyShop: string =  environment.baseUrlMarket + "dailyshop";
  apiUrlMarketPacks: string = environment.baseUrlMarket + "packs";
  apiUrlMarketSkin: string = environment.baseUrlMarket + "skin";
  apiUrlMarketTexture: string = environment.baseUrlMarket + "texture";

  constructor(private http: HttpClient) { }

  getMarketplace(): Observable<SellCard[]> {
    return this.http.get<SellCard[]>(this.apiUrlMarketPlace);
  }

  getMarketpack(): Observable<SellPack[]> {
    return this.http.get<SellPack[]>(this.apiUrlMarketPack);
  }

  getPacks(typePack:number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMarketPacks+'?case='+typePack);
  }

  getDailyShop(request:any): Observable<SellCard[]> {
    request.dataUpdate = this.takeFormatToday();
    return this.http.put<SellCard[]>(this.apiUrlMarketDailyShop,request,this.generateOptions());
  }

  getMarketPlaceById(playerId:string) { //To-DO verificare se si può fare un percorso unico tra getMarketPlace e getmarketplacebyid
    return this.http.get<SellCard[]>(this.marketplaceById+'?id='+playerId);
  }

  venditaCard(request:any) {
    request.today = this.takeFormatToday();
    return this.http.post<boolean>(this.apiUrlMarketPlace,request,this.generateOptions());
  }

  deleteSellCard(sellCardId:string, cardId: string, playerId:string): Observable<SellCard[]> {
    return this.http.delete<SellCard[]>(this.apiUrlMarketPlace+'?id='+sellCardId+';'+cardId+';'+playerId);
  }

  deleteSellPack(sellCardId:string): Observable<SellCard[]> {
    return this.http.delete<SellCard[]>(this.apiUrlMarketPack+'?id='+sellCardId);
  }

  acquistaCard(sellCard:SellCard, playerIdAcquista:string): Observable<boolean> {
    let acquisto:any = {};
    acquisto.card = {}
    acquisto.card.playerId = sellCard.playerId;
    acquisto.card.cardId = sellCard.card.id;
    acquisto.card.prezzo = sellCard.prezzo;
    acquisto.card.venduto = true;
    acquisto.playerIdAcquista = playerIdAcquista;

    acquisto.dataUpdate = this.takeFormatToday();

    return this.http.put<boolean>(this.apiUrlMarketPlace+'?id='+sellCard.id,acquisto,this.generateOptions());
  }

  acquistaCardDailyShop(request:any): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrlMarketDailyShop,request,this.generateOptions());
  }

  acquistaPacchetti(request:any): Observable<Pack[]> {
    request.dataUpdate = this.takeFormatToday();
    return this.http.put<Pack[]>(this.apiUrlMarketEdicola,request,this.generateOptions());
  }

  acquistaCoins(request:any): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrlMarketCoins,request,this.generateOptions());
  }

  apriPack(request:any) {
    request.dataUpdate = this.takeFormatToday();
    return this.http.put<boolean>(this.apiUrlMarketOpenPack,request,this.generateOptions());
  }

  venditaPack(request:any) {
    request.today = this.takeFormatToday();
    return this.http.post<boolean>(this.apiUrlMarketPlace,request,this.generateOptions());
  }

  acquistoPack(request:any) {
    request.dataUpdate = this.takeFormatToday();
    return this.http.put<boolean>(this.apiUrlMarketPack,request,this.generateOptions());
  }

  getSkins(type:number) {
    return this.http.get<any[]>(this.apiUrlMarketSkin+'?case='+type);
  }

  getSelectedTexture(playerId:string) {
    return this.http.get<any[]>(this.apiUrlMarketTexture+'?id='+playerId);
  }

  acquistaTexture(request:any) {
    request.dataUpdate = this.takeFormatToday();
    return this.http.post<boolean>(this.apiUrlMarketTexture,request,this.generateOptions());
  }

  selezionaTexture(request:any) {
    request.dataUpdate = this.takeFormatToday();
    return this.http.put<boolean>(this.apiUrlMarketTexture,request,this.generateOptions());
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
