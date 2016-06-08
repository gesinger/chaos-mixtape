# Chaos Mixtape

Tools for creating a series of chaotic player actions, then replaying them

## Usage

First, copy mover.js

```shell
$ cat mover.js | pbcopy # on Mac
```

Then, open a page with a player in a browser and open the console.

Create a reference to the player

```javascript
var player = videojs('player_id');
```

Paste the clipboard contents into the console. The player should start playing and logging the actions it is taking.

After the player has run long enough to encounter the condition you want to replay, copy the console log. clear out any prefixes before the message (e.g., on Chrome, VM# and a space), then on a new page save the logs in a var called logs.

```javascript
var player = videojs('player_id'); # need the player reference for the new page
var logs = """
INSERT
LOGS
HERE
""";
```

The player should start replaying and it should take the same actions as has been recorded.

## Changing actions

Note that the only actions currently supported are seek and rendition switches. To add new actions, add them to the `actions` object in mover.js. To change the frequency with which actions are run, modify either the interval timing or the random generator at the top of the interval function.
