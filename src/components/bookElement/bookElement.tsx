import { Icon } from "@iconify/react";
import { BaseBookData } from "../../db/db";

const BookElement = ({book}: {book?: BaseBookData}) => {

    return <div className={`w-48 aspect-1/1 border-1 border-border rounded-lg p-4 flex flex-col justify-center gap-2 cursor-default hover:border-border-light transition-all ${
        !book ? 'bg-transparent' : 'bg-panel'
    }`}>
        {
            book ? 
            <>
                <h3>{book.title}</h3>
            <span className="text-muted text-sm">{book.pageCount} pages</span>
            <span className="text-muted text-sm">{book.wordCount} words</span>
            <span className="text-muted text-sm">Last edited {book.lastEdited.toLocaleDateString()}</span>
            </>
            : <h3 className="text-muted flex">Add new book<Icon icon="mdi:plus" height={24}></Icon></h3>
        }
        
    </div>

}

export default BookElement;