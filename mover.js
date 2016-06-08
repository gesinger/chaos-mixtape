// var player = videojs('INSERT_PLAYER_ID');

var
  hls = player.tech_.hls,
  playlists = hls.playlists.master.playlists,
  EXCLUDE_FOREVER_TIME = 9999999999999,
  excludeAllExcept = function(keep) {
    playlists.forEach(function(playlist) {
      playlist.excludeUntil = keep.includes(playlist.attributes.BANDWIDTH) ? undefined
        : EXCLUDE_FOREVER_TIME;
    });
  },
  actions = {
    seek: function() {
      var seekTo = Math.floor(Math.random() * player.duration() + 1); // 0 => duration

      console.log('Seeking from ' + player.currentTime() + ' to ' + seekTo);
      player.currentTime(seekTo);
    },
    changeMedia: function() {
      var
        newMedia,
        currentMedia = hls.playlists.media();

      while (!newMedia || newMedia === currentMedia) {
        newMedia = playlists[Math.floor(Math.random() * playlists.length)];
      }

      excludeAllExcept([newMedia.attributes.BANDWIDTH]);

      console.log('Changing media from ' + currentMedia.attributes.BANDWIDTH +
        ' to ' + newMedia.attributes.BANDWIDTH + ' at ' + player.currentTime());
      hls.playlists.media(newMedia);
    }
  };

// blacklist all playlists except one to start (so there is no automatic switching)
// start with lowest resolution
excludeAllExcept([playlists[0].attributes.BANDWIDTH]);

setInterval(function() {
  // randomly run with 50% probability
  if (Math.floor(Math.random() * 2) !== 1) {
    console.log('Skipping at time: ' + player.currentTime());
    return;
  }

  var
    keys = Object.keys(actions),
    action = actions[keys[Math.floor(Math.random() * (keys.length))]];

  action();
}, 2000); // run every 2 seconds

player.play();
