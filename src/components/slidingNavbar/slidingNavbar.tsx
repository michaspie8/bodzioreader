import { useEffect, useRef, useState } from "react";

const SlidingNavbar = ({
    buttons = [],
    selectedIndex = 0
}: {
    buttons?: {
        name: string,
        onSelect: () => void  
    }[],
    selectedIndex?: number
}) => {
    
    const selectedButtonElement = useRef<HTMLLIElement | null>(null);
    const underline = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const targetElement = selectedButtonElement.current;
        if (!targetElement || !underline.current) return;

        const left = targetElement.offsetLeft;
        const width = targetElement.offsetWidth;

        underline.current.style.transform = `translateX(${left}px)`;
        underline.current.style.width = `${width}px`;
    }, [selectedIndex]);

    return <div className="relative">
        
        <ul className="flex border-b-1 border-border">
            {buttons.map((button, index) => {
                return <li ref={index === selectedIndex ? selectedButtonElement : null}
                className="transition-all">
                    <button onClick={button.onSelect} 
                    className={`cursor-pointer py-4 px-6 transition-all ${index === selectedIndex ? "text-text" : "text-muted"}`}>
                        {button.name}
                    </button>
                </li>
            })}
        </ul>
        <div ref={underline} className="bg-text h-0.25 absolute bottom-0 transition-all"></div>
    </div>
}

export default SlidingNavbar;