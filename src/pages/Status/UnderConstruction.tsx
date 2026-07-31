import { CSSProperties } from 'react';
import { FaDiscord, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import Geary from '../../assets/geary_construction.svg';
import PMCLogo from '../../assets/pmclogo.svg';

const socialLinks = [
    {
        href: 'https://ubcpmc.com/',
        label: 'PMC website',
        icon: (
            <span
                aria-hidden="true"
                className="inline-block h-10 w-10 translate-y-1 bg-current md:h-12 md:w-12 md:translate-y-1.5 [mask-image:var(--pmc-logo)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:var(--pmc-logo)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                style={{ '--pmc-logo': `url(${PMCLogo})` } as CSSProperties}
            />
        ),
    },
    {
        href: 'https://www.instagram.com/ubcpmc/?hl=en',
        label: 'Instagram',
        icon: <FaInstagram className="h-10 w-10 md:h-12 md:w-12" aria-hidden="true" />,
    },
    {
        href: 'https://www.linkedin.com/company/ubc-product-management-club/?originalSubdomain=ca',
        label: 'LinkedIn',
        icon: <FaLinkedin className="h-10 w-10 md:h-12 md:w-12" aria-hidden="true" />,
    },
    {
        href: 'https://discord.com/invite/MZChJSpSxA',
        label: 'Discord',
        icon: <FaDiscord className="h-10 w-10 md:h-12 md:w-12" aria-hidden="true" />,
    },
];

export default function UnderConstruction() {
    const centeredClass = 'fixed inset-0 bg-pmc-midnight-grey';
    const containerClass = 'relative flex h-screen w-full flex-col items-center justify-around';
    const contentClass = 'flex flex-col items-center text-pmc-midnight-blue';
    const logoClass = 'h-[160px] w-[160px] p-4 md:h-[226px] md:w-[226px]';
    const headerClass = 'm-0 text-[40px] md:text-[70px]';
    const subHeaderClass = 'mt-[-10px] text-center text-[20px] md:mt-[-20px] md:text-[30px]';
    const paragraphClass = 'text-center text-[16px] md:text-[20px]';
    const socialLinksClass = 'mt-4 flex items-center gap-6 md:gap-8';
    const socialLinkClass =
        'text-pmc-midnight-blue transition-opacity hover:opacity-70 focus-visible:opacity-70';

    return (
        <div className={centeredClass}>
            <div className={containerClass}>
                <div className={contentClass}>
                    <p className={subHeaderClass}>this page is under</p>
                    <h1 className={headerClass}>construction</h1>
                    <img
                        className={logoClass}
                        src={Geary}
                        data-testid="logo"
                        alt="Geary construction mascot"
                    />
                    <p className={paragraphClass}>
                        Geary and the team are busy <i>iterating</i>!
                        <br />
                        In the meantime, visit our sites!
                    </p>
                    <div className={socialLinksClass}>
                        {socialLinks.map(({ href, label, icon }) => (
                            <a
                                key={label}
                                className={socialLinkClass}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
