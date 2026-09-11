import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Environment} from '../../../environments/environment';
import {ThreadCategory} from '../../models/thread-category';
import {ThreadRead} from '../../models/thread-read';
import {ThreadCreate} from '../../models/thread-create';

@Injectable({
  providedIn: 'root',
})
export class ApiForumService {

  private http = inject(HttpClient)
  private url = Environment.apiUrl;

  getCategories$() {
    return this.http.get<ThreadCategory[]>(this.url + '/thread-categories');
  }

  getThreadsByCategory$(categoryId: number) {
    return this.http.get<ThreadRead[]>(this.url + '/threads/category/' + categoryId);
  }

  createThread(data: ThreadCreate) {
    return this.http.post<ThreadRead>(this.url+ '/threads', data);
  }

}
