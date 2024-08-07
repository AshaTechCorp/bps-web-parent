import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalModule, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest, EventMessage, EventType } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MsalModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule, NavbarComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isIframe = false;
  loginDisplay = false;
  isButtonDisabled = false
  private readonly _destroying$ = new Subject<void>();

  disableButton(): void {
    this.isButtonDisabled = true;
  }

  enableButton(): void {
    this.isButtonDisabled = false;
  }

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private _router: Router,
    private dialog: MatDialog,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

    this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount(){
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  loginRedirect() {
    //console.log('REDIRECT');

    if (this.msalGuardConfig.authRequest){
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  loginPopup() {
    //console.log('POPUP');

    if (this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
      });
    }
  }

  logout(popup?: boolean) {
    localStorage.clear()
    sessionStorage.clear()

    if (popup) {
      this.authService.logoutPopup({
        // mainWindowRedirectUri: "/"
      }).subscribe(() => {
        this.openDialog();
      });
    }
    else {
      this.authService.logoutRedirect();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '118px',
      height: '118px',
    });

    setTimeout(() => {
      dialogRef.close();
    }, 3000);

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed with result:', result);
      this._router.navigate(['/']);
    });
  }

  gotoselectcard(){
    this._router.navigate(['/select']);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
