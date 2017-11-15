// Экземпляр в статическом свойстве
console.log("<---Экземпляр в статическом свойстве--->");
function Universe() {
  // имеется ли экземпляр, созданный ранее?
  if (typeof Universe.instance === "object") {
    return Universe.instance;
  }
  // создать новый экземпляр
  this.start_time = 0;
  this.bang = "Big";
  // сохранить его
  Universe.instance = this;
  // неявный возврат экземпляра:
  // return this;
}
// проверка
var uni = new Universe();
var uni2 = new Universe();
console.log(uni === uni2); // true

console.log("<---Экземпляр в замыкании--->");

// Экземпляр в замыкании
function Universe2() {
  // сохраненный экземпляр
  var instance;
  // переопределить конструктор
  Universe2 = function Universe2() {
    return instance;
  };
  // перенести свойства прототипа
  Universe2.prototype = this;
  // создать экземпляр
  instance = new Universe2();
  // переустановить указатель на конструктор
  instance.constructor = Universe2;
  // добавить остальную функциональность
  instance.start_time = 0;
  instance.bang = "Big";
  return instance;
}

// добавить свойство в прототип и создать экземпляр
Universe2.prototype.nothing = true; // true
var uni = new Universe2();
Universe2.prototype.everything = true; // true
var uni2 = new Universe2();
// тот же самый экземпляр
console.log("тот же самый экземпляр =>", uni === uni2); // true
// все свойства прототипа доступны
// независимо от того, когда они были добавлены
console.log(
  "все свойства прототипа доступны =>",
  uni.nothing && uni.everything && uni2.nothing && uni2.everything
);
// true
// обычные свойства объекта также доступны
console.log("обычные свойства объекта также доступны =>", uni.bang); // "Big"
// ссылка на конструктор содержит правильный указатель
console.log(
  "ссылка на конструктор содержит правильный указатель =>",
  uni.constructor === Universe2
); // true
