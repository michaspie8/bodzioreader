import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

const PageVisualiser = ({ words, pageCount, page, highlightIndex, mode, onChangePage: onPageChange, onChangeMode: onModeChange, onAddPage, onDeletePage = (pageIdx) => {}, onSaveChanges, allowDeletePage = true }: {
  allowDeletePage?: boolean,
  words: string[] | undefined,
  pageCount: number,
  page: number,
  highlightIndex: number,
  mode: 'preview' | 'edit',
  onChangePage?: (newPage: number) => void,
  onChangeMode?: (newMode: 'preview' | 'edit') => void,
  onAddPage?: () => void,
  onDeletePage?: (pageIdx: number) => void,
  onSaveChanges?: (newWords: string[]) => void,
}) => {
  

  const [inputWords, setInputWords] = useState<string>("");
  const [pageInputValue, setPageInputValue] = useState<string>((page + 1).toString()); // Nowy stan dla inputa strony


  useEffect(() => {
    if (mode === 'edit' && words) {
      setInputWords(words.join(' '));
    }
  }, [mode, words]);

    useEffect(() => {
    setPageInputValue((page + 1).toString());
  }, [page]);

  return <div className="p-4 rounded-lg w-full gap-4 flex flex-col border-1 border-border bg-panel">
    <header className="flex justify-between">
      {mode === 'preview' ? 'Preview' : 'Editing page'}
      {mode === 'preview' ?
        <div className="text-muted text-sm flex items-center gap-2">
          <div>
            Page:&nbsp;&nbsp;
            <input 
              type="number" 
              className="text-input rounded-md text-center w-fit py-1 no-spinbox" 
              value={pageInputValue}
              min={1} 
              max={pageCount} 
              onChange={(e) => {
                setPageInputValue(e.target.value);
              }} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const num = Number(pageInputValue);
                  if (!isNaN(num) && num >= 1 && num <= pageCount) {
                    onPageChange?.(num);
                    (e.target as HTMLInputElement).blur();
                  } else {
                    setPageInputValue((page + 1).toString());
                  }
                }
              }}
            />
            &nbsp;&nbsp; of {pageCount}
          </div>
          <div className='flex items-center gap-2'>
            <button 
              onClick={() => onPageChange?.(page)}
              disabled={page <= 0}
            >
              <Icon icon="mdi:arrow-left" height={24} className={page <= 0 ? 'text-border-light opacity-50' : ''}></Icon>
            </button>
            <button 
              className="rotate-180" 
              onClick={() => onPageChange?.(page + 2)}
              disabled={page >= pageCount - 1}
            >
              <Icon icon="mdi:arrow-left" height={24} className={page >= pageCount - 1 ? 'text-border-light opacity-50' : ''}></Icon>
            </button>
            <button onClick={onAddPage}>
              <Icon icon="mdi:plus" height={32}></Icon>
            </button>
            <button onClick={onModeChange ? () => onModeChange('edit') : undefined}>
              <Icon icon="mdi:square-edit-outline" height={24}></Icon>
            </button>
            <button onClick={() => onDeletePage(page)} disabled={!allowDeletePage}>
              <Icon icon="mdi:trash-can-outline" height={24}></Icon>
            </button>
          </div>

        </div> : <div className='text-muted text-sm'>
          Page {page + 1} of {pageCount}
        </div>
      }



    </header>
    <div>
      {mode === 'preview' ?
        <div className="text-muted">
          {words?.slice(0, highlightIndex).join(' ') + ' '}
          <span className="text-accent">{words?.[highlightIndex]}</span>
          {' ' + words?.slice(highlightIndex + 1).join(' ')}
        </div>
        :
        <div>
          <textarea className="w-full text-input rounded-lg px-4 py-4 h-72 resize-none" value={inputWords} onChange={(e) => setInputWords(e.target.value)}></textarea>
        </div>
      }
    </div>
    {mode === 'edit' ?
      <div className='flex flex-row-reverse gap-4'>
        <button className="btn primary" onClick={() => onSaveChanges && inputWords && onSaveChanges(inputWords.split(' '))}>Save changes</button>
        <button className="btn ghost" onClick={() => onModeChange && onModeChange('preview')}>Cancel</button>
      </div>
      : undefined
    }

  </div>;
}

export default PageVisualiser;