import axios from 'axios';
import { errorEnum, feedType, postType } from './types/state';
import { uniqueId } from 'lodash';


const getUrlPromise = (url: string) => {
  return axios.get('https://allorigins.hexlet.app/get', {
    params: {
      disableCache: true,
      url: url
    }
  });
};

const parsePost = (post: Element): postType => {
  const parsedPost: postType = {
    id: parseInt(uniqueId()) - 1,
    title: post.querySelector('title').textContent,
    description: post.querySelector('description').textContent,
    link: post.querySelector('link').textContent,
    viewed: false,
  };

  return parsedPost;
};

const parseFeed = (channel: Element, url) => {
  const feed: feedType = {
    id: parseInt(uniqueId()) - 1,
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
    link: url,
  };
  return feed;
};

type rssPromise = Promise<{
  feed: feedType;
  posts: postType[];
}>

type updateRssPromise = Promise<{
  posts: postType[]
}>

export const checkUpdates = (url: string, links: string[]): updateRssPromise => {
  const proxy = getUrlPromise(url);
  return proxy.then((res) => {
    const parser = new DOMParser();
    const data = parser.parseFromString(res.data.contents, 'text/xml');
    const error = data.querySelector('parsererror');
    if (error) {
      const context = new Error(errorEnum.PARSE);
      throw context;
    }

    const postsNodes = [...data.querySelectorAll('item')];
    const newPosts = postsNodes.filter((post) => {
      const link = post.querySelector('link').textContent;
      return links.includes(link) === false
    });

    if (newPosts.length < 1) return { posts: [] };

    const posts = newPosts.map((post) => {
      return parsePost(post);
    });

    return { posts };
  });
};

const getRssData = (url: string): rssPromise => {
  const proxy = getUrlPromise(url);
  return proxy.then((res) => {
    const parser = new DOMParser();
    const data = parser.parseFromString(res.data.contents, 'text/xml');
    const error = data.querySelector('parsererror');
    if (error) {
      const context = new Error(errorEnum.PARSE);
      throw context;
    }

    const channel = data.querySelector('channel');
    const postsNodes = [...data.querySelectorAll('item')];

    const feed = parseFeed(channel, url);
    const posts = postsNodes.map((post) => parsePost(post));

    return { feed, posts };
  });
};

export default getRssData