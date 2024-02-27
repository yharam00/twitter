import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { TweetWithId, UserInfo } from "../types";
import Tweet from "./Tweet";
import { useParams } from "react-router-dom";
import EditProfile from "./EditProfile";
import { handleUnfollow, handleFollow } from "../redux/userSlice";

const ProfileCardBase = (props: {
  userId: string
} & WithFirebaseApiProps) => {
  const currentUserId = useAppSelector((state: RootState) => state.user.userId);
  const currentUserInfo = useAppSelector((state: RootState) => state.user.userInfo.value);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    props.firebaseApi.asyncGetUserInfo(props.userId).then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, [props.userId]);
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

  if (isEditProfile) {
    return (<>
      <EditProfile />
      <Button onClick={() => {setIsEditProfile(false)}}>Done</Button>
    </>);
  }

  let button = null;
  if (currentUserId !== props.userId) {
    const isFollowing = currentUserInfo!.following.includes(props.userId);
    button = isFollowing ? <Button onClick={() => {
        dispatch(handleUnfollow(props.firebaseApi, currentUserId!, props.userId))
      }}>Unfollow</Button> : <Button onClick={() => {
        dispatch(handleFollow(props.firebaseApi, currentUserId!, props.userId))
      }}>Follow</Button>
  } else {
    button = <Button onClick={() => {
      setIsEditProfile(true);
    }}>Edit Profile</Button>;
  }
  return (<>
    <img src={profilePicUrl} width={100} />
    <Typography>
      {'Username: ' + userInfo.username}
    </Typography>
    {button}
  </>);
};

const ProfileCard = withFirebaseApi(ProfileCardBase);

const ProfilePageBase = (props: WithFirebaseApiProps) => {
  const [tweets, setTweets] = useState<Array<TweetWithId> | null>(null);
  const params = useParams();

  const fetchTweets = () => {
    if (params.userId == null) {
      return;
    }
    props.firebaseApi.asyncGetProfileFeed(params.userId!).then((tweets) => {
      setTweets(tweets);
    });
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  if (params.userId == null) {
    return <Typography>Something went wrong...</Typography>;
  }
  if (tweets === null) {
    return <CircularProgress />;
  }
  return (<>
    <ProfileCard userId={params.userId} />
    {tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
  </>);
}

export default withFirebaseApi(ProfilePageBase);