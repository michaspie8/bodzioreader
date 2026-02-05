import * as pdfUtils from "../pdfExtractor";
import * as epubUtils from "../ePubExtractor";

export interface IBook {
  id: string;
  title: string;
  author: string;
  pages: {
    words: string[];
  }[];
  isbn?: string;
  coverImageURL?: string;
  lastEdited: Date;
};

async function tryFindCoverImage(
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


export const importPDF = async (file: File): Promise<IBook> => {
  return new Promise(async (resolve, reject) => {
    if (!file || !pdfUtils.isPdf(file)) {
      reject("Not a valid PDF file");
    }
    try {
      const extractor = pdfUtils.extractPdfPages(await file.arrayBuffer());
      const title = file.name.replace(/\.[^/.]+$/, ""); // filename without extension
      const author = "unknown";
      const pages = (await extractor).pages.map((p) => ({words: p}));
    const book: IBook = {id: Date.now().toString(), title, author, pages, lastEdited: new Date()};

      book.coverImageURL = await tryFindCoverImage(book.isbn, book.title);
      resolve(book);
    } catch (error) {
      reject(error);
    }
  })}

export const importEPUB = async (file: File): Promise<IBook> => {
  return new Promise(async (resolve, reject) => {
    if (!file || !epubUtils.isEpub(file)) {
        reject("Not a valid EPUB file");
    }
    try {
      const extractor = epubUtils.extractEpubPages(await file.arrayBuffer());
      
      const { title, author, isbn, pages } = await extractor;
      const book: IBook = {id: Date.now().toString(), title, author, pages: pages.map(p => ({words: p})), isbn, lastEdited: new Date()};
      book.coverImageURL = await tryFindCoverImage(book.isbn, book.title);
      resolve(book);
    } catch (error) {
      reject(error);
    }
    });
};

const importBookFromFile = async (file: File): Promise<IBook> => {
    if (pdfUtils.isPdf(file)) {
        return importPDF(file);
    } else if (epubUtils.isEpub(file)) {
        return importEPUB(file);
    } else {
        return Promise.reject("Unsupported file type");
    }
}

const getNewEmptyBook = (): IBook => {
  const newBook = {
      id: Date.now().toString(),
      title: "New book " 
        + new Date().toLocaleString().split(",")[0],
      author: "unknown",
      pages: [],
      lastEdited: new Date()
  };
  return newBook;
}


export { importBookFromFile, getNewEmptyBook };
