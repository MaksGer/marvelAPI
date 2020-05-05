import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})

export class ComicsRestService {
	publicKey = '261184743b3ca5f2464aa5f310961b29';
	urlAPI = `https://gateway.marvel.com/v1/public/comics`;

	constructor(private http: HttpClient,) { }

	getComics(limit) {
		let params = new HttpParams();

		params = params.append('apikey', this.publicKey);
		params = params.append('limit', limit);

		return this.http.get(this.urlAPI, {params})
			.pipe(
				map((response: any) => response.data.results)
			);
	}

	getComicsFromUserSearch(name: string): Observable<any> {
		let params = new HttpParams();

		params = params.append('titleStartsWith', name);
		params = params.append('apikey', this.publicKey);

		return this.http.get(this.urlAPI, {params})
			.pipe(
				map((response: any) => response.data.results)
			);
	}
}
