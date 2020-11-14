Array.prototype.myMap = function (callback) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) newArr.push(callback(this[i], i, this));
  return newArr;
};

function repeatPromiseUntilResolved(func) {
  return func()
    .then((res) => res)
    .catch(() => repeatPromiseUntilResolved(func));
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { getRndInteger, repeatPromiseUntilResolved };
