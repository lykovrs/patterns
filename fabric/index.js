// родительский конструктор
function CarMaker() {}
// метод предка
CarMaker.prototype.drive = function() {
  return "Vroom, I have " + this.doors + " doors";
};
// статический фабричный метод
CarMaker.factory = function(type) {
  var constr = type,
    newcar;
  // сообщить об ошибке, если конструктор
  // для запрошенного типа отсутствует
  if (typeof CarMaker[constr] !== "function") {
    throw {
      name: "Error",
      message: constr + " doesn't exist"
    };
  }
  // в этой точке известно, что требуемый конструктор существует
  // поэтому определим отношения наследования с предком,
  // но только один раз
  if (typeof CarMaker[constr].prototype.drive !== "function") {
    CarMaker[constr].prototype = new CarMaker();
  }

  // создать новый экземпляр
  newcar = new CarMaker[constr]();
  // дополнительно можно вызвать какие­либо методы
  // и затем вернуть объект...
  return newcar;
};
// специализированные конструкторы
CarMaker.Compact = function() {
  this.doors = 4;
};
CarMaker.Convertible = function() {
  this.doors = 2;
};
CarMaker.SUV = function() {
  this.doors = 24;
};

var corolla = CarMaker.factory("Compact");
var solstice = CarMaker.factory("Convertible");
var cherokee = CarMaker.factory("SUV");

console.log(corolla.drive());
console.log(solstice.drive());
console.log(cherokee.drive());
