import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { Box, Stack, TextField, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { TweetWithId } from "../types";
import Tweet from "./Tweet";

const TweetInputFieldBase = (props: {
    onClick: () => void,
  } & WithFirebaseApiProps) => {
    const currentUserId = useAppSelector((state: RootState) => state.user.userId);
    const [tweetContent, setTweetContent] = useState<string>('');

    const onSubmit = async () => {
        await props.firebaseApi.asyncCreateTweet(currentUserId!, tweetContent);
        props.onClick();
        setTweetContent("");
    };

    return (
        <Box sx={{ margin: "auto" }}>
        <Stack direction="row" spacing={2} justifyContent="center">
            <TextField
            id="tweet-input"
            label="Tweet"
            variant="outlined"
            onChange={(e) => setTweetContent(e.target.value)} value={tweetContent}
            />
            <Button variant="outlined" onClick={onSubmit}>Submit</Button>
        </Stack>
        </Box>
    );
};

const TweetInputField = withFirebaseApi(TweetInputFieldBase);

const MainFeedBase = (props: WithFirebaseApiProps) => {
    const currentUserId = useAppSelector((state: RootState) => state.user.userId);
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo.value);
    const [tweets, setTweets] = useState<Array<TweetWithId> | null>(null);
  
    const fetchTweets = () => {
      props.firebaseApi.asyncGetMainFeed(currentUserId!, userInfo!.following).then((tweets) => {
        setTweets(tweets);
      });
    };
    useEffect(() => {
      fetchTweets();
    }, []);
  
    if (tweets === null) {
      return <CircularProgress />;
    }
    return (<>
        <TweetInputField onClick={fetchTweets} />
        {tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
    </>);
}

export default withFirebaseApi(MainFeedBase);