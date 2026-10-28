import { Outlet } from "react-router";
import Authintro from "../Componant/Authintro/Authintro";

export default function AuthLayout() {
  return (
    <main className="min-h-screen pt-10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2">
          <div>
            <Authintro />
          </div>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}