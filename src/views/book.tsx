import PageVisualiser from "../components/pageVisualiser/pageVisualiser.tsx";
import WordDisplay from "../components/wordDisplay/wordDisplay.tsx";
import { useParams } from "react-router";
import { useReadingEngine } from "../hooks/useReadingEngine.ts";
import ReadingPanel from "../components/readingPanel/readingPanel.tsx";
import { useGetBook } from "../hooks/useGetBook.ts";
import { useEffect, useState } from "react";
import { IBook } from "../utils/bookImporter/bookImporter.ts";
import { saveEntry } from "../db/db.ts";



export default function Book() {

  const { id } = useParams();

  const { book, refetch } = useGetBook(id);

  const {wpm, setWpm, setWordIdx, pages, startPage, handleStartPageChange, isPlaying, setIsPlaying, currentPageWords, totalWordsUpToPage, pageIdx, wordIdx, currentWord} = useReadingEngine(book);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    
  }, [editing])

  return (
    

      <main className="layout flex gap-4 flex-col">
        
        <ReadingPanel 
        isEditing={editing}
        title={book?.title || "No title"}
          allowRead={!!pages.length && !editing}
          word={currentWord}
          wordIdx={wordIdx}
          maxPage={pages.length}
          pageIdx={pageIdx}
          wpm={wpm}
          isPlaying={isPlaying}
          onWpmChange={(newWpm) => setWpm(newWpm)}
          onSwitchPlaying={() => setIsPlaying((p) => !p)}
          onRestart={() => {
            setWordIdx(0);
            setIsPlaying(false);
          }}
          onPageChange={(newPageIdx) => handleStartPageChange(newPageIdx + 1)}
          totalWords={totalWordsUpToPage[totalWordsUpToPage.length - 1]}
          totalWordsUpToThisPage={totalWordsUpToPage[pageIdx] || 0}
          onTitleEditChange={(value) => setEditing(value)}
          onTitleSave={async (newTitle) => {
            if (!editing) return;
            setEditing(false);

            const updatedBook = {...book, title: newTitle} as IBook;

            saveEntry(updatedBook);
            refetch();

          }}
        />
        
          <PageVisualiser
            pageCount={pages.length}
            words={currentPageWords}
            highlightIndex={wordIdx}
            page={pageIdx}
            mode="preview"
            onChangePage={(page) => handleStartPageChange(page)}
          />
      </main>
  );
}
