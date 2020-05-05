import {Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.css'],
})

export class PaginationComponent {
	@Output() changeLimit = new EventEmitter;
	selectOptions = [20, 40, 60, 80, 100];
	selected = this.selectOptions[0];

	itemsPerPage() {
		this.changeLimit.emit(this.selected);
	}
}
