// MAIN

// NAVBAR
Template.templateNavBar.events({
	'click .navbar-brand': function() {
		Session.set('activatedBn',null)
	}
})

// MENU LATERAL
Template.templateMenuLateral.rendered = function() {
   $("[data-toggle=tooltip]").tooltip()
};

Template.templateMenuLateral.bns = function() {
	return BayesianNetwork.find({})
}

Template.templateMenuLateral.events({
	'click .btn-new-bn': function(e) {
		bootbox.prompt("What is the BN name?", function(result) {                
			if (result != null) {                                             
				BayesianNetwork.insert({name: result})
			}
		})
	},
	'click .bn-in-menu': function(e) {
		Session.set('activatedBn',this._id)
	}
})


// CENTRAL BLOCK
Template.templateCentral.rendered = function() {
	console.log('renderizou')
   $("[data-toggle=tooltip]").tooltip()
};

Template.templateCentral.isCentralActivated = function() {
	return Session.get('activatedBn')
}

Template.templateCentral.bn = function() {
	return BayesianNetwork.find({_id: Session.get('activatedBn')})
}

Template.templateCentral.cpts = function() {
	return Cpt.find({})
}

Template.templateCentral.variables = function() {
	return Variable.find({})
}

Template.templateCentral.variablesToEliminateMn = function() {
	var bnId = Session.get('activatedBn');
	return Session.get('variablesToEliminateMn'+bnId)
}

Template.templateCentral.variablesToEliminateMw = function() {
	var bnId = Session.get('activatedBn');
	return Session.get('variablesToEliminateMw'+bnId)
}

Template.templateCentral.variablesToEliminateMf = function() {
	var bnId = Session.get('activatedBn');
	return Session.get('variablesToEliminateMf'+bnId)
}

Template.templateCentral.variablesToEliminateWmf = function() {
	var bnId = Session.get('activatedBn');
	return Session.get('variablesToEliminateWmf'+bnId)
}

Template.templateCentral.countingsMn = function() {
	var bnId = Session.get('activatedBn')
	return Session.get('countingsMn'+bnId)
}

Template.templateCentral.countingsMw = function() {
	var bnId = Session.get('activatedBn')
	return Session.get('countingsMw'+bnId)
}

Template.templateCentral.countingsMf = function() {
	var bnId = Session.get('activatedBn')
	return Session.get('countingsMf'+bnId)
}

Template.templateCentral.countingsWmf = function() {
	var bnId = Session.get('activatedBn')
	return Session.get('countingsWmf'+bnId)
}

Template.templateCentral.events({
	'click .btn-delete-bn': function(e) {
		bootbox.confirm("Are you sure?", function(result) {                
			if (result) {        
				var bnId = Session.get('activatedBn')
				Cpt.find({bnId: bnId}).forEach(function (post) {
					Cpt.remove({_id: post._id})
				})
				Variable.find({bnId: bnId}).forEach(function (post) {
					Variable.remove({_id: post._id})
				})
				BayesianNetwork.remove({_id: bnId})
			}
		})
	},
	'click .btn-new-cpt': function(e) {
		bootbox.prompt("Please, type the CPT in this format: p(x1,x2|x3,x4) or p(x1)", function(result) {                
			if (result != null) {
				Cpt.insert(prepareCpt(result))
			}
		})
	},
	'click .btn-delete-cpt': function(e) {
		e.preventDefault()
		var cptId = this._id
		bootbox.confirm("Are you sure?", function(result) {
			if (result) {
				Cpt.remove({_id: cptId})
			}
		})
	},
	'click .btn-save-cpt': function(e) {
		e.preventDefault()
		var cptId = this._id
		Cpt.update({_id: cptId},prepareCpt($('#'+cptId).val()))
	},
	'click .btn-new-variable': function(e) {
		bootbox.prompt("Please, type the Variable in this format: a:2", function(result) {                
			if (result != null) {
				Variable.insert(prepareVariable(result))
			}
		})
	},
	'click .btn-save-variable': function(e) {
		e.preventDefault()
		var varId = this._id
		Variable.update({_id: varId}, {$set: {cardinality: $('#'+varId).val()}})
	},
	'click .btn-delete-variable': function(e) {
		e.preventDefault()
		var varId = this._id
		bootbox.confirm("Are you sure?", function(result) {
			if (result) {
				Variable.remove({_id: varId})
			}
		})
	},
	'click .btn-min-neighbors': function(e) {
		e.preventDefault()
		if (checkVariablesDefinition()) {
		var varToElim = $('.variables-to-eliminate-mn').val()
		var bnId = Session.get('activatedBn');
		Session.set('variablesToEliminateMn'+bnId,varToElim)
		varToElim = varToElim.split(",")
		varToElim = prepareVarToEliminate(varToElim)
		var allVars = prepareAllVariables()
		var cpts = Cpt.find({}).fetch()
		var countings = countComputationsFromAllPossibleEliminationOrderings(varToElim,cpts,allVars,scoreMinNeighbor)
		prepareCounting(countings)
		var bnId = Session.get('activatedBn')
		Session.set('countingsMn'+bnId,countings)
		} else {
			bootbox.alert("Please, check your variables definitions. Maybe you're missing some...");
		}
	},
	'click .btn-min-weight': function(e) {
		e.preventDefault()
		if (checkVariablesDefinition()) {
		var varToElim = $('.variables-to-eliminate-mw').val()
		var bnId = Session.get('activatedBn');
		Session.set('variablesToEliminateMw'+bnId,varToElim)
		varToElim = varToElim.split(",")
		varToElim = prepareVarToEliminate(varToElim)
		var allVars = prepareAllVariables()
		var cpts = Cpt.find({}).fetch()
		var countings = countComputationsFromAllPossibleEliminationOrderings(varToElim,cpts,allVars,scoreMinWeight)
		prepareCounting(countings)
		var bnId = Session.get('activatedBn')
		Session.set('countingsMw'+bnId,countings)
		} else {
			bootbox.alert("Please, check your variables definitions. Maybe you're missing some...");
		}
	},
	'click .btn-min-fill': function(e) {
		e.preventDefault()
		if (checkVariablesDefinition()) {
		var varToElim = $('.variables-to-eliminate-mf').val()
		var bnId = Session.get('activatedBn');
		Session.set('variablesToEliminateMf'+bnId,varToElim)
		varToElim = varToElim.split(",")
		varToElim = prepareVarToEliminate(varToElim)
		var allVars = prepareAllVariables()
		var cpts = Cpt.find({}).fetch()
		var countings = countComputationsFromAllPossibleEliminationOrderings(varToElim,cpts,allVars,scoreMinFill)
		prepareCounting(countings)
		var bnId = Session.get('activatedBn')
		Session.set('countingsMf'+bnId,countings)
		} else {
			bootbox.alert("Please, check your variables definitions. Maybe you're missing some...");
		}
	},
	'click .btn-weighted-min-fill': function(e) {
		e.preventDefault()
		if (checkVariablesDefinition()) {
		var varToElim = $('.variables-to-eliminate-wmf').val()
		var bnId = Session.get('activatedBn');
		Session.set('variablesToEliminateWmf'+bnId,varToElim)
		varToElim = varToElim.split(",")
		varToElim = prepareVarToEliminate(varToElim)
		var allVars = prepareAllVariables()
		var cpts = Cpt.find({}).fetch()
		var countings = countComputationsFromAllPossibleEliminationOrderings(varToElim,cpts,allVars,scoreWeightedMinFill)
		prepareCounting(countings)
		var bnId = Session.get('activatedBn')
		Session.set('countingsWmf'+bnId,countings)
		} else {
			bootbox.alert("Please, check your variables definitions. Maybe you're missing some...");
		}
	}
})

function prepareCpt(result) {
	var cpt = {}
	if (result.indexOf('|') != -1) {
		cpt['head'] = result.substring(2,result.indexOf('|')).split(',')
		cpt['tail'] = result.substring(result.indexOf('|')+1,result.indexOf(')')).split(',')
	} else {
		cpt['head'] = result.substring(2,result.indexOf(')')).split(',')
		cpt['tail'] = []
	}
	cpt['bnId'] = Session.get('activatedBn')
	return cpt
}

function prepareVariable(result) {
	var v = {}
	var resultSplit = result.split(':')
	v['name'] = resultSplit[0]
	v['cardinality'] = resultSplit[1]
	v['bnId'] = Session.get('activatedBn')
	return v
}

function prepareVarToEliminate(varToElim) {
	var varToElimPrepered = []
	Variable.find({}).forEach(function (post) {
		if (varToElim.indexOf(post.name) != -1) {
			var temp = {}
			temp[post.name] = post.cardinality
			varToElimPrepered.push(temp)
		}
	})
	return varToElimPrepered
}

function prepareAllVariables() {
	var varToElimPrepered = []
	Variable.find({}).forEach(function (post) {
		var temp = {}
		temp[post.name] = post.cardinality
		varToElimPrepered.push(temp)
	})
	return varToElimPrepered
}

function prepareCounting(countings) {
	for (var i = 0; i < countings.length; i++) {
		var newEliminationOrdering = []
		for (var j = 0; j < countings[i].eliminationOrdering.length; j++) {
			for (var key in countings[i].eliminationOrdering[j]) {
				var temp = {}
				temp['name'] = key
				temp['cardinality'] = countings[i].eliminationOrdering[j][key]
				newEliminationOrdering.push(temp)
			}
		}
		countings[i]['eliminationOrdering'] = newEliminationOrdering
	}
}

checkVariablesDefinition = function() {
	var varsSet = []
	Variable.find({}).forEach(function (post) {
		if (varsSet.indexOf(post.name) == -1) {
			varsSet.push(post.name)
		}
	})
	return (Cpt.find({}).count() == varsSet.length) ? true : false
}