import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  loggedIn: Boolean = false;
  name: string = '';

  constructor(private apiService: ApiService){
    apiService.userStatus.subscribe(
      {
        next: (res) =>{
          if(res === 'loggedIn'){
            this.loggedIn = true;
            const user = apiService.getUserInfo();
            this.name = `${user?.firstName} ${user?.lastName}`
          }else{
            this.name = '';
            this.loggedIn = false;
          }
        }
      }
    )
  }

  logout() {
    this.apiService.logOut();
  }


}
