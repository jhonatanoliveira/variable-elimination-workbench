// Took from http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
// In Aug 10, 2014, 11:15 PM
// FUNCTION
// Union of two arrays
function union_arrays (x, y) {
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
// ARRAY METHOD
// splice array on multiple indices
function multisplice (array,args) {
    // var args = Array.apply(null, arguments).slice(1);
    args.sort(function(a, b){
        return a - b;
    });
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        array.splice(index, 1);
    }        
}