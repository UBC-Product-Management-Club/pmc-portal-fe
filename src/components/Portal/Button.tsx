import { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

// The Figma button: light fill, slate border, 10 px corners
const buttonClass =
    'inline-flex min-h-11 items-center justify-center rounded-[10px] border border-portal-stroke bg-portal-surface px-4 py-2 text-base font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/50 disabled:text-portal-muted';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button type="button" className={`${buttonClass} ${className}`} {...props} />;
}

export function ButtonLink({
    to,
    className = '',
    children,
}: {
    to: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Link to={to} className={`${buttonClass} no-underline ${className}`}>
            {children}
        </Link>
    );
}
