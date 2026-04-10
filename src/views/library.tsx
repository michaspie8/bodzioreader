import { useState } from "react";
import BookElement from "../components/bookElement/bookElement";
import Dialog from "../components/dialog/dialog";
import { getBaseData } from "../db/db"
import { exampleBooks } from "../utils/exampleData";
import CreateBookForm from "../components/createBookForm/createBookForm";
import { IBook } from "../utils/bookImporter/bookImporter";
import { useNavigate } from "react-router";


export default function Library() {

    const books = getBaseData() || [];

    const [showDialog, setShowDialog] = useState(false);
    
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
        navigate(`/book/${id}`);
    }




    return <main>
        <Dialog title="Adding new book" align="text-left" visible={showDialog}
        onClose={onNewBookCancel}>
            <CreateBookForm onCancel={onNewBookCancel} key={Number(showDialog)} onNewBook={onNewBook} />
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