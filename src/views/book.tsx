import PageVisualiser from "../components/pageVisualiser/pageVisualiser.tsx";
import WordDisplay from "../components/wordDisplay/wordDisplay.tsx";
import { useParams } from "react-router";
import { useReadingEngine } from "../hooks/useReadingEngine.ts";
import ReadingPanel from "../components/readingPanel/readingPanel.tsx";
import { useGetBook } from "../hooks/useGetBook.ts";
import { useEffect, useState } from "react";
import { IBook } from "../utils/bookImporter/bookImporter.ts";
import { saveEntry } from "../db/db.ts";
import { useEditBook } from "../hooks/useEditBook.ts";



export default function Book() {

  const { id } = useParams();

  const { book, refetch } = useGetBook(id);

  const {wpm, setWpm, setWordIdx, pages, startPage, handleStartPageChange, isPlaying, setIsPlaying, currentPageWords, totalWordsUpToPage, pageIdx, wordIdx, currentWord} = useReadingEngine(book);

  const [editing, setEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<number | null>(null);

  const {addPage, editPage, deletePage} = useEditBook(book);

  useEffect(() => {
    setIsPlaying(false);
  }, [editing, editingPage]);

  return (
    

      <main className="layout flex gap-4 flex-col">
        
        <ReadingPanel 
        isEditing={editing}
        title={book?.title || "No title"}
          allowRead={!!pages.length && !editing && editingPage === null}
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

          onAddPage={() => {
            const nextPagesCount = pages.length + 1;
            addPage(pageIdx);
            refetch();
            handleStartPageChange(pageIdx + 2, nextPagesCount);
          }}
          onDeletePage={(pageIdx) => {
            deletePage(pageIdx);
            refetch();
            if (pageIdx >= pages.length - 1) {
              handleStartPageChange(pages.length - 1);
            } else {
              handleStartPageChange(pageIdx + 1);
            }
          }}
          onChangeMode={(newMode) => {
            if (newMode === 'edit') {
              console.log("edit page", pageIdx);
              setEditingPage(pageIdx);
            } else {
              setEditingPage(null);
            }
          }}
          onSaveChanges={(newWords: string[]) => {
            if (editingPage === null) return;
            editPage(editingPage, newWords.join(" "));
            setEditingPage(null);
            refetch();
            setWordIdx(0);
          }}
          allowDeletePage={pages.length > 1}
            pageCount={pages.length}
            words={currentPageWords}
            highlightIndex={wordIdx}
            page={pageIdx}
            mode={editingPage !== null ? "edit" : "preview"}
            onChangePage={(page) => handleStartPageChange(page)}


          />
      </main>
  );
}
