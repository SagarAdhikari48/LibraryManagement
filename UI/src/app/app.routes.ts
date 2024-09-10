import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { BooksStoreComponent } from './books/books-store/books-store.component';
import { UserordersComponent } from './users/userorders/userorders.component';
import { ProfileComponent } from './users/profile/profile.component';

export const routes: Routes = [
    {path:"login", component: LoginComponent},
    {path:"register", component: RegisterComponent},
    
    {path:'home', component: BooksStoreComponent},
    {path:"my-orders", component: UserordersComponent},
    {path:"profile", component:ProfileComponent},
    {path:'**', component: PageNotFoundComponent},
];
