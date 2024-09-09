import { Component, OnInit } from '@angular/core';

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
  panelName: string = 'Student Panel';
  navItems: NavigationItems[] = [];

  /**
   *
   */
  constructor() {
    this.navItems = [
      { value: 'View Books', link: 'view-books' },
      { value: 'My Orders', link: 'my-orders' },
    ];
  }

  ngOnInit(): void {}
}
