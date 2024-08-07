import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { DialogForm } from './form-dialog/dialog.component';
import { BottomSheetForm } from './form-bottomsheet/bottomsheet.component';
import { TopUpService } from '../top-up/topUp.service';
import { HistoryService } from './page.service';
import { UserService } from '../top-up/user.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

//history: {date: string, data: {type:string,balance: number, time: string, list:{payment:string, order:string,amount:number,total:number}
type History = {
  date: string
  data: {
    time: string, // date แปลง
    balance: number, // amount
    type: string,
    channel: string,
    cardMasking: string,
    referenceOrder: string,
    brand: string,
    shopName: string,
    location: string,
    list: {
      payment: string //transactions.channel
      order: string // == itemName
      amount: number //same
      price: number // add new
      total: number //same
    }[]
  }[]
};

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        NavbarComponent
    ],

    templateUrl: './page.component.html',
    //styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HistoryComponent implements OnInit {
  isMobile: boolean = window.innerWidth < 768;
  orders: any[] = [];
  users: any[] = []
  role: any
  total: any[] = []
  //history: any[] = []
  history: History[] = []
  isPlatformBrowser: boolean = window.innerWidth > 768;
  monthsYears: string[] = [];
  selectedDate: any
	card: any
  showTransactions: boolean = false;
  k: any;
  fk: any;
  bgCard: string='';
  loadsuccess: boolean = false
  all_cards: any[] = []
  slice_src: string = '';
  display_right: string = 'hidden';
  display_left: string = 'hidden';

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  //getReversedHistory(): any[] {
  //  return this.history?.slice().reverse();
  //}

constructor(
  private dialog: MatDialog,
  private bottomSheet: MatBottomSheet,
  private _router: Router,
  private _topup: TopUpService,
  private _historyService: HistoryService,
  private _userService: UserService,
  private activityroute: ActivatedRoute,

  @Inject(PLATFORM_ID) private platformId: any
) {
  this.fk = this.decodeBase64(this.activityroute.snapshot.params['fk'])
}


  ngOnInit(): void {
    this.generateMonthsYears();
    this.setDefaultMonthYear();

    //this.role = this._userService.get_role()
    this.role = 'staff'
    this._topup.get_card_by_fk(this.fk).subscribe((resp: any) =>{
      this.card = {
          id: resp.fkId,
          role: resp.role,
          name: resp.name,
          balance: resp.remain,
          update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
      }
      this.bgCard = this.bg_card()
      this.all_cards = this._topup.getAllCard()
      this.loadsuccess = true
      this.buttonL()
      this.buttonR()
      this.slice_card()
      this.onSelectedDateChange()
    })
  }

  get_Transaction(month: number, year: number){
    this._historyService.get_transactionsCard(this.card.id, month, year).subscribe(
      (resp: any) => {
        this.history = []
        this.total[0] = resp.totalTopUp
        this.total[1] = resp.totalSpending
        const historys = resp.history
        for (let i = 0; i < historys.length; i++) {
          const history = historys[i];
          let temp_history = {
            date: DateTime.fromISO(history.date).toLocaleString({ month: 'long',
                                                day: '2-digit', year: 'numeric' }),
            data: []
          }
          this.history.push(temp_history)
          for (let j = 0; j < history.transactions.length; j++) {
            const transaction = history.transactions[j];
            let temp_data ={
              time: (DateTime.fromISO(transaction.date)).toFormat('HH:mm'),
              balance: transaction.amount,
              type: transaction.type,
              shopName: transaction.shopName,
              channel: transaction.channel,
              cardMasking: transaction.cardMasking,
              referenceOrder: transaction.referenceOrder,
              brand: transaction.brand,
              location: transaction.location,
              list: []
            }
            this.history[i].data.push(temp_data)
            for (let k = 0; k < transaction?.items?.length; k++) {
              const item = transaction?.items[k];
              let temp_list ={
                payment: transaction.channel,
                order: item.itemName,
                amount: item.amount,
                price: item.price,
                total: item.total
              }
              this.history[i].data[j].list.push(temp_list)
            }
          }
        }
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );


  }

  buttonL(){
    const index = this._topup.getIndex(this.card.id)

    if (index > 0){
        this.display_left = "block"
    }
    else{
        this.display_left = "hidden"
    }
  }

  buttonR(){
      const index = this._topup.getIndex(this.card.id)
      if (index < this.all_cards.length - 1){
          this.display_right = "block"
      }
      else{
          this.display_right = "hidden"
      }
  }

  slice_card(){
      const index = this._topup.getIndex(this.card.id)
      if (this.all_cards.length == 0)
        this.slice_src = ""
      else if (this.all_cards.length == 1)
          this.slice_src = "assets/images/logo/card/slide_card0.svg"
      else if (index == 0)
          this.slice_src = "assets/images/logo/card/slide_card1.svg"
      else if ((index < this.all_cards.length - 1) && (index > 0))
          this.slice_src = "assets/images/logo/card/slide_card2.svg"
      else if (index == this.all_cards.length - 1)
          this.slice_src = "assets/images/logo/card/slide_card3.svg"
  }

  change_left(){
      const index = this._topup.getIndex(this.card.id) - 1
      this.card = this.all_cards[index]
      this.buttonL()
      this.buttonR()
      this.slice_card()
      this.bgCard = this.bg_card()
      this._router.navigate(['/history',this.encodeBase64(this.card.id)])
  }

  change_right(){
      const index = this._topup.getIndex(this.card.id) + 1
      this.card = this.all_cards[index]
      this.buttonL()
      this.buttonR()
      this.slice_card()
      this.bgCard = this.bg_card()
      this._router.navigate(['/history',this.encodeBase64(this.card.id)])
  }

  decodeBase64(input: string): string {
    return atob(input);
  }

  encodeBase64(input: string): string {
      return btoa(input);
  }

  onSelectedDateChange() {
    const parts = this.selectedDate.split(' ');
    const monthString = parts[0]; // ชื่อเดือน เช่น "February"
    const yearString = parts[1];  // ปี เช่น "2023"
    let all_month = []

    for (let i = 1; i <= 12; i++) {
      all_month.push(this.getMonthName(i))
    }
    // สร้าง mapping ของชื่อเดือนกับตัวเลขเดือน
    const monthMapping: { [key: string]: number } = {
      [all_month[0]]: 1, [all_month[1]]: 2, [all_month[2]]: 3, [all_month[3]]: 4, [all_month[4]]: 5, [all_month[5]]: 6, [all_month[6]]: 7, [all_month[7]]: 8, [all_month[8]]: 9, [all_month[9]]: 10, [all_month[10]]: 11, [all_month[11]]: 12
    };

    const monthNumber = monthMapping[monthString];
    const yearNumber = parseInt(yearString, 10);
    // console.log('history : ',this.card.id);

    this.get_Transaction(monthNumber, yearNumber)
  }

  bg_card(): string{
    return this._topup.get_bg_card(this.card.role)
  }

  openDialog(i: number, j: number): void {
    const dialogRef = this.dialog.open(DialogForm, {
      disableClose: true,
      width: '595px',
      height: '400px',
      data: this.getData(i, j)
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed with result:', result);
    });
  }

  openBottomSheet(i: number, j: number): void {
    const bottomSheetRef = this.bottomSheet.open(BottomSheetForm, {
      disableClose: true,
      panelClass: ['custom-bottom-sheet'],
      data: this.getData(i, j)
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      //console.log('The bottom sheet was dismissed with result:', result);
    })
  }

  getData(i: number, j: number): any {
    //console.log('test ,',this.history.slice().reverse()[i].data[j].time);
    //console.log('test2 ,',this.history.slice().reverse()[i].data.slice().reverse()[j].time);
    return {
      //history: this.history.slice().reverse(),
      date: this.history[i].date,
      type: this.history[i].data[j].type,
      balance: this.history[i].data[j].balance,
      time: this.history[i].data[j].time,
      list: this.history[i].data[j].list,
      shopName: this.history[i].data[j].shopName,
      channel: this.history[i].data[j].channel,
      referenceOrder: this.history[i].data[j].referenceOrder,
      marking: this.history[i].data[j].cardMasking,
      brand: this.history[i].data[j].brand,
      location: this.history[i].data[j].location
    };
  }

  openDialogOrBottomSheet(i: number, j: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth < 960;
      if (isMobile) {
        this.openBottomSheet(i, j);
      } else {
        this.openDialog(i, j);
      }
    }
  }

  clickForUpdateTime(){
    const date = DateTime.local()
    this.card.update = date.toFormat('HH:mm')
  }

  generateMonthsYears(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    for (let year = currentYear; year >= currentYear - 1; year--) {
      if (year == currentYear) {
        for (let month = currentMonth; month >= 1; month--) {
          this.monthsYears.push(`${this.getMonthName(month)} ${year}`);
        }
      }
      else
        for (let month = 12; month >= currentMonth; month--) {
          this.monthsYears.push(`${this.getMonthName(month)} ${year}`);
        }
    }
  }

  getMonthName(month: number): string {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  }

  setDefaultMonthYear(): void {
    const currentDate = new Date();
    const currentMonthYear = `${this.getMonthName(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`;
    this.selectedDate = currentMonthYear;
  }

  backto(){
    if (this.card?.id)
      this._router.navigate(['/card',this.encodeBase64(this.card.id)])
  }

}

