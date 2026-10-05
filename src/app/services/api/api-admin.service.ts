import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Environment} from '../../../environments/environment';
import {AdminUser} from '../../models/admin-user';
import {Page} from '../../models/page';
import {RoleRead} from '../../models/role-read';
import {RoleAssignment} from '../../models/role-assignment';

@Injectable({
  providedIn: 'root',
})
export class ApiAdminService {

  private http = inject(HttpClient)
  private url = Environment.apiUrl;

  getUsers$(page = 0) {
    return this.http.get<Page<AdminUser>>(this.url + '/adminpanel/users?page=' + page);
  }

  getRoles$() {
    return this.http.get<RoleRead[]>(this.url + '/adminpanel/roles');
  }

  banUser$(id: number) {
    return this.http.patch(this.url + '/adminpanel/users/' + id + '/ban', null);
  }

  unbanUser$(id: number) {
    return this.http.patch(this.url + '/adminpanel/users/' + id + '/unban', null);
  }

  setRole$(id: number, roleId: number) {
    const body: RoleAssignment = {roleId};
    return this.http.put(this.url + '/adminpanel/users/' + id + '/role', body);
  }

}
