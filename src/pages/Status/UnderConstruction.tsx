import Geary from '../../assets/geary_construction.svg';

export default function UnderConstruction() {
    const centeredClass = 'fixed inset-0 bg-pmc-midnight-grey';
    const containerClass = 'relative flex h-screen w-full flex-col items-center justify-around';
    const contentClass = 'flex flex-col items-center text-pmc-midnight-blue';
    const logoClass = 'h-[160px] w-[160px] p-4 md:h-[226px] md:w-[226px]';
    const headerClass = 'm-0 text-[40px] md:text-[70px]';
    const subHeaderClass = 'mt-[-10px] text-center text-[20px] md:mt-[-20px] md:text-[30px]';
    const paragraphClass = 'text-center text-[16px] md:text-[20px]';
    const linkClass = 'font-bold text-pmc-midnight-blue';
    return (
        <div className={centeredClass}>
            <div className={containerClass}>
                <div className={contentClass}>
                    <p className={subHeaderClass}>this page is under</p>
                    <h1 className={headerClass}>construction</h1>
                    <img className={logoClass} src={Geary} data-testid="logo" alt="PMC Logo" />
                    <p className={paragraphClass}>
                        Geary and the team are busy <i>iterating</i>!
                        <br />
                        In the meantime, visit our{' '}
                        <a
                            className={linkClass}
                            href="https://ubcpmc.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            existing site
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
