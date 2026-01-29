import { useEffect, useMemo, useState, useRef } from "react";
// removed unused extractor imports; bookImporter handles extraction
import * as bookImporter from "./components/bookImporter/bookImporter.tsx";
import PageVisualiser from "./components/pageVisualiser/pageVisualiser.tsx";
import PageReader from "./components/pageReader/pageReader.tsx";
const defaultWpm = 400;



export default function App() {
  const [book, setBook] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const pageOffsets = useMemo(() => {
    const offsets = [];
    let acc = 0;
    for (const page of pages) {
      const start = acc;
      const end = acc + page.length;
      offsets.push({ start, end });
      acc = end;
    }
    return offsets;
  }, [pages]);

  const words = useMemo(() => {
    if (!pages.length) return [];
    const safeStart = Math.min(Math.max(startPage, 1), pages.length);
    return pages.slice(safeStart - 1).flat();
  }, [pages, startPage]);

  const currentPageIndex = useMemo(() => {
    if (!pages.length) return 0;
    const globalIndex = currentIndex;
    for (let i = 0; i < pageOffsets.length; i++) {
      const { start, end } = pageOffsets[i];
      if (globalIndex >= start && globalIndex < end) {
        return i;
      }
    }
    return pageOffsets.length - 1;
  }, [currentIndex, pageOffsets]);


  useEffect(() => {
    if (!isPlaying || !words.length) return undefined;
    const delay = Math.max(40, Math.round(60000 / wpm));
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= words.length) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, delay);
    return () => clearInterval(timer);
  }, [isPlaying, words.length, wpm, words]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [startPage, pages]);


  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    setStatus("Wczytywanie pliku...");
    setIsPlaying(false);
    try {
      const importedBook = await bookImporter.importBookFromFile(file);
      setBook(importedBook);
      setStartPage(1);
      setCurrentIndex(0);
      setStatus(`Wczytano ${importedBook.pages.length} stron/rozdziałów`);
      setFileName(file.name);
    } catch (err) {
      setError("Nie udało się odczytać pliku. Upewnij się, że plik jest poprawny.");
      console.error(err);
    } finally {
      setLoading(false);
    }


  };

  const handleStartPageChange = (value) => {
    if (!pages.length) return;
    const next = Math.min(Math.max(value, 1), pages.length);
    setStartPage(next);
  };

  const currentWord = words[currentIndex] || "";
  const msPerWord = Math.round(60000 / wpm);



  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand">Fast Reading</div>
        <div className="file-info">{fileName || "Brak pliku"}</div>
      </header>

      <main className="layout flex gap-4 flex-col">
        <div className="flex gap-4 flex-col">
          <section className="controls">
            <img src={book?.coverImageURL || ""} alt={book?.coverImageURL} style={{maxHeight: '150px', aspectRatio: 'auto', marginBottom: '10px'}}/>
            <div className="control-group">
              <label className="label">Plik PDF lub EPUB</label>
              <input
                type="file"
                accept="application/pdf,application/epub+zip,.epub"
                onChange={(e) => handleFile(e.target.files?.[0])}
                disabled={loading}
              />
              <p className="hint">
                Wgraj plik, a następnie wybierz stronę/rozdział startowy i
                prędkość.
              </p>
            </div>

            <div className="control-group">
              <label className="label">
                Prędkość: {wpm} słów/min (ok. {msPerWord} ms)
              </label>
              <input
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
                  disabled={!words.length || loading}
                >
                  {isPlaying ? "Pauza" : "Start"}
                </button>
                <button
                  className="btn ghost"
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsPlaying(false);
                  }}
                  disabled={!words.length}
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
            wordsLength={words.length}
            currentIndex={currentIndex}
          />

        </div>
        <section className="page-visualisation">
          <PageVisualiser
            pageCount={pages.length}
            words={pages[safeStart - 1] || []}
            highlightIndex={currentIndex - (pageOffsets[safeStart - 1]?.start || 0)}
            page={currentPageIndex + safeStart - 1}
            mode="preview"
          />
        </section>
      </main>
    </div>
  );
}
