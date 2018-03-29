var DZ = {
  isConnected: false,
  loggedInResponse: { authResponse: "valid" },
  init: function(options) {},
  getLoginStatus: function(cb) {
    cb(this.isConnected ? this.loggedInResponse : {});
  },
  login: function(cb) {
    this.isConnected = true;
    cb(this.loggedInResponse);
  },
  logout: function() {
    this.isConnected = false;
  },
  api: function(url, cb) {
    if (url.startsWith("/user/me/playlists")) {
      return [
        { id: 1, title: "Favorites", nb_tracks: 5 },
        { id: 2, title: "Fiesta", nb_tracks: 5 },
        { id: 3, title: "Au calme", nb_tracks: 5 },
        { id: 4, title: "Chouchou", nb_tracks: 5 }
      ];
    } else if (url.startsWith("/playlist/")) {
      return [
        { title: "I love you", artist: "Johnny Halliday" },
        { title: "Don't forget me", artist: "Serge Gainsbourg" },
        { title: "Take that", artist: "The Beatles" },
        { title: "Bonjour la France", artist: "Peter McCalloway" },
        { title: "Manger du pain", artist: "Petit Bourguignon" }
      ];
    }
  }
};

dzAsyncInit();
