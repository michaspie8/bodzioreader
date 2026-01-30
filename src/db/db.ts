import { exampleBooks } from "../utils/exampleData";

const WORDS_KEY = 'bodzioreader_words';

export interface Book{
    id: number;
    title: string;
    lastEdited: Date;
    pages: {
        words: string[];
    }[];
}

export interface BaseBookData{
    id: number;
    title: string;
    lastEdited: Date;
    pageCount: number;
    wordCount: number;
}

export const saveEntries = (entries: Book[]): void => {
  localStorage.setItem(WORDS_KEY, JSON.stringify(entries));
};

export const getEntries = (): Book[] | null => {
  

//   const entries = localStorage.getItem(WORDS_KEY);
//     if (!entries) {
//         return null;
//     }

//     const parsed = JSON.parse(entries) as Entry[];

//     parsed.forEach((entry: any) => {
//         entry.lastEdited = new Date(entry.lastEdited);
//     });

//     return parsed;
    return exampleBooks;
};

export const getBaseData = (): BaseBookData[] | null => {
    const entries = getEntries();
    if (!entries) {
        return null;
    }

    return entries.map(entry => ({
        id: entry.id,
        title: entry.title,
        lastEdited: entry.lastEdited,
        pageCount: entry.pages.length,
        wordCount: entry.pages.reduce((acc, page) => acc + page.words.length, 0),
    }));
}

export const getEntry = (id: number): Book | null => {
    const entries = getEntries();
    if (!entries) {
        return null;
    }

    const entry = entries.find(e => e.id === id);
    return entry || null;
}

export const saveEntry = (entry: Book): void => {
    const entries = getEntries() || [];
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    if (existingIndex !== -1) {
        entries[existingIndex] = entry;
    } else {
        entries.push(entry);
    }
    saveEntries(entries);
}