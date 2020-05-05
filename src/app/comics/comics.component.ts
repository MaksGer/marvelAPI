import {Component, OnInit} from '@angular/core';
import {catchError, debounceTime, delay, filter} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {ComicsRestService} from '../services/comics-rest.service';
import {MatSnackBar} from '@angular/material';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {tap} from 'rxjs/internal/operators/tap';
import {switchMap} from 'rxjs/internal/operators/switchMap';

export interface Comics {
	id: number;
	title: string;
	description?: string;
	urls: [{
		type: string,
		url: string,
	}];
	thumbnail: {
		path: string,
		extension: string,
	};
}

@Component({
	selector: 'app-comics',
	templateUrl: './comics.component.html',
})

export class ComicsComponent implements OnInit {
	comicsList: Comics[];
	isLoading: boolean;
	isSearchActive: boolean;
	dialogComponent = 'comics';

	private searchTerms = new Subject<string>();

	constructor(
		private rest: ComicsRestService,
		private _snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.isLoading = true;
		this.getStartComics();
		this.getComics();
	}

	getLimit(limit) {
		this.isSearchActive = true;
		this.getStartComics(limit);
	}

	getStartComics(limit = 20) {
		this.rest.getComics(limit)
			.pipe(
				delay(1000),
				catchError(error => {
					this._snackBar.open(error.message, 'Close', {
						duration: 4000,
						verticalPosition: 'top',
						horizontalPosition: 'center',
						panelClass: 'error-snack-bar',
					});
					this.isLoading = false;

					return throwError(error);
				}))
			.subscribe(response => {
				this.comicsList = response;
				this.isSearchActive = false;
				this.isLoading = false;
			});
	}

	search(userString: string) {
		this.searchTerms.next(userString);
	}

	getComics() {
		this.searchTerms
			.pipe(
				debounceTime(1000),
				distinctUntilChanged(),
				filter(term => !!term),
				switchMap((term: string) => {
						return this.rest.getComicsFromUserSearch(term);
				}),
				tap(() => this.isSearchActive = true),
				delay(1000),
			).subscribe(response => {
			if (!response[0]) {
				this._snackBar.open('There are no matches', 'Close', {
					duration: 2000,
					verticalPosition: 'top',
					horizontalPosition: 'center',
					panelClass: 'error-snack-bar',
				});
			}

			this.comicsList = response;
			this.isSearchActive = false;
		});
	}
}
