import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../Firebase";
import { TweetWithId, UserInfo } from "../types";
import { Link } from 'react-router-dom';
import { Stack } from "@mui/material";

const TweetBase = (props: {
  tweet: TweetWithId,
} & WithFirebaseApiProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  useEffect(() => {
    props.firebaseApi.asyncGetUserInfo(props.tweet.userId).then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);
  useEffect(() => {
    if (userInfo?.profilePicHandle == null) {
      return;
    }
    props.firebaseApi.asyncGetURLFromHandle(userInfo!.profilePicHandle).then((url) => {
      setProfilePicUrl(url);
    })
  }, [userInfo?.profilePicHandle]);
  if (userInfo === null || profilePicUrl === null) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ margin: 5 }}>
      <Stack direction="row" spacing={2}>
        <img src={profilePicUrl!} width={50} height={50} />
        <Typography variant="body1" component="div" align="left">
          <Link to={"/user/" + props.tweet.userId}>{userInfo!.username}</Link>
        </Typography>
      </Stack>
      <Typography variant="body1" component="div" align="left">
        {props.tweet.tweetContent}
      </Typography>
    </Box>
  );
};

export default withFirebaseApi(TweetBase);