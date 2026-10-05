import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Environment} from '../../../environments/environment';
import {ThreadRead} from '../../models/thread-read';
import {UserProfile} from '../../models/user-profile';
import {ChangePasswordRequest} from '../../models/change-password-request';

@Injectable({
  providedIn: 'root',
})
export class ApiUserService {

  private http = inject(HttpClient);
  private url = Environment.apiUrl;

  getProfile$() {
    return this.http.get<UserProfile>(this.url + '/users/me');
  }

  getMyThreads$() {
    return this.http.get<ThreadRead[]>(this.url + '/users/me/threads');
  }

  changePassword$(data: ChangePasswordRequest) {
    return this.http.put(this.url + '/users/me/password', data, { responseType: 'text' });
  }

}
