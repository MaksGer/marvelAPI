import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Item} from '../../grid-for-tabs/grid-for-tabs.component';

@Component({
	selector: 'app-origin-dialog',
	templateUrl: './origin-dialog.component.html',
	styleUrls: ['./origin-dialog.component.css'],
})

export class OriginDialogComponent {
	data: Item;

	static open(dialog: MatDialog, data: Item) {
		const dialogRef = dialog.open(OriginDialogComponent, {width: '33vw'});

		dialogRef.componentInstance.data = data;

		return dialogRef;
	}

	constructor(
		public dialogRef: MatDialogRef<OriginDialogComponent>,
	) { }

	close(): void {
		this.dialogRef.close();
	}
}
