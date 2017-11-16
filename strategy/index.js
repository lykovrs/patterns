var validator = {
  // все доступные проверки
  types: {},
  // сообщения об ошибках
  // в текущем сеансе проверки
  messages: [], // текущие параметры проверки
  // имя: тип проверки
  config: {},
  // интерфейсный метод
  // аргумент `data` – это пары ключ => значение
  validate(data) {
    var i, msg, type, checker, result_ok;
    // удалить все сообщения
    this.messages = [];
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i];
        checker = this.types[type];
        if (!type) {
          continue; // проверка не требуется
        }
        if (!checker) {
          // ай­яй­яй
          throw {
            name: "ValidationError",
            message: "No handler to validate type " + type
          };
        }
        result_ok = checker.validate(data[i]);
        if (!result_ok) {
          msg = "Invalid value for *" + i + "*, " + checker.instructions;
          this.messages.push(msg);
        }
      }
    }
    return this.hasErrors();
  },
  // вспомогательный метод
  hasErrors() {
    return this.messages.length !== 0;
  }
};

// проверяет наличие значения
validator.types.isNonEmpty = {
  validate: function(value) {
    return value !== "";
  },
  instructions: "the value cannot be empty"
};
// проверяет, является ли значение числом
validator.types.isNumber = {
  validate: function(value) {
    return !isNaN(value);
  },
  instructions: "the value can only be a valid number, e.g. 1, 3.14 or 2010"
};
// проверяет, содержит ли значение только буквы и цифры
validator.types.isAlphaNum = {
  validate: function(value) {
    return !/[^a­z0­9]/i.test(value);
  },
  instructions:
    "the value can only contain characters and numbers,  no special symbols"
};

validator.config = {
  first_name: "isNonEmpty",
  age: "isNumber",
  username: "isAlphaNum"
};

var data = {
  first_name: "Super",
  last_name: "Man",
  age: "unknown",
  username: "o_O"
};

validator.validate(data);
if (validator.hasErrors()) {
  console.log(validator.messages.join("\n"));
}
