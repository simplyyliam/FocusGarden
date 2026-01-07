import { type HTMLAttributes } from "react";



export const BarContainer: React.FC<HTMLAttributes<HTMLDivElement>> = ({
    children, 
    className,
    ...props
}) => {
    return (
        <div className={`flex items-center justify-between w-full h-fit ${className}`}{...props}>{children}</div>
    )
}