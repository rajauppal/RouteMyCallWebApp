import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button variant="outlined" size="small" onClick={() => logout({ logoutParams: {  } })}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
