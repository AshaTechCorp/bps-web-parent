import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-history-form',
    standalone: true,
    templateUrl: './bottomsheet.component.html',
    styleUrls: ['./bottomsheet.component.scss'],
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatRadioModule
    ]
})
export class BottomSheetForm implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    data_type:any
    data_balance:any;
    data_date:any;
    data_time:any;
    data_list:any[]=[];

    constructor(
        private BottomSheetRef: MatBottomSheetRef<BottomSheetForm>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        this.data_type = this.data.type
        this.data_date = this.data.date
        this.data_balance = this.data.balance
        this.data_time = this.data.time
        this.data_list = this.data.list

    }

    onClose() {
      this.BottomSheetRef.dismiss();
  }
}
