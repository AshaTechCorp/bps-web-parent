import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, catchError, interval, of, switchMap, takeWhile, timeout } from 'rxjs';

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
    {id: 4, role: "student", name: "Eleanor Pena", balance: 50, update: '13:54', coupon: 10},
    {id: 5, role: "student", name: "Jerome Bell", balance: 830, update: '13:54', coupon: 11},
    {id: 6, role: "business", name: "Cameron Williamson", balance: 1400, update: '13:54', coupon: 12},
    {id: 7, role: "academic", name: "Esther Howard", balance: 200, update: '13:54', coupon: 13},
    {id: 8, role: "academic", name: "Esther Howard", balance: 830, update: '13:54', coupon: 14},
    {id: 9, role: "business", name: "Cameron Williamson", balance: 50, update: '13:54', coupon: 12},
    //// เพิ่ม object เพิ่มเติมตามต้องการ
  ];

  constructor(private _httpClient: HttpClient) {}

  get_test_card() {
    return this._httpClient.get<any>(environment.baseurl + '/api/person/inquiry?card=2617800948')
    .pipe( (response: any) => {
        return (response);
      }
    );
  }

  check_status(id: number) {
    const checkInterval = 3000; // 3 วินาที
    const checkTimeout = 180000; // 3 นาที

    return interval(checkInterval).pipe(
      switchMap(() => this._httpClient.get<any>(environment.baseurl + '/api/transaction/qrpayment/' + id).pipe(
        catchError(error => {
          console.error('API call failed:', error);
          return of(null);
        })
      )),
      takeWhile(response => response === null || response.status !== 'complete', true),
      timeout(checkTimeout),
      catchError(error => {
        console.error('Polling timed out:', error);
        return of(null);
      })
    );
  }

  create_QR(data: any): Observable<any> {
    //const token = localStorage.getItem('accessToken');
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTU1OTQ1NzgsImV4cCI6MTcxNTY4MDk3OH0.oaOr0Babded4EyJDhzvKHP_lyzVqhXkYAZeTFSWKVe0"
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this._httpClient.post<any>(environment.baseurl + '/api/transaction/qrpayment/request', data, { headers: headers });
  }

  getAllCard() {
    return this.cards
  }

  setCardData(id: number) {
    localStorage.setItem('card-Data', id.toString());
    this.select_index = id
  }

  getSelectIndex(){
    return parseInt(localStorage.getItem('card-Data') ?? '0');
    // return 1;
  }

  getCardData() {
    const resp = localStorage.getItem('card-Data');
    if (resp === null) {
      console.log('error func getCardData()');
      return null;
    } else {
      const parsedResp = parseInt(resp);
      if (isNaN(parsedResp)) {
        console.log('error func getCardData()');
        return null;
      } else {
        return this.cards[parsedResp];
      }
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
