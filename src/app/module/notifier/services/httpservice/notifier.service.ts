import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reqs } from 'src/app/module/interface/reqs';
import { Tournament } from 'src/app/module/interface/tournament';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  apiUrlPlaynow: string = environment.baseUrlNotifier + "playnow";

  apiUrlNotify:string = environment.baseUrlNotifier + "notify";

  apiUrlDuelRec:string = environment.baseUrlNotifier + "duelrec";
  apiUrlTrainingRec:string = environment.baseUrlNotifier + "training";

  apiUrlTournament:string = environment.baseUrlNotifier + "tournament";
  apiUrlTournamentById:string = environment.baseUrlNotifier + "tournamentById";

  constructor(private http: HttpClient) { }

  newRequest(request:any):Observable<string> {
    request.dataUpdate = this.takeFormatToday(false);
    return this.http.post<string>(this.apiUrlPlaynow,request,this.generateOptions());
  }

  updateRequest(request:any) {
    request.dataUpdate = this.takeFormatToday(false);
    return this.http.put<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
  }

  getReqs(id:string, page:number, limit:number, myReqs:boolean = false, history:boolean = false, typeMod?:number):Observable<any> {
    let req:any = {};
    req.id = id;
    req.page = page;
    req.limit = limit;
    req.myReqs = myReqs;
    req.history = history;
    if(typeMod) {
      req.typeMod = typeMod!;
    }
    return this.http.get<Reqs[]>(this.apiUrlPlaynow,{params:req});
  }
  
  getNumberNotify(id:string):Observable<number>{
    return this.http.get<number>(this.apiUrlNotify+'?id='+id);
  }

  createTraining(request:any):Observable<boolean> {
    return this.http.post<boolean>(this.apiUrlTrainingRec,request,this.generateOptions());
  }

  stopTraining():Observable<boolean> {
    return this.http.put<boolean>(this.apiUrlTrainingRec,{},this.generateOptions());
  }

  createDuelRec(request:any):Observable<any> {
    request.dataIns = this.takeFormatToday(true);
    return this.http.post<boolean>(this.apiUrlDuelRec,request,this.generateOptions());
  }

  getDuelRec(id:string):Observable<any> {
    return this.http.get<any>(this.apiUrlDuelRec+'?id='+id);
  }

  updateDuelRec(request:any):Observable<any> {
    request.dataUpdate = this.takeFormatToday(false);
    return this.http.put<boolean>(this.apiUrlDuelRec,request,this.generateOptions());
  }

  getTournaments():Observable<any> {
    return this.http.get<boolean>(this.apiUrlTournament);
  }

  getTournamentById(id:string):Observable<any> {
    return this.http.get<Tournament>(this.apiUrlTournamentById+'?id='+id);
  }

  updateTournaments(request:any):Observable<any> {
    if(request.status===2) {
      request.dataIns = this.takeFormatToday(true);
    }
    return this.http.put<boolean>(this.apiUrlTournament,request,this.generateOptions());
  }

  abbandonaTournament(request:any):Observable<any> {
    return this.http.post<boolean>(this.apiUrlTournamentById,request,this.generateOptions());
  }

  private takeFormatToday(time:boolean) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var formatDate = dd + '/' + mm + '/' + yyyy;

    return time ? formatDate+'-'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds() : formatDate;
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
