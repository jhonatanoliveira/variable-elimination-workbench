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
function removeVariable(variable, cpts) {
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
// Find an elimination ordering
function findEliminationOrdering(variablesToEliminate, cpts) {
	// creating tie structure
	var ties = {}
	for (var i = 0; i < variablesToEliminate.length; i++) {
		ties[i] = {
			isTied: false,
			variablesAlreadyChosen: []
		}
	}
	// Find alimination orderings throughout the ties
	var eliminationOrderings = []
	var eliminationOrdering = []
	copyOfvariablesToEliminate = variablesToEliminate.slice(0)
	// find one elimination ordering
	for (var i = 0; i < variablesToEliminate.length; i++) {
		var scores = scoreMinNeighbor(copyOfvariablesToEliminate,cpts)
		// Finding variable with minimun score
		var variablesWithMinimunScore = findVariablesWithMinimunScore(scores)
		// managing ties
		var thereIsAtie = (variablesWithMinimunScore.length > 1) ? true : false;
		var variableWithMinimunScore
		if (thereIsAtie) {
			ties[i].isTied = true
			var indexOfChosenVariableInTie
			for (var j = 0; j < variablesWithMinimunScore.length; j++) {
				if (ties[i].variablesAlreadyChosen.indexOf(variablesWithMinimunScore[j]) == -1) {
					ties[i].variablesAlreadyChosen.push(variablesWithMinimunScore[j])
					indexOfChosenVariableInTie = j
					break
				}
			}
			variableWithMinimunScore = variablesWithMinimunScore[indexOfChosenVariableInTie]
		} else {
			variableWithMinimunScore = variablesWithMinimunScore[0]
		}
		// save the variable
		eliminationOrdering.push(variableWithMinimunScore)
		// remove variable with minimun score
		cpts = removeVariable(variableWithMinimunScore,cpts)
		// remove from the list of variables to eliminate
		copyOfvariablesToEliminate.splice(0,1);
	}
	eliminationOrderings.push(eliminationOrdering);

	// trying to manage ties

	return eliminationOrderings
}

// FUNCTION
// Given the scores, find a variable to eliminate with the minimun score
function findVariablesWithMinimunScore(scores) {
	var actualMinimunScore = []
	var variablesWithMinimunScore  = []
	for (var variable in scores) {
		if (actualMinimunScore.length == 0 || actualMinimunScore > scores[variable]) {
			actualMinimunScore = scores[variable]
			variablesWithMinimunScore = [variable]
		} else if (actualMinimunScore == scores[variable]) {
			actualMinimunScore = scores[variable]
			variablesWithMinimunScore.push(variable)
		}
	}
	return variablesWithMinimunScore
}
