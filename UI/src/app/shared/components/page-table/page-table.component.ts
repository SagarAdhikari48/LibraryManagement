import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountStatus, Order, User } from '../../../models/models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-table',
  templateUrl: './page-table.component.html',
  styleUrl: './page-table.component.scss'
})
export class PageTableComponent {
  @Input()
  columns: string[] = [];

  @Input()
  dataSource: any[] = [];

  @Output()
  approve = new EventEmitter<User>();

  @Output()
  unblock = new EventEmitter<User>();

  constructor(private apiService: ApiService) {}

  getFineToPay(order: Order) {
    return this.apiService.getFine(order);
  }

  getAccountStatus(status: AccountStatus) {
    return AccountStatus[status];
  }
}
