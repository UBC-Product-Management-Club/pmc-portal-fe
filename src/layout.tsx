import Footer from "./components/Footer/Footer";
import {useAuth0} from "@auth0/auth0-react";
import {Navbar} from "./components/Navbar";
import {Outlet} from "react-router-dom";

export function Layout() {
    const {isLoading} = useAuth0();
    return (
        <div className={"width-fit"}>
            {!isLoading && (
                <>
                    <Navbar/>
                    <div className={"container"}>
                        <Outlet/>
                    </div>
                    <div className="footer">
                        <Footer />
                    </div>
                </>
            )}
        </div>
    );
}