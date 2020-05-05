import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class RandomBackgroundService {
	bgColor: string;
	bgClass: string;

	private themes = {
		1: {
			backgroundColor: '#070fd7',
			backgroundClass: 'bg1',
		},
		2: {
			backgroundColor: '#5e2396',
			backgroundClass: 'bg2',
		},
		3: {
			backgroundColor: '#bf6d1b',
			backgroundClass: 'bg3',
		},
		4: {
			backgroundColor: '#d42e1b',
			backgroundClass: 'bg4',
		},
	};

	constructor() {
		let resultOfRandom: number = Math.ceil(Math.random() * 4);

		this.bgColor = this.themes[resultOfRandom].backgroundColor;
		this.bgClass = this.themes[resultOfRandom].backgroundClass;
	}
}
