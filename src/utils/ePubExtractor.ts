import ePub from "epubjs";
import { cleanText, splitWords } from "./extractorHelpers";



export async function extractEpubPages(buffer: ArrayBuffer) {
    
     const book : any = ePub(buffer);
    const spine = await book.loaded.spine;
    const metadata = await book.loaded.metadata;
    const author = metadata.creator;
    let isbn = metadata.identifier;
    //check if isbn is a valid isbn number, else set to undefined
    isbn = /^\d{10}(\d{3})?$/.test(isbn) ? isbn : undefined;
    
    const title = metadata.title;
    const items = spine.spineItems || [];
    const pages = [];
    const pagesRaw = []; //pages with formatting of original file, for visualisation

    for (const item of items) {
        const content : any = await item.load(book.load.bind(book));
        if(content.length === 0) continue;
        
        //content is HTMLElement object
        const html = content as HTMLElement;

    [".annotation",".annotations","head", "script","aside", "style", "nav", "footer", "header", "sup", "title", "h1", "h2", "h3", "h4", "h5", "h6"].forEach(tag => {
        html.querySelectorAll(tag).forEach(el => el.remove());
    });
        let text = html.innerText || "";
        //if there is no text, skip this page
        if (text.trim().length === 0) continue;

        pages.push(splitWords(cleanText(text)));
        pagesRaw.push(content);
    }
    return { pages, pageCount: pages.length, pagesRaw: pagesRaw, title, author, isbn };
}

export function isEpub(file?: File | null): boolean {
    return !!file && (
        file.type === "application/epub+zip" ||
        file.name?.toLowerCase().endsWith(".epub")
    );
}