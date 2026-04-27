import { useState } from "react";
import BookElement from "../components/bookElement/bookElement";
import Dialog from "../components/dialog/dialog";
import { getBaseData, deleteEntry } from "../db/db"
import { exampleBooks } from "../utils/exampleData";
import CreateBookForm from "../components/createBookForm/createBookForm";
import { IBook } from "../utils/bookImporter/bookImporter";
import { useNavigate } from "react-router";


export default function Library() {

    const books = getBaseData() || [];

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


    return <main>
        <Dialog title="Adding new book" align="text-left" visible={showDialog}
        onClose={onNewBookCancel}>
            <CreateBookForm onCancel={onNewBookCancel} key={Number(showDialog)} onNewBook={onNewBook} />
        </Dialog>
        <Dialog title={books.find(b => b.id === showOpenDialog)?.title || "Book"} align="text-left" visible={showOpenDialog !== ""}
        onClose={() => setShowOpenDialog("")}>
            <div className="flex flex-col gap-4 p-4">
            <button onClick={() => {
                setShowOpenDialog("");
                navigate(`/book/${books.find(b => b.id === showOpenDialog)?.id}`);
            }
            }>Open</button>

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