import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { ApiService } from './shared/services/api.service';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, AuthModule, BooksModule, UsersModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'This is app Component';

  constructor(private apiService: ApiService) {

  }

  ngOnInit(): void {
    const status = this.apiService.isLoggedIn()? "loggedIn":"loggedOff"
    this.apiService.userStatus.next(status);
  }
}
