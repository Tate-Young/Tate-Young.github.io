function quickSortUsingArray(arr) {
  let len = arr.length;

  if (len <= 1) {
    return arr;
  }

  let splitIndex = Math.floor(len / 2);
  let splitVal = arr.splice(splitIndex, 1);
  let minorArr = [],
      majorArr = [];

  arr.forEach(element => {
    if (element < splitVal) {
      minorArr.push(element)
    } else {
      majorArr.push(element);
    }
  });

  return quickSortUsingArray(minorArr).concat(splitVal).concat(quickSortUsingArray(majorArr));
}


function quickSortNotUsingArray(arr) {
  let len = arr.length;

  for (var m = 0; m < len - 1; m++) {
    for (var n = m + 1; n < len; n++) {
      if (arr[m] > arr[n]) {
        var tmpArr = arr[m];
        arr[m] = arr[n];
        arr[n] = tmpArr;
      }
    }
  }

  return arr;
}
