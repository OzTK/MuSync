var dzInitialized = false;
var isDzConnected = false;

function loadDeezer() {
  window.dzAsyncInit = function () {
    DZ.init({
      appId: config.deezerAppId,
      channelUrl: config.scheme + "://" + config.domain + "/deezer_channel.html"
    });

    dzInitialized = true;
    if (typeof elmApp != "undefined") {
      getDeezerStatus(elmApp.ports.updateDeezerStatus.send);
    }
  };

  (function () {
    var e = document.createElement("script");
    e.src = config.local ?
      "/js/deezer.mock.js" :
      "https://e-cdns-files.dzcdn.net/js/min/dz.js";
    e.async = true;
    document.getElementById("dz-root").appendChild(e);
  })();
}

function getDeezerStatus(cb) {
  DZ.getLoginStatus(function (response) {
    isDzConnected = response.authResponse != undefined;
    cb(isDzConnected);
  });
}

function disconnectDeezer() {
  DZ.logout();
  document.cookie = "currentAuthResponse=;";
}

function connectDeezer(cb) {
  DZ.login(
    function (response) {
      isDzConnected = response.authResponse != undefined;
      cb(isDzConnected);
    }, {
      perms: "basic_access"
    }
  );
}

function loadDeezerPlaylists(cb) {
  DZ.api("/user/me/playlists", function (response) {
    cb(response.data ? response.data : null);
  });
}

function loadDeezerPlaylistSongs(pid, cb) {
  DZ.api("/playlist/" + pid, function (response) {
    cb(
      response.tracks && response.tracks.data ?
      response.tracks.data.map((s) => ({
        id: s.id.toString(),
        title: s.title,
        artist: s.artist.name
      })) :
      null
    );
  });
}

function searchDeezerSong(artist, title, cb) {
  DZ.api("/search/track?strict=on&q=" + 'artist:"' + artist + '" track:"' + title + '"', function (response) {
    cb(response.data && response.data.map((t) => ({
      id: t.id.toString(),
      title: t.title,
      artist: t.artist.name
    })));
  });
}

loadDeezer();