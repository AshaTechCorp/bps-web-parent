import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  isMobile: boolean = window.innerWidth < 768;
  orders: any[] = [];
  users: any[] = []
  role: any
  total: any[] = []
  history: any[] = []
  isPlatformBrowser: boolean = window.innerWidth > 768;
  monthsYears: string[] = [];
  selectedDate: any
	card: any
  showTransactions: boolean = false;
  k: any;

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  getReversedHistory(): any[] {
    return this.history.slice().reverse();
}

constructor(
  private dialog: MatDialog,
  private bottomSheet: MatBottomSheet,
  private _router: Router,
  private _topup: TopUpService,
  private _historyService: HistoryService,
  private _userService: UserService,

  @Inject(PLATFORM_ID) private platformId: any
) {}


  ngOnInit(): void {
    this.generateMonthsYears();
    this.setDefaultMonthYear();


    //this.role = this._userService.get_role()
    this.role = 'staff'
    this.card = this._topup.getCardData()

    this.total = this._historyService.get_total()

    this.history  = this._historyService.get_history()
  }

  bg_card(): string{
    const index = this._topup.getSelectIndex()
    if (this.card.role == "student"){
        if (index % 2 == 1)
            return "assets/images/logo/card/bg_CardStudentGray.svg"
        else
            return "assets/images/logo/card/bg_CardStudentRed.svg"
    }
    else if (this.card.role == "business")
        return "assets/images/logo/card/bg_CardBusiness.svg"
    else if (this.card.role == "academic")
        return "assets/images/logo/card/bg_CardAcademic.svg"
    else
      return ""
  }

  text_card(): string{
    if (this.role == "student")
        return "assets/images/logo/card/student.svg"
    else if (this.role == "business")
        return "assets/images/logo/card/business.svg"
    else if (this.role == "academic")
        return "assets/images/logo/card/academic.svg"
    else
        return ""
}

  openDialog(i: number, j: number): void {
    const dialogRef = this.dialog.open(DialogForm, {
      disableClose: true,
      width: '595px',
      height: '400px',
      data: this.getData(i, j)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result:', result);
    });
  }

  openBottomSheet(i: number, j: number): void {
    const bottomSheetRef = this.bottomSheet.open(BottomSheetForm, {
      disableClose: true,
      panelClass: ['custom-bottom-sheet'],
      data: this.getData(i, j)
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      console.log('The bottom sheet was dismissed with result:', result);
    })

  }

  getData(i: number, j: number): any {
    return {
      history: this.history.slice().reverse(),
      date: this.history.slice().reverse()[i].date,
      type: this.history.slice().reverse()[i].data[j].type,
      balance: this.history.slice().reverse()[i].data[j].balance,
      time: this.history.slice().reverse()[i].data[j].time,
      list: this.history.slice().reverse()[i].data[j].list
    };
  }

  openDialogOrBottomSheet(i: number, j: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
    for (let year = currentYear; year >= currentYear - 1; year--) {
      for (let month = 1; month <= 12; month++) {
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
    this._router.navigate(['/card'])
  }

}

