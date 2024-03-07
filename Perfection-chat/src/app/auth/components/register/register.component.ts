import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NewUser } from '../../models/newUser.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

	form = new FormGroup({
		firstName: new FormControl(null, [Validators.required]),
		lastName: new FormControl(null, [Validators.required]),
		middleName: new FormControl(null, [Validators.required]),
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(null, [Validators.required]),
		jobRole: new FormControl('Аниматор', [Validators.required])
	});

  constructor(
		private readonly authService: AuthService
	) { }

	register(): void {
		const formValue = this.form.value as NewUser;

		this.authService.register(formValue).subscribe();
	}

}
