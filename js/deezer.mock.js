var DZ = {
  isConnected: false,
  loggedInResponse: {
    authResponse: "valid"
  },
  init: function (options) {},
  getLoginStatus: function (cb) {
    cb(this.isConnected ? this.loggedInResponse : {});
  },
  login: function (cb) {
    this.isConnected = true;
    cb(this.loggedInResponse);
  },
  logout: function () {
    this.isConnected = false;
  },
  api: function (url, cb) {
    if (url.startsWith("/user/me/playlists")) {
      cb({
        data: [{
            id: 1,
            title: "Favorites",
            nb_tracks: 5,
            link: "http://track/1"
          },
          {
            id: 2,
            title: "Fiesta",
            nb_tracks: 5,
            link: "http://track/2"
          },
          {
            id: 3,
            title: "Au calme",
            nb_tracks: 5,
            link: "http://track/3"
          },
          {
            id: 4,
            title: "Chouchou",
            nb_tracks: 5,
            link: "http://track/4"
          }
        ]
      });
    } else if (url.startsWith("/playlist/")) {
      cb({
        data: [{
            id: 9,
            title: "I love you",
            artist: {
              name: "Johnny Halliday"
            },
            link: "http://track/9"
          },
          {
            id: 8,
            title: "Don't forget me",
            artist: {
              name: "Serge Gainsbourg"
            },
            link: "http://track/8"
          },
          {
            id: 7,
            title: "Take that",
            artist: {
              name: "The Beatles"
            },
            link: "http://track/7"
          },
          {
            id: 6,
            title: "Bonjour la France",
            artist: {
              name: "Peter McCalloway"
            },
            link: "http://track/6"
          },
          {
            id: 5,
            title: "Manger du pain",
            artist: {
              name: "Petit Bourguignon"
            },
            link: "http://track/5"
          }
        ]
      });
    } else if (url.startsWith("/search/track")) {
      cb({
        data: getRandomMatchingSongs()
      });
    }
  }
};

function getRandomMatchingSongs() {
  var songCount = Math.random() * 10;
  var songs = [];

  for (let index = 0; index <= songCount; index++) {
    songs.push({
      id: index,
      title: `Sample song ${index}`,
      artist: {
        name: `Sample artist ${index}`
      }
    });
  }

  return songs;
}

dzAsyncInit();