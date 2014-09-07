Meteor.publish('all-bayesian-networks', function(){
	return BayesianNetwork.find({})
})

Meteor.publish('all-cpts-from-bayesian-networks', function(_bnId){
	return Cpt.find({bnId: _bnId})
})

Meteor.publish('all-variables-from-bayesian-networks', function(_bnId){
	return Variable.find({bnId: _bnId})
})

Meteor.publish('all-heuristics-from-bayesian-networks', function(_bnId){
	return Heuristic.find({bnId: _bnId})
})