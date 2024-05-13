import { Injectable } from '@angular/core';

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
    // เพิ่ม object เพิ่มเติมตามต้องการ
  ];

  constructor() {}

  getAllCard() {
    return this.cards
  }

  setCardData(id: number) {
    localStorage.setItem('card-Data', id.toString());
    this.select_index = id
  }

  getSelectIndex(){
    // return parseInt(localStorage.getItem('card-Data')) ?? 1;
    return 1;
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
