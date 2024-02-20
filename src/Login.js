import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import Home from "./components/Home/Home";


const LoginButton = () => {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect()
    }
      
    // eslint-disable-next-line
  }, [isLoading, isAuthenticated]);

  return (
    <>
      {/* <Home></Home> */}
      <Button variant="outlined" onClick={() => loginWithRedirect()}>Log In</Button>
    </>
    
  )
  
};

export default LoginButton;