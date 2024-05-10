import { update } from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private role = 'parent'

  constructor() {}

  get_role() {
    return this.role
  }

}
