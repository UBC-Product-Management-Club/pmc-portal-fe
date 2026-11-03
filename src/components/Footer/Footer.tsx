import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
    const textClass = 'flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-[#6b6584]';
    const linkClass =
        'inline-flex items-center gap-1 font-medium text-[#1d1838] underline decoration-[#1d1838]/25 underline-offset-4 hover:decoration-[#5a54c9]';
    return (
        <p className={textClass}>
            Need help? Email{' '}
            <a className={linkClass} href="mailto:tech@ubcpmc.com">
                tech@ubcpmc.com
            </a>{' '}
            or message us on{' '}
            <a
                className={linkClass}
                href="https://www.instagram.com/ubcpmc"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaInstagram className="size-4" aria-hidden />
                Instagram
            </a>
        </p>
    );
}
