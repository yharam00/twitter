export interface UserInfo {
    username: string;
    profilePicHandle: string | null;
    following: Array<string>;
  };
  
  export interface WithLoadingState {
    loadState: 'idle' | 'loading' | 'failed';
  };

  export interface WithId {
    id: string;
  };

  export interface Tweet {
    userId: string;
    tweetContent: string;
    createdTime: number;
  };

  export type TweetWithId = Tweet & WithId;