let agg = (function() {
  let index = 0,
    data = [1, 2, 3, 4, 5],
    length = data.length;
  return {
    next() {
      let element;
      if (!this.hasNext()) {
        return null;
      }
      element = data[index];
      index = index + 2;
      return element;
    },
    hasNext() {
      return index < length;
    },
    rewind() {
      index = 0;
    },
    current() {
      return data[index];
    }
  };
})();

// этот цикл выведет значения 1, 3 и 5
while (agg.hasNext()) {
  console.log(agg.next());
}
// возврат
agg.rewind();
console.log(agg.current()); // 1
