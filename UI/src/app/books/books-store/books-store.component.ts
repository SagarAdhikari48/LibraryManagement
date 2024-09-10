import { Component } from '@angular/core';
import { Book, BookCategory, BooksByCategory } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'books-store',
  templateUrl: './books-store.component.html',
  styleUrl: './books-store.component.scss'
})
export class BooksStoreComponent {
  books: Book[] = [];
  booksToDisplay: BooksByCategory[] = [];

  displayedColumns: string[] = [
    'id',
    'title',
    'author',
    'price',
    'available',
    'order',
  ];

  constructor(private apiService: ApiService, private snackbar: MatSnackBar){
    this.apiService.getBooks().subscribe({
      next:(res: Book[]) => {
        console.log("response:", res);
        // this.booksToDisplay = res;
        this.books = [];
        res.forEach(book =>{
          this.books.push(book);
        })

        this.updateBooksLists();

      }
    })
  }

  updateBooksLists(){
    this.booksToDisplay = [];
    for(let book of this.books){
      let categoryExists = false;
      let categoryBook : BooksByCategory | null;
      for(let bookToDisplay of this.booksToDisplay){
        if(bookToDisplay.booksCategoryId == book.bookCategoryId){
          categoryExists = true;
          categoryBook = bookToDisplay;
        }
      }
      if(categoryExists){
        categoryBook!.books.push(book);
      }else{
        this.booksToDisplay.push({
          booksCategoryId: book.bookCategoryId,
           books:[book],
           category: book.bookCategory.category,
           subCategory: book.bookCategory.subCategory
        })
      }

    }
  }


  searchBooks(value: string){
    this.updateBooksLists();
    value = value.toLocaleLowerCase();
    this.booksToDisplay = this.booksToDisplay.filter(booksToDisplay =>{
     booksToDisplay.books = booksToDisplay.books.filter(book=> {
      return book.title.toLocaleLowerCase().includes(value);
     })
     return booksToDisplay.books.length > 0
    })
    

  }

  getBookCount(){
    let count = 0;
    this.booksToDisplay.forEach(book=>{
      count += book.books
      .length
    })
return count
  }

  orderBook(book: Book){
    this.apiService.orderBooks(book).subscribe({
      next:(res) =>{
        if(res == 'ordered'){
          book.ordered = true;
          const today = new Date();
          const returnDate = new Date();
          returnDate.setDate(today.getDate() + 10);
          this.snackbar.open(`${book.title} has been oordered, you need to return this book on ${returnDate.toDateString()}`,"Ok")

        }else{
          this.snackbar.open("You already have 3 orders pending!","Ok")
        }
      }
    })
  }


}
