import { Outlet } from "react-router";
import Nabar from "../Componant/Navbar/Nabar";

export default function MainLayout() {
  return (
    <>
      <Nabar />
      <main>
        <Outlet />
      </main>
    </>
  );
}