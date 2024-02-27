import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";

const TweetInputFieldBase = (props: WithFirebaseApiProps) => {
    const currentUserId = useAppSelector((state: RootState) => state.user.userId);
    const [tweetContent, setTweetContent] = useState<string>('');

    const onSubmit = async () => {
        await props.firebaseApi.asyncCreateTweet(currentUserId!, tweetContent);
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
  return (<>
    <TweetInputField />
  </>);
}

export default withFirebaseApi(MainFeedBase);