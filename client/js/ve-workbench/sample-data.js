cpts_ = [
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

variables_ = [
	{'a': 2},
	{'b': 4},
	{'c': 8},
	{'d': 3},
	{'e': 2}
]

variablesToEliminate_ = [
	{'a': 2},
	{'b': 4},
	{'d': 3}
]

cpts2_ = [
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

variables2_ = [
	{'a': 5},
	{'b': 2},
	{'c': 2},
	{'d': 2},
	{'e': 2},
	{'f': 2}
]

variablesToEliminate2_ = [
	{'a': 5},
	{'b': 2},
	{'c': 2},
	{'e': 2}
]

cptsEsbn = [
	{
		head: ['c'],
		tail: []
	},
	{
		head: ['d'],
		tail: ['c']
	},
	{
		head: ['g'],
		tail: ['d','i']
	},
	{
		head: ['i'],
		tail: []
	},
	{
		head: ['s'],
		tail: ['i']
	},
	{
		head: ['l'],
		tail: ['g']
	},
	{
		head: ['j'],
		tail: ['l','s']
	},
	{
		head: ['h'],
		tail: ['g','j']
	}
]

variablesEsbn = [
	{'c': 2},
	{'d': 2},
	{'g': 2},
	{'i': 2},
	{'s': 2},
	{'l': 2},
	{'j': 2},
	{'h': 2}
]

variablesToEliminateEsbn = [
	{'s': 2},
	{'l': 2},
	{'i': 2},
	{'g': 2},
	{'d': 2}
]

variablesToEliminateEsbn2 = [
	{'s': 2},
	{'l': 2},
	{'c': 2},
	{'d': 2},
	{'g': 2}
]

evidenceEsbn = ['h','j']