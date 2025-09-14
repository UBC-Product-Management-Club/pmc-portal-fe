import { useAuth0 } from '@auth0/auth0-react';
import PMCLogo from '../../assets/pmclogo.svg';
import Footer from '../../components/Footer/Footer';
import styled from 'styled-components';
import { useInAppBrowser } from '../../utils';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100vw;
    height: 100vh;
    background-color: var(--pmc-blue);
    position: relative;
    @media screen and (max-width: 768px) {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: var(--pmc-dark-blue);
    }
`;

const Content = styled.div`
    width: 36rem;
    height: 27rem;
    margin: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    background-color: var(--pmc-dark-blue);
    @media screen and (max-width: 768px) {
        width: 100%;
        height: 100;
        border-radius: 0rem;
    }
`;

const Logo = styled.img`
    width: 10rem;
    height: 10rem;
    @media screen and (max-width: 768px) {
        width: 8rem;
        height: 8rem;
    }
`;

const Header = styled.h1`
    text-align: center;
    font-family: Helvetica;
    line-height: 1.5;
    background: #fff;
    color: transparent;
    background-clip: text;
    @media screen and (max-width: 768px) {
        text-align: center;
        font-size: x-large;
        font-family: Helvetica;
        line-height: 1.5;
        background: #fff;
        color: transparent;
        background-clip: text;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;

    > button {
        width: 300px;
        padding: 0.75rem 0;
        margin: 0.5rem 0;
        border-radius: 999rem;
        cursor: pointer;
    }
    @media screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
        > button {
            width: 300px;
            padding: 0.75rem 0;
            margin: 0.5rem 0;
            border-radius: 999rem;
            cursor: pointer;
        }
    }
`;

const LoginButton = styled.button`
    font-weight: 400;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: medium;
    color: #1c1c1c;
    background-color: white;
    border: 0;
`;

const FooterContainer = styled.div`
    width: 100%;
    position: absolute;
    bottom: 1rem;
`;

export default function Login() {
    const { loginWithRedirect } = useAuth0();
    const { isInAppBrowser } = useInAppBrowser();

    function handleLogin() {
        if (isInAppBrowser) {
            const message =
                'For security reasons, please open this page in an external browser to log in. In-app browsers are not supported for secure login.';
            window.location.href = `googlechrome://${window.location.host}${window.location.pathname}`;

            setTimeout(() => {
                window.alert(message);
            }, 200);
        } else {
            loginWithRedirect();
        }
    }

    return (
        <Container>
            <Content>
                <Logo src={PMCLogo} data-testid="logo" alt="PMC Logo" />
                <Header> PMC Membership Portal</Header>
                <ButtonContainer>
                    <LoginButton onClick={handleLogin}>Log in / sign up</LoginButton>
                </ButtonContainer>
            </Content>
            <FooterContainer>
                <Footer />
            </FooterContainer>
        </Container>
    );
}
