import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import MainLayout from "./layouts/MainLayout";
import Newsfeed from "./Pages/Newsfeed/Newsfeed";
import Profile from "./Pages/Profile/Profile";

import CounterContextProvider from "./Context/CounterContext";
import AuthContextProvider from "./Context/AuthContext";
import Authlayout from "./layouts/AuthLayout";
import ProtecterRoutes from "./Componant/ProtectedRoutes/ProtecterRoutes";
import ProtectedRoutesPathes from "./Componant/ProtectedRoutesPathes/ProtectedRoutesPathes";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import PostDetailes from "./Pages/PostDetailes/PostDetailes";
import { Toaster } from 'react-hot-toast';
import {useNetworkState} from "react-use";
import Offline from "./Componant/Offline/Offline";
import { HelmetProvider } from "react-helmet-async";



const query = new QueryClient()

 const routes = createBrowserRouter([
    {
      path: "/auth",
      element: <Authlayout />,
      children: [
        { index: true, element: <ProtectedRoutesPathes>  <Navigate to="login" /></ProtectedRoutesPathes> },
        { path: "login", element: <ProtectedRoutesPathes>  <Login /></ProtectedRoutesPathes> },
        { path: "register", element: <ProtectedRoutesPathes> <Register /></ProtectedRoutesPathes> },
      ],
    },

    {
      path: "",
      element: <MainLayout />,
      children: [
        { index: true, element: <ProtectedRoutesPathes> <Navigate to="/auth/register" /></ProtectedRoutesPathes> },
        { path: "newsFeed", element: <ProtecterRoutes> <Newsfeed/>  </ProtecterRoutes> },
        { path: "profile", element: <ProtecterRoutes> <Profile/> </ProtecterRoutes> },
        { path: "postdetailes/:id", element: <ProtecterRoutes> <PostDetailes/> </ProtecterRoutes> },
       
        
      ],
    },
   
  ]);
export default function App() {
 const {online} = useNetworkState();
 return (
  <HelmetProvider>
    {!online && <Offline />}

    <QueryClientProvider client={query}>
      <AuthContextProvider>
        <CounterContextProvider>
          <Toaster />
          <RouterProvider router={routes} />
        </CounterContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
}