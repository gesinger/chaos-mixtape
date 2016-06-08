// var player = videojs('INSERT_PLAYER_ID');
// var logs = """
// INSERT
// LOGS
// HERE
// """;

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
  mediaForBandwidth = function(bandwidth) {
    playlists.find(function(playlist) {
      return playlist.attributes.BANDWIDTH === bandwidth;
    });
  },
  wait = function(seconds) {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, 1000*seconds);
    });
  },
  changeToBandwidth = function(bandwidth) {
    return new Promise(function(resolve, reject) {
      excludeAllExcept([bandwidth]);
      hls.playlists.media(mediaForBandwidth(bandwidth));
      resolve();
    });
  };

player.play();

var promise = wait(4); // placeholder
var previousTime = 0;

logs = logs.split(/\n/);

for (var lineKey in logs) {
  var
    line = logs[lineKey],
    lastTime,
    seekTo,
    changeTo,
    numbers = line.match(/[0-9\.]+/g);

  if (line.startsWith('Skipping')) {
    continue;
  }

  if (line.startsWith('Changing')) {
    lastTime = numbers[2];
    changeTo = numbers[1];

    console.log(
      'Adding a wait of ' + (lastTime - previousTime) + ', then change to: ' + changeTo);
    promise = promise
      .then(function() { return wait(lastTime - previousTime); })
      .then(function() { return changeToBandwidth(changeTo); });

    previousTime = lastTime;
  } else if (line.startsWith('Seeking')) {
    lastTime = numbers[0];
    seekTo = numbers[1];

    console.log(
      'Adding a wait of ' + (lastTime - previousTime) + ', then seek to: ' + seekTo);
    promise = promise
      .then(function() { return wait(lastTime - previousTime); })
      .then(function() { player.currentTime(seekTo); });

    previousTime = seekTo;
  }
}
