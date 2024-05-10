import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MsalModule } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [CommonModule, MsalModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule, NavbarComponent ]
})
export class AppComponent{
  isIframe = false;

  constructor () {

  }

}
