import HttpStatus from 'http-status-codes';

export const fetchData = (endpoint, name, artist) => new Promise((resolve, reject) => {
  fetch(`https://itunes.apple.com/us/rss/${endpoint}/limit=100/json`).then(res => {
    if (res.ok) {
      res.json().then(json => {
        let records = [];
        if (json.feed && json.feed.entry) {
          records = json.feed.entry.filter(item => {
            if (!!name) {
              if (item['im:name'].label.toUpperCase().indexOf(name.toUpperCase()) === -1) {
                return false;
              }
            }
            if (!!artist) {
              if (item['im:artist'].label.toUpperCase().indexOf(artist.toUpperCase()) === -1) {
                return false;
              }
            }
            return true;
          });
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
