// Took from http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
// In Aug 10, 2014, 11:15 PM
// FUNCTION
// Union of two arrays
union_arrays = function(x, y) {
  var obj = {};
  for (var i = x.length-1; i >= 0; -- i)
     obj[x[i]] = x[i];
  for (var i = y.length-1; i >= 0; -- i)
     obj[y[i]] = y[i];
  var res = []
  for (var k in obj) {
    if (obj.hasOwnProperty(k))  // <-- optional
      res.push(obj[k]);
  }
  return res;
}

// Took from http://upshots.org/actionscript/javascript-splice-array-on-multiple-indices-multisplice
// In Aug 11, 2014, 12:16 AM, with few modifications to make it work with array instead of argument
// FUNCTION
// splice array on multiple indices
multisplice = function(array,args) {
    // var args = Array.apply(null, arguments).slice(1);
    args.sort(function(a, b){
        return a - b;
    });
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        array.splice(index, 1);
    }        
}

// FUNCTION
// Test if an array of array is empty
isArrayOfArrayEmpty = function(arrayOfArray) {
  counter = 0
  for (var i = 0; i < arrayOfArray.length; i++) {
    if(arrayOfArray[i].length == 0) { counter++ }
  }
  return (counter == arrayOfArray.length) ? true : false
}

// FUNCTION
// return the value of a array of object - key/value type -, given the key
findValueOfObjectInArray = function(keyToFind,arrayOfObject) {
  for (var i = 0; i < arrayOfObject.length; i++) {
    for (var key in arrayOfObject[i]) {
      if (key == keyToFind) { return arrayOfObject[i][key] }
    }
  }
  return -1
}

// FUNCTION
// find the index of the object in a array of objects if the key and value are equal to the given one
findIndexEqualObject = function(obj,arrayOfObj) {
  for (var i = 0; i < arrayOfObj.length; i++) {
    for (var keyInArr in arrayOfObj[i]) {
      for (var keyObj in obj) {
        if (keyInArr == keyObj && arrayOfObj[i][keyInArr] == obj[keyObj]) {
          return i
        }
      }
    }
  }
  return -1
}

// FUNCTIONS
// return a object from an array of objects, if the given string is inside the object
findTheObjectWith = function(thisString,arrayOfObjects) {
  var arrayOfSelectedObjects = []
  for (var i = 0; i < arrayOfObjects.length; ++i) {
    for (var chave in arrayOfObjects[i]) {
      if (arrayOfObjects[i][chave].indexOf(thisString) != -1) {
        arrayOfSelectedObjects.push(arrayOfObjects[i])
      }
    }
  }
  return arrayOfSelectedObjects
}

// FUNCTION
// Unpack the keys of a array of objects
unpackAllVariables = function(variables) {
  unpackedVariables = []
  for (var i = 0; i < variables.length; i++) {
    unpackedVariables.push(Object.keys(variables[i])[0])
  }
  return unpackedVariables
}

// FUNCTION
arrDiff = function(a1, a2) {
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=true;
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=true;
  for(var k in a)
    diff.push(k);
  return diff;
}