import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
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
@Component({
    selector: 'app-product-form',
    standalone: true,
    templateUrl: './creditdebit.component.html',
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
    fee_moneyTopUp: number = +this.data.value * (2.0408 / 100.0)
    // total_moneyTopUp: number = +this.data.value
    total_moneyTopUp: number = +this.data.value + (this.data.value * (2.0408 / 100.0))
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
        private sanitizer: DomSanitizer
    )
    {
        console.log(' this.form', this.data);
        console.log('moneyTopUp ', this.moneyTopUp);
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
        const total_topUp = this.total_moneyTopUp.toFixed(2)
        return this.sanitizer.bypassSecurityTrustResourceUrl(`/static-html/kb_payment.html?amount=${total_topUp}&name=${this.card.name}`);
      }

    ngOnInit(): void {
         if (this.data.type === 'EDIT') {
        //   this.form.patchValue({
        //     ...this.data.value,
        //     roleId: +this.data.value?.role?.id
        //   })

        } else {
            console.log('New');
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
