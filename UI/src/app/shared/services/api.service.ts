import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, Subject } from 'rxjs';
import { Book, BookCategory, Order, User, UserType } from '../../models/models';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = 'https://localhost:7233/api/library/';
  googleLoginBaseUrl:string = 'https://localhost:7233/api/SocialLogin/';
  userStatus: Subject<string> = new Subject();

  constructor(
    private http: HttpClient, 
    private jwt: JwtHelperService,
    private socialAuthService: SocialAuthService // Inject SocialAuthService
  ) {}

  register(user: any) {
    return this.http.post(this.baseUrl + 'Register', user, {
      responseType: 'text',
    });
  }

  login(info: any) {
    const params = new HttpParams()
      .append('email', info.email)
      .append('password', info.password);
    return this.http.get(this.baseUrl + 'Login', {
      params: params,
      responseType: 'text',
    });
  }

  isLoggedIn(): boolean {
    if (
      localStorage.getItem('access_token') != null &&
      !this.jwt.isTokenExpired()
    ) {
      return true;
    }
    return false;
  }

  getUserInfo(): User | null | undefined {
    if (!this.isLoggedIn()) {
      return null;
    }
    var decodedToken = this.jwt.decodeToken();
    var user: User = {
      id: decodedToken.id,
      firstName: decodedToken.FirstName,
      lastName: decodedToken.LastName,
      email: decodedToken.Email,
      accountStatus: decodedToken.AccountStatus,
      phoneNumber: decodedToken.PhoneNumber,
      userType: UserType[decodedToken.UserType as keyof typeof UserType], //userType:UserType["Admin"]
      createdOn: decodedToken.CreatedOn,
      password: '',
    };
    return user;
  }

  logOut() {
    localStorage.removeItem('access_token');
       // Sign out from Google if logged in through Google
       this.socialAuthService.signOut().catch(() => {
        console.error('Error during Google sign-out');
      });
  
    this.userStatus.next('loggedOff');
  }

  getBooks() {
    return this.http.get<Book[]>(this.baseUrl + 'GetBooks');
  }

  orderBooks(book: Book) {
    let userId = this.getUserInfo()!.id;
    let params = new HttpParams()
      .append('userId', userId)
      .append('bookId', book.id);

    return this.http.post(this.baseUrl + 'OrderBook', null, {
      params: params,
      responseType: 'text',
    });
  }
  getOrdersOfUser(userId: number) {
    let params = new HttpParams().append('userId', userId);
    return this.http
      .get<any>(this.baseUrl + 'GetOrdersOfUser', {
        params: params,
      })
      .pipe(
        map((orders) => {
          //map the interface of frontend
          let newOrders = orders.map((order: any) => {
            let newOrder: Order = {
              id: order.id,
              userId: order.userId,
              userName: order.user.firstName + ' ' + order.user.lastName,
              bookId: order.bookId,
              bookTitle: order.book.title,
              orderDate: order.orderedDate,
              returned: order.returned,
              returnDate: order.returnedDate,
              finePaid: order.finePaid,
            };
            return newOrder;
          });
          return newOrders;
        })
      );
  }

  getFine(order: Order) {
    const today = new Date();
    const orderedDate = new Date(Date.parse(order.orderDate));
    orderedDate.setDate(orderedDate.getDate() + 10);
    if (orderedDate.getTime() < today.getTime()) {
      var diff = today.getTime() - orderedDate.getTime();
      var days = Math.floor(diff / (1000 * 86400));
      return days * 50;
    }
    return 0;
  }

  addNewCategory(category: BookCategory) {
    return this.http.post(this.baseUrl + 'AddNewCategory', category, {
      responseType: 'text',
    });
  }

  getCategories() {
    return this.http.get<BookCategory[]>(this.baseUrl + 'GetCategories');
  }

  addNewBook(book: Book) {
    return this.http.post(this.baseUrl + 'AddNewBook', book, {
      responseType: 'text',
    });
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'DeleteBook', {
      params: new HttpParams().set('id', id.toString()), // Ensure id is a string
      responseType: 'text',
    });
  }

  returnBook(userId: string, bookId: string, fine: number) {
    return this.http.get(this.baseUrl + 'ReturnBook', {
      params: new HttpParams()
        .append('userId', userId)
        .append('bookId', bookId)
        .append('fine', fine),
      responseType: 'text',
    });
  }

  getUsers() {
    return this.http.get<User[]>(this.baseUrl + 'GetUsers');
  }

  approveRequest(userId: number) {
    return this.http.get(this.baseUrl + 'ApproveRequest', {
      params: new HttpParams().append('userId', userId),
      responseType: 'text',
    });
  }

  getOrders(){
    return this.http.get<any>(this.baseUrl + "GetOrders").pipe(
      map((orders: any)=>{

        let newOrders = orders.map((order: any) =>{
          let newOrder: Order = {
            id: order.id,
            userId: order.userId,
            userName: order.user.firstName + " " + order.user.lastName,
            bookId: order.bookId,
            bookTitle: order.book.title,
            finePaid: order.finePaid,
            orderDate: order.orderedDate,
            returnDate: order.returnedDate,
            returned: order.returned,
          };
          return newOrder;
        })
        return newOrders;
      })
    )
  }

  sendEmails(){   
    return this.http.get(this.baseUrl + "SendEmailForPendingReturns",{
      responseType: "text"
    })
  }

  blockOverDueFineUsers(){
    return this.http.get(this.baseUrl + "BlockedFineOverdueUser",{
      responseType:"text"
    })
  }

  unblock(userId: number) {
    return this.http.get(this.baseUrl + "Unblock", {
      params: new HttpParams().append("userId", userId),
      responseType: "text",
    });
  }

  googleLogin(idToken: string){
    const res = this.http.post(this.googleLoginBaseUrl + "google-login",{
      idToken: idToken
    })

    return res;
  }
}
