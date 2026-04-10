import { useEffect, useMemo, useState, useRef } from "react";
import WordDisplay from "../wordDisplay/wordDisplay.tsx";
import { IBook } from "../../utils/bookImporter/bookImporter.ts";
import { useParams } from "react-router";
import { getEntry } from "../../db/db.ts";
import ReadingControls from "../readingControls/readingControls.tsx";
const defaultWpm = 400;



export default function ReadingPanel({
  title, 
  allowRead = true, 
  word, 
  wordIdx, 
  maxPage, 
  pageIdx, 
  wpm, 
  isPlaying, 
  onWpmChange, 
  onSwitchPlaying, 
  onRestart, 
  onPageChange, 
  totalWords, 
  totalWordsUpToThisPage, 
  onTitleEditChange, 
  onTitleSave,
  isEditing

}: {
    title: string;
    allowRead?: boolean;
    word: string;
    wordIdx: number;
    maxPage: number;
    pageIdx: number;
    wpm: number;
    isPlaying: boolean;
    totalWords: number;
    isEditing: boolean;
    totalWordsUpToThisPage: number;
    onTitleEditChange?: (value: boolean) => void;
    onTitleSave?: (newTitle: string) => void;
    onWpmChange: (newWpm: number) => void;
    onSwitchPlaying: () => void;
    onRestart: () => void;
    onPageChange: (newPageIdx: number) => void;
}) {

  return (
    

        <div className="flex gap-4 flex-col">

          <ReadingControls 
            title={title}
            wpm={wpm}
            pageIdx={pageIdx}
            maxPage={maxPage}
            allowRead={allowRead}
            isPlaying={isPlaying}
            onWpmChange={onWpmChange}
            onSwitchPlaying={onSwitchPlaying}
            onRestart={onRestart}
            onPageChange={onPageChange}
            onTitleEditChange={onTitleEditChange}
            onTitleSave={onTitleSave}
            isEditing={isEditing}
          
          />

          <WordDisplay
            currentWord={word}
            wordsLength={totalWords}
            currentIndex={
              pageIdx === 0 ? wordIdx :
              totalWordsUpToThisPage + wordIdx}
          />

        </div>
  );
}