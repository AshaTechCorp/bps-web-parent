import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, interval, of, switchMap, takeWhile, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopUpService {
  private topUp: number = 0
  private select_index = 0
  private cards: {id: number, role: string, name: string, balance: number, update: string, coupon: Number}[]= [
    {id: 1, role: "student", name: "Jenny Wilson", balance: 1400, update: '13:54', coupon: 7},
    {id: 2, role: "student", name: "Bessie Cooper", balance: 200, update: '13:54', coupon: 8},
    {id: 3, role: "student", name: "Jerome Bell", balance: 830, update: '13:54', coupon: 99},
    {id: 4, role: "staff", name: "Eleanor Pena", balance: 50, update: '13:54', coupon: 10},
    {id: 5, role: "parent", name: "Jerome Bell", balance: 830, update: '13:54', coupon: 11},
    {id: 6, role: "temporary", name: "Cameron Williamson", balance: 1400, update: '13:54', coupon: 12},
    {id: 7, role: "contracted", name: "Esther Howard", balance: 200, update: '13:54', coupon: 13},
    //// เพิ่ม object เพิ่มเติมตามต้องการ
  ];

  constructor(private _httpClient: HttpClient) {}

  get_bg_card(role: string): string{
    if (role == "Student" || role == "STD"){
        //if (index % 2 == 1)
        //    return "assets/images/logo/card/bg_CardStudentGray.svg"
        //else
        return "assets/images/logo/card/bg_CardStudentRed.svg"
    }
    else if (role == "STF" || role == "Staff" || role == "Business")
        return "assets/images/logo/card/bg_CardStaff.svg"
    else if (role == "PRT" || role == "Parent")
        return "assets/images/logo/card/bg_CardParent.svg"
    else if (role == "TMP" || role == "Temporary")
        return "assets/images/logo/card/bg_CardTemporary.svg"
    else if (role == "CTR" || role == "Contract")
        return "assets/images/logo/card/bg_CardContracted.svg"
    else
        return "assets/images/logo/card/bg_CardEmpty.svg"
}

  get_family_card() {
    let family_email = localStorage.getItem('family');
    //let family_email = 'phia@patana.ac.th';
    return this._httpClient.get<any>(environment.baseurl + '/api/card/inqury-family',{params:{
      email: family_email ?? ""
    }})
    .pipe( (response: any) => {
        return (response);
      }
    );
  }

  getProfile() {
    return this._httpClient.get<any>('https://graph.microsoft.com/v1.0/me')
      .pipe( (response: any) => {
        return (response);
      }
    )
  }

  get_card_by_fk(fk: any) {
    return this._httpClient.get<any>(environment.baseurl + '/api/person/inquiry-web',{params:{
      //card: sn
      fk: fk
    }})
    .pipe( (response: any) => {
        return (response);
      }
    );
  }

  get_test_card() {
    return this._httpClient.get<any>(environment.baseurl + '/api/person/inquiry?card=2617800948')
    .pipe( (response: any) => {
        return (response);
      }
    );
  }

  check_status(id: number) {
    const checkInterval = 3000; // 3 วินาที
    const checkTimeout = 600000; // 10 นาที

    //const token = localStorage.getItem('accessToken');
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTYyOTM3MzcsImV4cCI6MTcxNjM4MDEzN30.052VPoFGCA-TnFPul7hEwscTnfRtPNwr-D2i9RKltFY"
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return interval(checkInterval).pipe(
      switchMap(() => this._httpClient.get<any>(environment.baseurl + '/api/top-up/qrpayment/' + id).pipe(//, { headers: headers }
        catchError(error => {
          console.error('API call failed:', error);
          return of(null);
        })
      )),
      takeWhile(response => response === null || response.status !== 'SUCCESS', true),
      timeout(checkTimeout),
      catchError(error => {
        console.error('Polling timed out:', error);
        return of(null);
      })
    );
  }

  create_QR(data: any): Observable<any> {
    //const token = localStorage.getItem('accessToken');
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTYyOTM3MzcsImV4cCI6MTcxNjM4MDEzN30.052VPoFGCA-TnFPul7hEwscTnfRtPNwr-D2i9RKltFY"
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this._httpClient.post<any>(environment.baseurl + '/api/top-up/qrpayment/request-web', data);// ,{ headers: headers }
  }

  check_status_credit(ref: string) {
    const checkInterval = 3000; // 3 วินาที
    const checkTimeout = 9000; // 9 วินาที

    //const token = localStorage.getItem('accessToken');
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTYyOTM3MzcsImV4cCI6MTcxNjM4MDEzN30.052VPoFGCA-TnFPul7hEwscTnfRtPNwr-D2i9RKltFY"
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return interval(checkInterval).pipe(
      switchMap(() => this._httpClient.get<any>(environment.baseurl + '/api/top-up/card/inquery' , {params: { referenceOrder: ref }}
      ).pipe(//, { headers: headers }
        catchError(error => {
          console.error('API call failed:', error);
          return of(null);
        })
      )),
      takeWhile(response => response === null || (response.status !== 'SUCCESS' && response.status !== 'CREATE'), true),
      timeout(checkTimeout),
      catchError(error => {
        console.error('Polling timed out:', error);
        return of(null);
      })
    );
  }

  getAllCard() {
    return this.cards
  }

  setCardData(id: number) {
    this.select_index = id
  }

  setCardFromData(index: number, data: any) {
    sessionStorage.setItem('card-Data', JSON.stringify(data));
    this.select_index = index
  }

  getSelectIndex(){
    return (this.select_index ?? 0);
    // return 1;
  }

  getCardData() {
    const resp = sessionStorage.getItem('card-Data');
    if (resp === null) {
      console.log('error func getCardData()');
      this.setCardFromData(0,this.cards[0])
      return this.cards[0];
    } else {
      //const parsedResp = parseInt(resp);
      const parsedResp = JSON.parse(resp);
        //return this.cards[parsedResp];
        return parsedResp;
      }
  }

  setUpdateCard(data: any){
	  this.cards[this.select_index].update = data
  }

  getUpdateCard() {
    return this.cards[this.select_index].update;
  }

  setbalanceCard(data: any){
	this.cards[this.select_index].balance = data
  }

  getbalanceCard() {
    return this.cards[this.select_index].balance;
  }

  setTopUp(data: number){
    this.topUp = data;
  }

  getTopUp(){
    return this.topUp
  }
}
