class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {
   /*      const StoredBooks = [
            {
                title: 'Book One',
                author: 'John Doe',
                isbn: '123123'
            },
            {
                title: 'Book Two',
                author: 'Jane Doe',
                isbn: '123123'
            }
        ]; */
        const books = Store.getBooks();

        books.forEach((book) => UI.addToBookList(book));
    }

    static addToBookList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el)  {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, classname)
    {
        const div = document.createElement('div');
        div.className = `alert alert-${classname}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        setTimeout(() => document.querySelector('.alert').remove(), 1000);
    }

    static resetFields(){
        document.querySelector('#title').value = null;
        document.querySelector('#author').value = null;
        document.querySelector('#isbn').value = null;
    }
}

//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }
    static addBooks(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBooks(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    // Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if(title == '' || author == '' || isbn == ''){
        //alert('Please fill in all fields');
        UI.showAlert('Please fill the missing fields','danger');
    }
    else{
         //Instantiate book
        const book = new Book(title,author,isbn);
        //Add book to UI
        UI.addToBookList(book);
        // Add books to store
        Store.addBooks(book);
        //clear form fields
        UI.resetFields();
        UI.showAlert('Book successfully added','success');
    }
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target);
    //Remove book from Store
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
    
    UI.showAlert('Book Successfully Removed','success');
})
