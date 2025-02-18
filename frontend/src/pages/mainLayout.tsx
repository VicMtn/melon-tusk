//import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
export default function MainLayout() {
  return (
    <>
        <nav>
        <Navbar />  
    </nav>
    <div className="pt-6">
        <Table />
    </div>
    </>

  )
}