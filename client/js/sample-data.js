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