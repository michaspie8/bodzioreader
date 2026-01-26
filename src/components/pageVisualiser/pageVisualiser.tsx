import { Icon } from '@iconify/react';
import "./style.css"
import { useEffect, useState } from 'react';

const PageVisualiser = ({ words, pageCount, page, highlightIndex, mode, onChangePage: onPageChange, onChangeMode: onModeChange, onAddPage, onEditPage, onDeletePage, onSaveChanges }: {
  words: string[] | undefined,
  pageCount: number,
  page: number,
  highlightIndex: number,
  mode: 'preview' | 'edit',
  onChangePage?: (newPage: number) => void,
  onChangeMode?: (newMode: 'preview' | 'edit') => void,
  onAddPage?: () => void,
  onEditPage?: () => void,
  onDeletePage?: () => void,
  onSaveChanges?: (newWords: string[]) => void,
}) => {

  const [inputWords, setInputWords] = useState<string>("");

  useEffect(() => {

    if (mode === 'edit' && words) {
      setInputWords(words.join(' '));
    }

  }, [mode, words]);

  return <div className="page-visualiser-container p-4 rounded-lg w-full gap-4 flex flex-col">
    <header className="flex justify-between">
      {mode === 'preview' ? 'Preview' : 'Editing page'}
      {mode === 'preview' ?
        <div className="color-muted text-sm flex items-center gap-2">
          <div>
            Page:&nbsp;&nbsp;<input type="text" className="text-input rounded-md text-center w-12 py-1" value={page} />&nbsp;&nbsp; of {pageCount}
          </div>
          <div className='flex items-center gap-2'>

            <button onClick={page > 1 && onPageChange ? () => onPageChange(page - 1) : undefined}>
              <Icon icon="mdi:arrow-left" height={24} className={page == 1 ? 'color-border-light' : ''}></Icon>
            </button>
            <button className="rotate-180" onClick={page < pageCount && onPageChange ? () => onPageChange(page + 1) : undefined}>
              <Icon icon="mdi:arrow-left" height={24} className={page > pageCount ? 'color-border-light' : ''}></Icon>
            </button>
            <button onClick={onAddPage}>
              <Icon icon="mdi:plus" height={32}></Icon>
            </button>
            <button onClick={onEditPage}>
              <Icon icon="mdi:square-edit-outline" height={24}></Icon>
            </button>
            <button onClick={onDeletePage}>
              <Icon icon="mdi:trash-can-outline" height={24}></Icon>
            </button>
          </div>

        </div> : <div className='color-muted text-sm'>
          Page {page} of {pageCount}
        </div>
      }



    </header>
    <div>
      {mode === 'preview' ?
        <div className="color-muted">
          {words?.slice(0, highlightIndex).join(' ') + ' '}
          <span className="color-accent">{words?.[highlightIndex]}</span>
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