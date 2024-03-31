import { flatten } from "lodash";
import nodes from "./nodes";
import { localePathsEnum } from "./types/locale";
import { feedType, postType, statePathEnum, stateType, statusEnum } from "./types/state";
import { translationFunc } from "./types/translation";

// <Creators> //
const createCard = (code: localePathsEnum, translate: translationFunc): HTMLDivElement => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = translate(code);

  cardBody.append(cardTitle);
  card.append(cardBody);

  return card;
};

const createButton = (id: number, translate: translationFunc): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  btn.dataset.id = id.toString();
  btn.dataset.bsToggle = 'modal';
  btn.dataset.bsTarget = '#modal';
  btn.textContent = translate(localePathsEnum.VIEW);
  return btn;
};

const createFeedItem = (feed: feedType): HTMLLIElement => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = feed.title;

  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = feed.description;

  li.append(title, description);
  return li;
};

const createPostItem = (
  post: postType,
  viewedPosts: number[],
  translate: translationFunc
): HTMLLIElement => {

  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  li.dataset.postId = post.id.toString();

  const link = document.createElement('a');
  if (viewedPosts.includes(post.id)) {
    link.classList.add('fw-normal', 'text-secondary');
  } else {
    link.classList.add('fw-bold');
  }
  link.href = post.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = post.title;

  const btn = createButton(post.id, translate);
  li.append(link, btn);
  return li;
};

// </CREATORS> //

// <FORM> //
const enableForm = (): void => {
  nodes.label.classList.remove('text-danger', 'text-success');
  nodes.label.textContent = '';
  nodes.rssInput.removeAttribute('readonly');
  nodes.rssbtn.disabled = false;
};

const disableForm = (): void => {
  nodes.label.classList.remove('text-danger', 'text-success');
  nodes.label.textContent = '';
  nodes.rssInput.setAttribute('readonly', 'true');
  nodes.rssbtn.disabled = true;
};

// </FORM> //

const renderError = (state: stateType, translate: translationFunc): void => {
  nodes.label.classList.add('text-danger');
  nodes.label.textContent = translate(`errors.${state.error}`);
};

const renderSuccess = (translate: translationFunc): void => {
  nodes.label.classList.add('text-success');
  nodes.label.textContent = translate(localePathsEnum.SUCCESS);
}

const changeModalValues = (post: postType): void => {
  if (post === null) throw new Error(`Post Value must be more not null: ${post}`);
  nodes.modalTitle.textContent = post.title
  nodes.modalInfo.textContent = post.description
  nodes.modalBtn.href = post.link
};

const setPostViewed = (postId: number): void => {
  const item = nodes.posts.querySelector(`li[data-post-id="${postId}"]`);
  const link = item.querySelector('a');
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'text-body-secondary');
};


// <RENDERS> //
const renderFeeds = (feeds: feedType[], translate: translationFunc): void => {
  const card = createCard(localePathsEnum.FEEDS, translate);

  nodes.feeds.textContent = '';
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'rounded-0', 'border-0');
  const feedsItems = feeds.map(createFeedItem);

  feedsItems.forEach((item) => {
    feedsList.append(item);
  });

  nodes.feeds.append(card, feedsList);
};

const renderPosts = (
  postsFeed: postType[][],
  viewedPosts: number[],
  translate: translationFunc
): void => {
  nodes.posts.textContent = '';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const card = createCard(localePathsEnum.POSTS, translate);

  const posts = flatten(postsFeed);
  if (posts.length < 1) return;

  const postsItems = posts.map((post) => createPostItem(post, viewedPosts, translate));
  postsItems.forEach((item) => {
    postsList.append(item);
  });

  nodes.posts.append(card, postsList);
};
// </RENDERS> //

const renderByStatus = (state: stateType, translate: translationFunc): void => {
  enableForm();
  switch (state.status) {
    case statusEnum.WAITING:
      break;
    case statusEnum.SENDING:
      disableForm();
      break;
    case statusEnum.INVALID:
      renderError(state, translate);
      break;
    case statusEnum.RECEIVED:
      renderFeeds([...state.feeds], translate);
      renderPosts([...state.posts], [...state.postsViewed.all], translate);
      renderSuccess(translate);
      break;
    default:
      throw new Error(`Unknown status type -> ${state.status}`);
  }
};

const render = (state: stateType, path: statePathEnum, translate: translationFunc): void => {
  switch (path) {
    case statePathEnum.status:
      renderByStatus(state, translate);
      break;
    case `${statePathEnum.posts}`:
      renderPosts([...state.posts], [...state.postsViewed.all], translate);
      break;
    case statePathEnum.viewedCurrent:
      changeModalValues(state.postsViewed.current);
      setPostViewed(state.postsViewed.current.id);
      break;
    default:
      break;
  }
};

export default render;
