import { Component } from '@angular/core';
import { AccountStatus, User } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'approval-request',
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.scss'
})
export class ApprovalRequestComponent {
  columns: string[] = [
    'userId',
    'userName',
    'email',
    'userType',
    'createdOn',
    'approve',
  ];
  users: User[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    apiService.getUsers().subscribe({
      next: (res: User[]) => {
        console.log("approve unapprove user",res);
        this.users = res.filter(
          (r) => r.accountStatus == AccountStatus.UNAPPROVED
        );
      },
    });
  }

  approve(user: User) {
    this.apiService.approveRequest(user.id).subscribe({
      next: (res) => {
        if (res === 'approved') {
          this.snackBar.open(`Approved for ${user.id}`, 'OK');
        } else this.snackBar.open(`Not Approved`, 'OK');
      },
    });
  }
}
