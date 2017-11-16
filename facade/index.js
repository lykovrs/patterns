var myevent = {
  // ... комбинируем часто вместе вызываемые методы в отдельный
  stop: function(e) {
    // прочие броузеры
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
  }
};
// ... };
