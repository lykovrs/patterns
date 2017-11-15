/**
 * Игрок
 */
class Player {
  constructor(name) {
    this.points = 0;
    this.name = name;
  }

  play() {
    this.points += 1;
    mediator.played();
  }
}

/**
 * Табло с результатами
 * @type {Object}
 */
let scoreboard = {
  // элемент HTML, который должен обновляться
  element: document.getElementById("results"),
  // обновляет счет на экране
  update: function(score) {
    let i,
      msg = "";
    for (i in score) {
      if (score.hasOwnProperty(i)) {
        msg += `<p><strong>${i}</strong>: ${score[i]}</p>`;
      }
    }
    this.element.innerHTML = msg;
  }
};

/**
 * Посредник
 * @type {Object}
 */
var mediator = {
  // все игроки
  players: {},
  // инициализация
  setup() {
    let players = this.players;
    players.home = new Player("Home");
    players.guest = new Player("Guest");
  },
  // обновляет счет, если кто­то из игроков сделал ход
  played() {
    let players = this.players,
      score = {
        Home: players.home.points,
        Guest: players.guest.points
      };
    scoreboard.update(score);
  },
  // обработчик действий пользователя
  keypress: e => {
    if (e.which === 49) {
      // key “1”
      mediator.players.home.play();
      return;
    }
    if (e.which === 48) {
      // key “0”
      mediator.players.guest.play();
      return;
    }
  }
};

// Старт!
mediator.setup();
window.onkeypress = mediator.keypress;
// Игра завершится через 30 секунд
setTimeout(function() {
  window.onkeypress = null;
  alert("Game over!");
}, 30000);
