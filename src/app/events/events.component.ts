import {Component, OnInit} from '@angular/core';
import {Subject, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {EventsRestService} from '../services/events-rest.service';
import {catchError, debounceTime, delay, filter} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {switchMap} from 'rxjs/internal/operators/switchMap';

export interface Event {
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
	selector: 'app-events',
	templateUrl: './events.component.html',
})

export class EventsComponent implements OnInit {
	isLoading: boolean;
	isSearchActive: boolean;
	eventsList: Event[];
	dialogComponent = 'event';

	private searchTerms = new Subject<string>();

	constructor(private rest: EventsRestService,
				private _snackBar: MatSnackBar,
	) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.getStartEvents();
		this.getEvent();
	}


	getStartEvents(limit = 20) {
		this.rest.getEvents(limit)
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
				this.eventsList = data;
				this.isLoading = false;
				this.isSearchActive = false;
			});
	}

	search(userString: string) {
		this.searchTerms.next(userString);
	}

	getEvent() {
		this.searchTerms
			.pipe(
				debounceTime(1000),
				distinctUntilChanged(),
				filter(term => !!term),
				switchMap((term: string) => {
					return this.rest.getEventsFromUserSearch(term);
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

				this.eventsList = response;
				this.isSearchActive = false;
			});
	}

	getLimit(limit) {
		this.isSearchActive = true;
		this.getStartEvents(limit);
	}
}
