import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required]),
      password: fb.control('', [Validators.required]),
    });
  }

  ngOnInit(){
   
  }

  login() {
    const loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.apiService.login(loginInfo).subscribe({
      next: (res) => {
        if (res === 'Not Found!') {
          this.snackBar.open('Credentials are invalid!', 'Ok');
        } else if (res === 'Unapproved') {
          this.snackBar.open(
            'Your account is not approved by Admin yet!',
            'Ok'
          );
        }else if(res === 'blocked'){
          this.snackBar.open("Your account is BLOCKED! Please go to admin office to unblock","Ok");
        }else {
          localStorage.setItem('access_token', res);
          this.apiService.userStatus.next("loggedIn");
        }
      },
    });
  }
}
