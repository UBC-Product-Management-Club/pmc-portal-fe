import PMCLogo from "../assets/pmclogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserData } from "../providers/UserData/UserDataProvider";
import { styled } from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: content-fit;
    padding: 0.5rem 2rem;
    margin-top: 30px;
    border: 1px solid #ffffff;
    border-radius: 50px;
`
const Logo = styled.img`
  cursor: pointer;
`

const Links = styled.nav`
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
    font-size: 16px;
    transition: 0.5s;
`

const NavButton = styled.div`
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: 0.5s;
  &:hover {
    background-image: linear-gradient(134.02deg, #8d9beb 29.24%, #af71aa 57.54%, #e33148 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
`

const AuthButton = styled.button`
    background-color: white;
    padding: 0.5rem 1rem;
    font-size: medium;
    font-weight: bold;
    outline: none;
    border-radius: 50px;

    &:hover {
      background: linear-gradient(
            134.02deg,
            #8d9beb 29.24%,
            #af71aa 57.54%,
            #e33148 100%
      );
      color: white;
      cursor: pointer;
    }
`

export function Navbar() {
    const { user } = useUserData()
    const { isAuthenticated, logout } = useAuth0();
    const navigateTo = useNavigate();

    return  (
      <Container>
          <Logo src={PMCLogo} onClick={() => navigateTo("/dashboard")} alt={"PMC Logo"} />
          <Links>
              {/* <Link to="/psprint/raffle-tracker">
                <NavButton>
                  Raffle Tracker
                </NavButton>
              </Link> */}
              {user && (<Link to="/profile" style={{"textDecoration" : "none"}}><NavButton>Profile</NavButton></Link>)}
              {isAuthenticated ? 
                <AuthButton onClick={async () => await logout()}>
                   Sign out
                </AuthButton> :
                <Link to="/">
                  <AuthButton>
                    Sign in
                  </AuthButton>
                </Link>
              }
          </Links>
      </Container>
    )
}