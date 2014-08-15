// ###### MANIPULATING CPTS ######

// FUNCTION
// Removes a variable v by multiplying the CPTs with the variable v
function eliminateVariable(_variable, cpts) {
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
		product = sumOut(variable,product)
		cpts.push(product) // add the product to the set
	}
	return cpts
}

// FUNCTION
// Sumout a variable from the CPT
function sumOut(variable,cpt) {
	// remove the variable from head and tail
	var indexOfVariableInHead = cpt.head.indexOf(variable)
	if (indexOfVariableInHead != -1) {
		cpt.head.splice(indexOfVariableInHead,1)
	}
	var indexOfVariableInTail = cpt.tail.indexOf(variable)
	if (indexOfVariableInTail != -1) {
		cpt.tail.splice(indexOfVariableInTail,1)
	}
	return cpt
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



// ###### SCORINGS ######

// FUNCTION
// Scores the current variables of the CPTs using Min Neighbors
function scoreMinNeighbor(variablesToScore, cpts, allVariables) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variablesToScore.length; i++) {
		var variable = Object.keys(variablesToScore[i])[0]
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
// Scores the current variables of the CPTs using Min Weight
function scoreMinWeight(variablesToScore, cpts, allVariables) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variablesToScore.length; i++) {
		var variable = Object.keys(variablesToScore[i])[0]
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
		// Calculate the score
		var product = 1
		for (var j = 0; j < neighbors.length; j++) {
			product *= findValueOfObjectInArray(neighbors[j],allVariables)
		}
		// Register score of variable
		scores[variable] = product
	}
	return scores
}

// FUNCTION
// Scores the current variables of the CPTs using Min Fill
function scoreMinFill(variablesToScore, cpts, allVariables) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variablesToScore.length; i++) {
		var variable = Object.keys(variablesToScore[i])[0]
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
	}
	return scores
}



// ###### FINDING ELIMINATION ORDERINGS ######

// FUNCTION
// Find one elimination ordering
function findOneEliminationOrdering(variablesToEliminate, cpts, eliminationOrdering, eliminationOrderings, scoringFunction, allVariables) {
	var scores = scoringFunction(variablesToEliminate,cpts, allVariables)
	var variablesWithMinimunScore = findVariablesWithMinimunScore(scores, variablesToEliminate)

	var variablesWithMinimunScore = variablesWithMinimunScore.slice(0)
	var copyOfCpts = cpts.slice(0)
	if (variablesWithMinimunScore.length > 1) {
		for (var i = 0; i < variablesWithMinimunScore.length; i++) {
			copyOfCpts = eliminateVariable(variablesWithMinimunScore[i], copyOfCpts)
			eliminationOrdering.push(variablesWithMinimunScore[i])
			var tmpCopy = variablesToEliminate.slice(0)
			tmpCopy.splice(findIndexEqualObject(variablesWithMinimunScore[i],tmpCopy),1)
			findOneEliminationOrdering(tmpCopy, copyOfCpts.slice(0), eliminationOrdering, eliminationOrderings, scoringFunction, allVariables)
			eliminationOrdering.pop()
			if (eliminationOrdering.length == 0) { copyOfCpts = cpts.slice(0) }
		}
	} else {
		copyOfCpts = eliminateVariable(variablesWithMinimunScore[0], copyOfCpts)
		eliminationOrdering.push(variablesWithMinimunScore[0])
		var tmpCopy = variablesToEliminate.slice(0)
		tmpCopy.splice(findIndexEqualObject(variablesWithMinimunScore[0],tmpCopy),1)
		if (tmpCopy.length) {
			findOneEliminationOrdering(tmpCopy, copyOfCpts.slice(0), eliminationOrdering, eliminationOrderings, scoringFunction, allVariables)
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



// ###### COUNTING COMPUTATIONS ######

// FUNCTION
// Performs a elimination orderings, counting the computations
function countComputations(eliminationOrdering,cpts,variables) {
	countings = {'multiplications': 0, 'summations': 0}
	for (var i = 0; i < eliminationOrdering.length; i++) {
		// unroll variable value
		var variable = ''
		for (var key in eliminationOrdering[i]) {
			variable = key
		}
		var product = { head: [], tail: [] }
		// Loop on all CPTs
		var indexesToRemove = []
		var firstCpt = true
		for (var j = 0; j < cpts.length; j++) {
			// If the variable is in the CPT
			if (cpts[j].head.indexOf(variable) != -1 || cpts[j].tail.indexOf(variable) != -1) {
				firstCpt = (product.head.length == 0 && product.tail.length == 0) ? true : false
				product = multiply(product,cpts[j]) // multiply with the current product
				if (!firstCpt) { countings['multiplications'] += countMultiplicationsOrSummations(product,variables) }
				indexesToRemove.push(j)
			}
		}
		// Only do the rest of the modifications if the variable exist in some CPT
		if (indexesToRemove.length != 0) {
			// remove original CPTs from the set
			multisplice(cpts,indexesToRemove)
			product = sumOut(variable,product)
			countings['summations'] += countMultiplicationsOrSummations(product,variables)
			cpts.push(product) // add the product to the set
		}
	}
	return countings
}

// FUNCTION
// count the multiplications or summations in CPT (multiplying the variable's cardinalities)
function countMultiplicationsOrSummations(cpt,variables) {
	product = 1;
	for (var i = 0; i < cpt.head.length; i++) {
		product *= findValueOfObjectInArray(cpt.head[i],variables)
	}
	for (var i = 0; i < cpt.tail.length; i++) {
		product *= findValueOfObjectInArray(cpt.tail[i],variables)
	}
	return product
}

// FUNCTION
function countComputationsFromAllPossibleEliminationOrderings(variablesToEliminate,cpts,variables,scoringFunction) {

	eliminationOrdering =[]
	eliminationOrderings = []
	findOneEliminationOrdering(variablesToEliminate, cpts, eliminationOrdering, eliminationOrderings, scoringFunction, variables)

	var countings = []
	for (var i = 0; i < eliminationOrderings.length; i++) {
		var counting = {}
		counting['eliminationOrdering'] = eliminationOrderings[i]
		counting['counting'] = countComputations(eliminationOrderings[i], cpts.slice(0), variables.slice(0))
		countings.push(counting)
	}

	return countings
}