import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth.service';
import {Event, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {RandomBackgroundService} from '../services/random-background.service';

@Component({
	selector: 'app-authentication-form',
	templateUrl: './authentication-form.component.html',
	styleUrls: ['./authentication-form.component.css', 'authentication-form-backgrounds.component.css'],
})

export class AuthenticationFormComponent implements OnInit {
	isLoginExist: boolean = true;
	formToSignUp: FormGroup;
	formToLogIn: FormGroup;
	emailPattern: string = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';
	styleObject: {
		bgColor: string;
		bgClass: string;
	};
	timeout;
	routerChanged = true;

	constructor(private _snackBar: MatSnackBar,
				private authService: AuthService,
				private router: Router,
	) {
		this.styleObject = new RandomBackgroundService();

		router.events.subscribe((event: Event) => {
			if (event instanceof NavigationStart) {
				this.routerChanged = true;
			}

			if (event instanceof NavigationEnd) {
				this.timeout = setTimeout(() => {
					clearTimeout(this.timeout);
					this.routerChanged = false;
				}, 700);
			}
		});
	}

	ngOnInit() {
		this.formToSignUp = new FormGroup({
			email: new FormControl(null, [
				Validators.pattern(this.emailPattern),
			]),
			name: new FormControl('', []),
			password: new FormControl(null, [
				Validators.minLength(8),
			]),
		});

		this.formToLogIn = new FormGroup({
			login: new FormControl('', [
				Validators.required,
				Validators.pattern(this.emailPattern),
			]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
			]),
		});
	}

	submitSignUp() {
		this.authService.setData(
			this.formToSignUp.value.email,
			this.formToSignUp.value.password,
			this.formToSignUp.value.name
		);
		this.isLoginExist = true;
		this.formToSignUp.reset();
	}

	submitLogIn() {
		let errorMessage: string;

		switch (true) {
			case this.authService.getData(this.formToLogIn.value.login) === this.formToLogIn.value.password:
				this.router.navigate(['/heroes']);
				this.authService.setAuthFlag();

				break;

			case !this.authService.getData(this.formToLogIn.value.login):
				errorMessage = 'Please check your login';

				break;

			default:
				errorMessage = 'Please check your password';
		}

		if (errorMessage) {
			this._snackBar.open(errorMessage, 'Close', {
				duration: 4000,
				verticalPosition: 'top',
				horizontalPosition: 'center',
				panelClass: 'error-snack-bar',
			});
		}
	}

	changeForm(form: FormGroup) {
		this.isLoginExist = !this.isLoginExist;
		form.reset();
	}
}
