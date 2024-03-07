import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './components/auth/auth.page';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
		ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule
  ],
  declarations: [
		AuthPage,
		RegisterComponent,
		LoginComponent
	]
})
export class AuthPageModule {}
