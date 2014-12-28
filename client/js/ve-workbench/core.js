// ###### MANIPULATING CPTS ######

// FUNCTION
// Removes a variable v by multiplying the CPTs with the variable v
eliminateVariable = function(_variable, cpts) {
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
sumOut = function(variable,cpt) {
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
multiply = function(cpt1, cpt2) {
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
scorePopulationEnergy = function(variablesToScore, cpts, allVariables) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variablesToScore.length; i++) {
		var variable = Object.keys(variablesToScore[i])[0]
		var countMultiplication = countComputations([variablesToScore[i]], cpts, allVariables)
		scores[variable] = countMultiplication['multiplications']
	}
	return scores
}

// FUNCTION
// Scores the current variables of the CPTs using Min Neighbors
scoreMinNeighbor = function(variablesToScore, cpts, allVariables) {
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
scoreMinWeight = function(variablesToScore, cpts, allVariables) {
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
scoreMinFill = function(variablesToScore, cpts, allVariables) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variablesToScore.length; i++) {
		var variable = Object.keys(variablesToScore[i])[0]
		var neighbors = []
		var connectionsMap = {}
		// Loop on all CPTs
		for (var j = 0; j < cpts.length; j++) {
			if (cpts[j].head.indexOf(variable) != -1 || cpts[j].tail.indexOf(variable) != -1) {
				var connections = []
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
		// verify connections between neighbors
		for (var j = 0; j < neighbors.length; j++) {
			var selectedCpts = findTheObjectWith(neighbors[j],cpts)
			for (var k = 0; k < selectedCpts.length; k++) {
				for (var l = 0; l < selectedCpts[k].head.length; l++) {
					if (selectedCpts[k].head[l] != variable && selectedCpts[k].head[l] != neighbors[j] && neighbors.indexOf(selectedCpts[k].head[l]) != -1) {
						if (!connectionsMap[neighbors[j]]) {connectionsMap[neighbors[j]] = []}
						if (connectionsMap[neighbors[j]].indexOf(selectedCpts[k].head[l]) == -1) {
							connectionsMap[neighbors[j]].push(selectedCpts[k].head[l])
						}
					}
				}
				for (var l = 0; l < selectedCpts[k].tail.length; l++) {
					if (selectedCpts[k].tail[l] != variable && selectedCpts[k].tail[l] != neighbors[j] && neighbors.indexOf(selectedCpts[k].tail[l]) != -1) {
						if (!connectionsMap[neighbors[j]]) {connectionsMap[neighbors[j]] = []}
						if (connectionsMap[neighbors[j]].indexOf(selectedCpts[k].tail[l]) == -1) {
							connectionsMap[neighbors[j]].push(selectedCpts[k].tail[l])
						}
					}
				}
			}
		}
		// Calculating scores
		scoreCounter = 0;
		for (var j = 0; j < neighbors.length; j++) {
			for (var k = 0; k < neighbors.length; k++) {
				if (neighbors[j] != neighbors[k]){
					if (connectionsMap[neighbors[j]]){
						if (connectionsMap[neighbors[j]].indexOf(neighbors[k]) == -1) {
							scoreCounter++
						}
					} else {
						scoreCounter++
					}
				}
			}
		}
		scores[variable] = scoreCounter/2
	}
	return scores
}

// FUNCTION
// Scores the current variables of the CPTs using Weighted Min Fill
scoreWeightedMinFill = function(variablesToScore, cpts, allVariables) {
	var scores = {}
	// Loop on each variable
	for (var i = 0; i < variablesToScore.length; i++) {
		var variable = Object.keys(variablesToScore[i])[0]
		var neighbors = []
		var connectionsMap = {}
		// Loop on all CPTs
		for (var j = 0; j < cpts.length; j++) {
			if (cpts[j].head.indexOf(variable) != -1 || cpts[j].tail.indexOf(variable) != -1) {
				var connections = []
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
		// verify connections between neighbors
		for (var j = 0; j < neighbors.length; j++) {
			var selectedCpts = findTheObjectWith(neighbors[j],cpts)
			for (var k = 0; k < selectedCpts.length; k++) {
				for (var l = 0; l < selectedCpts[k].head.length; l++) {
					if (selectedCpts[k].head[l] != variable && selectedCpts[k].head[l] != neighbors[j] && neighbors.indexOf(selectedCpts[k].head[l]) != -1) {
						if (!connectionsMap[neighbors[j]]) {connectionsMap[neighbors[j]] = []}
						if (connectionsMap[neighbors[j]].indexOf(selectedCpts[k].head[l]) == -1) {
							connectionsMap[neighbors[j]].push(selectedCpts[k].head[l])
						}
					}
				}
				for (var l = 0; l < selectedCpts[k].tail.length; l++) {
					if (selectedCpts[k].tail[l] != variable && selectedCpts[k].tail[l] != neighbors[j] && neighbors.indexOf(selectedCpts[k].tail[l]) != -1) {
						if (!connectionsMap[neighbors[j]]) {connectionsMap[neighbors[j]] = []}
						if (connectionsMap[neighbors[j]].indexOf(selectedCpts[k].tail[l]) == -1) {
							connectionsMap[neighbors[j]].push(selectedCpts[k].tail[l])
						}
					}
				}
			}
		}
		// Calculating scores
		scoreCounter = 0;
		for (var j = 0; j < neighbors.length; j++) {
			for (var k = 0; k < neighbors.length; k++) {
				if (neighbors[j] != neighbors[k]){
					if (connectionsMap[neighbors[j]]){
						if (connectionsMap[neighbors[j]].indexOf(neighbors[k]) == -1) {
							scoreCounter += findValueOfObjectInArray(neighbors[j],allVariables)*findValueOfObjectInArray(neighbors[k],allVariables)
						}
					} else {
						scoreCounter += findValueOfObjectInArray(neighbors[j],allVariables)*findValueOfObjectInArray(neighbors[k],allVariables)
					}
				}
			}
		}
		scores[variable] = scoreCounter/2
	}
	return scores
}



// ###### FINDING ELIMINATION ORDERINGS ######

// FUNCTION
// Find one elimination ordering
findOneEliminationOrdering = function(variablesToEliminate, cpts, eliminationOrdering, eliminationOrderings, scoringFunction, allVariables) {
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
findVariablesWithMinimunScore = function(scores, variables) {
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
countComputations = function(eliminationOrdering, _cpts, variables, _evidence) {
	var evidence = _evidence || []
	var cpts = _cpts.slice(0)

	countings = {'multiplications': 0, 'summations': 0, 'divisions': 0}
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
				if (!firstCpt) { countings['multiplications'] += countMultiplicationsOrSummations(product,variables,evidence) }
				indexesToRemove.push(j)
			}
		}
		// Only do the rest of the modifications if the variable exist in some CPT
		if (indexesToRemove.length != 0) {
			// remove original CPTs from the set
			multisplice(cpts,indexesToRemove)
			product = sumOut(variable,product)
			countings['summations'] += countMultiplicationsOrSummations(product,variables,evidence)
			cpts.push(product) // add the product to the set
		}
	}
	// multiply all remaining variables
	if (cpts.length > 1) {
		var product = { head: [], tail: [] }
		// Loop on all CPTs
		var indexesToRemove = []
		var firstCpt = true
		for (var i = 0; i < cpts.length; i++) {
			// no need to check if the variable is in the CPT
			firstCpt = (product.head.length == 0 && product.tail.length == 0) ? true : false
			product = multiply(product,cpts[i]) // multiply with the current product
			if (!firstCpt) {
				countings['multiplications'] += countMultiplicationsOrSummations(product,variables,evidence)
			}
			indexesToRemove.push(i)
		}
		// Count Divisions, before creating Evidence Table
		countings['divisions'] += countMultiplicationsOrSummations(product,variables,evidence)
		// Only do the rest of the modifications if the variable exist in some CPT
		if (indexesToRemove.length != 0) {
			// remove all variables on the "left hand side"
			difference = arrDiff(product.head,evidence)
			for (var i = 0; i < difference.length; i++) {
				// remove original CPTs from the set
				multisplice(cpts,indexesToRemove)
				product = sumOut(difference[i],product)
				countings['summations'] += countMultiplicationsOrSummations(product,variables,evidence)
				cpts.push(product) // add the product to the set
			}
		}
	}
	return countings
}

// FUNCTION
// count the multiplications or summations in CPT (multiplying the variable's cardinalities)
countMultiplicationsOrSummations = function(cpt,variables,evidence) {
	product = 1;
	for (var i = 0; i < cpt.head.length; i++) {
		if (evidence.indexOf(cpt.head[i]) == -1) {
			product *= findValueOfObjectInArray(cpt.head[i],variables)
		}
	}
	for (var i = 0; i < cpt.tail.length; i++) {
		if (evidence.indexOf(cpt.tail[i]) == -1) {
			product *= findValueOfObjectInArray(cpt.tail[i],variables)
		}
	}
	return product
}

// FUNCTION
// count the multiplications or summations in CPT (multiplying the variable's cardinalities) for all possible elimination orderings
countComputationsFromAllPossibleEliminationOrderings = function(variablesToEliminate,cpts,variables,evidence,scoringFunction) {

	eliminationOrdering =[]
	eliminationOrderings = []
	findOneEliminationOrdering(variablesToEliminate, cpts, eliminationOrdering, eliminationOrderings, scoringFunction, variables)

	var countings = []
	for (var i = 0; i < eliminationOrderings.length; i++) {
		var counting = {}
		counting['eliminationOrdering'] = eliminationOrderings[i]
		counting['counting'] = countComputations(eliminationOrderings[i], cpts.slice(0), variables.slice(0), evidence.slice(0))
		countings.push(counting)
	}

	return countings
}