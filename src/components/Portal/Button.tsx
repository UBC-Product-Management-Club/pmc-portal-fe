import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Light fill with a slate border; the page's main action uses the pink-to-violet accent
const base =
    'inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 py-2 text-base transition disabled:cursor-not-allowed disabled:border disabled:border-portal-stroke disabled:bg-white/50 disabled:bg-none disabled:font-medium disabled:text-portal-muted disabled:shadow-none';
const variants = {
    default:
        'border border-portal-stroke bg-portal-surface font-medium text-black shadow-sm hover:bg-white',
    primary: 'portal-accent font-semibold text-white shadow-sm hover:brightness-105',
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
