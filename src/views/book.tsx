import { useEffect, useMemo, useState, useRef } from "react";
// removed unused extractor imports; bookImporter handles extraction
import PageVisualiser from "../components/pageVisualiser/pageVisualiser.tsx";
import PageReader from "../components/pageReader/pageReader.tsx";
import { IBook, importBookFromFile } from "../utils/bookImporter/bookImporter.ts";
const defaultWpm = 400;



export default function Book() {
  const [book, setBook] = useState<IBook| null>(null);
  const [startPage, setStartPage] = useState(1);       // 1-based do inputa
  const [pageIdx, setPageIdx] = useState(0);           // 0-based indeks strony
  const [wordIdx, setWordIdx] = useState(0);           // 0-based indeks słowa na stronie
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(defaultWpm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Wgraj PDF, aby zacząć");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  

  const pages = useMemo(() => book?.pages || [], [book]);

  const safeStart = useMemo(
    () => (pages.length ? Math.min(Math.max(startPage, 1), pages.length) : 1),
    [pages.length, startPage],
  );

  const currentPageWords = pages[pageIdx]?.words || [];
  const currentWord = currentPageWords[wordIdx] || "";
  const msPerWord = Math.round(60000 / wpm);

  const numberOfWordsInPages = useMemo(() => {
    return pages.map(page => page.words.length);
  }, [pages]);

  const totalWordsUpToPage = useMemo(() => {
    const totals = [];
    let acc = 0;
    for (const count of numberOfWordsInPages) {
      totals.push(acc);
      acc += count;
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


  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setError("");
    setStatus("Wczytywanie pliku...");
    setIsPlaying(false);
    try {
      const importedBook = await importBookFromFile(file);
      console.log(importedBook)
      setBook(importedBook);
      setStartPage(1);
      setPageIdx(0);
      setWordIdx(0);
      setStatus(`Wczytano ${importedBook.pages.length} stron/rozdziałów`);
      setFileName(file.name);
    } catch (err) {
      setError("Nie udało się odczytać pliku. Upewnij się, że plik jest poprawny.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPageChange = (value: number) => {
    if (!pages.length) return;
    const next = Math.min(Math.max(value, 1), pages.length);
    setStartPage(next);
    setPageIdx(next - 1);
    setWordIdx(0);
    setIsPlaying(false);
  };

  return (
    

      <main className="layout flex gap-4 flex-col">
        <div className="flex gap-4 flex-col">
          <section className="controls">
            <img src={book?.coverImageURL || ""} alt={book?.coverImageURL} style={{maxHeight: '150px', aspectRatio: 'auto', marginBottom: '10px'}}/>
            <div className="control-group">
              <label className="label">Plik PDF lub EPUB</label>
              <input
                id="file-input"
                type="file"
                accept="application/pdf,application/epub+zip,.epub"
                onChange={(e) => handleFile(e.target.files?.[0] as File)}
                style={{display: "none"}}
              />
              <button
                className="btn primary w-30"
                onClick={() => document.getElementById("file-input")?.click()}
                disabled={loading}
              >
                Wgraj plik
              </button>

              <p className="hint">
                Wgraj plik, a następnie wybierz stronę/rozdział startowy i
                prędkość.
              </p>
            </div>

            <div className="control-group">
              <label className="label" htmlFor="wpm-range">
                Prędkość: {wpm} słów/min (ok. {msPerWord} ms)
              </label>
              <input
                id="wpm-range"
                type="range"
                min="120"
                max="1200"
                step="10"
                value={wpm}
                onChange={(e) => setWpm(Number(e.target.value))}
              />
            </div>

            <div className="control-grid">
              <div className="control-group">
                <label className="label">Strona startowa</label>
                <input
                  type="number"
                  min="1"
                  max={pages.length || 1}
                  value={startPage}
                  onChange={(e) => handleStartPageChange(Number(e.target.value))}
                  disabled={!pages.length}
                />
                <p className="hint">
                  {pages.length ? `z ${pages.length} stron` : "Wgraj PDF"}
                </p>
              </div>

              <div className="control-group buttons">
                <button
                  className="btn primary"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  disabled={(!currentPageWords.length && pageIdx === pages.length) || loading}
                >
                  {isPlaying ? "Pauza" : "Start"}
                </button>
                <button
                  className="btn ghost"
                  onClick={() => {
                    setWordIdx(0);
                    setIsPlaying(false);
                  }}
                  disabled={!currentPageWords.length}
                >
                  Restart
                </button>
              </div>
            </div>

            <div className="status">
              {loading ? "Przetwarzanie..." : error || status}
            </div>
          </section>

          <PageReader
            currentWord={currentWord}
            wordsLength={totalWordsUpToPage[totalWordsUpToPage.length-1]}
            currentIndex={totalWordsUpToPage[pageIdx] + wordIdx}
          />

        </div>
        <section className="page-visualisation">
          <PageVisualiser
            pageCount={pages.length}
            words={currentPageWords}
            highlightIndex={wordIdx}
            page={pageIdx}
            mode="preview"
            onChangePage={(page) => handleStartPageChange(page + 1)}
          />
        </section>
      </main>
  );
}
