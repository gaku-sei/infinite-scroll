window.onload = () => {
  const url = '/sources/:offset/:limit';

  const fallback = 'http://i.imgur.com/rOe54wl.jpg';
  const percent = 85;
  const step = 20;

  let loading = false;

  const scrollPosition = () =>
    Math.round(100 * document.body.scrollTop / (document.body.scrollHeight - document.body.clientHeight));

  const getSources = function*(step) {
    for(let offset = 0;; offset += step) {
      yield fetch(url.replace(':offset', offset).replace(':limit', step))
        .then(data => data.json())
        .then(sources => sources.length > 0 ? sources : Promise.reject());
    }
  };

  const scroll = (step = 5, cb) => {
    const iterator = getSources(step);
    const iterate = ({value, done}) => {
      if(!done) {
        value.then(cb).catch(() => iterator.return());
      }
    };

    iterate(iterator.next());
    window.onscroll = () => {
      if(scrollPosition() > 85 && !loading) {
        iterate(iterator.next());
      }
    }
  };

  scroll(step, sources => {
    loading = true;
    Promise.all(sources.map(source => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = source;
        img.onerror = () => (img.src = fallback, resolve(img.outerHTML));
        img.onload = () => resolve(img.outerHTML);
      });
    })).then(images => {
      const node = document.createElement('div');
      node.innerHTML = images.map(image => `<div>${image}</div>`).join('');
      document.getElementById('images').appendChild(node);
      loading = false;
    });
  });
};
