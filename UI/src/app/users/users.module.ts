import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserordersComponent } from './userorders/userorders.component';
import { SharedModule } from '../shared/shared.module';
import { PageTableComponent } from "../shared/components/page-table/page-table.component";
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    UserordersComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PageTableComponent
]
})
export class UsersModule { }
