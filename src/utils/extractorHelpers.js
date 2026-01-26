export function splitWords(text) {
    return text
        .replace(/\s+/g, " ")
        .replace(/\u00a0/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean);
}

//
export function cleanText(text) {
    return text.normalize("NFKC");
}