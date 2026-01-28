import ePub from "epubjs";
import { cleanText, splitWords } from "./extractorHelpers";

export async function extractEpubPages(buffer) {
    const book = ePub(buffer);
    const spine = await book.loaded.spine;
    const title = await book.loaded.metadata.title;
    const author = await book.loaded.metadata.creator;
    const isbn = await book.loaded.metadata.identifier;
    
    const items = spine?.spineItems || [];
    const pages = [];
    const pagesRaw = []; //pages with formatting of original file, for visualisation

    for (const item of items) {
        const content = await item.load(book.load.bind(book));
        const text = content.replace(/<[^>]+>/g, " "); //remove HTML tags
        pages.push(splitWords(cleanText(text)));
        pagesRaw.push(content);
    }
    return { pages, pageCount: pages.length, pagesRaw: pagesRaw, title, author, isbn };
}

export function isEpub(file) {
    return (
        file?.type === "application/epub+zip" ||
        file?.name?.toLowerCase().endsWith(".epub")
    );
}