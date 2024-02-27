import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { TweetWithId } from "../types";
import Tweet from "./Tweet";

const ExploreFeedBase = (props: WithFirebaseApiProps) => {
  const [tweets, setTweets] = useState<Array<TweetWithId> | null>(null);

  const fetchTweets = () => {
    props.firebaseApi.asyncGetExploreFeed().then((tweets) => {
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
    {tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
  </>);
}

export default withFirebaseApi(ExploreFeedBase);