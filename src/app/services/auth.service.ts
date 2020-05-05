import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class AuthService {
	activeUser: {
		name: string,
		password: number,
	};

	setAuthFlag() {
		sessionStorage.setItem('activeUser', JSON.stringify(this.activeUser));
	}

	checkAuthFlag() {
		if (JSON.parse(sessionStorage.getItem('activeUser'))) {
			this.activeUser = JSON.parse(sessionStorage.getItem('activeUser'));

			return true;
		}

		return null;
	}

	getData(key: string) {
		if (JSON.parse(localStorage.getItem(key))) {
			this.activeUser = JSON.parse(localStorage.getItem(key));

			return this.activeUser.password;
		}

		return null;
	}

	setData(email: string, password: string, name: string): void {
		localStorage.setItem(email, JSON.stringify({
			password: password,
			name: name,
		}));
	}
}
