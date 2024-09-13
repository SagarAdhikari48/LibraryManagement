import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    GoogleLoginComponent
  ],
  imports: [
    CommonModule,
    SocialLoginModule,

    GoogleSigninButtonModule,
    SharedModule,
  ]
})
export class AuthModule { }
