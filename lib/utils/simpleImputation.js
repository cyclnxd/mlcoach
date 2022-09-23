class SimpleImputation {
  constructor(strategy, whichValue = null, copy = true) {
    this.mean;
    this.median;
    this.most_frequent;
    this.minumum;
    this.maximum;
    this.strategy = strategy;
    this.whichValue = whichValue;
    this.copy = copy;
  }

  transformData(selectedColumn, data) {
    if (this.strategy === "Mean") {
      this.mean = this.#Mean(selectedColumn, data);
    } else if (this.strategy === "Median") {
      this.median = this.#Median(selectedColumn, data);
    } else if (this.strategy === "Most_frequent") {
      this.most_frequent = this.#Mode(selectedColumn, data);
    } else if (this.strategy === "Minimum") {
      this.minumum = this.#Minimum(selectedColumn, data);
    } else if (this.strategy === "Maximum") {
      this.maximum = this.#Maximum(selectedColumn, data);
    }
  }
  #Mean(selectedColumn, data) {
    var sum = 0;
    for (var index in data) {
      if (data[index][selectedColumn]) {
        sum += parseFloat(data[index][selectedColumn]);
      }
    }
    for (var index in data) {
      if (!data[index][selectedColumn]) {
        data[index][selectedColumn] = sum / data.length;
      }
    }
    return sum / data.length;
  }
  #Median(selectedColumn, data) {
    var array = [];
    for (var index in data) {
      if (data[index][selectedColumn]) {
        array.push(data[index][selectedColumn]);
      }
    }
    array = quickSort(array);
    for (var index in data) {
      if (!data[index][selectedColumn]) {
        data[index][selectedColumn] = array[Math.floor(array.length / 2)];
      }
    }
    return array[Math.floor(array.length / 2)];
  }

  #Mode(selectedColumn, data) {
    var modes = [];
    var count = [];
    var number;
    var maxIndex = 0;
    for (var index in data) {
      number = data[index][selectedColumn];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
        maxIndex = count[number];
      }
    }
    for (var index in count)
      if (count.hasOwnProperty(index)) {
        if (count[index] === maxIndex) {
          modes.push(Number(index));
        }
      }
    return modes;
  }
  #Maximum(selectedColumn, data) {
    var max = Number.MIN_VALUE;
    for (var index in data) {
      if (data[index][selectedColumn]) {
        if (data[index][selectedColumn] > max) {
          max = data[index][selectedColumn];
        }
      }
    }
    for (var index in data) {
      if (!data[index][selectedColumn]) {
        data[index][selectedColumn] = max;
      }
    }
    return max;
  }
  #Minimum(selectedColumn, data) {
    var min = Number.MAX_VALUE;
    for (var index in data) {
      if (data[index][selectedColumn]) {
        if (data[index][selectedColumn] < min) {
          min = data[index][selectedColumn];
        }
      }
    }
    for (var index in data) {
      if (!data[index][selectedColumn]) {
        data[index][selectedColumn] = min;
      }
    }

    return min;
  }
  getMean() {
    return this.mean;
  }
  getMedian() {
    return this.median;
  }
  getMode() {
    return this.most_frequent;
  }
  getMinimum() {
    return this.minumum;
  }
  getMaximum() {
    return this.maximum;
  }
  checkStrategy() {
    if (
      this.strategy === "Mean" ||
      this.strategy === "Median" ||
      this.strategy === "Most_frequent" ||
      this.strategy === "Minumum" ||
      this.strategy === "Maximum"
    ) {
      return true;
    } else {
      return false;
    }
  }
}
function quickSort(Array) {
  if (Array.length <= 1) {
    return Array;
  } else {
    var left = [];
    var right = [];
    var newArray = [];
    var pivot = Array.pop();
    var length = Array.length;
    for (var i = 0; i < length; i++) {
      if (Array[i] <= pivot) {
        left.push(Array[i]);
      } else {
        right.push(Array[i]);
      }
    }
    return newArray.concat(quickSort(left), pivot, quickSort(right));
  }
}
export default SimpleImputation;
