import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SellCard } from 'src/app/module/interface/card';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  apiUrlMarketPlace: string = environment.baseUrlMarket + "marketplace";
  marketplaceById: string = environment.baseUrlMarket + "marketplaceById";

  constructor(private http: HttpClient) { }

  getMarketplace(): Observable<SellCard[]> {
    return this.http.get<SellCard[]>(this.apiUrlMarketPlace);
  }

  getMarketPlaceById(playerId:string) { //To-DO verificare se si può fare un percorso unico tra getMarketPlace e getmarketplacebyid
    return this.http.get<SellCard[]>(this.marketplaceById+'?id='+playerId);
  }

  venditaCard(playerId:string, cardId:string, prezzo:number) {
    let vendita:any = {};
    vendita.playerId = playerId;
    vendita.cardId = cardId;
    vendita.prezzo = prezzo;

    vendita.today = this.takeFormatToday();
    return this.http.post<boolean>(this.apiUrlMarket,vendita,this.generateOptions());
}

  deleteSellCard(sellCardId:string, cardId: string, playerId:string) {
    return this.http.delete<SellCard[]>(this.apiUrlMarketPlace+'?id='+sellCardId+';'+cardId+';'+playerId);
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
