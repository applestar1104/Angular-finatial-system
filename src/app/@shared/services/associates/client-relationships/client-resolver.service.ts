/**
 * @license
 * Copyright TWISS.IO
 * All Rights Reserved.
 * Licensed under the MIT License.
 */

import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Response, Client } from '@app/models';
import { AssociatesClientRelationshipsService } from './client-relationships.service';

@Injectable()
export class AssociatesClientResolverService implements Resolve<Response> {
  client: Client;

  constructor(private assClientService: AssociatesClientRelationshipsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (route.params.uuid) {
      return this.assClientService.getClients(route.params.uuid).pipe(
        take(1),
        map(res => {
          this.client = res['data'];
          // console.log('Client Resolver:', this.client);
          return this.client;
        })
      );
    } else {
      return false;
    }
  }
}
