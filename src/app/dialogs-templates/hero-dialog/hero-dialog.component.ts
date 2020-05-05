import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	Inject,
	OnInit,
	ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Hero} from '../../heroes/heroes.component';
import {HeroesRestService} from '../../services/heroes-rest.service';
import {delay} from 'rxjs/operators';
import {NguCarousel, NguCarouselConfig} from '@ngu/carousel';
import {Item} from '../../grid-for-tabs/grid-for-tabs.component';

export interface Comics {
	title: string;
	thumbnail: {
		path: string,
		extension: string,
	};
}

@Component({
	selector: 'app-hero-dialog',
	templateUrl: './hero-dialog.component.html',
	styleUrls: ['./hero-dialog.component.css'],
})

export class HeroDialogComponent implements OnInit, AfterViewInit {
	isLoading = true;
	listOfComics: Comics[];
	data: Item;

	@ViewChild('myCarousel', {static: false}) myCarousel: NguCarousel<[Comics]>;
	carouselConfig: NguCarouselConfig = {
		grid: {xs: 1, sm: 2, md: 3, lg: 3, all: 0},
		interval: {timing: 4000, initialDelay: 1000},
		loop: false,
		touch: true,
		velocity: 0.2,
	};

	constructor(
		public dialogRef: MatDialogRef<HeroDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public hero: Hero,
		private rest: HeroesRestService,
		private cdr: ChangeDetectorRef,
	) { }

	static open(dialog: MatDialog, data: Item) {
		const dialogRef = dialog.open(HeroDialogComponent, {width: '33vw'});

		dialogRef.componentInstance.data = data;

		return dialogRef;
	}

	ngOnInit(): void {
		this.rest.getComicsForHero(this.data.id)
			.pipe(
				delay(1000)
			)
			.subscribe(
				data => {
					this.listOfComics = data;
					this.isLoading = false;
				}
			);
	}

	close(): void {
		this.dialogRef.close();
	}

	ngAfterViewInit() {
		this.cdr.detectChanges();
	}
}
