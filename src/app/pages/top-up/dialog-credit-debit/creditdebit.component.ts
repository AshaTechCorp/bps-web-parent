import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TopUpService } from '../topUp.service';
import {MatRadioModule} from '@angular/material/radio';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-product-form',
    standalone: true,
    templateUrl: './creditdebit.component.html',
    styleUrl: './creditdebit.component.scss',
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule
    ]
})
export class CreditDebitDialog implements OnInit {
    moneyTopUp: number = +this.data.value
    // fee_moneyTopUp: number = +this.data.value
    fee_moneyTopUp: number = +this.data.value * (2.0 / 100.0)
    // total_moneyTopUp: number = +this.data.value
    total_moneyTopUp: number = +this.data.value + (this.data.value * (2.0 / 100.0));

    
    card:any = this.data.card
    form: FormGroup;
    stores: any[]=[];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    constructor(
        private dialogRef: MatDialogRef<CreditDebitDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _router: Router,
        private sanitizer: DomSanitizer,
        private elementRef: ElementRef
    )
    {
        //console.log(' this.form', this.data);
        //console.log('moneyTopUp ', this.moneyTopUp);
        if(this.data.type === 'EDIT') {

            this.form = this.FormBuilder.group({
                //code: this.data.value.code ?? '',
                //name: this.data.value.name ?? '',
             });
        } else {
            this.form = this.FormBuilder.group({
                //code: '',
                //name: '',
             });
        }


        // console.log('1111',this.data?.type);

    }

    getSafeUrl(): SafeResourceUrl {
        // ตรวจสอบว่ามีทศนิยมน้อยกว่า 2 ตำแหน่งหรือไม่
        
        return this.sanitizer.bypassSecurityTrustResourceUrl(`/static-html/kb_payment.html?amount=${+this.total_moneyTopUp.toFixed(2)}&name=${this.card.name}&base=${environment.baseurl}&id=${this.card.id}&nofee=${this.moneyTopUp}`);
      }

    ngOnInit(): void {
        if (+this.total_moneyTopUp > +this.total_moneyTopUp.toFixed(2)) {
            // ถ้ามีทศนิยมน้อยกว่า 2 ตำแหน่ง ให้เพิ่มเติมค่าอีก 1 หน่วย และทำการปัดทศนิยมอีกครั้ง
            this.total_moneyTopUp = +this.total_moneyTopUp.toFixed(2) + 0.01;
        }
        if (+this.fee_moneyTopUp > +this.fee_moneyTopUp.toFixed(2)) {
            // ถ้ามีทศนิยมน้อยกว่า 2 ตำแหน่ง ให้เพิ่มเติมค่าอีก 1 หน่วย และทำการปัดทศนิยมอีกครั้ง
            this.fee_moneyTopUp = +this.fee_moneyTopUp.toFixed(2) + 0.01;
        }
         if (this.data.type === 'EDIT') {
        //   this.form.patchValue({
        //     ...this.data.value,
        //     roleId: +this.data.value?.role?.id
        //   })

        } else {
            //console.log('New');
        }
    }

    nextto(){
        this.onClose()
        this._router.navigate(['/top-up/success',this.encodeBase64(this.data.id)])
    }
    
    encodeBase64(input: string): string {
        return btoa(input);
    }

    onClose() {
        this.dialogRef.close()
    }
}
