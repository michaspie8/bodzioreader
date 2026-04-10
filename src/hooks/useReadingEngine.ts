import { useEffect, useMemo, useState } from "react";
import { getEntry } from "../db/db";
import { IBook } from "../utils/bookImporter/bookImporter";

const defaultWpm = 400;

export const useReadingEngine = (book: IBook | null) => {
      const [startPage, setStartPage] = useState(1);       // 1-based do inputa
      const [pageIdx, setPageIdx] = useState(0);           // 0-based indeks strony
      const [wordIdx, setWordIdx] = useState(0);           // 0-based indeks słowa na stronie
      const [isPlaying, setIsPlaying] = useState(false);
      const [wpm, setWpm] = useState(defaultWpm);

    const pages = useMemo(() => book?.pages || [], [book]);

      

        const safeStart = useMemo(
            () => (pages.length ? Math.min(Math.max(startPage, 1), pages.length) : 1),
            [pages.length, startPage],
        );

        const currentPageWords = pages[pageIdx]?.words || [];
        const currentWord = currentPageWords[wordIdx] || "";

         const numberOfWordsInPages = useMemo(() => {
    return pages.map(page => page.words.length);
  }, [pages]);

  const totalWordsUpToPage = useMemo(() => {
    const totals = [];
    let acc = 0;
    for (const count of numberOfWordsInPages) {
      acc += count;
      totals.push(acc);
    }
    return totals;
  }, [numberOfWordsInPages]);

  useEffect(() => {
    if (!isPlaying || !pages.length) return undefined;
    const delay = Math.max(40, Math.round(60000 / wpm));
    const timer = setInterval(() => {
      setWordIdx((w) => {
        const wordsInPage = pages[pageIdx]?.words.length ?? 0;
        if (w + 1 < wordsInPage) return w + 1;

        // koniec strony -> spróbuj przejść do następnej
        setPageIdx((p) => {
          if (p + 1 < pages.length) {
            setWordIdx(0);
            return p + 1;
          }
          setIsPlaying(false);
          return p;
        });
        return w;
      });
    }, delay);
    return () => clearInterval(timer);
  }, [isPlaying, wpm, pages, pageIdx]);

  useEffect(() => {
    if (!pages.length) {
      setPageIdx(0);
      setWordIdx(0);
      setIsPlaying(false);
      return;
    }
    const nextPageIdx = safeStart - 1;
    setPageIdx(nextPageIdx);
    setWordIdx(0);
    setIsPlaying(false);
  }, [safeStart, pages]);

  const handleStartPageChange = (value: number) => {
    if (!pages.length) return;
    const next = Math.min(Math.max(value, 1), pages.length);
    setStartPage(next);
    setPageIdx(next - 1);
    setWordIdx(0);
    setIsPlaying(false);
  };

  return {
    startPage, 
    wpm, 
    pages, 
    currentPageWords,
    isPlaying,
    totalWordsUpToPage,
    pageIdx,
    wordIdx,
    currentWord,
    setWpm, 
    setWordIdx,
    setIsPlaying,
    handleStartPageChange, 
}

    }