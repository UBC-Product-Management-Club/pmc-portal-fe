import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Light fill with a fine border; the page's main action uses the brand gradient.
// Hover changes the fill: lavender for light buttons, a deeper gradient for the main one
const base =
    'inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 py-2 text-base transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pmc-accent disabled:cursor-not-allowed disabled:border disabled:border-portal-stroke disabled:bg-pmc-bg disabled:bg-none disabled:font-medium disabled:text-portal-muted disabled:shadow-none';
const variants = {
    default:
        'border border-portal-stroke bg-portal-surface font-medium text-pmc-ink shadow-sm not-disabled:hover:border-pmc-accent/30 not-disabled:hover:bg-portal-badge not-disabled:active:bg-[#e4ddf5]',
    primary: 'pmc-btn-gradient font-semibold text-white',
};

type Variant = keyof typeof variants;

export function Button({
    className = '',
    variant = 'default',
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    return (
        <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
}

export function ButtonLink({
    to,
    className = '',
    variant = 'default',
    children,
}: {
    to: string;
    className?: string;
    variant?: Variant;
    children: ReactNode;
}) {
    return (
        <Link to={to} className={`${base} ${variants[variant]} no-underline ${className}`}>
            {children}
        </Link>
    );
}
