import Geary from '../../assets/geary_construction.svg';
import styled from 'styled-components';

const Centered = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100vh;
  position: relative;

  @media screen and (max-width: 768px) {
    justify-content: center;
    align-items: center;
    height: 100vh;
    min-height: 100vh;
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
  color: var(--pmc-midnight-blue);
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: auto;
    margin: 0;
  }
`;

const Logo = styled.img`
  width: 226px;
  height: 226px;
  padding: 1rem;
  @media screen and (max-width: 768px) {
    width: 160px;
    height: 160px;
  }
`;

const Header = styled.h1`
  text-align: center;
  font-family: Poppins;
  line-height: 1.5;
  font-size: 70px;
  background-clip: text;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;

const SubHeader = styled.p`
  text-align: center;
  font-family: Poppins;
  font-size: 30px;
  margin: -20px;
  @media screen and (max-width: 768px) {
    margin: -10px;
    font-size: 20px;
  }
`;

const Paragraph = styled.p`
  font-size: 20px;
  line-height: 1.6;
  margin: 0.5rem 0;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

const Link = styled.a`
  color: var(--pmc-midnight-blue);
  text-decoration: none;
  font-weight: bold;
  text-decoration: underline;
`;

export default function UnderConstruction() {
  return (
    <Centered>
      <Container>
        <Content>
          <SubHeader>this page is under</SubHeader>
          <Header>construction</Header>
          <Logo src={Geary} data-testid="logo" alt="PMC Logo" />
          <Paragraph>
            Geary and the team are busy <i>iterating</i>!
            <br />
            In the meantime, visit our{' '}
            <Link href="https://ubcpmc.com/" className="navbar-link" target="_blank" rel="noopener noreferrer">
              existing site
            </Link>
          </Paragraph>
        </Content>
      </Container>
    </Centered>
  );
}
