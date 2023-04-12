export type postType = {
  id:          number;
  link:        string;
  title:       string;
  description: string;
  viewed:      boolean;
}

export type feedType = {
  id:          number;
  title:       string;
  link:        string;
  description: string;
}

export enum statusEnum {
  WAITING  = 'FILLING',
  SENDING  = 'SENDING',
  RECEIVED = 'RECEIVED',
  INVALID  = 'INVALID',
  SUCCESS  = 'SUCCESS',
}

export enum errorEnum {
  REQUIRED = 'REQUIRED',
  NOT_URL  = 'NOT_URL',
  PARSE    = 'PARSE',
  ALREADY  = 'ALREADY',
}

export enum statePathEnum {
  status        = 'status',
  posts         = 'posts',
  feeds         = 'feeds',
  error         = 'error',
  viewedAll     = 'postsViewed.all',
  viewedCurrent = 'postsViewed.current'
}

export type stateType = {
  status: statusEnum;
  posts:  postType[][];
  postsViewed: {
    current: postType;
    all:     number[];
  };
  feeds: feedType[];
  error: errorEnum | null;
}