import Footer from "./components/Footer/Footer";
import {Navbar} from "./components/Navbar";
import {Outlet} from "react-router-dom";

export function Layout() {
    return (
        <div className={"width-fit"}>
            <Navbar/>
            <div className={"container"}>
                <Outlet/>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}