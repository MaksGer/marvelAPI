import {Component, OnInit} from '@angular/core';
import {catchError, delay} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {StoriesRestService} from '../services/stories-rest.service';
import {MatSnackBar} from '@angular/material';

export interface Story {
	id: number;
	title: string;
	description?: string;
}

@Component({
	selector: 'app-stories',
	templateUrl: './stories.component.html',
})

export class StoriesComponent implements OnInit {
	storiesList: Story[];
	isLoading: boolean;
	isSearchActive: boolean;
	dialogTemplate = 'story';

	constructor(private rest: StoriesRestService,
				private _snackBar: MatSnackBar,
	) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.getStories();
	}

	getStories(limit = 20) {
		this.rest.getStories(limit)
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
				this.storiesList = data;
				this.isSearchActive = false;
				this.isLoading = false;
			});
	}

	getLimit(limit) {
		this.isSearchActive = true;
		this.getStories(limit);
	}
}
