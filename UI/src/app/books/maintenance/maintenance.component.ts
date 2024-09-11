import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book, BookCategory } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

export interface CategoryOption {
  displayValue: string;
  value: number;
}

@Component({
  selector: 'maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent {
  newCategory: FormGroup;
  addNewBook: FormGroup;
  deleteBook: FormControl;

  categoryOptions: CategoryOption[] = [
    { displayValue: 'Category / Subcategory', value: 1 },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackbar: MatSnackBar
  ) {
    this.newCategory = fb.group({
      category: fb.control('', [Validators.required]),
      subCategory: fb.control('', [Validators.required]),
    });

    this.addNewBook = fb.group({
      title: fb.control('', [Validators.required]),
      author: fb.control('', [Validators.required]),
      price: fb.control(0, [Validators.required]),
      category: fb.control(-1, [Validators.required]),
    });

    apiService.getCategories().subscribe({
      next: (response: BookCategory[]) => {
        response.forEach((category) => {
          // this.cat;
          this.categoryOptions.push({
            displayValue: `${category.category} / ${category.subCategory}`,
            value: Number(category.id),
          });
        });
      },
    });

    this.deleteBook = fb.control('',[Validators.required])
  }

  addNewCategory() {
    let newCategory: BookCategory = {
      id: 0,
      category: this.newCategory.get('category')?.value,
      subCategory: this.newCategory.get('subCategory')?.value,
    };
    this.apiService.addNewCategory(newCategory).subscribe({
      next: (res) => {
        console.log('Response add new category:', res);
        if (res === 'cannot insert') {
          this.snackbar.open('You have already in the list', 'Ok');
        } else {
          this.snackbar.open('Inserted!', 'Ok');
        }
      },
    });
  }

  addNewBooks() {
    let newBook: Book = {
      id: 0,
      title: this.addNewBook.get('title')?.value,
      author: this.addNewBook.get('author')?.value,
      price: this.addNewBook.get('price')?.value,
      bookCategoryId: this.addNewBook.get('category')?.value,
      bookCategory: { id: 0, category: '', subCategory: '' },
      ordered: false,
    };
    this.apiService.addNewBook(newBook).subscribe({
      next: (res) => {
        console.log('res', res);
        if (res == 'Inserted') {
          this.snackbar.open('Book inserted successfully!', 'Ok');
        } else {
          this.snackbar.open('Unable to add book!', 'Ok');
        }
      },
    });
  }

  deleteExistingBook(){
   let id = this.deleteBook?.value;
    this.apiService.deleteBook(Number(id)).subscribe({
      next: (res)=>{
        console.log("delete book",res)
        if(res == 'deleted'){
          this.snackbar.open("Book deleted successfully!","Ok")
        }else{
          this.snackbar.open("Book not  found!", "Ok");
        }
      }
    })
  }
}
