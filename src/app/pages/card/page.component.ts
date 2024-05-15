import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { TopUpService } from '../top-up/topUp.service';
import { HistoryService } from '../history/page.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { UserService } from '../top-up/user.service';

@Component({
    selector: 'app-card',
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
    //styleUrl: './selectCard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {
    users: any[] = []
    role: any
    balance: number = 1400
    card: any
    transactions:any[] = []
    cards: any[] = []
    //translate_y: string = 'translate-y-[119px]'
    display_popup: string = 'hidden'
    display_left: any
    display_right: any
    slice_src: any

    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,
        private _historyService: HistoryService,
    ) {
    }
    ngOnInit(): void {
        this.card = this._topup.getCardData()
        this.cards = this._topup.getAllCard()
        this.buttonL()
        this.buttonR()
        this.slice_card()
        console.log(this.cards.length);

        console.log(this.cards);

        this.role = 'parent'

        this.transactions = this._historyService.get_transactions()
    }

    buttonL(){
        const index = this._topup.getSelectIndex()
        console.log('L' + index);

        console.log('buttonL');

        if (index > 0){
            this.display_left = "block"
        }
        else{
            this.display_left = "hidden"
        }
    }

    buttonR(){
        const index = this._topup.getSelectIndex()
        console.log('R' + index);
        console.log('buttonR');
        if (index < this.cards.length - 1){
            this.display_right = "block"
            console.log(index + '<' + this.cards.length +'R block');
        }
        else{
            this.display_right = "hidden"
            console.log(index + '<' + this.cards.length +'R hidden');
        }
    }

    slice_card(){
        const index = this._topup.getSelectIndex()
        if (this.cards.length == 1)
            this.slice_src = "assets/images/logo/card/slide_card0.svg"
        else if (index == 0)
            this.slice_src = "assets/images/logo/card/slide_card1.svg"
        else if ((index < this.cards.length - 1) && (index > 0))
            this.slice_src = "assets/images/logo/card/slide_card2.svg"
        else if (index == this.cards.length - 1)
            this.slice_src = "assets/images/logo/card/slide_card3.svg"
    }

    change_left(){
        const index = this._topup.getSelectIndex() - 1
        console.log('this._topup.getSelectIndex() - 1 = ' + index);
        this._topup.setCardData(index)
        this.buttonL()
        this.buttonR()
        this.card = this._topup.getCardData()
        this.slice_card()
    }

    change_right(){
        const index = this._topup.getSelectIndex() + 1
        console.log('this._topup.getSelectIndex() + 1 = ' + index);
        this._topup.setCardData(index)
        this.buttonL()
        this.buttonR()
        this.card = this._topup.getCardData()
        this.slice_card()
    }

    change_card(index: number){
        this._topup.setCardData(index)
        this.toggle_popup()
        this.card = this._topup.getCardData()
        console.log(index);
        this.slice_card()
    }

    toggle_popup(){
        if (this.display_popup == "hidden")
            this.display_popup = "block"
        else if (this.display_popup == "block")
            this.display_popup = "hidden"
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
        if (this.card.role == "student")
            return "assets/images/logo/card/student.svg"
        else if (this.card.role == "business")
            return "assets/images/logo/card/business.svg"
        else if (this.card.role == "academic")
            return "assets/images/logo/card/academic.svg"
        else
            return ""
    }

    //translate_y_popup(){
    //    const len = this._topup.getAllCard().length
    //    console.log('len'+len);
    //    if (len == 1)
    //        this.translate_y = 'translate-y-[110%]'
    //    else if (len == 2)
    //        this.translate_y = 'translate-y-[171px]'
    //    else if (len > 2)
    //        this.translate_y = 'translate-y-[230px]'
    //    else
    //        this.translate_y = 'translate-y-[0px]'
    //    console.log(this.translate_y); 
    //}

    clickForUpdateTime(){
      const date = DateTime.local()
      this.card.update = date.toFormat('HH:mm')
      this._topup.setUpdateCard(this.card.update)
    }

    gototopup(){
        this._router.navigate(['/top-up'])
        console.log('top-up');

    }

    gotohistory(){
        this._router.navigate(['/history'])
        console.log('history');
    }
}
