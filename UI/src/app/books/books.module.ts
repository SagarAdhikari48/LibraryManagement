import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksStoreComponent } from './books-store/books-store.component';
import { SharedModule } from '../shared/shared.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ReturnedBooksComponent } from './returned-books/returned-books.component';

@NgModule({
  declarations: [
    BooksStoreComponent,
    MaintenanceComponent,
    ReturnedBooksComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class BooksModule { }
