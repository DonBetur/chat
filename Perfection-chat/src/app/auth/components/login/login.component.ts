import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

	form = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(null, [Validators.required])
	});

  constructor(
		private readonly authService: AuthService
	) {
		// Это заглушка с данными авторизации по умолчанию
		this.form.setValue({
			email: 'name1@romashka.ru',
			password: 'name1'
		});
	}

	login(): void {
		const formValue = this.form.value;

		this.authService.login(formValue.email, formValue.password).subscribe();
	}
}
