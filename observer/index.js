let publisher = {
  subscribers: {
    any: []
  },
  on(type, fn, context) {
    type = type || "any";
    fn = typeof fn === "function" ? fn : context[fn];

    if (typeof this.subscribers[type] === "undefined") {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push({ fn: fn, context: context || this });
  },
  remove(type, fn, context) {
    this.visitSubscribers("unsubscribe", type, fn, context);
  },
  fire(type, publication) {
    this.visitSubscribers("publish", type, publication);
  },
  visitSubscribers(action, type, arg, context) {
    let pubtype = type || "any",
      subscribers = this.subscribers[pubtype],
      i,
      max = subscribers ? subscribers.length : 0;

    for (i = 0; i < max; i += 1) {
      if (action === "publish") {
        subscribers[i].fn.call(subscribers[i].context, arg);
      } else {
        if (subscribers[i].fn === arg && subscribers[i].context === context) {
          subscribers.splice(i, 1);
        }
      }
    }
  }
};

function makePublisher(o) {
  let i;
  for (i in publisher) {
    if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
      o[i] = publisher[i];
    }
  }
  o.subscribers = { any: [] };
}

let game = {
  keys: {},

  addPlayer(player) {
    let key = player.key.toString().charCodeAt(0);
    this.keys[key] = player;
  },

  handleKeypress(e) {
    e = e || window.event; // IE
    if (game.keys[e.which]) {
      game.keys[e.which].play();
    }
  },

  handlePlay(player) {
    let i,
      players = this.keys,
      score = {};

    for (i in players) {
      if (players.hasOwnProperty(i)) {
        score[players[i].name] = players[i].points;
      }
    }
    this.fire("scorechange", score);
  }
};

class Player {
  constructor(name, key) {
    this.points = 0;
    this.name = name;
    this.key = key;
    this.fire("newplayer", this);
  }

  play() {
    this.points += 1;
    this.fire("play", this);
  }
}

let scoreboard = {
  element: document.getElementById("results"),

  update(score) {
    let i,
      msg = "";
    for (i in score) {
      if (score.hasOwnProperty(i)) {
        msg += "<p><strong>" + i + "</strong>: ";
        msg += score[i];
        msg += "</p>";
      }
    }
    this.element.innerHTML = msg;
  }
};

makePublisher(Player.prototype);
makePublisher(game);

Player.prototype.on("newplayer", "addPlayer", game);
Player.prototype.on("play", "handlePlay", game);

game.on("scorechange", scoreboard.update, scoreboard);

window.onkeypress = game.handleKeypress;

let playername, key;
while (1) {
  playername = prompt("Add player (name)");
  if (!playername) {
    break;
  }
  while (1) {
    key = prompt("Key for " + playername + "?");
    if (key) {
      break;
    }
  }
  new Player(playername, key);
}
