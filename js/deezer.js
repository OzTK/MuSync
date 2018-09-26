var dzInitialized = false;
var isDzConnected = false;

function loadDeezer() {
  window.dzAsyncInit = function () {
    DZ.init({
      appId: config.deezerAppId,
      channelUrl: config.scheme + "://" + config.domain + "/deezer_channel.html"
    });

    dzInitialized = true;
    if (typeof elmApp !== "undefined") {
      getDeezerStatus(elmApp.ports.updateStatus.send);
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
    isDzConnected = !!response.authResponse;
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
      isDzConnected = response.authResponse !== undefined;
      cb(isDzConnected);
    }, {
      perms: "basic_access,manage_library"
    }
  );
}

function loadDeezerPlaylists(cb) {
  DZ.api("/user/me/playlists", function (response) {
    cb(response.data ? response.data : null);
  });
}

function createDeezerPlaylists(name) {
  return new Promise((ok, err) => {
    DZ.api("/user/me/playlists", "POST", {
      title: name
    }, function (response) {
      if (response.error) {
        err(response.error);
      } else {
        ok(response.id);
      }
    });
  });
}

function addTracksToPlaylist(pid, trackIds) {
  return new Promise((ok, err) => {
    DZ.api("/playlist/" + pid + "/tracks", "POST", {
      songs: trackIds.join(",")
    }, function (response) {
      if (response && response.error) {
        err(response.error);
      } else {
        ok(pid);
      }
    });
  });
}

function loadDeezerPlaylistSongs(pid, cb) {
  DZ.api("/playlist/" + pid + "/tracks", function (response) {
    cb(response.data && response.data);
  });
}

function loadDeezerPlaylist(pid) {
  return new Promise((ok, err) => {
    DZ.api("/playlist/" + pid, function (response) {
      if (!response.error) {
        ok(response);
      } else {
        err(response.error);
      }
    });
  });
}

function searchDeezerSong(artist, title, cb) {
  var query = 'artist:"' + artist + '" track:"' + title + '"';
  DZ.api("/search/track?strict=on&q=" + encodeURIComponent(query), function (response) {
    cb(response.data && response.data);
  });
}

loadDeezer();