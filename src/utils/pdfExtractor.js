import { cleanText, splitWords } from "./extractorHelpers";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

export async function extractPdfPages(buffer) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const collected = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        collected.push(splitWords(cleanText(pageText)));
    }
    return { pages: collected, pageCount: pdf.numPages, pagesRaw: collected };
}