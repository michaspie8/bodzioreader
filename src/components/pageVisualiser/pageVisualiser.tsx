import { useState } from "react";
import "./style.css"

const PageVisualiser = ({words, pageCount} : {words: string[], pageCount: number}) => {

  const [mode, setMode] = useState<'preview' | 'edit'>('preview');

  return <div className="page-visualiser-container p-4 rounded-lg w-full">
    <header className="flex justify-between">
      {mode === 'preview' ? 'Preview' : 'Edit'}
      <div className="color-muted text-sm">Page:&nbsp;&nbsp;<input type="text" className="text-input rounded-md text-center w-12" />&nbsp;&nbsp; of {pageCount}</div>

      

      </header>
    <div></div>
    <div></div>

  </div>;
}

export default PageVisualiser;