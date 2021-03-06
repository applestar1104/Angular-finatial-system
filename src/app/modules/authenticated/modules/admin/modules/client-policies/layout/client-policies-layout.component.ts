/**
 * @license
 * Copyright TWISS.IO
 * All Rights Reserved.
 * Licensed under the MIT License.
 */

import { Component, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-client-policies-layout',
  templateUrl: './client-policies-layout.component.html',
  styleUrls: ['./client-policies-layout.component.scss']
})
export class AdminClientPoliciesLayoutComponent implements OnDestroy {
  _routerSubscriptions: Subscription;
  title;
  banner;

  constructor(private router: Router) {

    this._routerSubscriptions = router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationEnd) {
        var root = this.router.routerState.snapshot.root;
        while (root) {
          if (root.children && root.children.length) {
              root = root.children[0];
          } else if (root.data) {
              this.title = (root.data.title) ? root.data.title : null;
              this.banner = (root.data.banner === true) ? true : false;
              break;
          } else {
              break;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this._routerSubscriptions.unsubscribe();
  }

}
