import React from 'react';
import Link from 'next/link';

interface AnimatedButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    href,
    onClick,
    className = '',
    variant = 'primary'
}) => {
    const baseClasses = "relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 group inline-flex items-center justify-center shadow-md hover:shadow-lg";

    // Base colors and specific fill colors
    let variantClasses = "";
    // Added rounded-r-full to opacity transition to simulate curve?
    // Actually, simply adding a border-radius to the filling element might simulate the "curvo" effect the user wants if it's the leading edge.
    // However, if the parent is rounded-full, the child rect is clipped.
    // To make it look "not straight" (no recto), maybe they want the filling to be a growing circle or pill?
    // Let's try giving the fill itself a border radius.
    let fillClasses = "absolute inset-0 w-0 h-full transition-all duration-[400ms] ease-out group-hover:w-full rounded-full";

    switch (variant) {
        case 'primary':
            variantClasses = "bg-primary text-white";
            // User requested specific color #014e87 for hover
            fillClasses += " bg-[#014e87]";
            break;
        case 'secondary':
            variantClasses = "bg-secondary text-white";
            fillClasses += " bg-primary";
            break;
        case 'outline':
            variantClasses = "bg-transparent border border-primary text-primary hover:text-white";
            fillClasses += " bg-[#014e87]";
            break;
        default:
            variantClasses = "bg-primary text-white";
            fillClasses += " bg-[#014e87]";
    }

    const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;
    const textClasses = "relative z-10 flex items-center justify-center gap-2";

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                <span className={fillClasses}></span>
                <span className={textClasses}>{children}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses}>
            <span className={fillClasses}></span>
            <span className={textClasses}>{children}</span>
        </button>
    );
};

export default AnimatedButton;
