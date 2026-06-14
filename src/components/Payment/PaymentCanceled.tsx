import { Link } from 'react-router-dom';

const PaymentCanceled = () => {
    const headerClass = 'my-8 text-xl text-white';
    const containerClass = 'flex flex-col items-center pt-4 text-white';
    const buttonClass =
        'mt-2 block rounded-lg bg-white px-8 py-2 font-semibold text-pmc-midnight-blue';
    return (
        <>
            <h1 className={headerClass}>Payment Canceled </h1>
            <div className={containerClass}>
                <Link to="/dashboard" className="no-underline">
                    <button className={buttonClass}>Continue to dashboard</button>
                </Link>
            </div>
        </>
    );
};

export default PaymentCanceled;
