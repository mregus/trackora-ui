import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { SearchResponse } from '../../shared/models/search.models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  search(query: string) {
    const params = new HttpParams().set('query', query);

    return this.http.get<SearchResponse>(
      `${environment.apiBaseUrl}/search`,
      { params }
    );
  }
}
