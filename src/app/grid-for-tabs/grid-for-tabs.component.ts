import {Component, DoCheck, HostListener, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {OriginDialogComponent} from '../dialogs-templates/origin-dialog/origin-dialog.component';
import {HeroDialogComponent} from '../dialogs-templates/hero-dialog/hero-dialog.component';

export interface Item {
	id: number;
	title?: string;
	name?: string;
	fullName?: string;
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
	selector: 'app-grid-for-tabs',
	templateUrl: './grid-for-tabs.component.html',
	styleUrls: ['./grid-for-tabs.component.css'],
})

export class GridForTabsComponent implements DoCheck {
	@Input() itemsList: Item[];
	@Input() isSearchActive;
	@Input() component: 'series' | 'hero' | 'story' | 'event' | 'creator' | 'comics';
	breakpoint: number;
	isWindowScrolled: boolean;

	constructor(
		public dialog: MatDialog,
	) {
	}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		if ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 300) {
			this.isWindowScrolled = true;
		} else if (this.isWindowScrolled &&
			(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < 300) {
			this.isWindowScrolled = false;
		}
	}

	ngDoCheck(): void {
		this.setBreakpoint();
	}

	setBreakpoint() {
		switch (true) {
			case window.innerWidth > 1800:
				this.breakpoint = 6;

				break;


			case window.innerWidth > 1300:
				this.breakpoint = 5;

				break;

			case window.innerWidth > 1050:
				this.breakpoint = 4;

				break;

			case window.innerWidth > 600:
				this.breakpoint = 2;

				break;

			case window.innerWidth < 800:
				this.breakpoint = 1;
		}
	}

	openDialog(selectedItem: Item) {
		switch (true) {
			case this.component === 'story':
				return;

			case this.component === 'hero':
				HeroDialogComponent.open(this.dialog, selectedItem);

				break;

			default:
				OriginDialogComponent.open(this.dialog, selectedItem);
		}
	}

	scrollToTop() {
		(function smoothscroll() {
			let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

			if (currentScroll > 0) {
				window.requestAnimationFrame(smoothscroll);
				window.scrollTo(0, currentScroll - (currentScroll / 10));
			}
		})();
	}
}
