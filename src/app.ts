import onChange from "on-change";
import render from "./render";
import * as yup from 'yup';
import { flatten } from 'lodash';

import { errorEnum, feedType, statePathEnum, stateType, statusEnum } from "./types/state";
import { translationType } from './types/translation';
import nodes from "./nodes";

import getRssData, { checkUpdates } from './rss';

const refreshFeeds = (state: stateType) => {
  const currentPostsLinks = flatten([...state.posts]).map((post) => post.link);

  const RssPromises = [...state.feeds].map((feed) => {
    checkUpdates(feed.link, currentPostsLinks)
      .then((response) => {
        const { posts } = response;
        // TODO: REFACTOR LINE BELOW. KLUDGE FOR UPDATES
        if (posts.length > 0) state.posts[0].unshift(...posts);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return Promise.all(RssPromises).then(() => setTimeout(refreshFeeds, 5000, state));
};

const setRssToState = (url: string, state: stateType) => {
  getRssData(url).then(
    (data) => {
      state.posts.unshift(data.posts);
      state.feeds.unshift(data.feed);
      state.status = statusEnum.RECEIVED;
    }
  )
    .catch((err) => {
      if (err.message === errorEnum.PARSE) {
        state.error = errorEnum.PARSE;
        state.status = statusEnum.INVALID;
      }
    })
};

const formHandler = (schema, state: stateType): void => {
  nodes.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const target = nodes.form;
    const formData = new FormData(target);
    const urlProvided = formData.get('url').toString();

    schema.validate(urlProvided)
      .then(() => {
        state.error = null;
        state.status = statusEnum.SENDING;
        setRssToState(urlProvided, state)
      })
      .catch((error: { message: errorEnum }) => {
        state.error = error.message;
        state.status = statusEnum.INVALID;
      });
  });
};

const buttonHandler = (state: stateType) => {
  nodes.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.dataset.bsToggle !== undefined) {
      const postId = parseInt(target.dataset.id, 10);
      const posts = flatten([...state.posts]);
      const clickedPost = posts.filter((post) => post.id === postId)[0];
      state.postsViewed.current = clickedPost;
      state.postsViewed.all.push(clickedPost.id);
    }
  });

}

const isUrlInFeeds = (url: string, feeds: Array<feedType>) => {
  const feedWithUrl = feeds.slice().filter(
    (feed: feedType) => feed.link === url
  )
  return feedWithUrl.length === 1;
};

const app = (translation: translationType) => {
  const state: stateType = {
    status: statusEnum.WAITING,
    posts: [],
    postsViewed: {
      current: null,
      all: []
    },
    feeds: [],
    error: null,
  };

  translation.promise.then(() => {
    const watchedState = onChange(state, (path: statePathEnum) => {
      render(state, path, translation.instance.t);
    });

    const schema = yup.string()
      .required(errorEnum.REQUIRED)
      .url(errorEnum.NOT_URL)
      .test(
        'is url in feeds?',
        errorEnum.ALREADY,
        (value) => isUrlInFeeds(value, state.feeds) === false,
      );

    formHandler(schema, watchedState);
    buttonHandler(watchedState);
    refreshFeeds(watchedState);
  });
};

export default app;