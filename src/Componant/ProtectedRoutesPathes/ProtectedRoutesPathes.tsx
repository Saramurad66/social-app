import type { ReactNode } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoutesPathes({
  children,
}: {
  children: ReactNode;
}) {
  if (!localStorage.getItem("userToken")) {
    return <>{children}</>;
  } else {
    return <Navigate to="/Newsfeed" />;
  }
}