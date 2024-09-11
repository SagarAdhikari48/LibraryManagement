import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksStoreComponent } from './books-store/books-store.component';
import { SharedModule } from '../shared/shared.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';

@NgModule({
  declarations: [
    BooksStoreComponent,
    MaintenanceComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class BooksModule { }
