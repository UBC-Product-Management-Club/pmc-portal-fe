import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Light fill with a fine border; the page's main action uses the brand gradient.
// Hover lifts like the ubcpmc.com buttons; pressing settles it back down
const base =
    'inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 py-2 text-base transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(.16,1,.3,1)] not-disabled:motion-safe:hover:-translate-y-0.5 not-disabled:motion-safe:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pmc-accent disabled:cursor-not-allowed disabled:border disabled:border-portal-stroke disabled:bg-pmc-bg disabled:bg-none disabled:font-medium disabled:text-portal-muted disabled:shadow-none';
const variants = {
    default:
        'border border-portal-stroke bg-portal-surface font-medium text-pmc-ink shadow-sm not-disabled:hover:border-pmc-ink/25 not-disabled:hover:bg-white not-disabled:hover:shadow-[0_10px_22px_-12px_rgb(29_24_56/0.35)]',
    primary:
        'pmc-deep font-semibold text-white shadow-[0_10px_24px_-12px_rgb(138_88_207/0.7)] not-disabled:hover:shadow-[0_16px_30px_-12px_rgb(191_65_140/0.6)]',
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
