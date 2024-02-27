import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import EditProfile from './components/EditProfile'
import { WithFirebaseApiProps, withFirebaseApi } from './Firebase';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { handleUserChange } from './redux/userSlice';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const isLoadingState = (state: RootState): boolean => {
  return state.user.userId === undefined;
};

const Body = () => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const userInfo = useAppSelector((state: RootState) => state.user.userInfo.value);
  const userInfoLoadState = useAppSelector((state: RootState) => state.user.userInfo.loadState);
  if (userId === null) {
    // logged out user
    return (<>
      <Typography>haramy login app을 이용하기 위해 로그인이 필요합니다 🔒</Typography>
    </>);
  }

  if (userInfoLoadState === "loading") {
    return <CircularProgress />;
  }
  if (userInfoLoadState === "failed" || userInfo === undefined) {
    return (<>
      <Typography>Something failed</Typography>
    </>);
  }
  if (userInfo === null) {
    return <Onboarding />;
  }
  return (
    <Routes>
      <Route path="/" element={<>
        <Typography whiteSpace={'pre-wrap'}>{`안녕하세요 ${userInfo.username}님 😀 \nharamy login app에 오신걸 환영합니다.`}</Typography>
        <EditProfile />
      </>} />
    </Routes>
  );
};

const App = (props: WithFirebaseApiProps) => {
  const isLoading = useAppSelector(isLoadingState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return props.firebaseApi.onAuthStateChanged((user) => {
      if (user) {
        dispatch(handleUserChange(props.firebaseApi, user.uid));
      } else {
        dispatch(handleUserChange(props.firebaseApi, null));
      }
    });
  }, []);

  if (isLoading) {
    return <CircularProgress sx={{ margin: "auto" }} />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ paddingTop: 3 }}>
        <Box sx={{ margin: "auto" }}>
          <Body />
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default withFirebaseApi(App);
