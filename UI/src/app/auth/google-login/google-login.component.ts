import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'google-login',
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.scss'
})
export class GoogleLoginComponent implements OnInit {
  constructor(private authService: SocialAuthService, private apiService: ApiService,private router: Router){

  }

  ngOnInit(){
    this.apiService.userStatus.subscribe(status => {
      if (status === 'loggedOff') {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      }
    });
  
    this.authService.authState.subscribe({
      next: (result) => {
        if(result){
          console.log("token from google console:", result);
          this.apiService.googleLogin(result.idToken).subscribe((res: any) => {
            if (res.token) {
              console.log("Response from api to frontend token:", res);
              localStorage.setItem('access_token', res.token);
              this.apiService.userStatus.next("loggedIn");
              this.router.navigateByUrl("/home");
            } else {
              this.router.navigateByUrl("/login");
              this.apiService.logOut();
            }
          });
        }else{
          this.router.navigateByUrl("/login");
          this.apiService.logOut();
        }

      }
    });
  }
}
