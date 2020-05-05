import {Component, OnInit} from '@angular/core';
import {SeriesRestService} from '../services/series-rest.service';
import {MatSnackBar} from '@angular/material';
import {Subject, throwError} from 'rxjs';
import {catchError, debounceTime, delay} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {switchMap} from 'rxjs/internal/operators/switchMap';

export interface Series {
	id: number;
	title: string;
	description?: string;
	thumbnail: {
		path: string,
		extension: string,
	};
	urls: [{
		type: string,
		url: string,
	}];
}

@Component({
	selector: 'app-series',
	templateUrl: './series.component.html',
})

export class SeriesComponent implements OnInit {
	seriesList: Series[];
	isLoading: boolean;
	isSearchActive: boolean;
	dialogTemplate = 'series';

	private searchTerms = new Subject<string>();

	constructor(private rest: SeriesRestService,
				private _snackBar: MatSnackBar,
	) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.getStartSeries();
		this.getSeries();
	}

	search(userString: string) {
		this.searchTerms.next(userString);
	}

	getSeries() {
		this.searchTerms
			.pipe(
				debounceTime(1000),
				distinctUntilChanged(),
				switchMap((term: string) => {
						return this.rest.getSeriesFromUserSearch(term);
				}),
				tap(() => this.isSearchActive = true),
				delay(1000),
			)
			.subscribe(response => {
				if (!response[0]) {
					this._snackBar.open('There are no matches', 'Close', {
						duration: 2000,
						verticalPosition: 'top',
						horizontalPosition: 'center',
						panelClass: 'error-snack-bar',
					});
				}

				this.seriesList = response;
				this.isSearchActive = false;
			});
	}

	getStartSeries(limit = 20) {
		this.rest.getSeries(limit)
			.pipe(
				delay(1000),
				catchError(error => {
					this._snackBar.open(error.message, 'Close', {
						duration: 4000,
						verticalPosition: 'top',
						horizontalPosition: 'center',
						panelClass: 'error-snack-bar',
					});

					return throwError(error);
				})
			)
			.subscribe(data => {
				this.seriesList = data;
				this.isSearchActive = false;
				this.isLoading = false;
			});
	}

	getLimit(limit) {
		this.isSearchActive = true;
		this.getStartSeries(limit);
	}
}
