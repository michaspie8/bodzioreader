import { useState } from "react";
import SlidingNavbar from "../slidingNavbar/slidingNavbar";

const CreateBookForm = () => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    return <>
    <SlidingNavbar buttons={
        [
            {
            name: 'Create empty',
            onSelect: () => {
                setSelectedIndex(0);
            }
        },
        {
            name: 'Upload from file',
            onSelect: () => {
                setSelectedIndex(1);
            }
        },
        ]
    } 
    selectedIndex={selectedIndex}
    />
    <form className="p-4"></form>
    </>
}

export default CreateBookForm;