import { Outlet } from "react-router-dom";
import HeaderPage from "./Header";
import LoginPage from "./pages/LoginPage";
import Footer from "./pages/FooterPage";

export default function Layout(){
    return(
      <div className="w-full ">
        <div className="py-4 px-8 flex flex-col min-h-screen">
          <HeaderPage />
          <Outlet /> 
        </div>
        <Footer/>
        </div>
    )
}