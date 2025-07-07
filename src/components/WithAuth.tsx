import React, { useEffect } from "react";

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthWrapped(props: P) {
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
    }, []);

    return <Component {...props} />;
  };
}