import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reqs } from 'src/app/module/interface/reqs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  apiUrlPlaynow: string = environment.baseUrlNotifier + "playnow";

  apiUrlNotify:string = environment.baseUrlNotifier + "notify";

  apiUrlDuelRec:string = environment.baseUrlNotifier + "duelrec";

  constructor(private http: HttpClient) { }

  newRequest(request:any):Observable<boolean> {
    request.dataUpdate = this.takeFormatToday(false);
    return this.http.post<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
  }

  updateRequest(request:any) {
    request.dataUpdate = this.takeFormatToday(false);
    return this.http.put<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
  }

  getReqs(id:string, myReqs:boolean = false, history:boolean = false, typeMod?:number):Observable<any> {
    let req:any = {};
    req.id = id;
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

  createDuelRec(request:any):Observable<any> {
    request.dataUpdate = this.takeFormatToday(true);
    return this.http.post<boolean>(this.apiUrlDuelRec,request,this.generateOptions());
  }

  getDuelRec(id:string):Observable<any> {
    return this.http.get<any>(this.apiUrlDuelRec+'?id='+id);
  }

  updateDuelRec(request:any):Observable<any> {
    request.dataUpdate = this.takeFormatToday(false);
    return this.http.put<boolean>(this.apiUrlDuelRec,request,this.generateOptions());
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
