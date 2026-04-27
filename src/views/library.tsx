import { useState } from "react";
import BookElement from "../components/bookElement/bookElement";
import Dialog from "../components/dialog/dialog";
import { getBaseData, deleteEntry, getEntries } from "../db/db"
import { exampleBooks } from "../utils/exampleData";
import CreateBookForm from "../components/createBookForm/createBookForm";
import { IBook } from "../utils/bookImporter/bookImporter";
import { useNavigate } from "react-router";
import { useEditBook } from "../hooks/useEditBook";


export default function Library() {

    const [books, setBooks] = useState(getBaseData() || []);

    const [showDialog, setShowDialog] = useState(false);
    const [showOpenDialog, setShowOpenDialog] = useState("");
    
    const onNewBookClick = () => {
        setShowDialog(true);
    }

    const onNewBookCancel = () => {
        setShowDialog(false);
    }

    const onNewBook = (newBook: IBook) => {
        setShowDialog(false);
    }

    const navigate = useNavigate();
    const onBookClick = (id: string) => {
        setShowOpenDialog(id);
    }

    const onShowCoverChange = (id: string, showCover: boolean) => {
        const entries = getEntries() || [];
        const updatedBooks = entries.map(book => book.id === id ? {...book, showCover} : book);
        localStorage.setItem("bodzioreader_words", JSON.stringify(updatedBooks));

        setBooks(getBaseData() || []);
    }

    const onCoverUrlChange = (id: string, url: string) => {
        const entries = getEntries() || [];
        const updatedBooks = entries.map(book => book.id === id ? {...book, coverImageURL: url} : book);
        localStorage.setItem("bodzioreader_words", JSON.stringify(updatedBooks));

        setBooks(getBaseData() || []);
    }


    return <main>
        <Dialog title="Adding new book" align="text-left" visible={showDialog}
        onClose={onNewBookCancel}>
            <CreateBookForm onCancel={onNewBookCancel} key={Number(showDialog)} onNewBook={onNewBook} />
        </Dialog>
        <Dialog title={books.find(b => b.id === showOpenDialog)?.title || "Book"} align="text-left" visible={showOpenDialog !== ""}
        onClose={() => setShowOpenDialog("")}>
            <div className="flex flex-col gap-4 p-4 items-start">
            <label>
                <input type="checkbox" checked={books.find(b => b.id === showOpenDialog)?.showCover} onChange={(e) => {
                    onShowCoverChange(showOpenDialog, e.target.checked);
                }} />
                &nbsp;
                Show cover
            </label>
            <input type="text" placeholder="Custom cover url" className="text-input p-2 rounded-md w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={!(books.find(b => b.id === showOpenDialog)?.showCover)} 
            defaultValue={(books.find(b=> b.id === showOpenDialog)?.coverImage)}
            onChange={(e) => {
                onCoverUrlChange(showOpenDialog, e.target.value);
            }}
            />
            

            <button onClick={() => {
                setShowOpenDialog("");
                navigate(`/book/${books.find(b => b.id === showOpenDialog)?.id}`);
            }
            }
            className="cursor-pointer">Open</button>

            <button onClick={() => {
                const bookId = books.find(b => b.id === showOpenDialog)?.id;
                setShowOpenDialog("");
                //db delete entry
                if (bookId) {
                    deleteEntry(bookId);
                }
            }} className="text-red-500">Delete</button>
            </div>
                
        </Dialog>
        <ul className="flex gap-4 flex-wrap">
            {books.map(book => (
            <li key={book.id}>
                <BookElement book={book} onClick={() => onBookClick(book.id)} />
            </li>
        ))}
        <li><BookElement book={undefined} onClick={onNewBookClick} /></li>
        </ul>
        
        
        
    </main>

}