import { Component } from '@angular/core';
import { Order } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'all-orders',
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent {
  columnForPendingReturns = [
    'orderId',
    'userIdForOrder',
    'userNameForOrder',
    'bookId',
    'orderDate',
    'fineToPay'
  ]

  columnsForCompletedReturns = [
    'orderId',
    'userIdForOrder',
    'userNameForOrder',
    'bookId',
    'orderDate',
    'returnedDate',
    'finePaid'
  ]

  showProgressBar: Boolean = false;
  ordersWithPendingReturns: Order[] = [];
  orderswithCompletedReturns: Order[] = [];

  constructor(private apiService: ApiService, private snackbar:MatSnackBar){
    this.apiService.getOrders().subscribe({
      next:(res : Order[]) =>{
        this.ordersWithPendingReturns = res.filter(o=> !o.returned);
        this.orderswithCompletedReturns =  res.filter(o => o.returned);

      },
      error: (error) =>{
        this.snackbar.open("No orders found!", "Ok")
      }
    })
  }

  sendEmails(){
    this.showProgressBar = true;
    this.apiService.sendEmails().subscribe({
      next: (res) =>{
        if(res == 'sent'){
          this.snackbar.open("The emails has been sent to respected students!", "Ok");
          this.showProgressBar = false;
        }else{
          this.snackbar.open("Emails have not sent to the students!", "Ok");
          this.showProgressBar = false;
        }
      },
      error: () =>{
        this.snackbar.open("Emails have not sent to the students!", "Ok");
        this.showProgressBar = false;
      }
    })
  }

  blockUsers(){
    this.apiService.blockOverDueFineUsers().subscribe({
      next: (res) =>{
        if(res == 'blocked'){
          this.snackbar.open("Overdue users are blocked!", "Ok");
        }else{
          this.snackbar.open("Cannot block!","Ok");
        } 
      }
    })
  }

}
