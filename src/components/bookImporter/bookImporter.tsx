import * as pdfUtils from "../../utils/pdfExtractor";
import * as epubUtils from "../../utils/ePubExtractor";

class Book {
  title: string;
  author: string;
  pages: string[][];
  isbn?: string;
  coverImageURL?: string;
  constructor(title: string, author: string, pages: string[][], isbn?: string) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isbn = isbn;
  }

  static async tryFindCoverImage(
    isbn?: string,
    title?: string,
  ): Promise<string> {
    //openlibrary cover api https://openlibrary.org/dev/docs/api/search

    if (isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    }

    if (title) {
      try {
        //change every special character to space, then multiple spaces to single space, trim, then spaces to +
        const cleantitle = title
          .replace(/[^a-zA-Z0-9\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/ /g, "+");
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(cleantitle)}`,
        );
        if (response.ok) {
          const result = await response.json();
          const id = result?.docs?.[0]?.cover_i; // openlibrary cover id
          if (id) {
            return `https://covers.openlibrary.org/b/id/${id}-M.jpg`;
          }
        }
      } catch {
        console.log("Error fetching cover image from OpenLibrary");
        console.log(title);
      }
    }

    return "/default-book-cover.webp";
  }

  async tryFindCoverImage() {
    this.coverImageURL = await Book.tryFindCoverImage(this.isbn, this.title);
  }
}

// file from html e.target.files[0];
const importPDF = async (file: File): Promise<Book> => {
  return new Promise(async (resolve, reject) => {
    if (!file || !pdfUtils.isPdf(file)) {
      reject("Not a valid PDF file");
    }
    try {
      const extractor = pdfUtils.extractPdfPages(await file.arrayBuffer());
      const title = file.name.replace(/\.[^/.]+$/, ""); // filename without extension
      const author = "unknown";
      const {pages, pageCount, pagesRaw} = await extractor;
    const book = new Book(title, author, pages);
      await book.tryFindCoverImage();
      resolve(book);
    } catch (error) {
      reject(error);
    }
  });
};

const importEPUB = async (file: File): Promise<Book> => {
  return new Promise(async (resolve, reject) => {
    if (!file || !epubUtils.isEpub(file)) {
        reject("Not a valid EPUB file");
    }
    try {
      const extractor = epubUtils.extractEpubPages(await file.arrayBuffer());
      
      const { title, author, isbn, pages } = await extractor;
      const book = new Book(title, author, pages, isbn);
      await book.tryFindCoverImage();
      resolve(book);
    } catch (error) {
      reject(error);
    }
    });
};

const importBookFromFile = async (file: File): Promise<Book> => {
    if (pdfUtils.isPdf(file)) {
        return importPDF(file);
    } else if (epubUtils.isEpub(file)) {
        return importEPUB(file);
    } else {
        return Promise.reject("Unsupported file type");
    }
}

export { Book, importBookFromFile };
