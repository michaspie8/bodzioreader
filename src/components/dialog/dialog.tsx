import { Icon } from "@iconify/react";
import { ReactNode } from "react"

const Dialog = ({
    children, 
    title, 
    align = "text-left", 
    onClose = () => {}, 
    visible = false
}: {
    children?: ReactNode,
    title: string,
    align?: "text-center" | "text-left",
    onClose?: () => void,
    visible: boolean,
}) => {





    return <div className="bg-panel w-fit  border-border border-1 rounded-lg min-w-96" style={{ display: visible ? "block" : "none" }}>
        <header className={`${align} p-4 flex items-center justify-between border-b-1 border-border`}>
            {
                align === "text-center" ? <span className="invisible">
                    <Icon icon="material-symbols:close-rounded" height={20} className="invisible"></Icon>
                </span> : undefined
            }
            
            <span className="font-bold text-xl">
                {title}
                </span>
                <button onClick={() => onClose && onClose()} className="cursor-pointer">
                    <Icon icon="material-symbols:close-rounded" height={20}></Icon>
                </button>
            
        </header>
        <div className="">
            {children}
        </div>
    </div>
}

export default Dialog;