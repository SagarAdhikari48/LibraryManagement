import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserordersComponent } from './userorders/userorders.component';
import { SharedModule } from '../shared/shared.module';
import { PageTableComponent } from "../shared/components/page-table/page-table.component";
import { ProfileComponent } from './profile/profile.component';
import { ApprovalRequestComponent } from './approval-request/approval-request.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { ViewUsersComponent } from './view-users/view-users.component';

@NgModule({
  declarations: [
    UserordersComponent,
    ProfileComponent,
    ApprovalRequestComponent,
    AllOrdersComponent,
    ViewUsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
]
})
export class UsersModule { }
