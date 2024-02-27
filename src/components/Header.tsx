// src/components/Header.tsx
import { Button, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Link } from 'react-router-dom';

const HeaderBase = (
  props: WithFirebaseApiProps
) => {
  const currentUserId = useAppSelector((state: RootState) => state.user.userId);
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={props.firebaseApi.signInWithGoogleRedirect}>Login with Google</Button>
  );
  const logoutButton = (
    <Button color="inherit" onClick={props.firebaseApi.signOut}>Log out</Button>
  );
  const button = currentUserId == null ? loginWithGoogleButton : logoutButton;
  return (
    <AppBar position="static">
      <Toolbar sx={{ width: "100%", maxWidth: 720, margin: "auto" }}>
        <Typography variant="h6" component="div">
        <Button component={Link} to={'/'} color="inherit">Twitter</Button>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {button}
      </Toolbar>
    </AppBar>
  );
};

export default withFirebaseApi(HeaderBase);
