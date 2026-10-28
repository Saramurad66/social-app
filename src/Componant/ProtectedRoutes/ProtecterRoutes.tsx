
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export default function ProtecterRoutes({
  children,
}: {
  children: ReactNode;
}) {
  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/auth/login" />;
  } else {
    return <>{children}</>;
  }
}
