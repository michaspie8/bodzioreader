import { useEffect, useMemo, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import ePub from "epubjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const defaultWpm = 400;

function splitWords(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function cleanText(text) {
  return text.normalize("NFKC");
}

function highlightWord(word) {
  if (!word) return null;
  const wordWithoutPunctuationAtEnd = word.replace(/[.,!?;:]+$/g, "");
  const middleIndex = Math.floor(wordWithoutPunctuationAtEnd.length / 2);
  const left = word.slice(0, middleIndex);
  const middle = word[middleIndex] ?? "";
  const right = word.slice(middleIndex + 1);
  return (
    <div className="word">
      <span>{left}</span>
      <span className="word-middle">
        <div>^</div>
        {middle}
        <div>^</div>
        </span>
      <span>{right}</span>
    </div>
  );
}

function isEpub(file) {
  return file?.type === "application/epub+zip" || file?.name?.toLowerCase().endsWith(".epub");
}

async function extractPdfPages(buffer) {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const collected = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    collected.push(splitWords(cleanText(pageText)));
  }
  return { pages: collected, pageCount: pdf.numPages };
}

async function extractEpubPages(buffer) {
  const book = ePub(buffer);
  const spine = await book.loaded.spine;
  const items = spine?.spineItems || [];
  const pages = [];

  for (const item of items) {
    const section = await item.load(book.load.bind(book));
    const text = section?.body?.textContent || "";
    pages.push(splitWords(cleanText(text)));
    item.unload();
  }

  return { pages, pageCount: pages.length };
}

export default function App() {
  const [pages, setPages] = useState([]); // array of word arrays per page
  const [pageCount, setPageCount] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(defaultWpm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Wgraj PDF, aby zacząć");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const words = useMemo(() => {
    if (!pages.length) return [];
    const safeStart = Math.min(Math.max(startPage, 1), pages.length);
    return pages.slice(safeStart - 1).flat();
  }, [pages, startPage]);

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
    setError("");
    setLoading(true);
    setStatus("Wczytywanie pliku...");
    setIsPlaying(false);
    try {
      const buffer = await file.arrayBuffer();

      const extractor = isEpub(file) ? extractEpubPages : extractPdfPages;
      const { pages: collected, pageCount: total } = await extractor(buffer);

      setPageCount(total);
      setPages(collected);
      setStartPage(1);
      setCurrentIndex(0);
      setStatus(`Wczytano ${total} stron/rozdziałów`);
      setFileName(file.name);
    } catch (err) {
      setError(
        isEpub(file)
          ? "Nie udało się odczytać EPUB. Upewnij się, że plik nie jest poprawny."
          : "Nie udało się odczytać PDF. Upewnij się, że plik nie jest zabezpieczony."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPageChange = (value) => {
    if (!pageCount) return;
    const next = Math.min(Math.max(value, 1), pageCount);
    setStartPage(next);
  };

  const currentWord = words[currentIndex] || "";
  const msPerWord = Math.round(60000 / wpm);

  const visualisePage = async () => {
    const page = pages[startPage - 1];
    if (!page) return null;
    /*idea: podgląd strony pdfa/epuba z podświetlonym aktualnym słowem,
    trzeba by albo znaleźć renderer do canvasa albo generować html, dlatego ściągnąłem 
    pdf2html

    trzeba znalezc cos do epuba np
    https://github.com/readium

    i oczywiscie zainplementowac dzialane pdf2html
    */
  }




  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand">Fast Reading</div>
        <div className="file-info">{fileName || "Brak pliku"}</div>
      </header>

      <main className="layout">
        <section className="controls">
          <div className="control-group">
            <label className="label">Plik PDF lub EPUB</label>
            <input
              type="file"
              accept="application/pdf,application/epub+zip,.epub"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={loading}
            />
            <p className="hint">Wgraj plik, a następnie wybierz stronę/rozdział startowy i prędkość.</p>
          </div>

          <div className="control-group">
            <label className="label">Prędkość: {wpm} słów/min (ok. {msPerWord} ms)</label>
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
                max={pageCount || 1}
                value={startPage}
                onChange={(e) => handleStartPageChange(Number(e.target.value))}
                disabled={!pageCount}
              />
              <p className="hint">{pageCount ? `z ${pageCount} stron` : "Wgraj PDF"}</p>
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

        <section className="reader">
          <div className="word-box">
            {highlightWord(currentWord) || ""}
            </div>
          <div className="progress">
            <span>
              {words.length ? `${currentIndex + 1} / ${words.length} słów` : "Brak danych"}
            </span>
          </div>
        </section>
        <section className="pdf-visualisation">
            {visualisePage()}
        </section>
      </main>
    </div>
  );
}
