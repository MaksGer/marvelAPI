import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../grid-for-tabs/grid-for-tabs.component';

@Component({
	selector: 'app-story-item-card-component',
	templateUrl: './story-item-card-component.component.html',
	styleUrls: ['./story-item-card-component.component.css'],
})

export class StoryItemCardComponentComponent implements OnInit {
	@Input() data: Item;
	@Input() index: number;
	isDescrSet: boolean;
	title: string;

	ngOnInit() {
		this.title = 'Story ' + this.index;
	}

	setStory() {
		this.isDescrSet = true;
		this.title = this.data.title;
	}

	returnTitle(event) {
		event.stopPropagation();
		this.isDescrSet = false;
		this.title = 'Story ' + this.index;
	}
}
