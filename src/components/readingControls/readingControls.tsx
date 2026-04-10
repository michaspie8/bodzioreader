import { Icon } from "@iconify/react";
import { useRef } from "react";


const ReadingControls = ({
  title,
    wpm,
    pageIdx,
    maxPage,
    allowRead = true,
    isPlaying = false,
    isEditing = false,
    onWpmChange = () => {},
    onSwitchPlaying = () => {},
    onRestart = () => {},
    onPageChange = () => {},
    onTitleEditChange = () => {},
    onTitleSave = () => {}
}: {
  title: string;
    wpm: number;
    pageIdx: number;
    maxPage: number;
    allowRead: boolean;
    isPlaying: boolean;
    isEditing: boolean;
    onSwitchPlaying?: () => void;
    onRestart?: () => void;
    onWpmChange?: (newWpm: number) => void;
    onTitleEditChange?: (value: boolean) => void;
    onTitleSave?: (newTitle: string) => void;
    onPageChange?: (newPage: number) => void;
}) => {


const msPerWord = Math.round(60000 / wpm);

const inputRef = useRef<HTMLInputElement>(null);

return <section className="controls">

  <div className="flex gap-2 align-center">

  {isEditing ? (
    <>
      <input
      ref={inputRef}
       
              className="text-input rounded-md w-fit py-1 px-2 text-xl" 
        type="text"
        defaultValue={title}
        onKeyDown={(e) => {
          if (e.key == 'Enter'){
            onTitleSave((e.target as HTMLInputElement).value);
          }
          if (e.key === 'Escape') {
            onTitleEditChange(false);
          }
        }}
       
        onBlur={(e) => {
          onTitleSave(e.target.value)}
        }
      />
    </>
  ) : (
    <>
      <h2 className="text-xl">{title}</h2>
      <button className="text-muted hover:text-text transition-all" onClick={() => {
        setTimeout(() => inputRef.current?.focus(), 0);
        onTitleEditChange(true);
      }
        }>
        <Icon icon="material-symbols:edit-square-outline-rounded" height={24}></Icon>
      </button>
    </>
  )}
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
                defaultValue={wpm}
                onChange={(e) => onWpmChange(Number(e.target.value))}
              />
            </div>

            <div className="control-grid">
              <div className="control-group">
                <label className="label">Strona startowa</label>
                <input
                  type="number"
                  min="1"
                  max={maxPage || 1}
                  defaultValue={pageIdx + 1}
                  onChange={(e) => {
                    onPageChange(Number(e.target.value) - 1);
                    if (Number(e.target.value) > maxPage) e.target.value = String(maxPage);
                }}
                  disabled={maxPage <= 1}
                />
                <p className="hint">
                  {`z ${maxPage} stron`}
                </p>
              </div>

              <div className="control-group buttons">
                <button
                  className="btn primary"
                  onClick={() => onSwitchPlaying()}
                  disabled={!allowRead}
                >
                  {isPlaying ? "Pauza" : "Start"}
                </button>
                <button
                  className="btn ghost"
                  onClick={() => {
                    onRestart();
                  }}
                  disabled={!allowRead}
                >
                  Restart
                </button>
              </div>
            </div>
          </section>



}

export default ReadingControls;