export default function Footer() {
    const containerClass = 'flex w-full justify-center';
    const textClass = 'text-center text-sm font-bold text-white sm:text-base';
    const linkClass =
        'bg-gradient-to-r from-[var(--pmc-red)] to-[var(--pmc-light-blue)] bg-clip-text text-transparent no-underline';
    return (
        <div className={containerClass}>
            <div>
                <p className={textClass}>
                    Need help? Contact{' '}
                    <a className={linkClass} href="mailto:tech@ubcpmc.com">
                        tech@ubcpmc.com
                    </a>{' '}
                    for support.
                </p>
            </div>
        </div>
    );
}
