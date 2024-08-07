import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { TopUpService } from '../top-up/topUp.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

@Component({
  selector: 'app-success-ornot',
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
    NavbarComponent,
  ],

  templateUrl: './success-ornot.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SuccessOrnotComponent implements OnInit {
  users: any[] = [];
  balance: number = 1400;
  card: any;
  time: any;
  data_amount: any;
  success_date: Date = new Date();
  amount: any;
  topupAmount: number = 0;
  fee: number = 0;
  form: any;
  //sn: string;
  bgCard!: string;
  ref!: string;
  success: number = 3;
  loadsuccess: boolean = false
  //loading: string = 'assets/images/waiting/pending.gif';
  constructor(
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _router: Router,
    private _topup: TopUpService,
    private activityroute: ActivatedRoute
  ) {
    //this.fk = this.decodeBase64(this.activityroute.snapshot.params['fk'])
    //this.ref = this.activityroute.snapshot.params['referenceOrder']
    this.activityroute.queryParams.subscribe((params) => {
      this.ref = params['referenceOrder'];
      //console.log('ref ', this.ref);
    });
    this.form = this._fb.group({
      amount: 0,
    });
  }
  ngOnInit(): void {
    if (this.ref) {
      this._topup.check_status_credit(this.ref).subscribe((resp: any) => {
        this.card = {
          id: resp.topupTo.fkId,
          role: resp.topupTo.type,
          name: resp.topupTo.name,
          balance: resp.topupTo.balance,
          update: DateTime.fromISO(resp.date).toFormat('HH:mm'),
        };
        this.bgCard = this.bg_card();
        this.loadsuccess = true
        if (resp?.status == 'CREATE' || resp?.status == 'FAIL') {
          this.success = 1;
        } else if (resp?.status == 'SUCCESS') {
          this.success = 2;
        }

        this.topupAmount = resp.topupAmount
        this.fee = resp.topupAmount * (2.0 / 100)
        this.amount = resp.amount

        this._topup.get_family_card().subscribe((resp: any) => {
          const cards = []
          for (const person of resp.persons) {
            const data = {
              //id: element.sn,
              id: person.fkId,
              role: person.role,
              name: person.name,
              balance: person.remain,
              update: DateTime.fromISO(person.at).toFormat('HH:mm')
            }
            cards.push(data)
          }
          sessionStorage.setItem('all_c', JSON.stringify(cards));
        })
      }, (error) => {
        alert("error not found")
        this._router.navigate(['/select']);
      });
    }
  }
  decodeBase64(input: string): string {
    return atob(input);
  }

  encodeBase64(input: string): string {
    return btoa(input);
  }

  bg_card(): string {
    return this._topup.get_bg_card(this.card.role);
  }

  clickForUpdateTime() {
    const date = DateTime.local();
    this.card.update = date.toFormat('HH:mm');
    this._topup.setUpdateCard(this.card.update);
  }

  backto() {
    if (this.card?.id)
      this._router.navigate(['/top-up', this.encodeBase64(this.card.id)]);
  }
}
