import * as pdfUtils from "../../utils/pdfExtractor";
import * as epubUtils from "../../utils/epubExtractor";

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
    this.tryFindCoverImage();
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
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(title)}`,
        );
        if (response.ok) {
          const result = await response.json();
          const id = result?.docs?.[0]?.cover_i; // openlibrary cover id
          if (id) {
            return `https://covers.openlibrary.org/b/id/${id}-M.jpg`;
          }
        }
      } catch {
        // ignore
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
    //decide what to do with pagesRaw etc.
        resolve(new Book(title, author, pages));
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
      resolve(new Book(title, author, pages, isbn));
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
