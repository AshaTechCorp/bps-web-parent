import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
	private total: {type:string,balance: number}[]= [{ type: "Top-up", balance: 1850 },
													 { type: "spending", balance: 550 }, ];
	private history: {date: string, data: {type:string,balance: number, time: string, list:{payment:string, order:string,amount:number,total:number}[]}[]}[]
	  = [{	date: "23 March 2024",
			data: [
				{ type: "Top-Up", balance: 100, time: '20:12', list: [] },
				{ type: "Paid", balance: -10, time: '11:23',
					list: [{ payment:'Card', order:'Milk', amount:1, total:10 }, ]
				},
				{ type: "Paid", balance: -20, time: '11:15',
					list: [{ payment:'Card',  order:'Water', amount:2, total:20 }, ]
				}
			]
		},
		{ 	date: "24 March 2024",
			data: [
				{ type: "Paid", balance: -50, time: '16:45',
					list: [{ payment:'Card', order:'Cookie', amount:5, total:50 }, ]
				},
				{ type: "Paid", balance: -10, time: '11:23',
					list: [{ payment:'Card', order:'Water', amount:1, total:10 }, ]
				},
				{ type: "Paid", balance: -20, time: '11:15',
					list: [{ payment:'Card', order:'Coca Cola', amount:1, total:20 }, ]
				}
			]
		},
		{ 	date: "25 March 2024",
			data: [
				{ type: "Paid", balance: -180, time: '18:32',
					list: [	{ payment:'Card', order:'Pizza', amount:1, total:120 },
							{ payment:'Card', order:'Mac and cheese', amount:1, total:60 } ]
				},
				{ type: "Top-Up", balance: 1500, time: '10:12', list: [] },
				{ type: "Top-Up", balance: 500, time: '08:12', list: [] }
			]
		}
	  ];
    private transactions: {type:string,balance: number, date: string ,time: string}[] = [
		{ type: "Paid", balance: -50, date: '28 Mar 2024', time: '16:45'},
		{ type: "Paid", balance: -60, date: '28 Mar 2024', time: '10:54'},
		{ type: "Top-Up", balance: 1500, date: '27 Mar 2024', time: '11:18'},
		{ type: "Paid", balance: -50, date: '27 Mar 2024', time: '09:02'},
		{ type: "Paid", balance: -100, date: '26 Mar 2024', time: '09:02'},
		{ type: "Top-Up", balance: 1000, date: '25 Mar 2024', time: '14:44'},
		{ type: "Paid", balance: -1000, date: '24 Mar 2024', time: '11:02'},
	];

  constructor(private _httpClient: HttpClient) {}

  get_total() {
    return this.total
  }

  get_history() {
    return this.history
  }

  get_transactions() {
    return this.transactions
  }

  get_transactionsCard(id: number, month: number, year: number) :Observable<any> {
    return this._httpClient.get<any>(environment.baseurl + '/api/card/history',{params:{
		//sn: 1,
		//year: 1,
		//month: 1
		fkId: id,
		year: year,
		month: month
	}});
  }
  get_last_transactionsCard(id: number) :Observable<any> {
    return this._httpClient.get<any>(environment.baseurl + '/api/card/last',{params:{
		fkId: id
	}});
  }
}

//  setCardData(id: number) {
//    localStorage.setItem('card-Data', id.toString());
//    this.select_index = id
//  }

//  getCardData() {
//    const resp = parseInt(localStorage.getItem('card-Data'));
//    if (isNaN(resp)) {
//      console.log('error func getCardData()');
//      return null;
//    } else {
//      return this.cards[resp];
//    }
//  }

//  setUpdateCard(data: any){
//	  this.cards[this.select_index].update = data
//  }

//  getUpdateCard() {
//    return this.cards[this.select_index].update;
//  }

//  setbalanceCard(data: any){
//	this.cards[this.select_index].balance = data
//  }

//  getbalanceCard() {
//    return this.cards[this.select_index].balance;
//  }

//  setTopUp(data: number){
//    this.topUp = data;
//  }

//  getTopUp(){
//    return this.topUp
//  }
