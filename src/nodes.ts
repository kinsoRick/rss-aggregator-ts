const nodes = {
  form:       document.querySelector('#rss-form') as HTMLFormElement,
  label:      document.querySelector('#feedback'),
  rssInput:   document.querySelector('#url-input'),
  rssbtn:     document.querySelector('button[type="submit"]') as HTMLButtonElement,
  feeds:      document.querySelector('#feeds'),
  posts:      document.querySelector('#posts'),
  modalTitle: document.querySelector('#modal-title'),
  modalInfo:  document.querySelector('#additional-info'),
  modalBtn:   document.querySelector('#learn-more-btn') as HTMLLinkElement,
};

export default nodes;
