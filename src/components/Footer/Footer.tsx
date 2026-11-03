export default function Footer() {
    const containerClass = 'flex w-full justify-center';
    const textClass = 'text-center text-sm font-medium text-slate-700 sm:text-base';
    const linkClass = 'font-semibold text-violet-700 underline underline-offset-2';
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
