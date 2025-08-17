import styled from 'styled-components';
import checkmark from '../../assets/payment_success_checkmark.svg';
import { Link } from 'react-router-dom';

const ContentHeader = styled.h1`
    font-size: x-large;
    margin: 2rem 0;
    color: white;
`;

const PaymentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding-top: 1rem;
    padding-botton: 1 rem;
`;

const Button = styled.button`
    cursor: pointer;
    display: block;
    font-family: poppins;
    font-weight: 600;
    margin-top: 0.5rem;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    color: var(--pmc-midnight-blue);
`;

const PaymentSuccess = () => {
    return (
        <>
            <ContentHeader>
                Welcome to PMC! <span style={{ fontSize: 'x-large' }}>🥳</span>
            </ContentHeader>
            <PaymentContainer>
                <img src={checkmark} width={40} />
                <h3>Payment Successful</h3>
                <p>We've processed your payment</p>
                <br />
                <Link to="/dashboard" color="white" style={{ textDecoration: 'None' }}>
                    <Button>Continue to dashboard</Button>
                </Link>
            </PaymentContainer>
        </>
    );
};

export default PaymentSuccess;
