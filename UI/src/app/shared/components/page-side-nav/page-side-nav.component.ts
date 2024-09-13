import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { UserType } from '../../../models/models';

export interface NavigationItems {
  value: string;
  link: string;
}

@Component({
  selector: 'page-side-nav',
  templateUrl: './page-side-nav.component.html',
  styleUrl: './page-side-nav.component.scss',
})
export class PageSideNavComponent implements OnInit {
  panelName: string = '';
  navItems: NavigationItems[] = [];

  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.userStatus.subscribe({
      next: (status) => {
        if (status === 'loggedIn') {
          router.navigateByUrl('/home');
          const user = this.apiService.getUserInfo();
          if (user != null) {
            if (user.userType === UserType.ADMIN) {
              this.panelName = 'Admin Panel';
              this.navItems = [
                { value: 'View Books', link: '/home' },
                { value: 'Maintenance', link: '/maintenance' },
                { value: 'Return Books', link: '/return-book' },
                { value: 'View Users', link: '/view-users' },
                { value: 'Approval Request', link: '/approval-request' },
                { value: 'All Orders', link: '/all-orders' },
                { value: 'My Orders', link: '/my-orders' },
              ];
            } else if (user.userType === UserType.STUDENT) {
              this.panelName = 'Student Panel';
              this.navItems = [
                { value: 'View Book', link: '/home' },
                { value: 'My Orders', link: '/my-orders' },
              ];
            }
          }
        } else if (status === 'loggedOff') {
          this.panelName = 'Auth Panel';
          this.router.navigateByUrl('/login');
          this.navItems = [];
        }
      },
    });
  }

  ngOnInit(): void {}
}
