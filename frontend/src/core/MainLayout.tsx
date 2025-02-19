import { Outlet } from 'react-router-dom';
import Navbar from "../components/Navbar";
import MainContainer from "./MainContainer";
import Footer from "../components/Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MainContainer>
        <Outlet />
      </MainContainer>
      <Footer />
    </div>
  );
}

export default MainLayout;