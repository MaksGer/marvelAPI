import {Component, OnInit} from '@angular/core';
import {HeroesRestService} from '../services/heroes-rest.service';
import {MatSnackBar} from '@angular/material';
import {catchError, debounceTime, delay, filter, switchMap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {tap} from 'rxjs/internal/operators/tap';

export interface Hero {
	id: number;
	name: string;
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
	selector: 'app-heroes',
	templateUrl: './heroes.component.html',
})

export class HeroesComponent implements OnInit {
	heroesList: Hero[];
	isLoading: boolean;
	isSearchActive: boolean;
	dialogComponent = 'hero';

	private searchTerms = new Subject<string>();

	constructor(private heroes: HeroesRestService,
				private _snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.isLoading = true;
		this.getStartHero();
		this.getHero();
	}

	search(userString: string) {
		this.searchTerms.next(userString);
	}

	getHero() {
		this.searchTerms
			.pipe(
				debounceTime(1000),
				distinctUntilChanged(),
				filter(term => !!term),
				switchMap((term: string) => {
						return this.heroes.getHeroesFromUserSearch(term);
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

				this.heroesList = response;
				this.isSearchActive = false;
			});
	}

	getStartHero(limit = 20) {
		this.heroes.getHeroes(limit)
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
				this.heroesList = data;
				this.isLoading = false;
				this.isSearchActive = false;
			});
	}

	getLimit(limit) {
		this.isSearchActive = true;
		this.getStartHero(limit);
	}
}
