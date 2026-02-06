import { useEffect, useRef, useState } from "react";
import SlidingNavbar from "../slidingNavbar/slidingNavbar";
import { Icon } from "@iconify/react";
import { getNewEmptyBook, IBook, importBookFromFile } from "../../utils/bookImporter/bookImporter";
import { saveEntry } from "../../db/db";
import { useNavigate } from "react-router";
import FileCatcher from "../fileCatcher/fileCatcher";

const CreateBookForm = ({onCancel, onNewBook} : {onCancel?: () => void, onNewBook?: (book: IBook) => void}) => {

    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const allowSubmit = () => {
        return selectedIndex === 1 || selectedFile !== null;
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDragFileContainerClick = () => {
        fileInputRef.current?.click();
    }

    useEffect(() => {
        if (selectedIndex === 1) {
            setError(null);
            setSelectedFile(null);
        }
    }, [selectedIndex]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let newBook: IBook;

        if (selectedFile) {
            try {
                newBook = await importBookFromFile(selectedFile);
            } catch (error) {

                setError(error instanceof Error ? error.message : String(error));

                return;
            }
            
            saveEntry(newBook);
        
        } else {
            newBook = getNewEmptyBook();
            saveEntry(newBook);
        }

        onNewBook && onNewBook(newBook);

        navigate(`/book/${newBook.id}`);
    }

    return <>
    <SlidingNavbar buttons={
        [
            {
            name: 'Upload from file',
            onSelect: () => {
                setSelectedIndex(0);
            }
        },
        {
            name: 'Create empty',
            onSelect: () => {
                setSelectedIndex(1);
            }
        },
        ]
    } 
    selectedIndex={selectedIndex}
    />
    <FileCatcher active={selectedIndex === 0} onFileDrop={(file) => setSelectedFile(file)}/>
    <form onSubmit={onSubmit}>
        {
            (() => {
                switch(selectedIndex) {
                case 0:

                    return <div className="h-48 flex flex-col justify-center items-center text-muted cursor-pointer px-6"
                    onClick={handleDragFileContainerClick}>
                        {
                            selectedFile === null ?<> 
                            <Icon icon="material-symbols:upload-rounded" height={96}></Icon>
                            <span>Click or drag file to upload</span> 
                            </> :<>
                            <span>
                                
                            {selectedFile.name} will be imported
                            </span>
                            {
                                error && <span className="text-accent">
                                    {error}
                                </span>
                            }
                            </>
                            
                        }
                    </div>
                case 1:

                    

                    return <div className="h-48 flex justify-center items-center">
                        <span className="text-muted">Empty book will be created</span>
                    </div>
                default:
                    return null;
            }})()
        }

        <input type="file" hidden ref={fileInputRef} onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
            }
        }}></input>

        <div className="p-4 flex gap-4 flex-row-reverse border-t-1 border-border">
            <button type="submit" className="btn primary text-background px-4 py-2 rounded-lg"
            disabled={!allowSubmit()}
            >Create Book</button>
            <button type="button" className="btn ghost text-background px-4 py-2 rounded-lg" onClick={onCancel}>Cancel</button>
        </div>
        
    </form>
    </>
}

export default CreateBookForm;