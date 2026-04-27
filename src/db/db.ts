import { IBook } from "../utils/bookImporter/bookImporter";
import { exampleBooks } from "../utils/exampleData";

const WORDS_KEY = 'bodzioreader_words';

export interface BaseBookData{
    id: string;
    title: string;
    lastEdited: Date;
    pageCount: number;
    wordCount: number;
    coverImage?: string;
}

export const saveEntries = (entries: IBook[]): void => {
  localStorage.setItem(WORDS_KEY, JSON.stringify(entries));
};

export const getEntries = (): IBook[] | null => {
  

  const entries = localStorage.getItem(WORDS_KEY);
    if (!entries) {
        return null;
    }

    const parsed = JSON.parse(entries) as IBook[];

    parsed.forEach((entry: any) => {
        entry.lastEdited = new Date(entry.lastEdited);
    });

    return parsed;
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
        coverImage: entry.coverImageURL,
    }));
}

export const getEntry = (id: string): IBook | null => {
    const entries = getEntries();
    if (!entries) {
        return null;
    }

    const entry = entries.find(e => e.id === id);
    return entry || null;
}

export const saveEntry = (entry: IBook): void => {
    const entries = getEntries() || [];
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    if (existingIndex !== -1) {
        entries[existingIndex] = entry;
    } else {
        entries.push(entry);
    }
    saveEntries(entries);
}

export const deleteEntry = (id: string): void => {
    const entries = getEntries() || [];
    const newEntries = entries.filter(e => e.id !== id);
    saveEntries(newEntries);
}