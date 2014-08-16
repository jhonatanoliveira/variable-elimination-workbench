Meteor.subscribe('all-bayesian-networks')

Deps.autorun(function () {
  Meteor.subscribe('all-cpts-from-bayesian-networks', Session.get('activatedBn'))
})

Deps.autorun(function () {
  Meteor.subscribe('all-variables-from-bayesian-networks', Session.get('activatedBn'))
})