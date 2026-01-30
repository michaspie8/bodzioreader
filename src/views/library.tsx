import BookElement from "../components/bookElement/bookElement";
import { Book, getBaseData } from "../db/db"
import { exampleBooks } from "../utils/exampleData";


export default function Library() {

    const books = getBaseData() || [];




    return <main>
        <ul className="flex gap-4 flex-wrap">
            {books.map(book => (
            <li key={book.id}>
                <BookElement book={book} />
            </li>
        ))}
        <li><BookElement book={undefined} /></li>
        </ul>
        
        
        
    </main>

}