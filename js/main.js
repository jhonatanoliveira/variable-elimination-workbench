var _cpts = [
	{
		head: ['a'],
		tail: ['d']
	},
	{
		head: ['b'],
		tail: ['a','d']
	},
	{
		head: ['c'],
		tail: ['b','d']
	},
	{
		head: ['d'],
		tail: []
	},
	{
		head: ['e'],
		tail: ['a']
	}
]

var _variables = [
	{'a': 2},
	{'b': 4},
	{'c': 8},
	{'d': 3},
	{'e': 2}
]

var _variablesToEliminate = [
	{'a': 2},
	{'b': 4},
	{'d': 3}
]

var _cpts2 = [
	{
		head: ['a'],
		tail: []
	},
	{
		head: ['b'],
		tail: ['a']
	},
	{
		head: ['c'],
		tail: []
	},
	{
		head: ['d'],
		tail: []
	},
	{
		head: ['e'],
		tail: ['a','c','d']
	},
	{
		head: ['f'],
		tail: ['b','e']
	}
]

var _variables2 = [
	{'a': 5},
	{'b': 2},
	{'c': 2},
	{'d': 2},
	{'e': 2},
	{'f': 2}
]

var _variablesToEliminate2 = [
	{'a': 5},
	{'b': 2},
	{'c': 2},
	{'e': 2}
]

// FUNCTION
// Scores the current variables of the CPTs using Min Neighbors
function scoreMinNeighbor(variables, cpts) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variables.length; i++) {
		var variable = Object.keys(variables[i])[0]
		var neighbors = []
		// Loop on all CPTs
		for (var j = 0; j < cpts.length; j++) {
			// If the variable is in the CPT...
			if (cpts[j].head.indexOf(variable) != -1 || cpts[j].tail.indexOf(variable) != -1) {
				// ...then fetch its neighbors
				for (var k = 0; k < cpts[j].head.length; k++) {
					if (cpts[j].head[k] != variable && neighbors.indexOf(cpts[j].head[k]) == -1) {
						neighbors.push(cpts[j].head[k])
					}
				}
				for (var k = 0; k < cpts[j].tail.length; k++) {
					if (cpts[j].tail.length != 0 && cpts[j].tail[k] != variable && neighbors.indexOf(cpts[j].tail[k]) == -1) {
						neighbors.push(cpts[j].tail[k])
					}
				}
			}
		}
		// Register score of variable
		scores[variable] = neighbors.length
	}
	return scores
}

// FUNCTION
// Removes a variable v by multiplying the CPTs with the variable v
function removeVariable(_variable, cpts) {
	// unroll variable value
	var variable = ''
	for (var key in _variable) {
		variable = key
	}
	var product = { head: [], tail: [] }
	// Loop on all CPTs
	var indexesToRemove = []
	for (var j = 0; j < cpts.length; j++) {
		// If the variable is in the CPT
		if (cpts[j].head.indexOf(variable) != -1 || cpts[j].tail.indexOf(variable) != -1) {
			product = multiply(product,cpts[j]) // multiply with the current product
			indexesToRemove.push(j)
		}
	}
	// Only do the rest of the modifications if the variable exist in some CPT
	if (indexesToRemove.length != 0) {
		// remove original CPTs from the set
		multisplice(cpts,indexesToRemove)
		// remove the variable from head and tail
		var indexOfVariableInHead = product.head.indexOf(variable)
		if (indexOfVariableInHead != -1) {
			product.head.splice(indexOfVariableInHead,1)
		}
		var indexOfVariableInTail = product.tail.indexOf(variable)
		if (indexOfVariableInTail != -1) {
			product.tail.splice(indexOfVariableInTail,1)
		}
		cpts.push(product) // add the product to the set
	}
	return cpts
}

// FUNCTION
// Multiply two CPTs
function multiply(cpt1, cpt2) {
	// The head variables are always in the head of the product CPT
	var productHead = union_arrays(cpt1.head, cpt2.head)
	// One tail variables can go to the head if at least one of its instance is in the head
	var productTail = []
	for (var i = 0; i < cpt1.tail.length; i++) {
		// Check if at least one instance of the tail variable is in the head
		if (cpt1.tail.length != 0 && productHead.indexOf(cpt1.tail[i]) == -1 && productTail.indexOf(cpt1.tail[i]) == -1) {
			productTail.push(cpt1.tail[i])
		}
	}
	for (var i = 0; i < cpt2.tail.length; i++) {
		// Check if at least one instance of the tail variable is in the head
		if (cpt2.tail.length != 0 && productHead.indexOf(cpt2.tail[i]) == -1 && productTail.indexOf(cpt2.tail[i]) == -1) {
			productTail.push(cpt2.tail[i])
		}
	}
	return {head: productHead, tail: productTail}
}

// FUNCTION
// Find one elimination ordering
function findOneEliminationOrdering(variablesToEliminate, cpts, eliminationOrdering, eliminationOrderings) {
	var scores = scoreMinNeighbor(variablesToEliminate,cpts)
	var variablesWithMinimunScore = findVariablesWithMinimunScore(scores, variablesToEliminate)

	var variablesWithMinimunScore = variablesWithMinimunScore.slice(0)
	var copyOfCpts = cpts.slice(0)
	if (variablesWithMinimunScore.length > 1) {
		for (var i = 0; i < variablesWithMinimunScore.length; i++) {
			copyOfCpts = removeVariable(variablesWithMinimunScore[i], copyOfCpts)
			eliminationOrdering.push(variablesWithMinimunScore[i])
			var tmpCopy = variablesToEliminate.slice(0)
			tmpCopy.splice(findIndexEqualObject(variablesWithMinimunScore[i],tmpCopy),1)
			findOneEliminationOrdering(tmpCopy, copyOfCpts.slice(0), eliminationOrdering, eliminationOrderings)
			eliminationOrdering.pop()
			if (eliminationOrdering.length == 0) { copyOfCpts = cpts.slice(0) }
		}
	} else {
		copyOfCpts = removeVariable(variablesWithMinimunScore[0], copyOfCpts)
		eliminationOrdering.push(variablesWithMinimunScore[0])
		var tmpCopy = variablesToEliminate.slice(0)
		tmpCopy.splice(findIndexEqualObject(variablesWithMinimunScore[0],tmpCopy),1)
		if (tmpCopy.length) {
			findOneEliminationOrdering(tmpCopy, copyOfCpts.slice(0), eliminationOrdering, eliminationOrderings)
			eliminationOrdering.pop()
			if (eliminationOrdering.length == 0) { copyOfCpts = cpts.slice(0) }
		} else {
			eliminationOrderings.push(eliminationOrdering.slice(0))
			eliminationOrdering.pop()
		}
	}
}

// FUNCTION
// Given the scores, find a variable to eliminate with the minimun score
function findVariablesWithMinimunScore(scores, variables) {
	var actualMinimunScore = []
	var variablesWithMinimunScore  = []
	for (var variable in scores) {
		if (actualMinimunScore.length == 0 || actualMinimunScore > scores[variable]) {
			actualMinimunScore = scores[variable]
			variablesWithMinimunScore = []
			variablesWithMinimunScore[0] = {}
			variablesWithMinimunScore[0][variable] = findValueOfObjectInArray(variable,variables)
		} else if (actualMinimunScore == scores[variable]) {
			actualMinimunScore = scores[variable]
			var objTemp = {}
			objTemp[variable] = findValueOfObjectInArray(variable,variables)
			variablesWithMinimunScore.push(objTemp)
		}
	}
	return variablesWithMinimunScore
}
