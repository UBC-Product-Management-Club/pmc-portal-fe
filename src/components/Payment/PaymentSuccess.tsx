import checkmark from '../../assets/payment_success_checkmark.svg';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    const headerClass = 'my-8 text-xl text-white';
    const containerClass = 'flex flex-col items-center pt-4 text-white';
    const buttonClass =
        'mt-2 block rounded-lg bg-white px-8 py-2 font-semibold text-pmc-midnight-blue';
    return (
        <>
            <h1 className={headerClass}>
                Welcome to PMC! <span className="text-2xl">🥳</span>
            </h1>
            <div className={containerClass}>
                <img src={checkmark} width={40} />
                <h3>Payment Successful</h3>
                <p>We've processed your payment</p>
                <br />
                <Link to="/dashboard" className="no-underline">
                    <button className={buttonClass}>Continue to dashboard</button>
                </Link>
            </div>
        </>
    );
};

export default PaymentSuccess;
