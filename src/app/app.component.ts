/**
 * @license
 * Copyright TWISS.IO
 * All Rights Reserved.
 * Licensed under the MIT License.
 */
import { Component, OnInit, OnDestroy, RendererFactory2, ViewChild, AfterViewInit } from '@angular/core';
import { NbAuthOAuth2Token, NbAuthService } from '@nebular/auth';
import { Router,
         Event as RouterEvent,
         NavigationStart,
         NavigationEnd,
         NavigationCancel,
         NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { setTheme } from 'ngx-bootstrap/utils';

import { AuthService, PusherService, TitleService, LocalStorageService } from '@app/@core/services';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-nav-loading" [ngClass]="{'d-none':!loading}"><div class="logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 734.17 800.2" class="animated faa-spin"><defs><style>.cls-1{fill:#c1c3c5;stroke:#c1c3c5;stroke-miterlimit:10;stroke-width:10px;}</style></defs><title>logo_symbol_thick</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M663.73,399.88a148.5,148.5,0,0,0-148.49-256.4,148.5,148.5,0,0,0-296.31-.16A148.5,148.5,0,0,0,70.89,400,148.5,148.5,0,0,0,219,656.71a148.5,148.5,0,0,0,296.35-.4A148.5,148.5,0,0,0,663.73,399.88Zm-148.17-249a141.75,141.75,0,0,1,142,245l-19.42,10.5a140.58,140.58,0,0,1-23.57,8.08c-2.25.56-4.5,1-6.75,1.49l0,60.74a55.18,55.18,0,0,1,6.72,4.61,54,54,0,1,1-64.47-2.42L556.8,475l.45-58.34c-2.4-.4-4.79-.87-7.16-1.39a142.63,142.63,0,0,1-31.48-11l-14.87-8.35A141.94,141.94,0,0,1,439,283.43l7.63-4.54L490.12,304h0a94.51,94.51,0,1,0,63-117.61h0l-38-21.92v0Zm3,260.84a149.08,149.08,0,0,0,31.49,10.4h0v48.67l0,.13a60.71,60.71,0,1,0,64.46,2V421.43h0a148.51,148.51,0,0,0,23.94-7.85V448.2h0v8.73a87.76,87.76,0,1,1-133.81,22.16,89,89,0,0,1,7.2-10.61,86,86,0,0,1,6.75-7.59v-9.23h0ZM491.42,641.66l-.31.21h0l-30.35,17.52h0l-7.56,4.36a84.79,84.79,0,0,1-2.29,9A87.76,87.76,0,1,1,367.11,559a87.53,87.53,0,0,1,22.73,3l8-4.61h0l35-20.18h0l0,0a150.14,150.14,0,0,0,6.69,32h0L416,582.73l-18.63,10.76-.14,0a60.72,60.72,0,1,0,30.48,56.85l44.62-25.76h0A147.62,147.62,0,0,0,491.42,641.66Zm-59-128.34a148.74,148.74,0,0,0-130.74,0A148.71,148.71,0,0,0,236.2,400a148.72,148.72,0,0,0,65.5-113.16,148.71,148.71,0,0,0,130.77,0,148.72,148.72,0,0,0,65,113,148.65,148.65,0,0,0-65.08,113.43ZM243.2,158.27,281,136.45a87.76,87.76,0,1,1,86.1,104.8,89.76,89.76,0,0,1-12.79-.92,90.88,90.88,0,0,1-9.95-2.05l-42.94,24.79a149.37,149.37,0,0,0-6.75-32.64h0l23.51-13.57,18.77-10.79a60.7,60.7,0,1,0-30.48-56.84L261.84,175h0A147.51,147.51,0,0,0,243.2,158.27Zm266.07,38.21a147.57,147.57,0,0,0,5.19-24.65h0l37.9,21.88a87.76,87.76,0,1,1-47.72,127,88.05,88.05,0,0,1-8.79-21.18l-42.95-24.8h0a149.28,149.28,0,0,0,24.76-22.06h0l42.24,24.43a60.72,60.72,0,1,0,34-54.81l-44.62-25.77ZM367.09,11.75a141.75,141.75,0,0,1,141.62,136l-.28,16.5a141.67,141.67,0,0,1-5.17,28.8c-.65,2.22-1.34,4.42-2.09,6.59l52.62,30.34a54,54,0,1,1-27,51.11l0-7.82-50.29-29.56c-1.55,1.87-3.15,3.71-4.79,5.5a142.57,142.57,0,0,1-25.87,22.21l-8.09,5a141.86,141.86,0,0,1-135.69,3l-.12-8.88,43.44-25.08h0A94.51,94.51,0,1,0,275,132.1h0L237.2,153.94l-11.7-7.19A141.75,141.75,0,0,1,367.09,11.75Zm-336.32,194a141.74,141.74,0,0,1,187.84-55l18.58,11.48a141.42,141.42,0,0,1,18.64,16.27c1.6,1.66,3.15,3.37,4.66,5.1l52.59-30.4a52.88,52.88,0,0,1,.63-8.12,54,54,0,1,1,30.14,57l-6.8-3.87L286.3,227q1.27,3.42,2.38,6.9a142.45,142.45,0,0,1,6.26,32.9h0l.36,10.13a141.9,141.9,0,0,1-65.22,119l-7.75-4.34V341.44h0A94.51,94.51,0,1,0,89,345.66v43.83L77,396A141.74,141.74,0,0,1,30.77,205.75Zm184.8,133v49.77a149.08,149.08,0,0,0-31.49-10.4h0V329.41l0-.13a60.72,60.72,0,1,0-64.47-2v51.52h0a147.53,147.53,0,0,0-23.94,7.85v-44a87.68,87.68,0,1,1,119.86-4Zm3,310.61a141.75,141.75,0,1,1-99-263.6c2.24-.56,4.49-1.05,6.75-1.49l0-60.74a54,54,0,1,1,57.76-2.19l-6.75,3.95-.46,58.34c2.4.4,4.79.87,7.16,1.39a141.79,141.79,0,0,1,111,131.79l-7.63,4.54-43.44-25.08h0a94.51,94.51,0,1,0-63,117.61h0L219,635.75Zm1.12-20.94h0l-30.34-17.52h0l-7.57-4.36a87.76,87.76,0,1,1,47.72-127,88.05,88.05,0,0,1,8.79,21.18l8,4.62h0l35,20.18h0a149.15,149.15,0,0,0-24.74,22.06h0L233,534l-18.63-10.76-.09-.1a60.72,60.72,0,1,0-34,54.81l44.62,25.77ZM367.11,788.45a141.75,141.75,0,0,1-141.67-137.1l-.08-4.69a141.63,141.63,0,0,1,5.58-39.47c.64-2.22,1.34-4.42,2.08-6.59l-52.61-30.34a55.21,55.21,0,0,1-7.36,3.51,54,54,0,1,1,34.33-54.62l.05,7.82,50.3,29.56c1.55-1.87,3.14-3.71,4.79-5.5a142.26,142.26,0,0,1,26.74-22.8l5.17-3.24a141.85,141.85,0,0,1,137.71-4.26l.14,8.9-43.44,25.08h0A94.51,94.51,0,1,0,459.18,668.1h0l37.95-21.92,11.57,7.12A141.75,141.75,0,0,1,367.11,788.45Zm336.3-194.61a141.89,141.89,0,0,1-225.07,27.3q-2.4-2.5-4.66-5.11l-52.59,30.4a53,53,0,0,1-.63,8.13,54,54,0,1,1-30.14-57l6.8,3.86,50.75-28.77q-1.28-3.42-2.38-6.9a143,143,0,0,1-6.3-33.54l-.29-11.49a141.86,141.86,0,0,1,64.86-116.81q4,2.4,8.09,4.54v49.74h0a94.51,94.51,0,1,0,133.36-4.22h0v-43.4l12.28-6.67A141.75,141.75,0,0,1,703.41,593.84Z"/></g></g></svg></div><div class="spinner"><span></span></div></div>
    <nb-layout><nb-layout-column><router-outlet></router-outlet></nb-layout-column></nb-layout>

    <swal #multipleLoginsSwal title="Multiple Logins" text="For security reasons, this session is logged out automatically." type="error" [showConfirmButton]="false"></swal>
  `,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('multipleLoginsSwal', {static: false}) private multipleLoginsSwal: SwalComponent;
  subs_pusher: Subscription;
  loading: boolean = false;
  renderer: any;

  constructor(
    private nbAuthService: NbAuthService,
    private authService: AuthService,
    private pusherService: PusherService,
    private router: Router,
    private titleService: TitleService,
    private localStorageService: LocalStorageService,
    private rendererFactory: RendererFactory2
  ) {
    setTheme('bs4');
    this.renderer = rendererFactory.createRenderer(null, null);

    this.nbAuthService.onTokenChange()
      .subscribe((token: NbAuthOAuth2Token) => {
        if (token.isValid()) {
          // here we receive a payload from the token :: token.getPayload();
          this.renderer.addClass(document.body, 'authenticated');
        } else {
          this.renderer.removeClass(document.body, 'authenticated');
          // this.authService.invalidate();
        }
      });
  }

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => this.navigationInterceptor(event));
    this.subs_pusher = this.pusherService.monitorRoot().subscribe((data) => {
       if (data == 'multiple-logins') {
         if (this.router.url != '/') this.localStorageService.setItem('auth-redirect', this.router.url);
         this.authService.invalidate();
         this.multipleLoginsSwal.show();
       }
    });
  }

  ngAfterViewInit() {
    this.loading = false;
    this.renderer.addClass(document.body, 'angular-loaded');
  }

  navigationInterceptor(event: RouterEvent): void {
    this.titleService.setTitle(this.router.routerState.snapshot.root);

    // Shows and hides the loading spinner during RouterEvent changes
    if (event instanceof NavigationStart) { this.loading = true; }
    if (event instanceof NavigationEnd) { this.loading = false; }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) { this.loading = false; }
    if (event instanceof NavigationError) { this.loading = false; }
  }

  ngOnDestroy() {
    this.subs_pusher.unsubscribe();
  }
}
