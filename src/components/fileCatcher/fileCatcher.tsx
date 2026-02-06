import { useEffect, useState } from "react";

const FileCatcher = ({
    active,
    onFileDrop,
    onFileDragOver,
    onFileDragLeave
}: {
    active: boolean;
    onFileDrop?: (file: File) => void;
    onFileDragOver?: () => void;
    onFileDragLeave?: () => void;
}) => {

    const [isDragging, setIsDragging] = useState(false);


    useEffect(() => {
        const handleWindowDragEnter = (e: DragEvent) => {
            if (!active) return;
            // Sprawdź czy to plik, a nie np. zaznaczony tekst
            if (e.dataTransfer?.types.includes('Files')) {
                setIsDragging(true);
            }
        };

        window.addEventListener('dragenter', handleWindowDragEnter);
        return () => window.removeEventListener('dragenter', handleWindowDragEnter);
    }, [active]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        onFileDragOver && onFileDragOver();
    }

    const handleDragLeave = (e: React.DragEvent) => {
        console.log('leave')
        if (e.relatedTarget === null){
            setIsDragging(false);
            onFileDragLeave && onFileDragLeave();
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        console.log('drop');

        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            onFileDrop && onFileDrop(file);
        }
    }


    return <div className={`fixed inset-0 ${active && isDragging ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <div className="p-8 w-full h-full bg-black/50">
            <div className="border-3 border-dashed rounded-4xl h-full border-muted flex justify-center items-center text-lg">
                Drop file to upload
            </div>
        </div>
        
    </div>
}

export default FileCatcher;