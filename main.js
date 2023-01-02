const modal = document.querySelector('#modal')
const addButton = document.getElementById('add-book');
const closeModal = document.getElementById('close')
const UNCOMPLETED_BOOK_ID = "unread";
const COMPLETED_BOOK_ID ="read";
const BOOK_ITEMID = "itemId";

const undoBookFromCompleted = (bookElement) => {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    
  const judul = bookElement.querySelector(".detail-book > h3").innerText;
  const penulis = bookElement.querySelector(".detail-book > p").innerText;
  const tahun = bookElement.querySelector(".detail-book > small").innerText;
 
  const bukubaru = makeBook(judul, penulis, tahun, false);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  bukubaru[BOOK_ITEMID] = book.id;
  
  listUncompleted.append(bukubaru);
  bookElement.remove();
  updateDataToStorage();
}
const createUnreadButton = () => {
  return createButton("unread-button", function(event){
    undoBookFromCompleted(event.target.parentElement);
  });
}
addButton.addEventListener("click", () => {
  modal.classList.toggle("modal-open")
})
closeModal.addEventListener("click", () => {
  modal.style.transition = '1s';
  modal.classList.toggle("modal-open")
})

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    modal.classList.remove("modal-open");
    addBook();
  });

  if(checkStorage()){
    loadDatafromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
  booksLength();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
  booksLength();
});

const addBook = () => {
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
  const judul = document.getElementById('title').value;
  const penulis = document.getElementById('author').value;
  const tahun = document.getElementById('year').value;
  
  const book = makeBook(judul, penulis, tahun, false)
  const bookObject = composeBookObject(judul, penulis, tahun, false)
  
  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);
  
  uncompletedBook.append(book)
  updateDataToStorage();
}
const makeBook = (title, author, year, isCompleted) => {
  
  //----------BIKIN JUDUL BUKU----------------//
  const judulbuku = document.createElement('h3');
  judulbuku.innerText = title;
  
  //----------BIKIN NAMA PENULIS----------------//
  const penulisbuku = document.createElement('p');
  penulisbuku.innerText = author;
  
  //----------BIKIN TANGGAL----------------//
  const tahunbuku = document.createElement('small');
  tahunbuku.innerText = `${year}`;
  
  //----------BIKIN DETAIL----------------//
  const detail = document.createElement('div');
  detail.classList.add('detail-book')
  detail.append(judulbuku, penulisbuku, tahunbuku)
  
  //----------BIKIN KONTAINER----------------//
  const container = document.createElement('div');
  container.classList.add('my-container');
  container.append(detail)
 
  if(isCompleted){
        container.append(
            createUnreadButton(),
            createTrashButton()
        );
    } else {
        container.append(
          createReadButton(),
          createTrashButton()
        );
    }
  return container;
}
const createButton = (buttonTypeClass, eventListener) => {
    const button  = document.createElement('button');
    button.classList.add(buttonTypeClass);
    
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}
const createReadButton = () => {
    return createButton("read-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}
const addBookToCompleted = (bookElement) => {
  const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);
  
	const judul = bookElement.querySelector(".detail-book > h3").innerText;
  const penulis = bookElement.querySelector(".detail-book > p").innerText;
  const tahun = bookElement.querySelector(".detail-book > small").innerText;
 
  const bukubaru = makeBook(judul, penulis, tahun, true);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  bukubaru[BOOK_ITEMID] = book.id;
  
  bookCompleted.append(bukubaru);
  bookElement.remove();
    
  updateDataToStorage();
} 
const removeBookFromCompleted = (bookElement)  => {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
}
const createTrashButton = () => {
    return createButton("trash-book", function(event){
        removeBookFromCompleted(event.target.parentElement);
        window.alert('Are you sure to delete this?');
    });
}