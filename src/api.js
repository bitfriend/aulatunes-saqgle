import HttpStatus from 'http-status-codes';

export const fetchData = (category) => new Promise((resolve, reject) => {
  fetch(`https://itunes.apple.com/us/rss/${category}/limit=100/json`).then(res => {
    if (res.ok) {
      res.json().then(json => {
        let records = [];
        if (json.feed && json.feed.entry) {
          records = json.feed.entry;
        }
        resolve(records);
      }).catch(err => {
        reject(err);
      });
    } else {
      const text = HttpStatus.getStatusText(res.status);
      throw new Error(text);
    }
  }).catch(err => {
    reject(err);
  });
})
