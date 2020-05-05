import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	constructor(public authService: AuthService,
				) {
	}

	links = ['heroes', 'comics', 'creators', 'events', 'series', 'stories'];
	activeLink = this.links[0];

	logout() {
		sessionStorage.clear();
	}
}
