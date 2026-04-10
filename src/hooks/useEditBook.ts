import { saveEntry } from "../db/db";
import { IBook } from "../utils/bookImporter/bookImporter";

export const useEditBook = (book: IBook | null) => {
    const editPage = (pageIdx: number, updatedPage: string) => {

        const page = updatedPage.split(" ");
        const updatedPages = book?.pages.map((p, idx) => idx === pageIdx ? {words: page} : p) || [];
        const updatedBook = {...book, pages: updatedPages, lastEdited: new Date()} as IBook;

        saveEntry(updatedBook);
    }

    const addPage = (pageIdx: number) => {
        if (!book) return;
        const newPage = { words: [] };
        const updatedPages = [...book.pages];
        updatedPages.splice(pageIdx + 1, 0, newPage);
        const updatedBook = { ...book, pages: updatedPages, lastEdited: new Date() } as IBook;
        
        saveEntry(updatedBook);
    }

    const deletePage = (pageIdx: number) => {
        const updatedPages = book?.pages.filter((_, idx) => idx !== pageIdx) || [];
        const updatedBook = {...book, pages: updatedPages, lastEdited: new Date()} as IBook;

        saveEntry(updatedBook);
    }

    return {editPage, addPage, deletePage};
}