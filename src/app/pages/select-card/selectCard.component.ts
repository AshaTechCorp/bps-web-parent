import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Renderer2, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { TopUpService } from '../top-up/topUp.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    NavbarComponent
  ],

  templateUrl: './selectCard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectCardComponent implements OnInit {
  cards: any[] = []
  cards_family: any;
  loadsuccess: boolean = false

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private _topupservice: TopUpService,
    private renderer: Renderer2,
    private authService: MsalService,
  ) {
  }

  ngOnInit(): void {
    this._topupservice.getProfile().subscribe((resp: any) => {
      const email = resp.userPrincipalName
      // const email = "akulla4671@thinhmin.com"

      localStorage.setItem('family', email);

      this._topupservice.signInWithEmail(email).subscribe({
        next: (resp: any) => {
          localStorage.setItem('accessToken', resp.accessToken);

          this._topupservice.get_family_card().subscribe({
            next: (resp: any) => {
              this.cards_family = resp

              for (let index = 0; index < this.cards_family.persons.length; index++) {
                const element = this.cards_family.persons[index];
                const data = {
                  //id: element.sn,
                  id: element.fkId,
                  role: element.role,
                  name: element.name,
                  balance: element.remain,
                  update: DateTime.fromISO(element.at).toFormat('HH:mm')
                }
                this.cards.push(data)
              }
              sessionStorage.setItem('all_c', JSON.stringify(this.cards));
              const requesterId = resp.requesterId
              localStorage.setItem('requesterId', requesterId);
              this.loadsuccess = true
            },
            error: (err: any) => {
              // จัดการเมื่อเกิด error ในการดึงข้อมูล
              alert(err?.error?.message)
              console.error(err);
              this.authService.logoutRedirect();
              // อาจต้องมีการ handle error ตามที่ต้องการ เช่น แสดงข้อความแจ้งเตือนให้ผู้ใช้
            }
          })
        },
        error: (err) => {
          alert(err?.error?.message)
          console.error(err);
          this.authService.logoutRedirect();
        }
      })
    })
  }

  encodeBase64(input: string): string {
    return btoa(input);
  }

  bg_card(i: number): string {
    return this._topupservice.get_bg_card(this.cards[i].role)
  }

  clickForUpdateTime(i: number) {
    const date = DateTime.local()
    this.cards[i].update = date.toFormat('HH:mm')
  }

  select(fk: string, i: number) {
    this._topupservice.setCardData(i)
    this._router.navigate(['/card', this.encodeBase64(fk)]);
  }

  getTextWidth(text: string): number {
    const span = this.renderer.createElement('span');
    span.textContent = text;
    span.style.fontFamily = "IBM Plex Sans Thai"
    span.style.fontSize = "16px"
    span.style.letterSpacing = "0.25px"
    span.style.fontWeight = "500"
    this.renderer.setStyle(span, 'position', 'absolute');
    this.renderer.setStyle(span, 'visibility', 'hidden');
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
  }
}

