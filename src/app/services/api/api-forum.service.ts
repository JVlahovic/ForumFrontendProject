import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Environment} from '../../../environments/environment';
import {ThreadCategory} from '../../models/thread-category';

@Injectable({
  providedIn: 'root',
})
export class ApiForumService {

  private http = inject(HttpClient)
  private url = Environment.apiUrl;

  getCategories$() {
    return this.http.get<ThreadCategory[]>(this.url + '/thread-categories');
  }

}
