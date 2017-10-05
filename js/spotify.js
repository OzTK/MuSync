if (window.location.hash) {
  window.opener.onSpotifyLogin(window.location.hash.split('&')[0].split('=')[1]);
} else if (window.location.search) {
  var err = new URL(window.location).searchParams.get("error");
  window.opener.onSpotifyLoginError(err);
}

window.open('', '_self', '');
window.close();