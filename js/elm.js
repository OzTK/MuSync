(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bf.ad === region.bz.ad)
	{
		return 'on line ' + region.bf.ad;
	}
	return 'on lines ' + region.bf.ad + ' through ' + region.bz.ad;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (!x.$)
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? $elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return $elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return $elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? $elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? $elm$core$Result$Ok(value)
				: (value instanceof String)
					? $elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return $elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dp,
		impl.ew,
		impl.d9,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		C: func(record.C),
		bg: record.bg,
		a5: record.a5
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		(key !== 'value' || key !== 'checked' || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		value
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		value
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.C;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bg;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.a5) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			var oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			var newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dp,
		impl.ew,
		impl.d9,
		function(sendToApp, initialModel) {
			var view = impl.ey;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dp,
		impl.ew,
		impl.d9,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.a9 && impl.a9(sendToApp)
			var view = impl.ey;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cJ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.er) && (_VirtualDom_doc.title = title = doc.er);
			});
		}
	);
});



// ANIMATION


var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dB;
	var onUrlRequest = impl.dC;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		a9: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.download)
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bZ === next.bZ
							&& curr.dj === next.dj
							&& curr.bU.a === next.bU.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dp: function(flags)
		{
			return A3(impl.dp, flags, _Browser_getUrl(), key);
		},
		ey: impl.ey,
		ew: impl.ew,
		d9: impl.d9
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { di: 'hidden', ab: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { di: 'mozHidden', ab: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { di: 'msHidden', ab: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { di: 'webkitHidden', ab: 'webkitvisibilitychange' }
		: { di: 'hidden', ab: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		b1: _Browser_getScene(),
		ci: {
			aF: _Browser_window.pageXOffset,
			aG: _Browser_window.pageYOffset,
			ck: _Browser_doc.documentElement.clientWidth,
			bE: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ck: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		bE: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			b1: {
				ck: node.scrollWidth,
				bE: node.scrollHeight
			},
			ci: {
				aF: node.scrollLeft,
				aG: node.scrollTop,
				ck: node.clientWidth,
				bE: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			b1: _Browser_getScene(),
			ci: {
				aF: x,
				aG: y,
				ck: _Browser_doc.documentElement.clientWidth,
				bE: _Browser_doc.documentElement.clientHeight
			},
			c6: {
				aF: x + rect.left,
				aG: y + rect.top,
				ck: rect.width,
				bE: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail($elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail($elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.bB.a));
		});

		try
		{
			xhr.open(request.dw, request.bh, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail($elm$http$Http$BadUrl(request.bh)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.cJ;
		xhr.send($elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!$elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			cR: event.loaded,
			cS: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.dh; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.bB.b;
	xhr.withCredentials = request.ez;

	$elm$core$Maybe$isJust(request.ca) && (xhr.timeout = request.ca.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail($elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if ($elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2($elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		bh: xhr.responseURL,
		d4: { cZ: xhr.status, C: xhr.statusText },
		dh: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		cJ: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = $elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2($elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return $elm$http$Http$Internal$FormDataBody(formData);
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.b) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.e);
		} else {
			var treeLen = builder.b * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.f) : builder.f;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.b);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.e);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{f: nodeList, b: (len / $elm$core$Array$branchFactor) | 0, e: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {bC: fragment, dj: host, bO: path, bU: port_, bZ: protocol, aA: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $mdgriffith$elm_ui$Element$BigDesktop = 3;
var $mdgriffith$elm_ui$Element$Desktop = 2;
var $mdgriffith$elm_ui$Element$Landscape = 1;
var $mdgriffith$elm_ui$Element$Phone = 0;
var $mdgriffith$elm_ui$Element$Portrait = 0;
var $mdgriffith$elm_ui$Element$Tablet = 1;
var $mdgriffith$elm_ui$Element$classifyDevice = function (window) {
	return {
		cV: (window.ck <= 600) ? 0 : (((window.ck > 600) && (window.ck <= 1200)) ? 1 : (((window.ck > 1200) && (window.ck <= 1800)) ? 2 : 3)),
		dF: (_Utils_cmp(window.ck, window.bE) < 0) ? 0 : 1
	};
};
var $author$project$Main$PlaylistImportFailed = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $author$project$Main$PlaylistImported = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Main$PlaylistsFetched = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Main$UserInfoReceived = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Main$handlers = {dJ: $author$project$Main$PlaylistImported, dK: $author$project$Main$PlaylistImportFailed, dL: $author$project$Main$PlaylistsFetched, ex: $author$project$Main$UserInfoReceived};
var $author$project$Page$Page = $elm$core$Basics$identity;
var $author$project$Page$Request$ServiceConnection = {$: 0};
var $author$project$Page$init = $author$project$Page$Request$ServiceConnection;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $author$project$Connection$Connected$ConnectedProviderWithToken = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $krisajenkins$remotedata$RemoteData$NotAsked = {$: 0};
var $author$project$MusicService$connect = F2(
	function (_v0, tok) {
		var service = _v0;
		return A3($author$project$Connection$Connected$ConnectedProviderWithToken, service, tok, $krisajenkins$remotedata$RemoteData$NotAsked);
	});
var $author$project$Connection$Connected$EmptyTokenError = 0;
var $author$project$Connection$Connected$OAuthToken = $elm$core$Basics$identity;
var $author$project$Connection$Connected$createToken = function (rawValue) {
	return (rawValue === '') ? $elm$core$Result$Err(0) : $elm$core$Result$Ok(rawValue);
};
var $author$project$MusicProvider$Deezer = 1;
var $author$project$MusicProvider$Spotify = 0;
var $author$project$MusicProvider$Youtube = 2;
var $author$project$MusicProvider$fromString = function (pName) {
	switch (pName) {
		case 'Spotify':
			return $elm$core$Maybe$Just(0);
		case 'Deezer':
			return $elm$core$Maybe$Just(1);
		case 'Youtube':
			return $elm$core$Maybe$Just(2);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$deserializeTokenPair = function (_v0) {
	var serviceName = _v0.a;
	var token = _v0.b;
	return A3(
		$elm$core$Maybe$map2,
		$elm$core$Tuple$pair,
		$author$project$MusicProvider$fromString(serviceName),
		$elm$core$Result$toMaybe(
			$author$project$Connection$Connected$createToken(token)));
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Connection$Connected = function (a) {
	return {$: 2, a: a};
};
var $author$project$Connection$fromConnected = function (connectedProvider) {
	return $author$project$Connection$Connected(connectedProvider);
};
var $author$project$Connection$Disconnected = function (a) {
	return {$: 0, a: a};
};
var $author$project$Connection$fromDisconnected = function (connection) {
	return $author$project$Connection$Disconnected(connection);
};
var $turboMaCk$any_dict$Dict$Any$AnyDict = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $turboMaCk$any_dict$Dict$Any$empty = function (toKey) {
	return {a: $elm$core$Dict$empty, w: toKey};
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $turboMaCk$any_dict$Dict$Any$insert = F3(
	function (k, v, _v0) {
		var inner = _v0;
		return _Utils_update(
			inner,
			{
				a: A3(
					$elm$core$Dict$insert,
					inner.w(k),
					_Utils_Tuple2(k, v),
					inner.a)
			});
	});
var $author$project$List$Extra$groupByOverwrite = F2(
	function (keyBuilder, grouper) {
		return A2(
			$elm$core$List$foldl,
			F2(
				function (el, dict) {
					return A3(
						$turboMaCk$any_dict$Dict$Any$insert,
						grouper(el),
						el,
						dict);
				}),
			$turboMaCk$any_dict$Dict$Any$empty(keyBuilder));
	});
var $author$project$Connection$Connected$toString = function (t) {
	switch (t) {
		case 0:
			return 'Spotify';
		case 1:
			return 'Deezer';
		default:
			return 'Youtube';
	}
};
var $author$project$Connection$Dict$keyBuilder = $author$project$Connection$Connected$toString;
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $turboMaCk$any_dict$Dict$Any$map = F2(
	function (f, _v0) {
		var dict = _v0.a;
		var toKey = _v0.w;
		return {
			a: A2(
				$elm$core$Dict$map,
				F2(
					function (_v1, _v2) {
						var k = _v2.a;
						var v = _v2.b;
						return _Utils_Tuple2(
							k,
							A2(f, k, v));
					}),
				dict),
			w: toKey
		};
	});
var $author$project$Connection$Connected$type_ = function (connection) {
	if (!connection.$) {
		var t = connection.a;
		return t;
	} else {
		var t = connection.a;
		return t;
	}
};
var $author$project$Connection$type_ = function (con) {
	switch (con.$) {
		case 0:
			var pType = con.a;
			return pType;
		case 1:
			var pType = con.a;
			return pType;
		default:
			var connection = con.a;
			return $author$project$Connection$Connected$type_(connection);
	}
};
var $author$project$Connection$Dict$fromList = function (list) {
	return A2(
		$turboMaCk$any_dict$Dict$Any$map,
		F2(
			function (_v0, c) {
				return _Utils_Tuple2(c, $krisajenkins$remotedata$RemoteData$NotAsked);
			}),
		A3($author$project$List$Extra$groupByOverwrite, $author$project$Connection$Dict$keyBuilder, $author$project$Connection$type_, list));
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $turboMaCk$any_dict$Dict$Any$fromList = F2(
	function (f, xs) {
		return {
			a: $elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (_v0) {
						var k = _v0.a;
						var v = _v0.b;
						return _Utils_Tuple2(
							f(k),
							_Utils_Tuple2(k, v));
					},
					xs)),
			w: f
		};
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $turboMaCk$any_dict$Dict$Any$get = F2(
	function (k, _v0) {
		var dict = _v0.a;
		var toKey = _v0.w;
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$Dict$get,
				toKey(k),
				dict));
	});
var $author$project$MusicService$DisconnectedProvider = $elm$core$Basics$identity;
var $author$project$MusicService$disconnected = $elm$core$Basics$identity;
var $author$project$Main$initProviders = _List_fromArray(
	[
		$author$project$MusicService$disconnected(0),
		$author$project$MusicService$disconnected(1)
	]);
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$initConnections = function (_v0) {
	var rawTokens = _v0.a6;
	var tokens = A2(
		$turboMaCk$any_dict$Dict$Any$fromList,
		$author$project$Connection$Connected$toString,
		A2($elm$core$List$filterMap, $author$project$Main$deserializeTokenPair, rawTokens));
	return $author$project$Connection$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (con) {
				return A2(
					$elm$core$Maybe$withDefault,
					$author$project$Connection$fromDisconnected(con),
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeL,
							$author$project$Connection$fromConnected,
							$author$project$MusicService$connect(con)),
						A2(
							$turboMaCk$any_dict$Dict$Any$get,
							A2($elm$core$Basics$composeL, $author$project$Connection$type_, $author$project$Connection$fromDisconnected)(con),
							tokens)));
			},
			$author$project$Main$initProviders));
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Connection$Connected$connectionToString = A2($elm$core$Basics$composeR, $author$project$Connection$Connected$type_, $author$project$Connection$Connected$toString);
var $author$project$Playlist$Dict$keyBuilder = function (_v0) {
	var con = _v0.a;
	var p = _v0.b;
	return $author$project$Connection$Connected$connectionToString(con) + ('_' + p);
};
var $author$project$Playlist$Dict$noPlaylists = $turboMaCk$any_dict$Dict$Any$empty($author$project$Playlist$Dict$keyBuilder);
var $author$project$Connection$asConnected = function (connection) {
	if (connection.$ === 2) {
		var provider = connection.a;
		return $elm$core$Maybe$Just(provider);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$List$Connection$connectedProviders = $elm$core$List$filterMap(
	function (con) {
		if (con.$ === 2) {
			var provider = con.a;
			return $elm$core$Maybe$Just(provider);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $turboMaCk$any_dict$Dict$Any$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$values(dict);
};
var $turboMaCk$any_dict$Dict$Any$values = A2(
	$elm$core$Basics$composeL,
	$elm$core$List$map($elm$core$Tuple$second),
	$turboMaCk$any_dict$Dict$Any$toList);
var $author$project$Connection$Dict$connections = function (connectionsDict) {
	return A2(
		$elm$core$List$map,
		$elm$core$Tuple$first,
		$turboMaCk$any_dict$Dict$Any$values(connectionsDict));
};
var $author$project$Connection$Dict$connectedConnections = A2($elm$core$Basics$composeL, $author$project$List$Connection$connectedProviders, $author$project$Connection$Dict$connections);
var $author$project$MusicService$InvalidServiceConnectionError = function (a) {
	return {$: 0, a: a};
};
var $krisajenkins$remotedata$RemoteData$Success = function (a) {
	return {$: 3, a: a};
};
var $author$project$Deezer$addSongsToPlaylistEncoder = function (tracks) {
	return A2(
		$elm$core$String$join,
		',',
		A2(
			$elm$core$List$map,
			function ($) {
				return $.av;
			},
			tracks));
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $krisajenkins$remotedata$RemoteData$Failure = function (a) {
	return {$: 2, a: a};
};
var $krisajenkins$remotedata$RemoteData$Loading = {$: 1};
var $krisajenkins$remotedata$RemoteData$map = F2(
	function (f, data) {
		switch (data.$) {
			case 3:
				var value = data.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					f(value));
			case 1:
				return $krisajenkins$remotedata$RemoteData$Loading;
			case 0:
				return $krisajenkins$remotedata$RemoteData$NotAsked;
			default:
				var error = data.a;
				return $krisajenkins$remotedata$RemoteData$Failure(error);
		}
	});
var $author$project$ApiClient$chain = F2(
	function (f, task) {
		return A2(
			$elm$core$Task$andThen,
			function (data) {
				switch (data.$) {
					case 3:
						var t2 = data.a;
						return t2;
					case 2:
						var err = data.a;
						return $elm$core$Task$succeed(
							$krisajenkins$remotedata$RemoteData$Failure(err));
					default:
						return $elm$core$Task$succeed($krisajenkins$remotedata$RemoteData$NotAsked);
				}
			},
			A2(
				$elm$core$Task$map,
				$krisajenkins$remotedata$RemoteData$map(f),
				task));
	});
var $elm$http$Http$Internal$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Internal$Header;
var $ohanhi$remotedata_http$RemoteData$Http$acceptJson = A2($elm$http$Http$header, 'Accept', 'application/json');
var $ohanhi$remotedata_http$RemoteData$Http$defaultConfig = {
	dh: _List_fromArray(
		[$ohanhi$remotedata_http$RemoteData$Http$acceptJson]),
	ca: $elm$core$Maybe$Nothing,
	ez: false
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$ApiClient$Endpoint = $elm$core$Basics$identity;
var $author$project$ApiClient$baseEndpoint = $elm$core$Basics$identity;
var $author$project$Deezer$corsProxy = 'https://cors-anywhere.herokuapp.com/';
var $author$project$Deezer$endpoint = $author$project$ApiClient$baseEndpoint($author$project$Deezer$corsProxy + 'https://api.deezer.com');
var $author$project$ApiClient$fullEndpointUrl = function (endpoint) {
	if (!endpoint.$) {
		var u = endpoint.a;
		return u;
	} else {
		var u = endpoint.a;
		return u;
	}
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 2, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var $elm$http$Http$expectJson = function (decoder) {
	return $elm$http$Http$expectStringResponse(
		function (response) {
			var _v0 = A2($elm$json$Json$Decode$decodeString, decoder, response.cJ);
			if (_v0.$ === 1) {
				var decodeError = _v0.a;
				return $elm$core$Result$Err(
					$elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _v0.a;
				return $elm$core$Result$Ok(value);
			}
		});
};
var $elm$http$Http$Internal$Request = $elm$core$Basics$identity;
var $elm$http$Http$request = $elm$core$Basics$identity;
var $ohanhi$remotedata_http$RemoteData$Http$createRequest = F5(
	function (config, method, url, successDecoder, body) {
		return $elm$http$Http$request(
			{
				cJ: body,
				bB: $elm$http$Http$expectJson(successDecoder),
				dh: config.dh,
				dw: method,
				ca: config.ca,
				bh: url,
				ez: config.ez
			});
	});
var $elm$http$Http$Internal$EmptyBody = {$: 0};
var $elm$http$Http$emptyBody = $elm$http$Http$Internal$EmptyBody;
var $ohanhi$remotedata_http$RemoteData$Http$getRequest = F3(
	function (config, url, decoder) {
		return A5($ohanhi$remotedata_http$RemoteData$Http$createRequest, config, 'GET', url, decoder, $elm$http$Http$emptyBody);
	});
var $elm$http$Http$toTask = function (_v0) {
	var request_ = _v0;
	return A2(_Http_toTask, request_, $elm$core$Maybe$Nothing);
};
var $ohanhi$remotedata_http$RemoteData$Http$toTask = function (request) {
	return A2(
		$elm$core$Task$onError,
		A2($elm$core$Basics$composeL, $elm$core$Task$succeed, $krisajenkins$remotedata$RemoteData$Failure),
		A2(
			$elm$core$Task$map,
			$krisajenkins$remotedata$RemoteData$Success,
			$elm$http$Http$toTask(request)));
};
var $ohanhi$remotedata_http$RemoteData$Http$getTaskWithConfig = F3(
	function (config, url, decoder) {
		return $ohanhi$remotedata_http$RemoteData$Http$toTask(
			A3($ohanhi$remotedata_http$RemoteData$Http$getRequest, config, url, decoder));
	});
var $author$project$ApiClient$get = F2(
	function (config, endpoint) {
		return A2(
			$ohanhi$remotedata_http$RemoteData$Http$getTaskWithConfig,
			config,
			$author$project$ApiClient$fullEndpointUrl(endpoint));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Process$sleep = _Process_sleep;
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$ApiClient$delayAndRetry = function (task) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Basics$add(1000),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Process$sleep,
			$elm$core$Task$andThen(
				function (_v1) {
					return $author$project$ApiClient$withRateLimit(task);
				})));
};
var $author$project$ApiClient$withRateLimit = function (task) {
	return A2(
		$elm$core$Task$andThen,
		function (result) {
			if ((result.$ === 2) && (result.a.$ === 3)) {
				var response = result.a.a;
				return (response.d4.cZ === 429) ? A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Task$succeed(result),
					A2(
						$elm$core$Maybe$map,
						$author$project$ApiClient$delayAndRetry(task),
						A2(
							$elm$core$Maybe$andThen,
							$elm$core$String$toFloat,
							A2($elm$core$Dict$get, 'retry-after', response.dh)))) : $elm$core$Task$succeed(result);
			} else {
				return $elm$core$Task$succeed(result);
			}
		},
		task);
};
var $author$project$ApiClient$getWithRateLimit = F3(
	function (config, endpoint, decoder) {
		return $author$project$ApiClient$withRateLimit(
			A3($author$project$ApiClient$get, config, endpoint, decoder));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Deezer$pageSize = 25;
var $author$project$ApiClient$FullWithQuery = function (a) {
	return {$: 1, a: a};
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$crossOrigin = F3(
	function (prePath, pathSegments, parameters) {
		return prePath + ('/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters)));
	});
var $author$project$ApiClient$queryEndpoint = F3(
	function (_v0, path, query) {
		var base = _v0;
		return $author$project$ApiClient$FullWithQuery(
			A3($elm$url$Url$Builder$crossOrigin, base, path, query));
	});
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.bZ;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.bC,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.aA,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.bU,
					_Utils_ap(http, url.dj)),
				url.bO)));
};
var $author$project$ApiClient$appendQueryParam = F2(
	function (param, endpoint) {
		var encodedParam = A2(
			$elm$core$String$dropLeft,
			1,
			$elm$url$Url$Builder$toQuery(
				_List_fromArray(
					[param])));
		if (!endpoint.$) {
			var actionUrl = endpoint.a;
			return A2(
				$elm$core$Maybe$withDefault,
				actionUrl,
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeL, $elm$core$Basics$identity, $elm$url$Url$toString),
					A2(
						$elm$core$Maybe$map,
						function (url) {
							return _Utils_update(
								url,
								{
									aA: $elm$core$Maybe$Just(encodedParam)
								});
						},
						$elm$url$Url$fromString(actionUrl))));
		} else {
			var queryUrl = endpoint.a;
			return A2(
				$elm$core$Maybe$withDefault,
				queryUrl,
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeL, $elm$core$Basics$identity, $elm$url$Url$toString),
					A2(
						$elm$core$Maybe$map,
						function (url) {
							return _Utils_update(
								url,
								{
									aA: A2(
										$elm$core$Maybe$withDefault,
										$elm$core$Maybe$Just(encodedParam),
										A2(
											$elm$core$Maybe$map,
											function (q) {
												return $elm$core$Maybe$Just(q + ('&' + encodedParam));
											},
											url.aA))
								});
						},
						$elm$url$Url$fromString(queryUrl))));
		}
	});
var $author$project$ApiClient$fullQueryAsAny = $author$project$ApiClient$FullWithQuery;
var $author$project$Deezer$withToken = function (token) {
	return A2(
		$elm$core$Basics$composeR,
		A2(
			$elm$core$Basics$composeR,
			$author$project$ApiClient$appendQueryParam(
				A2($elm$url$Url$Builder$string, 'access_token', token)),
			$author$project$ApiClient$fullQueryAsAny),
		A2(
			$elm$core$Basics$composeR,
			$author$project$ApiClient$appendQueryParam(
				A2($elm$url$Url$Builder$string, 'output', 'json')),
			$author$project$ApiClient$fullQueryAsAny));
};
var $author$project$Deezer$addSongsBatchToPlaylist = F4(
	function (token, tracks, id, skipped) {
		if (_Utils_eq(
			skipped,
			$elm$core$List$length(tracks))) {
			return $elm$core$Task$succeed(
				$krisajenkins$remotedata$RemoteData$Success(0));
		} else {
			var next = A2(
				$elm$core$Basics$min,
				skipped + $author$project$Deezer$pageSize,
				$elm$core$List$length(tracks));
			var batch = A2(
				$elm$core$List$take,
				next - skipped,
				A2($elm$core$List$drop, skipped, tracks));
			return A2(
				$author$project$ApiClient$chain,
				function (_v0) {
					return A4($author$project$Deezer$addSongsBatchToPlaylist, token, tracks, id, next);
				},
				A3(
					$author$project$ApiClient$getWithRateLimit,
					$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
					A2(
						$author$project$Deezer$withToken,
						token,
						A3(
							$author$project$ApiClient$queryEndpoint,
							$author$project$Deezer$endpoint,
							_List_fromArray(
								['playlist', id, 'tracks']),
							_List_fromArray(
								[
									A2($elm$url$Url$Builder$string, 'request_method', 'POST'),
									A2(
									$elm$url$Url$Builder$string,
									'songs',
									$author$project$Deezer$addSongsToPlaylistEncoder(batch))
								]))),
					$elm$json$Json$Decode$bool));
		}
	});
var $author$project$Deezer$addSongsToPlaylist = F3(
	function (token, tracks, _v0) {
		var id = _v0.av;
		return A2(
			$elm$core$Task$map,
			$krisajenkins$remotedata$RemoteData$map(
				function (_v1) {
					return 0;
				}),
			A4($author$project$Deezer$addSongsBatchToPlaylist, token, tracks, id, 0));
	});
var $author$project$Playlist$Playlist = F4(
	function (id, name, link, tracksCount) {
		return {av: id, du: link, dy: name, eu: tracksCount};
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2($elm$core$Basics$composeR, $elm$json$Json$Decode$succeed, $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Deezer$createplaylistResponse = function (title) {
	return A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
		0,
		A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
			'',
			A2(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
				title,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'id',
					A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
					$elm$json$Json$Decode$succeed($author$project$Playlist$Playlist)))));
};
var $author$project$Deezer$createPlaylist = F3(
	function (token, user, name) {
		return A3(
			$author$project$ApiClient$get,
			$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
			A2(
				$author$project$Deezer$withToken,
				token,
				A3(
					$author$project$ApiClient$queryEndpoint,
					$author$project$Deezer$endpoint,
					_List_fromArray(
						['user', user, 'playlists']),
					_List_fromArray(
						[
							A2($elm$url$Url$Builder$string, 'request_method', 'POST'),
							A2($elm$url$Url$Builder$string, 'title', name)
						]))),
			$author$project$Deezer$createplaylistResponse(name));
	});
var $author$project$ApiClient$actionEndpoint = F2(
	function (_v0, path) {
		var base = _v0;
		return A3($elm$url$Url$Builder$crossOrigin, base, path, _List_Nil);
	});
var $author$project$Deezer$BuildingTrackList = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Deezer$buildTracks = $author$project$Deezer$BuildingTrackList(_List_Nil);
var $author$project$Deezer$TrackBatch = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$String$append = _String_append;
var $author$project$ApiClient$FullNoQuery = function (a) {
	return {$: 0, a: a};
};
var $author$project$ApiClient$fullAsAny = $author$project$ApiClient$FullNoQuery;
var $author$project$ApiClient$endpointFromLink = F2(
	function (_v0, link) {
		var domain = _v0;
		return A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var host = _v1.dj;
				var query = _v1.aA;
				var _v2 = _Utils_Tuple2(
					A2($elm$core$String$contains, host, domain),
					query);
				if (_v2.a) {
					if (_v2.b.$ === 1) {
						var _v3 = _v2.b;
						return $elm$core$Maybe$Just(
							$author$project$ApiClient$fullAsAny(link));
					} else {
						return $elm$core$Maybe$Just(
							$author$project$ApiClient$fullQueryAsAny(link));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			$elm$url$Url$fromString(link));
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Track$Track = F4(
	function (id, title, artist, isrc) {
		return {cD: artist, av: id, ds: isrc, er: title};
	});
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _v1.a;
					return $elm$json$Json$Decode$fail(
						$elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$at, path, valDecoder),
			decoder);
	});
var $author$project$Deezer$track = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'isrc',
	$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['artist', 'name']),
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'title',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
				$elm$json$Json$Decode$succeed($author$project$Track$Track)))));
var $author$project$Deezer$buildingTracks = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'next',
	A2(
		$elm$json$Json$Decode$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$append($author$project$Deezer$corsProxy),
			A2(
				$elm$core$Basics$composeR,
				$author$project$ApiClient$endpointFromLink($author$project$Deezer$endpoint),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$map($elm$json$Json$Decode$succeed),
					$elm$core$Maybe$withDefault(
						$elm$json$Json$Decode$fail('Invalid next url'))))),
		$elm$json$Json$Decode$string),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'data',
		$elm$json$Json$Decode$list($author$project$Deezer$track),
		$elm$json$Json$Decode$succeed($author$project$Deezer$TrackBatch)));
var $author$project$Deezer$TrackLastBatch = function (a) {
	return {$: 1, a: a};
};
var $author$project$Deezer$lastTrackBatch = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'data',
	$elm$json$Json$Decode$list($author$project$Deezer$track),
	$elm$json$Json$Decode$succeed($author$project$Deezer$TrackLastBatch));
var $author$project$Deezer$allTracks = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[$author$project$Deezer$buildingTracks, $author$project$Deezer$lastTrackBatch]));
var $author$project$Deezer$CompleteTrackList = function (a) {
	return {$: 1, a: a};
};
var $author$project$Deezer$concatTracks = F2(
	function (builder, batch) {
		var _v0 = _Utils_Tuple2(builder, batch);
		if (!_v0.a.$) {
			if (!_v0.b.$) {
				var _v1 = _v0.a;
				var prev = _v1.a;
				var _v2 = _v0.b;
				var next = _v2.a;
				var url = _v2.b;
				return A2(
					$author$project$Deezer$BuildingTrackList,
					_Utils_ap(prev, next),
					url);
			} else {
				var _v3 = _v0.a;
				var prev = _v3.a;
				var _final = _v0.b.a;
				return $author$project$Deezer$CompleteTrackList(
					_Utils_ap(prev, _final));
			}
		} else {
			return builder;
		}
	});
var $author$project$ApiClient$map = function (f) {
	return $elm$core$Task$map(
		$krisajenkins$remotedata$RemoteData$map(f));
};
var $author$project$Deezer$fetchAllTracks = function (builder) {
	if (builder.$ === 1) {
		var trackList = builder.a;
		return $elm$core$Task$succeed(
			$krisajenkins$remotedata$RemoteData$Success(trackList));
	} else {
		var url = builder.b;
		return A2(
			$author$project$ApiClient$chain,
			$author$project$Deezer$fetchAllTracks,
			A2(
				$author$project$ApiClient$map,
				$author$project$Deezer$concatTracks(builder),
				A3($author$project$ApiClient$getWithRateLimit, $ohanhi$remotedata_http$RemoteData$Http$defaultConfig, url, $author$project$Deezer$allTracks)));
	}
};
var $krisajenkins$remotedata$RemoteData$andMap = F2(
	function (wrappedValue, wrappedFunction) {
		var _v0 = _Utils_Tuple2(wrappedFunction, wrappedValue);
		_v0$2:
		while (true) {
			_v0$3:
			while (true) {
				_v0$4:
				while (true) {
					_v0$5:
					while (true) {
						switch (_v0.a.$) {
							case 3:
								switch (_v0.b.$) {
									case 3:
										var f = _v0.a.a;
										var value = _v0.b.a;
										return $krisajenkins$remotedata$RemoteData$Success(
											f(value));
									case 2:
										break _v0$2;
									case 1:
										break _v0$4;
									default:
										var _v4 = _v0.b;
										return $krisajenkins$remotedata$RemoteData$NotAsked;
								}
							case 2:
								var error = _v0.a.a;
								return $krisajenkins$remotedata$RemoteData$Failure(error);
							case 1:
								switch (_v0.b.$) {
									case 2:
										break _v0$2;
									case 1:
										break _v0$3;
									case 0:
										break _v0$3;
									default:
										break _v0$3;
								}
							default:
								switch (_v0.b.$) {
									case 2:
										break _v0$2;
									case 1:
										break _v0$4;
									case 0:
										break _v0$5;
									default:
										break _v0$5;
								}
						}
					}
					var _v3 = _v0.a;
					return $krisajenkins$remotedata$RemoteData$NotAsked;
				}
				var _v2 = _v0.b;
				return $krisajenkins$remotedata$RemoteData$Loading;
			}
			var _v1 = _v0.a;
			return $krisajenkins$remotedata$RemoteData$Loading;
		}
		var error = _v0.b.a;
		return $krisajenkins$remotedata$RemoteData$Failure(error);
	});
var $krisajenkins$remotedata$RemoteData$map2 = F3(
	function (f, a, b) {
		return A2(
			$krisajenkins$remotedata$RemoteData$andMap,
			b,
			A2($krisajenkins$remotedata$RemoteData$map, f, a));
	});
var $krisajenkins$remotedata$RemoteData$fromList = A2(
	$elm$core$List$foldr,
	$krisajenkins$remotedata$RemoteData$map2($elm$core$List$cons),
	$krisajenkins$remotedata$RemoteData$Success(_List_Nil));
var $author$project$Deezer$loadTrack = F2(
	function (token, t) {
		return A3(
			$author$project$ApiClient$getWithRateLimit,
			$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
			A2(
				$author$project$Deezer$withToken,
				token,
				$author$project$ApiClient$fullAsAny(
					A2(
						$author$project$ApiClient$actionEndpoint,
						$author$project$Deezer$endpoint,
						_List_fromArray(
							['track', t.av])))),
			$author$project$Deezer$track);
	});
var $author$project$Deezer$getPlaylistTracks = F2(
	function (token, _v0) {
		var id = _v0.av;
		return A2(
			$author$project$ApiClient$chain,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$map(
					$author$project$Deezer$loadTrack(token)),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Task$sequence,
					$elm$core$Task$map($krisajenkins$remotedata$RemoteData$fromList))),
			$author$project$Deezer$fetchAllTracks(
				$author$project$Deezer$buildTracks(
					A2(
						$author$project$Deezer$withToken,
						token,
						$author$project$ApiClient$fullAsAny(
							A2(
								$author$project$ApiClient$actionEndpoint,
								$author$project$Deezer$endpoint,
								_List_fromArray(
									['playlist', id, 'tracks'])))))));
	});
var $author$project$Deezer$playlist = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'nb_tracks',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'link',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'title',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
				$elm$json$Json$Decode$succeed($author$project$Playlist$Playlist)))));
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve = $elm$json$Json$Decode$andThen($elm$core$Basics$identity);
var $author$project$Deezer$decodePlaylists = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'data',
		$elm$json$Json$Decode$list($author$project$Deezer$playlist),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Deezer$getPlaylists = function (token) {
	return A3(
		$author$project$ApiClient$getWithRateLimit,
		$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
		A2(
			$author$project$Deezer$withToken,
			token,
			$author$project$ApiClient$fullAsAny(
				A2(
					$author$project$ApiClient$actionEndpoint,
					$author$project$Deezer$endpoint,
					_List_fromArray(
						['user', 'me', 'playlists'])))),
		$author$project$Deezer$decodePlaylists);
};
var $author$project$UserInfo$UserInfo = F2(
	function (id, displayName) {
		return {c5: displayName, av: id};
	});
var $author$project$Deezer$userInfo = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
		$elm$json$Json$Decode$succeed($author$project$UserInfo$UserInfo)));
var $author$project$Deezer$getUserInfo = function (token) {
	return A3(
		$author$project$ApiClient$get,
		$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
		A2(
			$author$project$Deezer$withToken,
			token,
			$author$project$ApiClient$fullAsAny(
				A2(
					$author$project$ApiClient$actionEndpoint,
					$author$project$Deezer$endpoint,
					_List_fromArray(
						['user', 'me'])))),
		$author$project$Deezer$userInfo);
};
var $author$project$Basics$Extra$apply = F2(
	function (a, f) {
		return f(a);
	});
var $author$project$Deezer$singleTrack = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $author$project$Deezer$track),
			$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
		]));
var $author$project$Deezer$searchTrackByISRC = F2(
	function (token, _v0) {
		var isrc = _v0.ds;
		return A2(
			$author$project$Basics$Extra$apply,
			$author$project$Deezer$singleTrack,
			A2(
				$author$project$ApiClient$getWithRateLimit,
				$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
				A2(
					$author$project$Deezer$withToken,
					token,
					$author$project$ApiClient$fullAsAny(
						A2(
							$author$project$ApiClient$actionEndpoint,
							$author$project$Deezer$endpoint,
							_List_fromArray(
								['track', 'isrc:' + isrc]))))));
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Deezer$tracksResult = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'data',
		$elm$json$Json$Decode$list($author$project$Deezer$track),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Deezer$searchTrackByName = F2(
	function (token, t) {
		return A2(
			$author$project$Basics$Extra$apply,
			A2($elm$json$Json$Decode$map, $elm$core$List$head, $author$project$Deezer$tracksResult),
			A2(
				$author$project$ApiClient$getWithRateLimit,
				$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
				A2(
					$author$project$Deezer$withToken,
					token,
					A3(
						$author$project$ApiClient$queryEndpoint,
						$author$project$Deezer$endpoint,
						_List_fromArray(
							['search', 'track']),
						_List_fromArray(
							[
								A2($elm$url$Url$Builder$string, 'q', 'artist:\"' + (t.cD + ('\" track:\"' + (t.er + '\"'))))
							])))));
	});
var $author$project$Deezer$api = {cp: $author$project$Deezer$addSongsToPlaylist, c1: $author$project$Deezer$createPlaylist, dc: $author$project$Deezer$getPlaylistTracks, dd: $author$project$Deezer$getPlaylists, de: $author$project$Deezer$getUserInfo, dW: $author$project$Deezer$searchTrackByISRC, dX: $author$project$Deezer$searchTrackByName};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Spotify$addPlaylistTracksEncoder = function (songs) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uris',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$string,
					A2(
						$elm$core$List$map,
						$elm$core$Basics$append('spotify:track:'),
						A2(
							$elm$core$List$map,
							function ($) {
								return $.av;
							},
							songs))))
			]));
};
var $author$project$Spotify$addToPlaylistResponse = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['snapshot_id']),
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Spotify$config = function (token) {
	return _Utils_update(
		$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
		{
			dh: _List_fromArray(
				[
					A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token),
					A2($elm$http$Http$header, 'Content-Type', 'application/json')
				])
		});
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$ApiClient$appendPath = F2(
	function (segment, endpoint) {
		if (!endpoint.$) {
			var url = endpoint.a;
			return $author$project$ApiClient$fullAsAny(
				url + ('/' + $elm$url$Url$percentEncode(segment)));
		} else {
			var url = endpoint.a;
			return A2(
				$elm$core$Maybe$withDefault,
				endpoint,
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $author$project$ApiClient$fullQueryAsAny, $elm$core$Basics$identity),
						$elm$url$Url$toString),
					A2(
						$elm$core$Maybe$map,
						function (u) {
							return _Utils_update(
								u,
								{bO: u.bO + ('/' + segment)});
						},
						$elm$url$Url$fromString(url))));
		}
	});
var $author$project$Spotify$version = 'v1';
var $author$project$Spotify$endpoint = $author$project$ApiClient$baseEndpoint(
	A3(
		$elm$url$Url$Builder$crossOrigin,
		'https://api.spotify.com',
		_List_fromArray(
			[$author$project$Spotify$version]),
		_List_Nil));
var $author$project$Spotify$playlistsTracksFromLink = function (link) {
	return A2(
		$elm$core$Maybe$map,
		$author$project$ApiClient$appendPath('tracks'),
		A2($author$project$ApiClient$endpointFromLink, $author$project$Spotify$endpoint, link));
};
var $elm$http$Http$Internal$StringBody = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		$elm$http$Http$Internal$StringBody,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $ohanhi$remotedata_http$RemoteData$Http$postTaskWithConfig = F4(
	function (config, url, decoder, body) {
		return $ohanhi$remotedata_http$RemoteData$Http$toTask(
			A5(
				$ohanhi$remotedata_http$RemoteData$Http$createRequest,
				config,
				'POST',
				url,
				decoder,
				$elm$http$Http$jsonBody(body)));
	});
var $author$project$ApiClient$post = F2(
	function (config, endpoint) {
		return A2(
			$ohanhi$remotedata_http$RemoteData$Http$postTaskWithConfig,
			config,
			$author$project$ApiClient$fullEndpointUrl(endpoint));
	});
var $author$project$Spotify$addSongsToPlaylist = F3(
	function (token, songs, pl) {
		var rest = A2($elm$core$List$drop, 100, songs);
		var batch = A2($elm$core$List$take, 100, songs);
		return $elm$core$List$isEmpty(batch) ? $elm$core$Task$succeed(
			$krisajenkins$remotedata$RemoteData$Success(0)) : A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Task$succeed(
				$krisajenkins$remotedata$RemoteData$Failure(
					$elm$http$Http$BadUrl(pl.du))),
			A2(
				$elm$core$Maybe$map,
				function (l) {
					return A2(
						$author$project$ApiClient$map,
						function (_v1) {
							return 0;
						},
						A2(
							$author$project$ApiClient$chain,
							function (_v0) {
								return A3($author$project$Spotify$addSongsToPlaylist, token, rest, pl);
							},
							A4(
								$author$project$ApiClient$post,
								$author$project$Spotify$config(token),
								l,
								$author$project$Spotify$addToPlaylistResponse,
								$author$project$Spotify$addPlaylistTracksEncoder(batch))));
				},
				$author$project$Spotify$playlistsTracksFromLink(pl.du)));
	});
var $author$project$Spotify$playlist = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
	_List_fromArray(
		['tracks', 'total']),
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'href',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Playlist$Playlist)))));
var $author$project$Spotify$createPlaylist = F3(
	function (token, user, name) {
		return A4(
			$author$project$ApiClient$post,
			$author$project$Spotify$config(token),
			$author$project$ApiClient$fullAsAny(
				A2(
					$author$project$ApiClient$actionEndpoint,
					$author$project$Spotify$endpoint,
					_List_fromArray(
						['users', user, 'playlists']))),
			$author$project$Spotify$playlist,
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'name',
						$elm$json$Json$Encode$string(name))
					])));
	});
var $author$project$Spotify$Artist = function (name) {
	return {dy: name};
};
var $author$project$Spotify$artist = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	$elm$json$Json$Decode$succeed($author$project$Spotify$Artist));
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt = F4(
	function (path, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $author$project$Spotify$toArtistName = function (artists) {
	if (artists.b) {
		var first = artists.a;
		return $elm$json$Json$Decode$succeed(first.dy);
	} else {
		return $elm$json$Json$Decode$fail('No artists found');
	}
};
var $author$project$Spotify$track = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
	_List_fromArray(
		['external_ids', 'isrc']),
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['artists']),
				$elm$json$Json$Decode$list($author$project$Spotify$artist),
				$elm$json$Json$Decode$succeed($author$project$Spotify$toArtistName))),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Track$Track)))));
var $author$project$Spotify$trackEntry = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['track']),
		$author$project$Spotify$track,
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Spotify$playlistTracks = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'items',
		$elm$json$Json$Decode$list($author$project$Spotify$trackEntry),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Spotify$getPlaylistTracksFromLink = F2(
	function (token, _v0) {
		var link = _v0.du;
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Task$succeed(
				$krisajenkins$remotedata$RemoteData$Failure(
					$elm$http$Http$BadUrl(link))),
			A2(
				$elm$core$Maybe$map,
				function (l) {
					return A3(
						$author$project$ApiClient$getWithRateLimit,
						$author$project$Spotify$config(token),
						l,
						$author$project$Spotify$playlistTracks);
				},
				$author$project$Spotify$playlistsTracksFromLink(link)));
	});
var $author$project$Spotify$playlistsResponse = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'items',
		$elm$json$Json$Decode$list($author$project$Spotify$playlist),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Spotify$getPlaylists = function (token) {
	return A3(
		$author$project$ApiClient$getWithRateLimit,
		$author$project$Spotify$config(token),
		$author$project$ApiClient$fullAsAny(
			A2(
				$author$project$ApiClient$actionEndpoint,
				$author$project$Spotify$endpoint,
				_List_fromArray(
					['me', 'playlists']))),
		$author$project$Spotify$playlistsResponse);
};
var $author$project$Spotify$userInfo = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'display_name',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$UserInfo$UserInfo)));
var $author$project$Spotify$getUserInfo = function (token) {
	return A3(
		$author$project$ApiClient$get,
		$author$project$Spotify$config(token),
		$author$project$ApiClient$fullAsAny(
			A2(
				$author$project$ApiClient$actionEndpoint,
				$author$project$Spotify$endpoint,
				_List_fromArray(
					['me']))),
		$author$project$Spotify$userInfo);
};
var $elm$url$Url$Builder$int = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$core$String$fromInt(value));
	});
var $author$project$Spotify$searchResponse = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['tracks', 'items']),
		$elm$json$Json$Decode$list($author$project$Spotify$track),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Spotify$searchTrack = F2(
	function (token, query) {
		return A2(
			$author$project$ApiClient$map,
			$elm$core$List$head,
			A2(
				$author$project$Basics$Extra$apply,
				$author$project$Spotify$searchResponse,
				A2(
					$author$project$ApiClient$getWithRateLimit,
					$author$project$Spotify$config(token),
					A3(
						$author$project$ApiClient$queryEndpoint,
						$author$project$Spotify$endpoint,
						_List_fromArray(
							['search']),
						_List_fromArray(
							[
								A2($elm$url$Url$Builder$string, 'type', 'track'),
								A2($elm$url$Url$Builder$int, 'limit', 1),
								A2($elm$url$Url$Builder$string, 'q', query)
							])))));
	});
var $author$project$Spotify$searchTrackByISRC = F2(
	function (token, _v0) {
		var isrc = _v0.ds;
		return A2($author$project$Spotify$searchTrack, token, 'isrc:' + isrc);
	});
var $author$project$Spotify$searchTrackByName = F2(
	function (token, t) {
		return A2($author$project$Spotify$searchTrack, token, 'artist:\"' + (t.cD + ('\" track:\"' + (t.er + '\"'))));
	});
var $author$project$Spotify$api = {cp: $author$project$Spotify$addSongsToPlaylist, c1: $author$project$Spotify$createPlaylist, dc: $author$project$Spotify$getPlaylistTracksFromLink, dd: $author$project$Spotify$getPlaylists, de: $author$project$Spotify$getUserInfo, dW: $author$project$Spotify$searchTrackByISRC, dX: $author$project$Spotify$searchTrackByName};
var $author$project$Youtube$addPlaylistTracksEncoder = function (songs) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uris',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$string,
					A2(
						$elm$core$List$map,
						$elm$core$Basics$append('spotify:track:'),
						A2(
							$elm$core$List$map,
							function ($) {
								return $.av;
							},
							songs))))
			]));
};
var $author$project$Youtube$addToPlaylistResponse = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['snapshot_id']),
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Youtube$config = function (token) {
	return _Utils_update(
		$ohanhi$remotedata_http$RemoteData$Http$defaultConfig,
		{
			dh: _List_fromArray(
				[
					A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token)
				])
		});
};
var $author$project$Youtube$YT = 1;
var $author$project$Youtube$sectionToPrefix = function (section) {
	if (!section) {
		return 'www';
	} else {
		return 'youtube';
	}
};
var $author$project$Youtube$oauth = _List_fromArray(
	['oauth2', 'v2']);
var $author$project$Youtube$yt = _List_fromArray(
	['youtube', 'v3']);
var $author$project$Youtube$sectionToSegment = function (section) {
	if (!section) {
		return $author$project$Youtube$oauth;
	} else {
		return $author$project$Youtube$yt;
	}
};
var $author$project$Youtube$endpoint = function (section) {
	return $author$project$ApiClient$baseEndpoint(
		A3(
			$elm$url$Url$Builder$crossOrigin,
			'https://' + ($author$project$Youtube$sectionToPrefix(section) + '.googleapis.com'),
			$author$project$Youtube$sectionToSegment(section),
			_List_Nil));
};
var $author$project$Youtube$playlistsTracksFromLink = function (link) {
	return A2(
		$elm$core$Maybe$map,
		$author$project$ApiClient$appendPath('tracks'),
		A2(
			$author$project$ApiClient$endpointFromLink,
			$author$project$Youtube$endpoint(1),
			link));
};
var $author$project$Youtube$addSongsToPlaylist = F3(
	function (token, songs, _v0) {
		var link = _v0.du;
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Task$succeed(
				$krisajenkins$remotedata$RemoteData$Failure(
					$elm$http$Http$BadUrl(link))),
			A2(
				$elm$core$Maybe$map,
				function (l) {
					return A2(
						$author$project$ApiClient$map,
						function (_v1) {
							return 0;
						},
						A4(
							$author$project$ApiClient$post,
							$author$project$Youtube$config(token),
							l,
							$author$project$Youtube$addToPlaylistResponse,
							$author$project$Youtube$addPlaylistTracksEncoder(songs)));
				},
				$author$project$Youtube$playlistsTracksFromLink(link)));
	});
var $author$project$Youtube$playlist = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
	_List_fromArray(
		['contentDetails', 'itemCount']),
	$elm$json$Json$Decode$int,
	A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
		'',
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['snippet', 'title']),
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Playlist$Playlist)))));
var $author$project$Youtube$createPlaylist = F3(
	function (token, user, name) {
		return A4(
			$author$project$ApiClient$post,
			$author$project$Youtube$config(token),
			$author$project$ApiClient$fullAsAny(
				A2(
					$author$project$ApiClient$actionEndpoint,
					$author$project$Youtube$endpoint(1),
					_List_fromArray(
						['users', user, 'playlists']))),
			$author$project$Youtube$playlist,
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'name',
						$elm$json$Json$Encode$string(name))
					])));
	});
var $author$project$Youtube$Artist = function (name) {
	return {dy: name};
};
var $author$project$Youtube$artist = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	$elm$json$Json$Decode$succeed($author$project$Youtube$Artist));
var $author$project$Youtube$toArtistName = function (artists) {
	if (artists.b) {
		var first = artists.a;
		return $elm$json$Json$Decode$succeed(first.dy);
	} else {
		return $elm$json$Json$Decode$fail('No artists found');
	}
};
var $author$project$Youtube$track = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
	_List_fromArray(
		['external_ids', 'isrc']),
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['artists']),
				$elm$json$Json$Decode$list($author$project$Youtube$artist),
				$elm$json$Json$Decode$succeed($author$project$Youtube$toArtistName))),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Track$Track)))));
var $author$project$Youtube$trackEntry = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['track']),
		$author$project$Youtube$track,
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Youtube$playlistTracks = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'items',
		$elm$json$Json$Decode$list($author$project$Youtube$trackEntry),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Youtube$getPlaylistTracksFromLink = F2(
	function (token, _v0) {
		var link = _v0.du;
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Task$succeed(
				$krisajenkins$remotedata$RemoteData$Failure(
					$elm$http$Http$BadUrl(link))),
			A2(
				$elm$core$Maybe$map,
				function (l) {
					return A3(
						$author$project$ApiClient$getWithRateLimit,
						$author$project$Youtube$config(token),
						l,
						$author$project$Youtube$playlistTracks);
				},
				$author$project$Youtube$playlistsTracksFromLink(link)));
	});
var $author$project$Youtube$playlistsResponse = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'items',
		$elm$json$Json$Decode$list($author$project$Youtube$playlist),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Youtube$getPlaylists = function (token) {
	return A3(
		$author$project$ApiClient$getWithRateLimit,
		$author$project$Youtube$config(token),
		A3(
			$author$project$ApiClient$queryEndpoint,
			$author$project$Youtube$endpoint(1),
			_List_fromArray(
				['playlists']),
			_List_fromArray(
				[
					A2($elm$url$Url$Builder$string, 'part', 'snippet,contentDetails'),
					A2($elm$url$Url$Builder$string, 'mine', 'true')
				])),
		$author$project$Youtube$playlistsResponse);
};
var $author$project$Youtube$Auth = 0;
var $author$project$Youtube$userInfo = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$UserInfo$UserInfo)));
var $author$project$Youtube$getUserInfo = function (token) {
	return A3(
		$author$project$ApiClient$get,
		$author$project$Youtube$config(token),
		$author$project$ApiClient$fullAsAny(
			A2(
				$author$project$ApiClient$actionEndpoint,
				$author$project$Youtube$endpoint(0),
				_List_fromArray(
					['userinfo']))),
		$author$project$Youtube$userInfo);
};
var $author$project$Youtube$searchTrackByISRC = F2(
	function (_v0, _v1) {
		return $elm$core$Task$succeed(
			$krisajenkins$remotedata$RemoteData$Success($elm$core$Maybe$Nothing));
	});
var $author$project$Youtube$searchResponse = $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$resolve(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['tracks', 'items']),
		$elm$json$Json$Decode$list($author$project$Youtube$track),
		$elm$json$Json$Decode$succeed($elm$json$Json$Decode$succeed)));
var $author$project$Youtube$searchTrack = F2(
	function (token, query) {
		return A2(
			$author$project$ApiClient$map,
			$elm$core$List$head,
			A2(
				$author$project$Basics$Extra$apply,
				$author$project$Youtube$searchResponse,
				A2(
					$author$project$ApiClient$getWithRateLimit,
					$author$project$Youtube$config(token),
					A3(
						$author$project$ApiClient$queryEndpoint,
						$author$project$Youtube$endpoint(1),
						_List_fromArray(
							['search']),
						_List_fromArray(
							[
								A2($elm$url$Url$Builder$string, 'type', 'track'),
								A2($elm$url$Url$Builder$int, 'limit', 1),
								A2($elm$url$Url$Builder$string, 'q', query)
							])))));
	});
var $author$project$Youtube$searchTrackByName = F2(
	function (token, t) {
		return A2($author$project$Youtube$searchTrack, token, 'artist:\"' + (t.cD + ('\" track:\"' + (t.er + '\"'))));
	});
var $author$project$Youtube$api = {cp: $author$project$Youtube$addSongsToPlaylist, c1: $author$project$Youtube$createPlaylist, dc: $author$project$Youtube$getPlaylistTracksFromLink, dd: $author$project$Youtube$getPlaylists, de: $author$project$Youtube$getUserInfo, dW: $author$project$Youtube$searchTrackByISRC, dX: $author$project$Youtube$searchTrackByName};
var $author$project$MusicProvider$api = function (provider) {
	switch (provider) {
		case 0:
			return $author$project$Spotify$api;
		case 1:
			return $author$project$Deezer$api;
		default:
			return $author$project$Youtube$api;
	}
};
var $author$project$MusicService$NeverError = {$: 2};
var $elm$core$Task$fail = _Scheduler_fail;
var $elm$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			$elm$core$Task$onError,
			A2($elm$core$Basics$composeL, $elm$core$Task$fail, convert),
			task);
	});
var $author$project$MusicService$asErrorTask = $elm$core$Task$mapError(
	function (_v0) {
		return $author$project$MusicService$NeverError;
	});
var $author$project$Connection$Connected$rawToken = function (_v0) {
	var value = _v0;
	return value;
};
var $author$project$MusicService$fetchUserInfo = function (connection) {
	if (connection.$ === 1) {
		var service = connection.a;
		var tok = connection.b;
		var api = $author$project$MusicProvider$api(service);
		return $author$project$MusicService$asErrorTask(
			api.de(
				$author$project$Connection$Connected$rawToken(tok)));
	} else {
		return $elm$core$Task$fail(
			$author$project$MusicService$InvalidServiceConnectionError(connection));
	}
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Playlist$Dict$get = $turboMaCk$any_dict$Dict$Any$get;
var $author$project$Playlist$State$PlaylistImportResult = F3(
	function (connection, playlist, status) {
		return {c$: connection, bQ: playlist, d4: status};
	});
var $author$project$MusicService$addSongsToPlaylist = F3(
	function (connection, playlist, tracks) {
		if (connection.$ === 1) {
			var service = connection.a;
			var tok = connection.b;
			var api = $author$project$MusicProvider$api(service);
			return $author$project$MusicService$asErrorTask(
				A3(
					api.cp,
					$author$project$Connection$Connected$rawToken(tok),
					tracks,
					playlist));
		} else {
			return $elm$core$Task$fail(
				$author$project$MusicService$InvalidServiceConnectionError(connection));
		}
	});
var $author$project$ApiClient$chain2 = F3(
	function (f, task1, task2) {
		return A2(
			$elm$core$Task$andThen,
			function (data) {
				switch (data.$) {
					case 3:
						var t2 = data.a;
						return t2;
					case 2:
						var err = data.a;
						return $elm$core$Task$succeed(
							$krisajenkins$remotedata$RemoteData$Failure(err));
					default:
						return $elm$core$Task$succeed($krisajenkins$remotedata$RemoteData$NotAsked);
				}
			},
			A3(
				$elm$core$Task$map2,
				$krisajenkins$remotedata$RemoteData$map2(f),
				task1,
				task2));
	});
var $author$project$MusicService$MissingUserInfo = function (a) {
	return {$: 1, a: a};
};
var $author$project$MusicService$createPlaylist = F2(
	function (connection, name) {
		if (!connection.$) {
			return $elm$core$Task$fail(
				$author$project$MusicService$InvalidServiceConnectionError(connection));
		} else {
			if (connection.c.$ === 3) {
				var service = connection.a;
				var tok = connection.b;
				var userInfo = connection.c.a;
				var api = $author$project$MusicProvider$api(service);
				return $author$project$MusicService$asErrorTask(
					A3(
						api.c1,
						$author$project$Connection$Connected$rawToken(tok),
						userInfo.av,
						name));
			} else {
				return $elm$core$Task$fail(
					$author$project$MusicService$MissingUserInfo(connection));
			}
		}
	});
var $author$project$MusicService$loadPlaylistSongs = F2(
	function (connection, playlist) {
		if (connection.$ === 1) {
			var service = connection.a;
			var tok = connection.b;
			var api = $author$project$MusicProvider$api(service);
			return $author$project$MusicService$asErrorTask(
				A2(
					api.dc,
					$author$project$Connection$Connected$rawToken(tok),
					playlist));
		} else {
			return $elm$core$Task$fail(
				$author$project$MusicService$InvalidServiceConnectionError(connection));
		}
	});
var $author$project$Playlist$Import$successfulTracks = $elm$core$List$filterMap($elm$core$Tuple$second);
var $author$project$Playlist$Import$matchedTracks = function (rpt) {
	if (!rpt.$) {
		var tracks = rpt.a;
		return tracks;
	} else {
		var tracks = rpt.a;
		return $author$project$Playlist$Import$successfulTracks(tracks);
	}
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$Set$size = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$size(dict);
};
var $author$project$Track$toString = function (track) {
	return track.cD + (' - ' + track.er);
};
var $author$project$MusicService$removeDuplicates = function (trackList) {
	return A2(
		$elm$core$Tuple$mapSecond,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Set$size,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Basics$sub(
					$elm$core$List$length(trackList)),
				$elm$core$Basics$abs)),
		A2(
			$elm$core$Tuple$mapFirst,
			$elm$core$Array$toList,
			A3(
				$elm$core$List$foldl,
				F2(
					function (t, _v0) {
						var tracks = _v0.a;
						var ids = _v0.b;
						var tid = A2(
							$elm$core$Maybe$withDefault,
							$author$project$Track$toString(t),
							t.ds);
						return A2($elm$core$Set$member, tid, ids) ? _Utils_Tuple2(tracks, ids) : _Utils_Tuple2(
							A2($elm$core$Array$push, t, tracks),
							A2($elm$core$Set$insert, tid, ids));
					}),
				_Utils_Tuple2($elm$core$Array$empty, $elm$core$Set$empty),
				trackList)));
};
var $author$project$Playlist$Import$ImportHasWarnings = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Playlist$Import$ImportIsSuccess = function (a) {
	return {$: 0, a: a};
};
var $author$project$Playlist$Import$report = F2(
	function (results, dupes) {
		var matched = $author$project$Playlist$Import$successfulTracks(results);
		var matchedTrackCount = $elm$core$List$length(matched);
		return ((_Utils_cmp(
			matchedTrackCount,
			$elm$core$List$length(results)) < 0) || (dupes > 0)) ? A2($author$project$Playlist$Import$ImportHasWarnings, results, dupes) : $author$project$Playlist$Import$ImportIsSuccess(matched);
	});
var $author$project$Track$IdentifiedTrack = F4(
	function (id, title, artist, isrc) {
		return {cD: artist, av: id, ds: isrc, er: title};
	});
var $author$project$Track$identified = function (track) {
	return A2(
		$elm$core$Maybe$map,
		A3($author$project$Track$IdentifiedTrack, track.av, track.er, track.cD),
		track.ds);
};
var $author$project$MusicService$searchSongFromProvider = F2(
	function (con, track) {
		var searchFns = function () {
			if (con.$ === 1) {
				var service = con.a;
				var tok = con.b;
				var api = $author$project$MusicProvider$api(service);
				return $elm$core$Maybe$Just(
					_Utils_Tuple3(
						api.dW,
						api.dX,
						$author$project$Connection$Connected$rawToken(tok)));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}();
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Task$fail(
				$author$project$MusicService$InvalidServiceConnectionError(con)),
			A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var searchTrackByISRC = _v0.a;
					var searchTrackByName = _v0.b;
					var tok = _v0.c;
					return A2(
						$elm$core$Maybe$withDefault,
						$author$project$MusicService$asErrorTask(
							A2(searchTrackByName, tok, track)),
						A2(
							$elm$core$Maybe$map,
							$author$project$MusicService$asErrorTask,
							A2(
								$elm$core$Maybe$map,
								$author$project$ApiClient$chain(
									function (data) {
										if (data.$ === 1) {
											return A2(searchTrackByName, tok, track);
										} else {
											return $elm$core$Task$succeed(
												$krisajenkins$remotedata$RemoteData$Success(data));
										}
									}),
								A2(
									$elm$core$Maybe$map,
									searchTrackByISRC(tok),
									$author$project$Track$identified(track)))));
				},
				searchFns));
	});
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Basics$Extra$uncurry = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		return A2(f, a, b);
	});
var $author$project$List$Extra$zip = $author$project$Basics$Extra$uncurry(
	$elm$core$List$map2($elm$core$Tuple$pair));
var $author$project$MusicService$searchAllTracks = F2(
	function (connection, trackList) {
		return A2(
			$elm$core$Task$map,
			$krisajenkins$remotedata$RemoteData$map($author$project$List$Extra$zip),
			A2(
				$elm$core$Task$map,
				function (_v0) {
					var tracks = _v0.a;
					var result = _v0.b;
					return A2(
						$krisajenkins$remotedata$RemoteData$map,
						$elm$core$Tuple$pair(tracks),
						result);
				},
				A2(
					$elm$core$Task$map,
					$elm$core$Tuple$mapSecond($krisajenkins$remotedata$RemoteData$fromList),
					A2(
						$elm$core$Task$map,
						$elm$core$List$unzip,
						$elm$core$Task$sequence(
							A2(
								$elm$core$List$map,
								function (t) {
									return A2(
										$elm$core$Task$map,
										$elm$core$Tuple$pair(t),
										A2($author$project$MusicService$searchSongFromProvider, connection, t));
								},
								trackList))))));
	});
var $author$project$MusicService$importPlaylist = F3(
	function (con, otherConnection, playlist) {
		var name = playlist.dy;
		var tracksTask = A2(
			$author$project$ApiClient$chain,
			function (_v2) {
				var t = _v2.a;
				var dupes = _v2.b;
				return A2(
					$author$project$ApiClient$map,
					function (d) {
						return _Utils_Tuple2(d, dupes);
					},
					A2($author$project$MusicService$searchAllTracks, otherConnection, t));
			},
			A2(
				$author$project$ApiClient$map,
				$author$project$MusicService$removeDuplicates,
				A2($author$project$MusicService$loadPlaylistSongs, con, playlist)));
		var newPlaylistTask = A2($author$project$MusicService$createPlaylist, otherConnection, name);
		return A3(
			$author$project$ApiClient$chain2,
			F2(
				function (_v0, newPlaylist) {
					var tracksResult = _v0.a;
					var dupes = _v0.b;
					var report = A2($author$project$Playlist$Import$report, tracksResult, dupes);
					var matchedTracks = $author$project$Playlist$Import$matchedTracks(report);
					var withTracksCount = _Utils_update(
						newPlaylist,
						{
							eu: $elm$core$List$length(matchedTracks)
						});
					return A2(
						$author$project$ApiClient$map,
						function (_v1) {
							return A3($author$project$Playlist$State$PlaylistImportResult, otherConnection, withTracksCount, report);
						},
						A3($author$project$MusicService$addSongsToPlaylist, otherConnection, newPlaylist, matchedTracks));
				}),
			tracksTask,
			newPlaylistTask);
	});
var $author$project$Playlist$Dict$keyToCon = function (_v0) {
	var con = _v0.a;
	return con;
};
var $author$project$MusicService$loadPlaylists = function (connection) {
	if (connection.$ === 1) {
		var service = connection.a;
		var tok = connection.b;
		var api = $author$project$MusicProvider$api(service);
		return $author$project$MusicService$asErrorTask(
			api.dd(
				$author$project$Connection$Connected$rawToken(tok)));
	} else {
		return $elm$core$Task$fail(
			$author$project$MusicService$InvalidServiceConnectionError(connection));
	}
};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Result$Extra$unwrap = function (r) {
	if (!r.$) {
		var data = r.a;
		return data;
	} else {
		var error = r.a;
		return error;
	}
};
var $author$project$Connection$Connected$user = function (con) {
	_v0$2:
	while (true) {
		if (con.$ === 1) {
			if (con.c.$ === 3) {
				var u = con.c.a;
				return $elm$core$Maybe$Just(u);
			} else {
				break _v0$2;
			}
		} else {
			if (con.b.$ === 3) {
				var u = con.b.a;
				return $elm$core$Maybe$Just(u);
			} else {
				break _v0$2;
			}
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Page$onNavigate = F3(
	function (handlers, _v0, _v1) {
		var connections = _v0.A;
		var playlists = _v0.n;
		var path = _v1;
		switch (path.$) {
			case 0:
				return $elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						function (_v5) {
							var c = _v5.a;
							var t = _v5.b;
							return A2(
								$elm$core$Task$perform,
								handlers.ex(c),
								t);
						},
						A2(
							$elm$core$List$map,
							function (c) {
								return _Utils_Tuple2(
									c,
									A2(
										$elm$core$Task$onError,
										function (_v4) {
											return $elm$core$Task$succeed($krisajenkins$remotedata$RemoteData$NotAsked);
										},
										$author$project$MusicService$fetchUserInfo(c)));
							},
							A2(
								$elm$core$List$filter,
								A2(
									$elm$core$Basics$composeR,
									$author$project$Connection$Connected$user,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Maybe$map(
											function (_v3) {
												return false;
											}),
										$elm$core$Maybe$withDefault(true))),
								A2(
									$elm$core$List$filterMap,
									$author$project$Connection$asConnected,
									$author$project$Connection$Dict$connections(connections))))));
			case 1:
				return $elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						function (con) {
							return A2(
								$elm$core$Task$attempt,
								handlers.dL(con),
								$author$project$MusicService$loadPlaylists(con));
						},
						$author$project$Connection$Dict$connectedConnections(connections)));
			case 6:
				var playlist = path.a;
				var destination = path.b;
				return A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Platform$Cmd$none,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Task$attempt(
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Result$map(
									handlers.dJ(playlist)),
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Result$mapError(
										A2(handlers.dK, playlist, destination)),
									$author$project$Result$Extra$unwrap))),
						A2(
							$elm$core$Maybe$map,
							A2(
								$author$project$MusicService$importPlaylist,
								$author$project$Playlist$Dict$keyToCon(playlist),
								destination),
							A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$first,
								A2($author$project$Playlist$Dict$get, playlist, playlists)))));
			default:
				return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Main$init = function (flags) {
	var m = {
		A: $author$project$Main$initConnections(flags),
		by: $mdgriffith$elm_ui$Element$classifyDevice(flags.bk),
		dH: $author$project$Page$init,
		n: $author$project$Playlist$Dict$noPlaylists
	};
	return _Utils_Tuple2(
		m,
		A3($author$project$Page$onNavigate, $author$project$Main$handlers, m, m.dH));
};
var $author$project$Main$BrowserResized = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$Dimensions = F2(
	function (height, width) {
		return {bE: height, ck: width};
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$browser$Browser$Events$Window = 1;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {bP: pids, b6: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {bA: event, bJ: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.bP,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.bJ;
		var event = _v0.bA;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.b6);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize(
				F2(
					function (w, h) {
						return $author$project$Main$BrowserResized(
							A2($author$project$Main$Dimensions, h, w));
					}))
			]));
};
var $author$project$Main$Navigated = function (a) {
	return {$: 7, a: a};
};
var $author$project$Page$Request$PlaylistPicker = {$: 2};
var $author$project$Page$Request$TransferReport = function (a) {
	return {$: 7, a: a};
};
var $author$project$Playlist$State$Untransferred = {$: 1};
var $author$project$Playlist$State$init = $author$project$Playlist$State$Untransferred;
var $turboMaCk$any_dict$Dict$Any$update = F3(
	function (k, f, _v0) {
		var inner = _v0;
		var updateDict = A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Maybe$map(
					function (b) {
						return _Utils_Tuple2(k, b);
					}),
				f),
			$elm$core$Maybe$map($elm$core$Tuple$second));
		return _Utils_update(
			inner,
			{
				a: A3(
					$elm$core$Dict$update,
					inner.w(k),
					updateDict,
					inner.a)
			});
	});
var $author$project$Playlist$Dict$add = F2(
	function (pKey, p) {
		return A2(
			$turboMaCk$any_dict$Dict$Any$update,
			pKey,
			function (_v0) {
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(p, $author$project$Playlist$State$init));
			});
	});
var $author$project$Playlist$State$New = {$: 0};
var $author$project$Playlist$State$new = $author$project$Playlist$State$New;
var $author$project$Playlist$Dict$addNew = F2(
	function (pKey, p) {
		return A2(
			$turboMaCk$any_dict$Dict$Any$update,
			pKey,
			function (_v0) {
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(p, $author$project$Playlist$State$new));
			});
	});
var $author$project$Basics$Extra$const = function (value) {
	return function (_v0) {
		return value;
	};
};
var $author$project$Playlist$State$Transferred = function (a) {
	return {$: 3, a: a};
};
var $author$project$Playlist$State$transferComplete = $author$project$Playlist$State$Transferred;
var $author$project$Playlist$Dict$completeTransfer = F2(
	function (pKey, result) {
		return A2(
			$turboMaCk$any_dict$Dict$Any$update,
			pKey,
			$elm$core$Maybe$map(
				$elm$core$Tuple$mapSecond(
					$author$project$Basics$Extra$const(
						$author$project$Playlist$State$transferComplete(result)))));
	});
var $author$project$Playlist$Dict$PlaylistKey = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Playlist$Dict$key = $author$project$Playlist$Dict$PlaylistKey;
var $author$project$Connection$map = F2(
	function (f, connection) {
		if (connection.$ === 2) {
			var provider = connection.a;
			return $author$project$Connection$Connected(
				f(provider));
		} else {
			return connection;
		}
	});
var $author$project$Page$Request$DestinationPicker = function (a) {
	return {$: 4, a: a};
};
var $author$project$Page$Request$PlaylistNotFound = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Request$tryGetPlaylist = F3(
	function (req, playlistKey, playlists) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Result$Err(
				$author$project$Page$Request$PlaylistNotFound(
					req(playlistKey))),
			A2(
				$elm$core$Maybe$map,
				function (_v0) {
					return $elm$core$Result$Ok(
						req(playlistKey));
				},
				A2($turboMaCk$any_dict$Dict$Any$get, playlistKey, playlists)));
	});
var $author$project$Page$Request$tryDestinationPicker = F2(
	function (playlistKey, _v0) {
		var playlists = _v0.n;
		return A3($author$project$Page$Request$tryGetPlaylist, $author$project$Page$Request$DestinationPicker, playlistKey, playlists);
	});
var $author$project$Page$Request$PlaylistDetails = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Request$tryPlaylistDetails = F2(
	function (playlistKey, _v0) {
		var playlists = _v0.n;
		return A3($author$project$Page$Request$tryGetPlaylist, $author$project$Page$Request$PlaylistDetails, playlistKey, playlists);
	});
var $author$project$Page$Request$WaitingForLoadingPlaylists = function (a) {
	return {$: 1, a: a};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$Page$Request$isWaitingForPlaylists = function (service) {
	_v0$2:
	while (true) {
		switch (service.a.$) {
			case 2:
				if (service.b.$ === 3) {
					return false;
				} else {
					break _v0$2;
				}
			case 0:
				return false;
			default:
				break _v0$2;
		}
	}
	return true;
};
var $author$project$Page$Request$tryPlaylistPicker = function (_v0) {
	var connections = _v0.A;
	return A2(
		$elm$core$List$any,
		$author$project$Page$Request$isWaitingForPlaylists,
		$turboMaCk$any_dict$Dict$Any$values(connections)) ? $elm$core$Result$Err(
		$author$project$Page$Request$WaitingForLoadingPlaylists($author$project$Page$Request$PlaylistPicker)) : $elm$core$Result$Ok($author$project$Page$Request$PlaylistPicker);
};
var $author$project$Page$Request$NotEnoughConnectedProviders = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Request$PlaylistsSpinner = {$: 1};
var $author$project$Connection$Connected$hasUser = function (con) {
	_v0$2:
	while (true) {
		if (con.$ === 1) {
			if (con.c.$ === 3) {
				return true;
			} else {
				break _v0$2;
			}
		} else {
			if (con.b.$ === 3) {
				return true;
			} else {
				break _v0$2;
			}
		}
	}
	return false;
};
var $author$project$Page$Request$hasAtLeast2Connected = function (connections) {
	return 2 <= $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			$author$project$Connection$Connected$hasUser,
			$author$project$List$Connection$connectedProviders(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$first,
					$turboMaCk$any_dict$Dict$Any$values(connections)))));
};
var $author$project$Page$Request$tryPlaylistsSpinner = function (_v0) {
	var connections = _v0.A;
	return $author$project$Page$Request$hasAtLeast2Connected(connections) ? $elm$core$Result$Ok($author$project$Page$Request$PlaylistsSpinner) : $elm$core$Result$Err(
		$author$project$Page$Request$NotEnoughConnectedProviders($author$project$Page$Request$PlaylistsSpinner));
};
var $author$project$Page$Request$DestinationPicked = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Page$Request$SourceIsDestination = function (a) {
	return {$: 4, a: a};
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Result$Extra$fromBool = F2(
	function (error, test) {
		return test ? $elm$core$Result$Ok(0) : $elm$core$Result$Err(error);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Page$Request$trySelectedDestinationPicker = F3(
	function (playlistKey, connection, _v0) {
		var playlists = _v0.n;
		return A2(
			$elm$core$Result$map,
			function (_v2) {
				return A2($author$project$Page$Request$DestinationPicked, playlistKey, connection);
			},
			A2(
				$elm$core$Result$andThen,
				function (_v1) {
					return A3($author$project$Page$Request$tryGetPlaylist, $author$project$Page$Request$DestinationPicker, playlistKey, playlists);
				},
				A2(
					$author$project$Result$Extra$fromBool,
					$author$project$Page$Request$SourceIsDestination(
						A2($author$project$Page$Request$DestinationPicked, playlistKey, connection)),
					!_Utils_eq(
						connection,
						$author$project$Playlist$Dict$keyToCon(playlistKey)))));
	});
var $author$project$Page$Request$MusicServiceNotFound = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Request$TransferSpinner = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $author$project$Page$Request$tryTransferSpinner = F3(
	function (playlistKey, service, model) {
		var connections = model.A;
		return A2(
			$elm$core$Result$andThen,
			function (_v0) {
				return A2(
					$elm$core$Result$map,
					function (_v1) {
						return A2($author$project$Page$Request$TransferSpinner, playlistKey, service);
					},
					A2(
						$elm$core$Result$fromMaybe,
						$author$project$Page$Request$MusicServiceNotFound(
							A2($author$project$Page$Request$TransferSpinner, playlistKey, service)),
						A2(
							$turboMaCk$any_dict$Dict$Any$get,
							$author$project$Connection$Connected$type_(service),
							connections)));
			},
			A2($author$project$Page$Request$tryDestinationPicker, playlistKey, model));
	});
var $author$project$Page$Request$tryNavigate = F2(
	function (model, path) {
		switch (path.$) {
			case 0:
				return $elm$core$Result$Ok($author$project$Page$Request$ServiceConnection);
			case 1:
				return $author$project$Page$Request$tryPlaylistsSpinner(model);
			case 2:
				return $author$project$Page$Request$tryPlaylistPicker(model);
			case 3:
				var playlist = path.a;
				return A2($author$project$Page$Request$tryPlaylistDetails, playlist, model);
			case 4:
				var playlist = path.a;
				return A2($author$project$Page$Request$tryDestinationPicker, playlist, model);
			case 5:
				var playlist = path.a;
				var connection = path.b;
				return A3($author$project$Page$Request$trySelectedDestinationPicker, playlist, connection, model);
			case 6:
				var playlist = path.a;
				var destination = path.b;
				return A3($author$project$Page$Request$tryTransferSpinner, playlist, destination, model);
			default:
				var result = path.a;
				return $elm$core$Result$Ok(
					$author$project$Page$Request$TransferReport(result));
		}
	});
var $author$project$Page$navigate = F2(
	function (model, req) {
		return A2(
			$elm$core$Result$map,
			$elm$core$Basics$identity,
			A2($author$project$Page$Request$tryNavigate, model, req));
	});
var $author$project$Main$resultToKey = function (_v0) {
	var connection = _v0.c$;
	var playlist = _v0.bQ;
	return A2($author$project$Playlist$Dict$key, connection, playlist.av);
};
var $author$project$Connection$Connected$ConnectedProvider = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Connection$Connected$setUserInfo = F2(
	function (userInfo, provider) {
		if (!provider.$) {
			var t = provider.a;
			return A2($author$project$Connection$Connected$ConnectedProvider, t, userInfo);
		} else {
			var t = provider.a;
			var tok = provider.b;
			return A3($author$project$Connection$Connected$ConnectedProviderWithToken, t, tok, userInfo);
		}
	});
var $author$project$Connection$Dict$stopLoading = F2(
	function (service, error) {
		return A2(
			$turboMaCk$any_dict$Dict$Any$update,
			service,
			function (result) {
				if ((!result.$) && (result.a.a.$ === 2)) {
					var _v1 = result.a;
					var con = _v1.a.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$author$project$Connection$Connected(con),
							A2(
								$krisajenkins$remotedata$RemoteData$map,
								$elm$core$List$map(
									$author$project$Playlist$Dict$key(con)),
								error)));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			});
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Deezer$connectDeezer = _Platform_outgoingPort(
	'connectDeezer',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Spotify$connectS = _Platform_outgoingPort(
	'connectS',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Youtube$connectYoutube = _Platform_outgoingPort(
	'connectYoutube',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Connection$toggleProviderConnect = function (connection) {
	var _v0 = $author$project$Connection$type_(
		$author$project$Connection$fromDisconnected(connection));
	switch (_v0) {
		case 1:
			return $author$project$Deezer$connectDeezer(0);
		case 0:
			return $author$project$Spotify$connectS(0);
		default:
			return $author$project$Youtube$connectYoutube(0);
	}
};
var $author$project$Connection$Dict$updateConnection = F2(
	function (type_, f) {
		return A2(
			$turboMaCk$any_dict$Dict$Any$update,
			type_,
			$elm$core$Maybe$map(
				$elm$core$Tuple$mapFirst(f)));
	});
var $krisajenkins$remotedata$RemoteData$withDefault = F2(
	function (_default, data) {
		if (data.$ === 3) {
			var x = data.a;
			return x;
		} else {
			return _default;
		}
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 6:
				var dims = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							by: $mdgriffith$elm_ui$Element$classifyDevice(dims)
						}),
					$elm$core$Platform$Cmd$none);
			case 0:
				var connection = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Connection$toggleProviderConnect(connection));
			case 2:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 3:
				var con = msg.a;
				var info = msg.b;
				return _Utils_Tuple2(
					function (c) {
						return _Utils_update(
							model,
							{A: c});
					}(
						A3(
							$author$project$Connection$Dict$updateConnection,
							$author$project$Connection$Connected$type_(con),
							$author$project$Connection$map(
								function (c) {
									return _Utils_eq(c, con) ? A2($author$project$Connection$Connected$setUserInfo, info, c) : c;
								}),
							model.A)),
					$elm$core$Platform$Cmd$none);
			case 1:
				if (!msg.b.$) {
					var connection = msg.a;
					var playlistsData = msg.b.a;
					var withPlaylists = A2(
						$author$project$Basics$Extra$apply,
						model.A,
						A2(
							$author$project$Connection$Dict$stopLoading,
							$author$project$Connection$Connected$type_(connection),
							A2(
								$krisajenkins$remotedata$RemoteData$map,
								$elm$core$List$map(
									function ($) {
										return $.av;
									}),
								playlistsData)));
					var storedPlaylists = A2(
						$krisajenkins$remotedata$RemoteData$withDefault,
						model.n,
						A2(
							$krisajenkins$remotedata$RemoteData$map,
							A2(
								$elm$core$List$foldl,
								F2(
									function (p, dict) {
										return A3(
											$author$project$Playlist$Dict$add,
											A2($author$project$Playlist$Dict$key, connection, p.av),
											p,
											dict);
									}),
								model.n),
							playlistsData));
					var m = _Utils_update(
						model,
						{A: withPlaylists, n: storedPlaylists});
					return A2(
						$elm$core$Result$withDefault,
						_Utils_Tuple2(m, $elm$core$Platform$Cmd$none),
						A2(
							$elm$core$Result$map,
							A2(
								$elm$core$Basics$composeL,
								A2(
									$elm$core$Basics$composeL,
									$author$project$Basics$Extra$apply(m),
									$author$project$Main$update),
								$author$project$Main$Navigated),
							A2($author$project$Page$navigate, m, $author$project$Page$Request$PlaylistPicker)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				if (msg.b.$ === 3) {
					var playlist = msg.a;
					var result = msg.b.a;
					var m = _Utils_update(
						model,
						{
							n: A3(
								$author$project$Playlist$Dict$addNew,
								$author$project$Main$resultToKey(result),
								result.bQ,
								A3($author$project$Playlist$Dict$completeTransfer, playlist, result, model.n))
						});
					return A2(
						$elm$core$Result$withDefault,
						_Utils_Tuple2(m, $elm$core$Platform$Cmd$none),
						A2(
							$elm$core$Result$map,
							A2(
								$elm$core$Basics$composeL,
								A2(
									$elm$core$Basics$composeL,
									$author$project$Basics$Extra$apply(m),
									$author$project$Main$update),
								$author$project$Main$Navigated),
							A2(
								$author$project$Page$navigate,
								m,
								$author$project$Page$Request$TransferReport(result))));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				var page = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dH: page}),
					A3($author$project$Page$onNavigate, $author$project$Main$handlers, model, page));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Above = 0;
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$above = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 0, element);
};
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$classes = {co: 'a', aH: 'atv', cr: 'ab', cs: 'cx', ct: 'cy', cu: 'acb', cv: 'accx', cw: 'accy', cx: 'acr', bp: 'al', bq: 'ar', cy: 'at', aI: 'ah', aJ: 'av', cB: 's', cG: 'bh', cH: 'b', cK: 'w7', cM: 'bd', cN: 'bdt', al: 'bn', cO: 'bs', an: 'cpe', cW: 'cp', cX: 'cpx', cY: 'cpy', z: 'c', ap: 'ctr', aq: 'cb', ar: 'ccx', B: 'ccy', ac: 'cl', as: 'cr', c0: 'ct', c2: 'cptr', c3: 'ctxt', c9: 'fcs', da: 'fs', dg: 'g', aQ: 'hbh', au: 'hc', aS: 'hf', bG: 'hfp', dk: 'hv', dm: 'ic', $7: 'fr', dq: 'iml', dr: 'it', dt: 'i', U: 'nb', bM: 'notxt', dz: 'ol', dA: 'or', O: 'oq', dG: 'oh', dH: 'pg', bN: 'p', dI: 'ppe', dQ: 'ui', o: 'r', dS: 'sb', dT: 'sbx', dU: 'sby', dV: 'sbt', d_: 'e', d$: 'cap', d1: 'sev', d7: 'sk', eb: 't', ec: 'tc', ed: 'w8', ee: 'w2', eg: 'w9', eh: 'tj', aD: 'tja', ei: 'tl', ej: 'w3', ek: 'w5', el: 'w4', em: 'tr', en: 'w6', eo: 'w1', ep: 'tun', cd: 'ts', ce: 'clr', ev: 'u', bi: 'wc', cl: 'we', bj: 'wf', cm: 'wfp', bl: 'wrp'};
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$fontAlignment = $mdgriffith$elm_ui$Internal$Flag$flag(12);
var $mdgriffith$elm_ui$Element$Font$center = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.ec);
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Styles$delayedTransition = F2(
	function (delay, prop) {
		return $mdgriffith$elm_ui$Element$htmlAttribute(
			A2(
				$elm$html$Html$Attributes$style,
				'transition',
				prop + (' .2s ease ' + ($elm$core$String$fromFloat(delay) + 's'))));
	});
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$padding = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			x,
			x,
			x,
			x));
};
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.aE;
	var right = _v0.aB;
	var bottom = _v0.am;
	var left = _v0.aw;
	return (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) ? A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(top),
			top,
			top,
			top,
			top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
			top,
			right,
			bottom,
			left));
};
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		return _Utils_eq(x, y) ? A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(x),
				x,
				x,
				x,
				x)) : A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $elm$core$Basics$pow = _Basics_pow;
var $mdgriffith$elm_ui$Element$modular = F3(
	function (normal, ratio, rescale) {
		return (!rescale) ? normal : ((rescale < 0) ? (normal * A2($elm$core$Basics$pow, ratio, rescale)) : (normal * A2($elm$core$Basics$pow, ratio, rescale - 1)));
	});
var $author$project$Dimensions$scaled = A2($mdgriffith$elm_ui$Element$modular, 16, 1.25);
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $author$project$Dimensions$dimensions = function (_v0) {
	var device = _v0.by;
	var _v1 = function () {
		var _v2 = device.cV;
		if (!_v2) {
			return {
				S: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(3)),
				T: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(1)),
				X: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(-2)),
				_: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(-3))
			};
		} else {
			return {
				S: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(5)),
				T: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(3)),
				X: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(-1)),
				_: $elm$core$Basics$round(
					$author$project$Dimensions$scaled(-2))
			};
		}
	}();
	var xSmallPadding = _v1._;
	var smallPadding = _v1.X;
	var mediumPadding = _v1.T;
	var largePadding = _v1.S;
	var _v3 = device.cV;
	if (!_v3) {
		return {
			aL: $mdgriffith$elm_ui$Element$height(
				$mdgriffith$elm_ui$Element$px(
					$elm$core$Basics$round(
						$author$project$Dimensions$scaled(5)))),
			aM: $mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$px(
					$elm$core$Basics$round(
						$author$project$Dimensions$scaled(4)))),
			aR: $mdgriffith$elm_ui$Element$paddingEach(
				{
					am: 0,
					aw: 0,
					aB: 0,
					aE: $elm$core$Basics$round(
						$author$project$Dimensions$scaled(-1))
				}),
			S: largePadding,
			aU: $mdgriffith$elm_ui$Element$padding(largePadding),
			aV: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(5))),
			aW: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(2))),
			T: mediumPadding,
			aX: $mdgriffith$elm_ui$Element$padding(mediumPadding),
			aY: $mdgriffith$elm_ui$Element$paddingEach(
				{am: 0, aw: 0, aB: 0, aE: mediumPadding}),
			aZ: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(3))),
			a_: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(1))),
			a4: 220,
			bb: A2($mdgriffith$elm_ui$Element$paddingXY, smallPadding, 0),
			X: smallPadding,
			bc: $mdgriffith$elm_ui$Element$padding(smallPadding),
			bd: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(1))),
			d0: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-1))),
			be: A2($mdgriffith$elm_ui$Element$paddingXY, 0, smallPadding),
			_: smallPadding,
			bm: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-2))),
			bn: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-2))),
			eB: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-3)))
		};
	} else {
		return {
			aL: $mdgriffith$elm_ui$Element$height(
				$mdgriffith$elm_ui$Element$px(
					$elm$core$Basics$round(
						$author$project$Dimensions$scaled(6)))),
			aM: $mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$px(
					$elm$core$Basics$round(
						$author$project$Dimensions$scaled(6)))),
			aR: $mdgriffith$elm_ui$Element$paddingEach(
				{
					am: 0,
					aw: 0,
					aB: 0,
					aE: $elm$core$Basics$round(
						$author$project$Dimensions$scaled(2))
				}),
			S: largePadding,
			aU: $mdgriffith$elm_ui$Element$padding(largePadding),
			aV: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(9))),
			aW: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(3))),
			T: mediumPadding,
			aX: $mdgriffith$elm_ui$Element$padding(mediumPadding),
			aY: $mdgriffith$elm_ui$Element$paddingEach(
				{am: 0, aw: 0, aB: 0, aE: mediumPadding}),
			aZ: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(3))),
			a_: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(1))),
			a4: 350,
			bb: A2($mdgriffith$elm_ui$Element$paddingXY, smallPadding, 0),
			X: smallPadding,
			bc: $mdgriffith$elm_ui$Element$padding(smallPadding),
			bd: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(1))),
			d0: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-1))),
			be: A2($mdgriffith$elm_ui$Element$paddingXY, 0, smallPadding),
			_: xSmallPadding,
			bm: $mdgriffith$elm_ui$Element$spacing(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-2))),
			bn: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-2))),
			eB: $mdgriffith$elm_ui$Element$Font$size(
				$elm$core$Basics$round(
					$author$project$Dimensions$scaled(-3)))
		};
	}
};
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var $mdgriffith$elm_ui$Internal$Model$asEl = 2;
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.z);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dg);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dH);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bN);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.o);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d_);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var $mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 13:
			var name = style.a;
			return name;
		case 12:
			var name = style.a;
			var o = style.b;
			return name;
		case 0:
			var _class = style.a;
			return _class;
		case 1:
			var name = style.a;
			return name;
		case 2:
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 3:
			var _class = style.a;
			return _class;
		case 4:
			var _class = style.a;
			return _class;
		case 5:
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 7:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 6:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 8:
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.dR)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.q)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.d2.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.d2.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.o) + ('-' + ($elm$core$String$fromInt(pos.c_) + ('-' + ($elm$core$String$fromInt(pos.ck) + ('-' + $elm$core$String$fromInt(pos.bE)))))));
		case 11:
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector) {
					case 0:
						return 'fs';
					case 1:
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.bI ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.a1.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.a1.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.aK) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.ba) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.aN))
				])));
};
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$Style,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + (':focus .focusable, ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + '.focusable:focus')),
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					A2(
					$elm$core$Maybe$map,
					function (color) {
						return A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-color',
							$mdgriffith$elm_ui$Internal$Model$formatColor(color));
					},
					focus.cL),
					A2(
					$elm$core$Maybe$map,
					function (color) {
						return A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'background-color',
							$mdgriffith$elm_ui$Internal$Model$formatColor(color));
					},
					focus.cE),
					A2(
					$elm$core$Maybe$map,
					function (shadow) {
						return A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'box-shadow',
							$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
								{
									aK: shadow.aK,
									aN: shadow.aN,
									bI: false,
									a1: A2(
										$elm$core$Tuple$mapSecond,
										$elm$core$Basics$toFloat,
										A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.a1)),
									ba: shadow.ba
								}));
					},
					focus.dZ),
					$elm$core$Maybe$Just(
					A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
				])));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = 3;
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = 2;
var $mdgriffith$elm_ui$Internal$Style$Self = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var $mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var $mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var $mdgriffith$elm_ui$Internal$Style$Top = 0;
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c0);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aq);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.as);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ac);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ar);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.B);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cy);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cr);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bq);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bp);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cs);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ct);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aQ),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cG),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dV),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eb),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.au),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bj),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bi),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = 0;
var $mdgriffith$elm_ui$Internal$Style$Behind = 5;
var $mdgriffith$elm_ui$Internal$Style$Below = 1;
var $mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var $mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var $mdgriffith$elm_ui$Internal$Style$Within = 4;
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _v0 = function () {
		switch (loc) {
			case 0:
				return 0;
			case 1:
				return 0;
			case 2:
				return 0;
			case 3:
				return 0;
			case 4:
				return 0;
			default:
				return 0;
		}
	}();
	return _List_fromArray(
		[0, 1, 2, 3, 4, 5]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d_),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dm))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dQ),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.$7),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.U),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.U),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d_),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.co),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bj),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cH),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dA),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dz),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.$7),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cG),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bl),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bM),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c3),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.an),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ce),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.O),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.dk, $mdgriffith$elm_ui$Internal$Style$classes.ce)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.dk, $mdgriffith$elm_ui$Internal$Style$classes.O)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.c9, $mdgriffith$elm_ui$Internal$Style$classes.ce)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.c9, $mdgriffith$elm_ui$Internal$Style$classes.O)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.aH, $mdgriffith$elm_ui$Internal$Style$classes.ce)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.aH, $mdgriffith$elm_ui$Internal$Style$classes.O)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cd),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dS),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.o),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.z),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d_),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cW),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bi),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.al),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cM),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cO),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eb),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dr),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d_),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.o),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cl),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bG),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ap),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cx,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cv,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cs),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cv,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cs),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cv,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ct),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cv + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cx + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.cv)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d1),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.z),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cm),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bi),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cu,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cw,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ct),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cw,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ct),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.cw,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ct),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cw + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.cu + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.cw)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ap),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d1),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.cB + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.cB))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.cB + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.cB))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dq),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aQ),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cG),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eb),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d_),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.$7),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cG),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.co),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cH),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dA),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dz),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eb),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.o),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.z),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dg),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eo),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ee),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ej),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.el),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ek),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.en),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cK),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ed),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dt),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d7),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d7)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ep),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aD),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ec),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ei),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.cB + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.cB + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$sliderOverrides = '\n\n/* General Input Reset */\ninput[type=range] {\n  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */\n  /* width: 100%;  Specific width is required for Firefox. */\n  background: transparent; /* Otherwise white in Chrome */\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n\n/* Hide all syling for track */\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n\n/* Thumbs */\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.o) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.o) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cB) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ap) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$sliderOverrides + $mdgriffith$elm_ui$Internal$Style$explainer))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {ao: closing, g: _List_Nil, F: _List_Nil, v: selector};
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								F: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.F)
							});
					case 2:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								g: A2(
									$elm$core$List$cons,
									{ao: '\n}', g: _List_Nil, F: props, v: '@supports (' + (prop + (':' + (value + (') {' + parent.v))))},
									rendered.g)
							});
					case 4:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								g: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.v + (' + ' + selector), ''),
										adjRules),
									rendered.g)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								g: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.v + (' > ' + child), ''),
										childRules),
									rendered.g)
							});
					case 3:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								g: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.v, descriptor),
											''),
										descriptorRules),
									rendered.g)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								g: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.v, ''),
										batched),
									rendered.g)
							});
				}
			});
		return A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.F;
		if (!_v2.b) {
			return '';
		} else {
			return rule.v + ('{' + (renderValues(rule.F) + (rule.ao + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.g)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $mdgriffith$elm_ui$Internal$Model$staticRoot = A3(
	$elm$virtual_dom$VirtualDom$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
		]));
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 0:
			return 'serif';
		case 1:
			return 'sans-serif';
		case 2:
			return 'monospace';
		case 3:
			var name = font.a;
			return '\"' + (name + '\"');
		case 4:
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.dy;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return name === 'smcp';
		case 1:
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.cg);
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.eb + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.eb)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.d$, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.da, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.d$ + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.d$))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.d$ + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.eb + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.d$ + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.eb)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {bE: height / size, ba: size, ch: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.cT, adjustment.cF, adjustment.c4, adjustment.dv]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.c4,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.cF,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.cT,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		cT: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		bD: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.bE)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.ch) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.ba) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _v2 = _with.cq;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.bD;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.cT;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return '\"' + (name + '\"');
		case 1:
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.cg)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var renderStyle = F3(
			function (maybePseudo, selector, props) {
				if (maybePseudo.$ === 1) {
					return selector + ('{' + (A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props) + '\n}'));
				} else {
					var pseudo = maybePseudo.a;
					switch (pseudo) {
						case 1:
							var _v17 = options.dk;
							switch (_v17) {
								case 0:
									return '';
								case 2:
									return selector + ('-hv {' + (A3(
										$elm$core$List$foldl,
										$mdgriffith$elm_ui$Internal$Model$renderProps(true),
										'',
										props) + '\n}'));
								default:
									return selector + ('-hv:hover {' + (A3(
										$elm$core$List$foldl,
										$mdgriffith$elm_ui$Internal$Model$renderProps(false),
										'',
										props) + '\n}'));
							}
						case 0:
							var renderedProps = A3(
								$elm$core$List$foldl,
								$mdgriffith$elm_ui$Internal$Model$renderProps(false),
								'',
								props);
							return A2(
								$elm$core$String$join,
								'\n',
								_List_fromArray(
									[selector + ('-fs:focus {' + (renderedProps + '\n}')), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.cB + (':focus ~ ' + (selector + ('-fs:not(.focus)  {' + (renderedProps + '\n}'))))), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.cB + (':focus ' + (selector + ('-fs  {' + (renderedProps + '\n}'))))), '.focusable-parent:focus ~ ' + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + (selector + ('-fs {' + (renderedProps + '\n}'))))))]));
						default:
							return selector + ('-act:active {' + (A3(
								$elm$core$List$foldl,
								$mdgriffith$elm_ui$Internal$Model$renderProps(false),
								'',
								props) + '\n}'));
					}
				}
			});
		var renderStyleRule = F2(
			function (rule, maybePseudo) {
				switch (rule.$) {
					case 0:
						var selector = rule.a;
						var props = rule.b;
						return A3(renderStyle, maybePseudo, selector, props);
					case 13:
						var name = rule.a;
						var prop = rule.b;
						return A3(
							renderStyle,
							maybePseudo,
							'.' + name,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
								]));
					case 12:
						var name = rule.a;
						var transparency = rule.b;
						var opacity = A2(
							$elm$core$Basics$max,
							0,
							A2($elm$core$Basics$min, 1, 1 - transparency));
						return A3(
							renderStyle,
							maybePseudo,
							'.' + name,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'opacity',
									$elm$core$String$fromFloat(opacity))
								]));
					case 2:
						var i = rule.a;
						return A3(
							renderStyle,
							maybePseudo,
							'.font-size-' + $elm$core$String$fromInt(i),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'font-size',
									$elm$core$String$fromInt(i) + 'px')
								]));
					case 1:
						var name = rule.a;
						var typefaces = rule.b;
						var features = A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
						var families = _List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'font-family',
								A2(
									$elm$core$String$join,
									', ',
									A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
								A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'font-variant',
								A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
							]);
						return A2(
							$elm$core$String$join,
							' ',
							_List_fromArray(
								[
									A3(renderStyle, maybePseudo, '.' + name, families)
								]));
					case 3:
						var _class = rule.a;
						var prop = rule.b;
						var val = rule.c;
						return A3(
							renderStyle,
							maybePseudo,
							'.' + _class,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
								]));
					case 4:
						var _class = rule.a;
						var prop = rule.b;
						var color = rule.c;
						return A3(
							renderStyle,
							maybePseudo,
							'.' + _class,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									prop,
									$mdgriffith$elm_ui$Internal$Model$formatColor(color))
								]));
					case 5:
						var cls = rule.a;
						var x = rule.b;
						var y = rule.c;
						var yPx = $elm$core$String$fromInt(y) + 'px';
						var xPx = $elm$core$String$fromInt(x) + 'px';
						var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.d_;
						var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.o;
						var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.bl + row);
						var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bq;
						var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bN;
						var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.dH;
						var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.bp;
						var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
						var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
						var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.z;
						var _class = '.' + cls;
						var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.cB;
						return $elm$core$String$concat(
							_List_fromArray(
								[
									A3(
									renderStyle,
									maybePseudo,
									_class + (row + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (wrappedRow + (' > ' + any)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (column + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + left)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + right)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_Utils_ap(_class, paragraph),
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'line-height',
											'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
										])),
									A3(
									renderStyle,
									maybePseudo,
									'textarea' + _class,
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'line-height',
											'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + (' > ' + left)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + (' > ' + right)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + '::after'),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'margin-top',
											$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + '::before'),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'margin-bottom',
											$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
										]))
								]));
					case 7:
						var cls = rule.a;
						var top = rule.b;
						var right = rule.c;
						var bottom = rule.d;
						var left = rule.e;
						var _class = '.' + cls;
						return A3(
							renderStyle,
							maybePseudo,
							_class,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'padding',
									$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
								]));
					case 6:
						var cls = rule.a;
						var top = rule.b;
						var right = rule.c;
						var bottom = rule.d;
						var left = rule.e;
						var _class = '.' + cls;
						return A3(
							renderStyle,
							maybePseudo,
							_class,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'border-width',
									$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
								]));
					case 8:
						var template = rule.a;
						var toGridLengthHelper = F3(
							function (minimum, maximum, x) {
								toGridLengthHelper:
								while (true) {
									switch (x.$) {
										case 0:
											var px = x.a;
											return $elm$core$String$fromInt(px) + 'px';
										case 1:
											var _v2 = _Utils_Tuple2(minimum, maximum);
											if (_v2.a.$ === 1) {
												if (_v2.b.$ === 1) {
													var _v3 = _v2.a;
													var _v4 = _v2.b;
													return 'max-content';
												} else {
													var _v6 = _v2.a;
													var maxSize = _v2.b.a;
													return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
												}
											} else {
												if (_v2.b.$ === 1) {
													var minSize = _v2.a.a;
													var _v5 = _v2.b;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
												} else {
													var minSize = _v2.a.a;
													var maxSize = _v2.b.a;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
												}
											}
										case 2:
											var i = x.a;
											var _v7 = _Utils_Tuple2(minimum, maximum);
											if (_v7.a.$ === 1) {
												if (_v7.b.$ === 1) {
													var _v8 = _v7.a;
													var _v9 = _v7.b;
													return $elm$core$String$fromInt(i) + 'fr';
												} else {
													var _v11 = _v7.a;
													var maxSize = _v7.b.a;
													return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
												}
											} else {
												if (_v7.b.$ === 1) {
													var minSize = _v7.a.a;
													var _v10 = _v7.b;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
												} else {
													var minSize = _v7.a.a;
													var maxSize = _v7.b.a;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
												}
											}
										case 3:
											var m = x.a;
											var len = x.b;
											var $temp$minimum = $elm$core$Maybe$Just(m),
												$temp$maximum = maximum,
												$temp$x = len;
											minimum = $temp$minimum;
											maximum = $temp$maximum;
											x = $temp$x;
											continue toGridLengthHelper;
										default:
											var m = x.a;
											var len = x.b;
											var $temp$minimum = minimum,
												$temp$maximum = $elm$core$Maybe$Just(m),
												$temp$x = len;
											minimum = $temp$minimum;
											maximum = $temp$maximum;
											x = $temp$x;
											continue toGridLengthHelper;
									}
								}
							});
						var toGridLength = function (x) {
							return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
						};
						var xSpacing = toGridLength(template.d2.a);
						var ySpacing = toGridLength(template.d2.b);
						var rows = function (x) {
							return 'grid-template-rows: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								' ',
								A2($elm$core$List$map, toGridLength, template.dR)));
						var msRows = function (x) {
							return '-ms-grid-rows: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								ySpacing,
								A2($elm$core$List$map, toGridLength, template.q)));
						var msColumns = function (x) {
							return '-ms-grid-columns: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								ySpacing,
								A2($elm$core$List$map, toGridLength, template.q)));
						var gapY = 'grid-row-gap:' + (toGridLength(template.d2.b) + ';');
						var gapX = 'grid-column-gap:' + (toGridLength(template.d2.a) + ';');
						var columns = function (x) {
							return 'grid-template-columns: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								' ',
								A2($elm$core$List$map, toGridLength, template.q)));
						var _class = '.grid-rows-' + (A2(
							$elm$core$String$join,
							'-',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.dR)) + ('-cols-' + (A2(
							$elm$core$String$join,
							'-',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.q)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.d2.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.d2.b)))))));
						var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
						var supports = '@supports (display:grid) {' + (modernGrid + '}');
						var base = _class + ('{' + (msColumns + (msRows + '}')));
						return _Utils_ap(base, supports);
					case 9:
						var position = rule.a;
						var msPosition = A2(
							$elm$core$String$join,
							' ',
							_List_fromArray(
								[
									'-ms-grid-row: ' + ($elm$core$String$fromInt(position.o) + ';'),
									'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.bE) + ';'),
									'-ms-grid-column: ' + ($elm$core$String$fromInt(position.c_) + ';'),
									'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.ck) + ';')
								]));
						var modernPosition = A2(
							$elm$core$String$join,
							' ',
							_List_fromArray(
								[
									'grid-row: ' + ($elm$core$String$fromInt(position.o) + (' / ' + ($elm$core$String$fromInt(position.o + position.bE) + ';'))),
									'grid-column: ' + ($elm$core$String$fromInt(position.c_) + (' / ' + ($elm$core$String$fromInt(position.c_ + position.ck) + ';')))
								]));
						var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.o) + ('-' + ($elm$core$String$fromInt(position.c_) + ('-' + ($elm$core$String$fromInt(position.ck) + ('-' + $elm$core$String$fromInt(position.bE)))))));
						var modernGrid = _class + ('{' + (modernPosition + '}'));
						var supports = '@supports (display:grid) {' + (modernGrid + '}');
						var base = _class + ('{' + (msPosition + '}'));
						return _Utils_ap(base, supports);
					case 11:
						var _class = rule.a;
						var styles = rule.b;
						var renderPseudoRule = function (style) {
							return A2(
								renderStyleRule,
								style,
								$elm$core$Maybe$Just(_class));
						};
						return A2(
							$elm$core$String$join,
							' ',
							A2($elm$core$List$map, renderPseudoRule, styles));
					default:
						var transform = rule.a;
						var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
						var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
						var _v12 = _Utils_Tuple2(_class, val);
						if ((!_v12.a.$) && (!_v12.b.$)) {
							var cls = _v12.a.a;
							var v = _v12.b.a;
							return A3(
								renderStyle,
								maybePseudo,
								'.' + cls,
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
									]));
						} else {
							return '';
						}
				}
			});
		var combine = F2(
			function (style, rendered) {
				return {
					aC: _Utils_ap(
						rendered.aC,
						A2(renderStyleRule, style, $elm$core$Maybe$Nothing)),
					ai: function () {
						var _v14 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v14.$ === 1) {
							return rendered.ai;
						} else {
							var topLevel = _v14.a;
							return A2($elm$core$List$cons, topLevel, rendered.ai);
						}
					}()
				};
			});
		var _v13 = A3(
			$elm$core$List$foldl,
			combine,
			{aC: '', ai: _List_Nil},
			stylesheet);
		var topLevel = _v13.ai;
		var rules = _v13.aC;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			rules);
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			'style',
			_List_Nil,
			_List_fromArray(
				[
					$elm$virtual_dom$VirtualDom$text(
					A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2('static-stylesheet', $mdgriffith$elm_ui$Internal$Model$staticRoot),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'dynamic-stylesheet',
					A2(
						$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
						opts,
						A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$reduceStyles,
							_Utils_Tuple2(
								$elm$core$Set$empty,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.c9)
									])),
							styles).b)),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'dynamic-stylesheet',
				A2(
					$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
					opts,
					A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$reduceStyles,
						_Utils_Tuple2(
							$elm$core$Set$empty,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.c9)
								])),
						styles).b)),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot,
			A2(
				$elm$core$List$cons,
				A2(
					$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
					opts,
					A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$reduceStyles,
						_Utils_Tuple2(
							$elm$core$Set$empty,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.c9)
								])),
						styles).b),
				children)) : A2(
			$elm$core$List$cons,
			A2(
				$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
				opts,
				A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$reduceStyles,
					_Utils_Tuple2(
						$elm$core$Set$empty,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.c9)
							])),
					styles).b),
			children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$core$Basics$not = _Basics_not;
var $elm$html$Html$p = _VirtualDom_node('p');
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return unkeyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 0:
					return A2(createNode, 'div', attributes);
				case 1:
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.cB + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d_))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.ap, $mdgriffith$elm_ui$Internal$Style$classes.B, $mdgriffith$elm_ui$Internal$Style$classes.cx])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.ap, $mdgriffith$elm_ui$Internal$Style$classes.B, $mdgriffith$elm_ui$Internal$Style$classes.cv])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.ap, $mdgriffith$elm_ui$Internal$Style$classes.cw])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.ap, $mdgriffith$elm_ui$Internal$Style$classes.cu])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[$mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.eb, $mdgriffith$elm_ui$Internal$Style$classes.bi, $mdgriffith$elm_ui$Internal$Style$classes.au])))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'div',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[$mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.eb, $mdgriffith$elm_ui$Internal$Style$classes.bj, $mdgriffith$elm_ui$Internal$Style$classes.aS])))
			]),
		_List_fromArray(
			[
				$elm$virtual_dom$VirtualDom$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.dl, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.d8 : _Utils_ap(styled.d8, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.dl, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.d8 : _Utils_ap(styled.d8, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.dl, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.d8 : _Utils_ap(styled.d8, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.dl, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.d8 : _Utils_ap(styled.d8, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.d8 : _Utils_ap(rendered.d8, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.L,
						rendered.N,
						rendered.H,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.I)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						dl: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.L,
							rendered.N,
							rendered.H,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.I))),
						d8: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.d8 : _Utils_ap(rendered.d8, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.L,
						rendered.N,
						rendered.H,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.I)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						dl: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.L,
							rendered.N,
							rendered.H,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.I))),
						d8: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.U, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.co]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.U, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.cH]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.U, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.dA]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.U, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.dz]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.U, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.$7]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.U, $mdgriffith$elm_ui$Internal$Style$classes.d_, $mdgriffith$elm_ui$Internal$Style$classes.cG]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return $elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.dl, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.aI + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bp);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.aI + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bq);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.aI + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cs);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.aJ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cy);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.aJ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cr);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.aJ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ct);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 1:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				name,
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.au,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.aS,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bG + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.cB + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.o + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.cl + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bi,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.bj,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.cm + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.cB + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.o + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 3) {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 2:
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 7:
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 1) {
					return {
						H: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						I: children,
						L: has,
						N: node,
						d8: styles
					};
				} else {
					var _class = _v1.a;
					return {
						H: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						I: children,
						L: has,
						N: node,
						d8: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 0:
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 3:
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 1:
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 4:
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 10:
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 7:
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 0:
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.cl + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bi),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bj),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.cm + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.cB + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.o + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$merge, addToFlags, has),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 8:
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 0:
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = name + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.au + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.aS + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bG + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.cB + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.z + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$merge, addToFlags, has),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 2:
						var description = attribute.a;
						switch (description.$) {
							case 0:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 1:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 2:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 3:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 4:
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 9:
								var newNode = function () {
									switch (node.$) {
										case 0:
											return $mdgriffith$elm_ui$Internal$Model$NodeName('p');
										case 1:
											var name = node.a;
											return $mdgriffith$elm_ui$Internal$Model$NodeName(name);
										default:
											var x = node.a;
											var y = node.b;
											return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
									}
								}();
								var $temp$classes = classes,
									$temp$node = newNode,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 8:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 5:
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 6:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 9:
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 3:
									return styles;
								case 2:
									var str = elem.a;
									return styles;
								case 0:
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.d8);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 6:
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $author$project$Breadcrumb$baseDot = F2(
	function (size, attrs) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(size)),
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px(size)),
						$mdgriffith$elm_ui$Element$centerY,
						$mdgriffith$elm_ui$Element$Border$rounded(8)
					]),
				attrs),
			$mdgriffith$elm_ui$Element$none);
	});
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Model$InFront = 4;
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 4, element);
};
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Element$fromRgb = function (clr) {
	return A4($mdgriffith$elm_ui$Internal$Model$Rgba, clr.dN, clr.df, clr.cI, clr.cz);
};
var $mdgriffith$elm_ui$Element$toRgb = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {cz: a, cI: b, df: g, dN: r};
};
var $author$project$Graphics$Palette$fade = F2(
	function (alpha, color) {
		var rgbColor = $mdgriffith$elm_ui$Element$toRgb(color);
		return $mdgriffith$elm_ui$Element$fromRgb(
			_Utils_update(
				rgbColor,
				{cz: alpha}));
	});
var $mdgriffith$elm_ui$Element$rgb255 = F3(
	function (red, green, blue) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, 1);
	});
var $mdgriffith$elm_ui$Element$rgba255 = F4(
	function (red, green, blue, a) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, a);
	});
var $author$project$Graphics$Palette$palette = function () {
	var white = A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255);
	var textColor = A3($mdgriffith$elm_ui$Element$rgb255, 42, 67, 80);
	var ternary = A3($mdgriffith$elm_ui$Element$rgb255, 248, 160, 116);
	var secondary = A3($mdgriffith$elm_ui$Element$rgb255, 69, 162, 134);
	var quaternary = A3($mdgriffith$elm_ui$Element$rgb255, 189, 199, 79);
	return {
		br: A3($mdgriffith$elm_ui$Element$rgb255, 0, 0, 0),
		bV: A3($mdgriffith$elm_ui$Element$rgb255, 220, 94, 93),
		bW: A4($mdgriffith$elm_ui$Element$rgba255, 220, 94, 93, 0.1),
		dM: quaternary,
		b_: A2($author$project$Graphics$Palette$fade, 0.2, quaternary),
		dY: secondary,
		b2: A2($author$project$Graphics$Palette$fade, 0.7, secondary),
		ea: ternary,
		b8: A2($author$project$Graphics$Palette$fade, 0.2, ternary),
		eb: textColor,
		ef: A2($author$project$Graphics$Palette$fade, 0.17, textColor),
		b9: white,
		ce: A4($mdgriffith$elm_ui$Element$rgba255, 255, 255, 255, 0),
		cf: function (t) {
			return A2($author$project$Graphics$Palette$fade, t, white);
		},
		cj: white
	};
}();
var $author$project$Styles$transition = function (props) {
	return $mdgriffith$elm_ui$Element$htmlAttribute(
		A2(
			$elm$html$Html$Attributes$style,
			'transition',
			A2(
				$author$project$Basics$Extra$apply,
				' .2s ease',
				$elm$core$Basics$append(
					A2($elm$core$String$join, ' .2s ease,', props)))));
};
var $author$project$Breadcrumb$dot = F2(
	function (size, active) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(size)),
					$mdgriffith$elm_ui$Element$inFront(
					A2(
						$author$project$Breadcrumb$baseDot,
						size,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.bV),
								active ? A2($author$project$Styles$delayedTransition, 0.2, 'transform') : $author$project$Styles$transition(
								_List_fromArray(
									['transform'])),
								$mdgriffith$elm_ui$Element$htmlAttribute(
								$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('active-dot', active),
											_Utils_Tuple2('inactive-dot', !active)
										])))
							])))
				]),
			A2(
				$author$project$Breadcrumb$baseDot,
				size - 2,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.bW)
					])));
	});
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $author$project$List$Extra$flatten = A2(
	$elm$core$List$foldl,
	F2(
		function (l, flat) {
			return _Utils_ap(flat, l);
		}),
	_List_Nil);
var $author$project$Connection$Connected$connected = F2(
	function (t, userInfo) {
		return A2($author$project$Connection$Connected$ConnectedProvider, t, userInfo);
	});
var $author$project$Connection$Connected$any = A2($author$project$Connection$Connected$connected, 1, $krisajenkins$remotedata$RemoteData$NotAsked);
var $author$project$Playlist$Dict$anyKey = A2($author$project$Playlist$Dict$PlaylistKey, $author$project$Connection$Connected$any, '');
var $author$project$Page$is = F2(
	function (_v0, path) {
		var page = _v0;
		var _v1 = _Utils_Tuple2(path, page);
		_v1$8:
		while (true) {
			switch (_v1.a.$) {
				case 0:
					if (!_v1.b.$) {
						var _v2 = _v1.a;
						var _v3 = _v1.b;
						return true;
					} else {
						break _v1$8;
					}
				case 1:
					if (_v1.b.$ === 1) {
						var _v4 = _v1.a;
						var _v5 = _v1.b;
						return true;
					} else {
						break _v1$8;
					}
				case 2:
					if (_v1.b.$ === 2) {
						var _v6 = _v1.a;
						var _v7 = _v1.b;
						return true;
					} else {
						break _v1$8;
					}
				case 3:
					if (_v1.b.$ === 3) {
						return true;
					} else {
						break _v1$8;
					}
				case 4:
					if (_v1.b.$ === 4) {
						return true;
					} else {
						break _v1$8;
					}
				case 5:
					if (_v1.b.$ === 5) {
						var _v8 = _v1.a;
						var _v9 = _v1.b;
						return true;
					} else {
						break _v1$8;
					}
				case 6:
					if (_v1.b.$ === 6) {
						var _v10 = _v1.a;
						var _v11 = _v1.b;
						return true;
					} else {
						break _v1$8;
					}
				default:
					if (_v1.b.$ === 7) {
						return true;
					} else {
						break _v1$8;
					}
			}
		}
		return false;
	});
var $author$project$Page$oneOf = function (page) {
	return A2(
		$elm$core$List$foldl,
		F2(
			function (path, matched) {
				return matched || A2($author$project$Page$is, page, path);
			}),
		false);
};
var $author$project$Breadcrumb$indexFromPage = function (page) {
	return A2(
		$author$project$Page$oneOf,
		page,
		_List_fromArray(
			[$author$project$Page$Request$ServiceConnection, $author$project$Page$Request$PlaylistsSpinner])) ? 0 : (A2(
		$author$project$Page$oneOf,
		page,
		_List_fromArray(
			[
				$author$project$Page$Request$PlaylistPicker,
				$author$project$Page$Request$PlaylistDetails($author$project$Playlist$Dict$anyKey)
			])) ? 1 : (A2(
		$author$project$Page$oneOf,
		page,
		_List_fromArray(
			[
				$author$project$Page$Request$DestinationPicker($author$project$Playlist$Dict$anyKey),
				A2($author$project$Page$Request$DestinationPicked, $author$project$Playlist$Dict$anyKey, $author$project$Connection$Connected$any)
			])) ? 2 : (A2(
		$author$project$Page$is,
		page,
		A2($author$project$Page$Request$TransferSpinner, $author$project$Playlist$Dict$anyKey, $author$project$Connection$Connected$any)) ? 3 : 4)));
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $mdgriffith$elm_ui$Internal$Model$AsRow = 0;
var $mdgriffith$elm_ui$Internal$Model$asRow = 0;
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ac + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.B)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $author$project$Breadcrumb$baseSegment = F2(
	function (size, attrs) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px(size)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$centerY
					]),
				attrs),
			$mdgriffith$elm_ui$Element$none);
	});
var $author$project$Breadcrumb$segment = F2(
	function (size, active) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$inFront(
					A2(
						$author$project$Breadcrumb$baseSegment,
						size,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerY,
								$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.bV),
								$mdgriffith$elm_ui$Element$Border$rounded(2),
								$author$project$Styles$transition(
								_List_fromArray(
									['transform'])),
								$mdgriffith$elm_ui$Element$htmlAttribute(
								$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('active-segment', active),
											_Utils_Tuple2('inactive-segment', !active)
										])))
							])))
				]),
			A2(
				$author$project$Breadcrumb$baseSegment,
				size - 1,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.bW)
					])));
	});
var $mdgriffith$elm_ui$Element$spaceEvenly = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$spacing, $mdgriffith$elm_ui$Internal$Style$classes.d1);
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $author$project$Breadcrumb$breadcrumb = F2(
	function (attrs, model) {
		var index = $author$project$Breadcrumb$indexFromPage(model.dH);
		var d = $author$project$Dimensions$dimensions(model);
		var _v0 = function () {
			var _v1 = _Utils_Tuple2(model.by.cV, model.by.dF);
			if ((!_v1.a) && (!_v1.b)) {
				var _v2 = _v1.a;
				var _v3 = _v1.b;
				return {aO: 10, aP: d.eB, aT: 75, a3: 30, a7: 4};
			} else {
				return {aO: 15, aP: d.d0, aT: 170, a3: 78, a7: 5};
			}
		}();
		var labelWidth = _v0.aT;
		var paddingX = _v0.a3;
		var fontSize = _v0.aP;
		var dotSize = _v0.aO;
		var segSize = _v0.a7;
		var bigSpot = A2($author$project$Breadcrumb$dot, dotSize, true);
		var fadedSpot = A2($author$project$Breadcrumb$dot, dotSize, false);
		var items = A2(
			$elm$core$List$cons,
			_List_fromArray(
				[bigSpot]),
			_Utils_ap(
				A2(
					$elm$core$List$repeat,
					index,
					_List_fromArray(
						[
							A2($author$project$Breadcrumb$segment, segSize, true),
							bigSpot
						])),
				A2(
					$elm$core$List$repeat,
					3 - index,
					_List_fromArray(
						[
							A2($author$project$Breadcrumb$segment, segSize, false),
							fadedSpot
						]))));
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spaceEvenly,
						$mdgriffith$elm_ui$Element$htmlAttribute(
						A2($elm$html$Html$Attributes$style, 'z-index', '0')),
						$mdgriffith$elm_ui$Element$above(
						A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, paddingX, 10),
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							$author$project$List$Extra$flatten(items)))
					]),
				attrs),
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, s) {
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(labelWidth)),
									$mdgriffith$elm_ui$Element$Font$center,
									_Utils_eq(i, index) ? A2($author$project$Styles$delayedTransition, 0.2, 'color') : $author$project$Styles$transition(
									_List_fromArray(
										['color'])),
									(_Utils_cmp(i, index) > 0) ? $mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.ef) : $mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.eb),
									fontSize
								]),
							$mdgriffith$elm_ui$Element$text(s));
					}),
				_List_fromArray(
					['Connect', 'Pick playlist', 'Pick destination', 'Transfer'])));
	});
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX(1);
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.cW);
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.c0 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ac)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 0:
						return 'serif';
					case 1:
						return 'sans-serif';
					case 2:
						return 'monospace';
					case 3:
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.dy;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Element$Font$family = function (families) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontFamily,
		A2(
			$mdgriffith$elm_ui$Internal$Model$FontFamily,
			A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'ff-', families),
			families));
};
var $mdgriffith$elm_ui$Internal$Model$FocusStyleOption = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Element$focusStyle = $mdgriffith$elm_ui$Internal$Model$FocusStyleOption;
var $author$project$Main$hack_forceClip = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$htmlAttribute(
		A2($elm$html$Html$Attributes$style, 'flex-shrink', '1')),
		$mdgriffith$elm_ui$Element$htmlAttribute(
		$elm$html$Html$Attributes$class('hack_forceClip'))
	]);
var $mdgriffith$elm_ui$Internal$Model$Left = 0;
var $mdgriffith$elm_ui$Element$alignLeft = $mdgriffith$elm_ui$Internal$Model$AlignX(0);
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$animateTransform = $elm$svg$Svg$trustedNode('animateTransform');
var $elm$svg$Svg$Attributes$attributeName = _VirtualDom_attribute('attributeName');
var $elm$svg$Svg$Attributes$begin = _VirtualDom_attribute('begin');
var $elm$svg$Svg$Attributes$calcMode = _VirtualDom_attribute('calcMode');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$dur = _VirtualDom_attribute('dur');
var $elm$svg$Svg$Attributes$end = _VirtualDom_attribute('end');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Element$html = $mdgriffith$elm_ui$Internal$Model$unstyled;
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$Attributes$keySplines = _VirtualDom_attribute('keySplines');
var $elm$svg$Svg$Attributes$keyTimes = _VirtualDom_attribute('keyTimes');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$to = function (value) {
	return A2(
		_VirtualDom_attribute,
		'to',
		_VirtualDom_noJavaScriptUri(value));
};
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $author$project$Element$Extra$hexFromFloat = A2(
	$elm$core$Basics$composeR,
	$elm$core$Basics$mul(255),
	A2($elm$core$Basics$composeR, $elm$core$Basics$round, $rtfeldman$elm_hex$Hex$toString));
var $author$project$Element$Extra$hexFromRGBA = function (_v0) {
	var red = _v0.dN;
	var green = _v0.df;
	var blue = _v0.cI;
	var alpha = _v0.cz;
	return '#' + ($author$project$Element$Extra$hexFromFloat(red) + ($author$project$Element$Extra$hexFromFloat(green) + ($author$project$Element$Extra$hexFromFloat(blue) + $author$project$Element$Extra$hexFromFloat(alpha))));
};
var $author$project$Element$Extra$toHex = A2($elm$core$Basics$composeR, $mdgriffith$elm_ui$Element$toRgb, $author$project$Element$Extra$hexFromRGBA);
var $elm$svg$Svg$Attributes$type_ = _VirtualDom_attribute('type');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Graphics$Logo$view = $mdgriffith$elm_ui$Element$html(
	A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox('0 0 119 45'),
				$elm$svg$Svg$Attributes$id('logo'),
				$elm$svg$Svg$Attributes$fill('white')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id('Text')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id('M'),
										$elm$svg$Svg$Attributes$fill(
										$author$project$Element$Extra$toHex($author$project$Graphics$Palette$palette.bV)),
										$elm$svg$Svg$Attributes$d('M1.62,7.78H7.25L12.82,16l5.54-8.19H24V29.12H17.17V21.44l-4.35,6.4-4.38-6.4v7.68H1.62Z')
									]),
								_List_Nil)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id('U'),
										$elm$svg$Svg$Attributes$fill(
										$author$project$Element$Extra$toHex($author$project$Graphics$Palette$palette.ea)),
										$elm$svg$Svg$Attributes$d('M35,29.67a12.17,12.17,0,0,1-3.65-.51,7.51,7.51,0,0,1-2.78-1.54A6.73,6.73,0,0,1,26.75,25a9.92,9.92,0,0,1-.62-3.68V7.78h6.82V21.06a2.72,2.72,0,0,0,.46,1.71,1.85,1.85,0,0,0,1.55.59,1.86,1.86,0,0,0,1.55-.59A2.73,2.73,0,0,0,37,21.06V7.78h6.85V21.35A9.92,9.92,0,0,1,43.2,25a6.65,6.65,0,0,1-1.79,2.59,7.67,7.67,0,0,1-2.8,1.54A12.17,12.17,0,0,1,35,29.67Z')
									]),
								_List_Nil)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id('S'),
										$elm$svg$Svg$Attributes$fill(
										$author$project$Element$Extra$toHex($author$project$Graphics$Palette$palette.dM)),
										$elm$svg$Svg$Attributes$d('M45.39,22.5a10.52,10.52,0,0,0,1.47.35,11.6,11.6,0,0,0,1.46.26,14.09,14.09,0,0,0,1.65.1q1.47,0,1.47-1.09a1.22,1.22,0,0,0-.45-.85,13.53,13.53,0,0,0-1.14-1q-.69-.53-1.47-1.17a10.62,10.62,0,0,1-1.47-1.47,7.67,7.67,0,0,1-1.14-1.87,6,6,0,0,1-.45-2.38,6.15,6.15,0,0,1,.54-2.66,5.35,5.35,0,0,1,1.5-1.92,6.77,6.77,0,0,1,2.26-1.17,9.33,9.33,0,0,1,2.77-.4,14.84,14.84,0,0,1,1.54.08l1.38.14,1.38.19v6l-.58-.06-.58-.06c-.21,0-.44,0-.67,0l-.48,0a3,3,0,0,0-.54.08,1.11,1.11,0,0,0-.45.22.55.55,0,0,0-.19.45q0,.26.43.64t1.06.9q.62.51,1.38,1.18a9.54,9.54,0,0,1,1.38,1.54,9,9,0,0,1,1.06,2,6.56,6.56,0,0,1,.43,2.43,7.66,7.66,0,0,1-.45,2.64,5.62,5.62,0,0,1-1.39,2.14,6.66,6.66,0,0,1-2.42,1.44,10.35,10.35,0,0,1-3.49.53,21.25,21.25,0,0,1-2.26-.11q-1-.11-1.84-.27a15.49,15.49,0,0,1-1.7-.38Z')
									]),
								_List_Nil)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id('N'),
										$elm$svg$Svg$Attributes$fill(
										$author$project$Element$Extra$toHex($author$project$Graphics$Palette$palette.dY)),
										$elm$svg$Svg$Attributes$d('M79.57,7.78h5.6L91.06,16V7.78h6.69V29.12H92.11l-5.86-8.19v8.19H79.57Z')
									]),
								_List_Nil)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id('C'),
										$elm$svg$Svg$Attributes$fill(
										$author$project$Element$Extra$toHex($author$project$Graphics$Palette$palette.eb)),
										$elm$svg$Svg$Attributes$d('M99.5,18.47a11.49,11.49,0,0,1,.9-4.62,10.78,10.78,0,0,1,2.43-3.54,10.61,10.61,0,0,1,3.58-2.26,12.06,12.06,0,0,1,4.35-.78,13.61,13.61,0,0,1,3.25.35,15.42,15.42,0,0,1,2.45.8,11.55,11.55,0,0,1,2,1.12l-3.36,5.92a11.43,11.43,0,0,0-1.12-.74,10.88,10.88,0,0,0-1.3-.5A5.62,5.62,0,0,0,111,14a4.64,4.64,0,0,0-1.82.35,4.7,4.7,0,0,0-1.46,1,4.4,4.4,0,0,0-1,1.42,4.34,4.34,0,0,0-.35,1.74,4.19,4.19,0,0,0,.37,1.74,4.49,4.49,0,0,0,1,1.42,4.79,4.79,0,0,0,1.5,1,5,5,0,0,0,1.89.35,6,6,0,0,0,1.82-.26,6.69,6.69,0,0,0,1.34-.58,5,5,0,0,0,1.12-.83l3.36,5.92a9.53,9.53,0,0,1-2,1.25,17.41,17.41,0,0,1-2.46.83,12.84,12.84,0,0,1-3.3.38,12.68,12.68,0,0,1-4.61-.82,10.85,10.85,0,0,1-3.65-2.29,10.38,10.38,0,0,1-2.4-3.54A11.69,11.69,0,0,1,99.5,18.47Z')
									]),
								_List_Nil)
							]))
					])),
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id('Note')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('Croche'),
								$elm$svg$Svg$Attributes$fill(
								$author$project$Element$Extra$toHex($author$project$Graphics$Palette$palette.eb)),
								$elm$svg$Svg$Attributes$d('M69.61,1.21,60,35.7c-.61-1.73-4.68-3.1-8-2.31-4,.94-6.51,4-5.7,7s4.66,4.5,8.62,3.56a8.07,8.07,0,0,0,5.17-3.53,7.26,7.26,0,0,0,.66-2.11L67.53,13.9c14,8,3.37,19.29.72,23.58C85.31,24,68.28,11.87,71,1.58Z')
							]),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$animateTransform,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$type_('scale'),
										$elm$svg$Svg$Attributes$to('1 1'),
										$elm$svg$Svg$Attributes$calcMode('spline'),
										$elm$svg$Svg$Attributes$keySplines('0.1 0.8 0.51 0.95'),
										$elm$svg$Svg$Attributes$keyTimes('0;0.2'),
										$elm$svg$Svg$Attributes$begin('logo.mouseenter'),
										$elm$svg$Svg$Attributes$end('logo.mouseleave'),
										$elm$svg$Svg$Attributes$dur('0.2s'),
										$elm$svg$Svg$Attributes$attributeName('transform'),
										$elm$svg$Svg$Attributes$fill('freeze')
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$animateTransform,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$type_('scale'),
										$elm$svg$Svg$Attributes$to('0.5 0.5'),
										$elm$svg$Svg$Attributes$calcMode('spline'),
										$elm$svg$Svg$Attributes$keySplines('0.1 0.8 0.51 0.95'),
										$elm$svg$Svg$Attributes$keyTimes('0;0.2'),
										$elm$svg$Svg$Attributes$begin('logo.mouseleave+0.2s'),
										$elm$svg$Svg$Attributes$dur('0.2s'),
										$elm$svg$Svg$Attributes$attributeName('transform'),
										$elm$svg$Svg$Attributes$fill('freeze')
									]),
								_List_Nil)
							])),
						A2(
						$elm$svg$Svg$animateTransform,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('note_in'),
								$elm$svg$Svg$Attributes$type_('translate'),
								$elm$svg$Svg$Attributes$to('0 0'),
								$elm$svg$Svg$Attributes$calcMode('spline'),
								$elm$svg$Svg$Attributes$keySplines('0.1 0.8 0.51 0.95'),
								$elm$svg$Svg$Attributes$keyTimes('0;0.2'),
								$elm$svg$Svg$Attributes$begin('logo.mouseenter'),
								$elm$svg$Svg$Attributes$dur('0.2s'),
								$elm$svg$Svg$Attributes$attributeName('transform'),
								$elm$svg$Svg$Attributes$fill('freeze')
							]),
						_List_Nil),
						A2(
						$elm$svg$Svg$animateTransform,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('note_out'),
								$elm$svg$Svg$Attributes$type_('translate'),
								$elm$svg$Svg$Attributes$to('-15 10'),
								$elm$svg$Svg$Attributes$calcMode('spline'),
								$elm$svg$Svg$Attributes$keySplines('0.1 0.8 0.51 0.95'),
								$elm$svg$Svg$Attributes$keyTimes('0;0.2'),
								$elm$svg$Svg$Attributes$begin('logo.mouseleave+0.2s'),
								$elm$svg$Svg$Attributes$dur('0.2s'),
								$elm$svg$Svg$Attributes$attributeName('transform'),
								$elm$svg$Svg$Attributes$fill('freeze')
							]),
						_List_Nil)
					]))
			])));
var $author$project$Main$header = function (_v0) {
	var device = _v0.by;
	var style = function () {
		var _v1 = _Utils_Tuple2(device.cV, device.dF);
		_v1$2:
		while (true) {
			if (!_v1.b) {
				switch (_v1.a) {
					case 0:
						var _v2 = _v1.a;
						var _v3 = _v1.b;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(80))
							]);
					case 1:
						var _v4 = _v1.a;
						var _v5 = _v1.b;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(100))
							]);
					default:
						break _v1$2;
				}
			} else {
				break _v1$2;
			}
		}
		return _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$alignLeft,
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$px(150))
			]);
	}();
	return A2($mdgriffith$elm_ui$Element$el, style, $author$project$Graphics$Logo$view);
};
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var $mdgriffith$elm_ui$Internal$Model$Layout = 1;
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	cE: $elm$core$Maybe$Nothing,
	cL: $elm$core$Maybe$Nothing,
	dZ: $elm$core$Maybe$Just(
		{
			aK: 3,
			aN: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			a1: _Utils_Tuple2(0, 0),
			ba: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.dk;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								dk: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.c9;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								c9: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.dx;
					if (_v6.$ === 1) {
						return _Utils_update(
							record,
							{
								dx: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			c9: function () {
				var _v0 = record.c9;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			dk: function () {
				var _v1 = record.dk;
				if (_v1.$ === 1) {
					return 1;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			dx: function () {
				var _v2 = record.dx;
				if (_v2.$ === 1) {
					return 1;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{c9: $elm$core$Maybe$Nothing, dk: $elm$core$Maybe$Nothing, dx: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.d8;
				var html = el.a.dl;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.dx;
			if (_v0 === 2) {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-color-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'font-color-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.dE;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.dQ, $mdgriffith$elm_ui$Internal$Style$classes.cB, $mdgriffith$elm_ui$Internal$Style$classes.d_]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Main = {$: 0};
var $mdgriffith$elm_ui$Element$Region$mainContent = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Main);
var $mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var $mdgriffith$elm_ui$Internal$Model$Navigation = {$: 1};
var $mdgriffith$elm_ui$Element$Region$navigation = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Navigation);
var $author$project$Main$ToggleConnect = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 8};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 4) && (attr.b.$ === 11)) && (!attr.b.a)) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $mdgriffith$elm_ui$Element$Input$onKey = F2(
	function (desiredCode, msg) {
		var decode = function (code) {
			return _Utils_eq(code, desiredCode) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Not the enter key');
		};
		var isKey = A2(
			$elm$json$Json$Decode$andThen,
			decode,
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
		return $mdgriffith$elm_ui$Internal$Model$Attr(
			A2(
				$elm$html$Html$Events$preventDefaultOn,
				'keyup',
				A2(
					$elm$json$Json$Decode$map,
					function (fired) {
						return _Utils_Tuple2(fired, true);
					},
					isKey)));
	});
var $mdgriffith$elm_ui$Element$Input$onEnter = function (msg) {
	return A2($mdgriffith$elm_ui$Element$Input$onKey, $mdgriffith$elm_ui$Element$Input$enter, msg);
};
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.c2);
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.u;
		var label = _v0.s;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ar + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.B + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dV + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bM)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 1) {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onEnter(msg),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Internal$Flag$borderStyle = $mdgriffith$elm_ui$Internal$Flag$flag(11);
var $mdgriffith$elm_ui$Element$Border$dotted = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$borderStyle, $mdgriffith$elm_ui$Internal$Style$classes.cN);
var $mdgriffith$elm_ui$Internal$Model$Bottom = 2;
var $mdgriffith$elm_ui$Element$alignBottom = $mdgriffith$elm_ui$Internal$Model$AlignY(2);
var $mdgriffith$elm_ui$Internal$Model$Min = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$minimum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Min, i, l);
	});
var $mdgriffith$elm_ui$Internal$Model$Hover = 1;
var $mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$hover = $mdgriffith$elm_ui$Internal$Flag$flag(33);
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 1:
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						dl: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.dl, add, context));
							}),
						d8: styled.d8
					});
			case 0:
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 2:
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2($mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, $elm$core$Basics$never, style);
};
var $mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _v0) {
		var styles = _v0.a;
		var trans = _v0.b;
		var _v1 = $mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_v1.$) {
			case 4:
				var style = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, style, styles),
					trans);
			case 10:
				var flag = _v1.a;
				var component = _v1.b;
				return _Utils_Tuple2(
					styles,
					A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _v0 = A3(
		$elm$core$List$foldl,
		$mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, $mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _v0.a;
	var transform = _v0.b;
	return A2(
		$elm$core$List$cons,
		$mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var $mdgriffith$elm_ui$Element$mouseOver = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$hover,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			1,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$semiBold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.en);
var $mdgriffith$elm_ui$Element$Border$solid = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$borderStyle, $mdgriffith$elm_ui$Internal$Style$classes.cO);
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $author$project$Main$baseButtonStyle = F3(
	function (device, _v0, _v1) {
		var bgColor = _v0.a;
		var textColor = _v0.b;
		var bgHoverColor = _v1.a;
		var textHoverColor = _v1.b;
		var deviceDependent = function () {
			var _v2 = _Utils_Tuple2(device.cV, device.dF);
			_v2$2:
			while (true) {
				if (!_v2.b) {
					switch (_v2.a) {
						case 0:
							var _v3 = _v2.a;
							var _v4 = _v2.b;
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]);
						case 1:
							var _v5 = _v2.a;
							var _v6 = _v2.b;
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]);
						default:
							break _v2$2;
					}
				} else {
					break _v2$2;
				}
			}
			return _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$minimum, 120, $mdgriffith$elm_ui$Element$shrink))
				]);
		}();
		var d = $author$project$Dimensions$dimensions(
			{by: device});
		return _Utils_ap(
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(textColor),
					d.a_,
					$mdgriffith$elm_ui$Element$Background$color(bgColor),
					$mdgriffith$elm_ui$Element$Border$color(bgHoverColor),
					$mdgriffith$elm_ui$Element$Border$solid,
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$alignBottom,
					$mdgriffith$elm_ui$Element$Font$center,
					$mdgriffith$elm_ui$Element$Font$semiBold,
					$author$project$Styles$transition(
					_List_fromArray(
						['box-shadow', 'background'])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(bgHoverColor),
							$mdgriffith$elm_ui$Element$Font$color(textHoverColor)
						])),
					d.aL
				]),
			deviceDependent);
	});
var $author$project$Main$primaryButtonStyle = function (_v0) {
	var device = _v0.by;
	return A3(
		$author$project$Main$baseButtonStyle,
		device,
		_Utils_Tuple2($author$project$Graphics$Palette$palette.b2, $author$project$Graphics$Palette$palette.cj),
		_Utils_Tuple2($author$project$Graphics$Palette$palette.dY, $author$project$Graphics$Palette$palette.cj));
};
var $author$project$Main$Toggled = 1;
var $author$project$Main$Untoggled = 0;
var $mdgriffith$elm_ui$Internal$Model$Top = 0;
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY(0);
var $author$project$Connection$asDisconnected = function (connection) {
	if (!connection.$) {
		var provider = connection.a;
		return $elm$core$Maybe$Just(provider);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $mdgriffith$elm_ui$Element$image = F2(
	function (attrs, _v0) {
		var src = _v0.b5;
		var description = _v0.bv;
		var imageAttributes = A2(
			$elm$core$List$filter,
			function (a) {
				switch (a.$) {
					case 7:
						return true;
					case 8:
						return true;
					default:
						return false;
				}
			},
			attrs);
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dm),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName('img'),
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$src(src)),
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$alt(description))
								]),
							imageAttributes),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil))
					])));
	});
var $author$project$Main$connectionStatus = function (isConnected) {
	return A2(
		$mdgriffith$elm_ui$Element$image,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$px(50))
			]),
		{
			bv: isConnected ? 'Connected' : 'Disconnected',
			b5: isConnected ? '/assets/img/noun_connected.svg' : '/assets/img/noun_disconnected.svg'
		});
};
var $author$project$Connection$isConnected = function (connection) {
	if (connection.$ === 2) {
		return true;
	} else {
		return false;
	}
};
var $author$project$MusicProvider$logoPath = function (provider) {
	switch (provider) {
		case 1:
			return 'assets/img/deezer_logo.png';
		case 0:
			return 'assets/img/spotify_logo.png';
		default:
			return 'assets/img/youtube_logo.png';
	}
};
var $author$project$Main$providerName = function (pType) {
	switch (pType) {
		case 0:
			return 'Spotify';
		case 1:
			return 'Deezer';
		default:
			return 'Youtube';
	}
};
var $author$project$Main$providerLogoOrName = F2(
	function (attrs, pType) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			attrs,
			A2(
				$mdgriffith$elm_ui$Element$image,
				_List_Nil,
				{
					bv: $author$project$Main$providerName(pType),
					b5: $author$project$MusicProvider$logoPath(pType)
				}));
	});
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Internal$Model$Focus = 0;
var $mdgriffith$elm_ui$Internal$Flag$focus = $mdgriffith$elm_ui$Internal$Flag$flag(31);
var $mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			0,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Internal$Model$boxShadowName = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.bI ? 'box-inset' : 'box-',
				$elm$core$String$fromFloat(shadow.a1.a) + 'px',
				$elm$core$String$fromFloat(shadow.a1.b) + 'px',
				$elm$core$String$fromFloat(shadow.aK) + 'px',
				$elm$core$String$fromFloat(shadow.ba) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.aN)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {aK: almostShade.aK, aN: almostShade.aN, bI: false, a1: almostShade.a1, ba: almostShade.ba};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowName(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $mdgriffith$elm_ui$Element$Border$glow = F2(
	function (clr, size) {
		return $mdgriffith$elm_ui$Element$Border$shadow(
			{
				aK: size * 2,
				aN: clr,
				a1: _Utils_Tuple2(0, 0),
				ba: size
			});
	});
var $mdgriffith$elm_ui$Element$Border$innerShadow = function (almostShade) {
	var shade = {aK: almostShade.aK, aN: almostShade.aN, bI: true, a1: almostShade.a1, ba: almostShade.ba};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowName(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $mdgriffith$elm_ui$Element$Border$innerGlow = F2(
	function (clr, size) {
		return $mdgriffith$elm_ui$Element$Border$innerShadow(
			{
				aK: size * 2,
				aN: clr,
				a1: _Utils_Tuple2(0, 0),
				ba: size
			});
	});
var $mdgriffith$elm_ui$Internal$Model$Active = 2;
var $mdgriffith$elm_ui$Internal$Flag$active = $mdgriffith$elm_ui$Internal$Flag$flag(32);
var $mdgriffith$elm_ui$Element$mouseDown = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$active,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			2,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $author$project$Main$squareToggleButtonStyle = F2(
	function (model, state) {
		var d = $author$project$Dimensions$dimensions(model);
		return _Utils_ap(
			_List_fromArray(
				[
					d.aU,
					$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.cj),
					$mdgriffith$elm_ui$Element$Border$rounded(8),
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.ce),
					$author$project$Styles$transition(
					_List_fromArray(
						['box-shadow', 'border']))
				]),
			function () {
				switch (state) {
					case 1:
						return _List_fromArray(
							[
								A2($mdgriffith$elm_ui$Element$Border$innerGlow, $author$project$Graphics$Palette$palette.eb, 1)
							]);
					case 0:
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$mouseDown(
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Element$Border$innerGlow, $author$project$Graphics$Palette$palette.eb, 1)
									])),
								$mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Border$color(
										A2($author$project$Graphics$Palette$fade, 0.5, $author$project$Graphics$Palette$palette.eb))
									]))
							]);
					default:
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alpha(0.5),
								$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
								$mdgriffith$elm_ui$Element$focused(_List_Nil),
								$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
								A2($mdgriffith$elm_ui$Element$Border$glow, $author$project$Graphics$Palette$palette.ef, 1)
							]);
				}
			}());
	});
var $author$project$Main$serviceConnectButton = F3(
	function (model, tagger, connection) {
		var d = $author$project$Dimensions$dimensions(model);
		var buttonState = $author$project$Connection$isConnected(connection) ? 1 : 0;
		var style = A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Element$htmlAttribute(
				A2(
					$elm$html$Html$Attributes$attribute,
					'aria-label',
					A2($elm$core$Basics$composeR, $author$project$Connection$type_, $author$project$Connection$Connected$toString)(connection))),
			_Utils_ap(
				A2($author$project$Main$squareToggleButtonStyle, model, buttonState),
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$alignTop])));
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			style,
			{
				s: A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[d.bm, d.bb]),
					_List_fromArray(
						[
							A2(
							$author$project$Main$providerLogoOrName,
							_List_fromArray(
								[d.aM, d.aL, $mdgriffith$elm_ui$Element$centerX]),
							$author$project$Connection$type_(connection)),
							$author$project$Main$connectionStatus(
							$author$project$Connection$isConnected(connection))
						])),
				u: A2(
					$elm$core$Maybe$map,
					tagger,
					$author$project$Connection$asDisconnected(connection))
			});
	});
var $mdgriffith$elm_ui$Internal$Model$Padding = F5(
	function (a, b, c, d, e) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Model$Spaced = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (attr, _v0) {
				var pad = _v0.a;
				var spacing = _v0.b;
				return _Utils_Tuple2(
					function () {
						if (!pad.$) {
							var x = pad.a;
							return pad;
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 7)) {
								var _v3 = attr.b;
								var name = _v3.a;
								var t = _v3.b;
								var r = _v3.c;
								var b = _v3.d;
								var l = _v3.e;
								return $elm$core$Maybe$Just(
									A5($mdgriffith$elm_ui$Internal$Model$Padding, name, t, r, b, l));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}(),
					function () {
						if (!spacing.$) {
							var x = spacing.a;
							return spacing;
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 5)) {
								var _v6 = attr.b;
								var name = _v6.a;
								var x = _v6.b;
								var y = _v6.c;
								return $elm$core$Maybe$Just(
									A3($mdgriffith$elm_ui$Internal$Model$Spaced, name, x, y));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}());
			}),
		_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
		attrs);
};
var $mdgriffith$elm_ui$Element$wrappedRow = F2(
	function (attrs, children) {
		var _v0 = $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding(attrs);
		var padded = _v0.a;
		var spaced = _v0.b;
		if (spaced.$ === 1) {
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asRow,
				$mdgriffith$elm_ui$Internal$Model$div,
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ac + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.B + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bl)))),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							attrs))),
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
		} else {
			var _v2 = spaced.a;
			var spaceName = _v2.a;
			var x = _v2.b;
			var y = _v2.c;
			var newPadding = function () {
				if (!padded.$) {
					var _v5 = padded.a;
					var name = _v5.a;
					var t = _v5.b;
					var r = _v5.c;
					var b = _v5.d;
					var l = _v5.e;
					return ((_Utils_cmp(r, (x / 2) | 0) > -1) && (_Utils_cmp(b, (y / 2) | 0) > -1)) ? $elm$core$Maybe$Just(
						$mdgriffith$elm_ui$Element$paddingEach(
							{am: b - ((y / 2) | 0), aw: l - ((x / 2) | 0), aB: r - ((x / 2) | 0), aE: t - ((y / 2) | 0)})) : $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}();
			if (!newPadding.$) {
				var pad = newPadding.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asRow,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ac + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.B + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bl)))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
								_Utils_ap(
									attrs,
									_List_fromArray(
										[pad]))))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
			} else {
				var halfY = -(y / 2);
				var halfX = -(x / 2);
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					attrs,
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asRow,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ac + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.B + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bl)))),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											A2(
												$elm$html$Html$Attributes$style,
												'margin',
												$elm$core$String$fromFloat(halfY) + ('px' + (' ' + ($elm$core$String$fromFloat(halfX) + 'px'))))),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Internal$Model$Attr(
												A2(
													$elm$html$Html$Attributes$style,
													'width',
													'calc(100% + ' + ($elm$core$String$fromInt(x) + 'px)'))),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$Attr(
													A2(
														$elm$html$Html$Attributes$style,
														'height',
														'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))),
												A2(
													$elm$core$List$cons,
													A2(
														$mdgriffith$elm_ui$Internal$Model$StyleClass,
														$mdgriffith$elm_ui$Internal$Flag$spacing,
														A3($mdgriffith$elm_ui$Internal$Model$SpacingStyle, spaceName, x, y)),
													_List_Nil))))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(children))
							])));
			}
		}
	});
var $author$project$Main$connectView = function (model) {
	var d = $author$project$Dimensions$dimensions(model);
	var _v0 = function () {
		var _v1 = model.by.dF;
		if (!_v1) {
			return _Utils_Tuple3(
				_List_Nil,
				_List_fromArray(
					[
						d.aZ,
						A2($mdgriffith$elm_ui$Element$paddingXY, d.S, d.T)
					]),
				_List_Nil);
		} else {
			return _Utils_Tuple3(
				_List_fromArray(
					[d.bc]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$dotted,
						$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.b8),
						$mdgriffith$elm_ui$Element$Border$width(3),
						$mdgriffith$elm_ui$Element$Border$rounded(8),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, 800, $mdgriffith$elm_ui$Element$fill))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$rounded(8)
					]));
		}
	}();
	var containerPadding = _v0.a;
	var servicesContainerStyle = _v0.b;
	var buttonStyle = _v0.c;
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
				d.aZ
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$wrappedRow,
				_Utils_ap(
					_List_fromArray(
						[d.bd, d.aX, $mdgriffith$elm_ui$Element$centerX]),
					servicesContainerStyle),
				A2(
					$elm$core$List$map,
					A2($author$project$Main$serviceConnectButton, model, $author$project$Main$ToggleConnect),
					$author$project$Connection$Dict$connections(model.A))),
				A3(
				$elm$core$Basics$apL,
				$elm$core$Result$withDefault,
				A2(
					$mdgriffith$elm_ui$Element$el,
					A2($elm$core$List$cons, d.aL, containerPadding),
					$mdgriffith$elm_ui$Element$none),
				A2(
					$elm$core$Result$map,
					function (page) {
						return A2(
							$mdgriffith$elm_ui$Element$el,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								containerPadding),
							A2(
								$mdgriffith$elm_ui$Element$Input$button,
								_Utils_ap(
									$author$project$Main$primaryButtonStyle(model),
									A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$centerX, buttonStyle)),
								{
									s: $mdgriffith$elm_ui$Element$text('Next'),
									u: $elm$core$Maybe$Just(
										$author$project$Main$Navigated(page))
								}));
					},
					A2($author$project$Page$navigate, model, $author$project$Page$Request$PlaylistsSpinner)))
			]));
};
var $author$project$Page$match = F2(
	function (matchers, _v0) {
		var page = _v0;
		switch (page.$) {
			case 0:
				return matchers.b3;
			case 1:
				return matchers.bS;
			case 2:
				return matchers.bT;
			case 3:
				var playlist = page.a;
				return matchers.bR(playlist);
			case 4:
				var playlist = page.a;
				return matchers.bx(playlist);
			case 5:
				var playlist = page.a;
				var connection = page.b;
				return A2(matchers.bw, playlist, connection);
			case 6:
				var playlist = page.a;
				var connection = page.b;
				return A2(matchers.cc, playlist, connection);
			default:
				var result = page.a;
				return matchers.cb(result);
		}
	});
var $author$project$Playlist$Dict$destructureKey = function (_v0) {
	var con = _v0.a;
	var id = _v0.b;
	return _Utils_Tuple2(con, id);
};
var $turboMaCk$any_dict$Dict$Any$keys = A2(
	$elm$core$Basics$composeL,
	$elm$core$List$map($elm$core$Tuple$first),
	$turboMaCk$any_dict$Dict$Any$toList);
var $author$project$Playlist$Dict$matches = F3(
	function (con, id, _v0) {
		var otherCon = _v0.a;
		var otherId = _v0.b;
		return _Utils_eq(con, otherCon) && _Utils_eq(id, otherId);
	});
var $author$project$Main$hack_textEllipsis = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$htmlAttribute(
		A2($elm$html$Html$Attributes$style, 'text-overflow', 'ellipsis')),
		$mdgriffith$elm_ui$Element$htmlAttribute(
		A2($elm$html$Html$Attributes$style, 'display', 'inline-block'))
	]);
var $author$project$Playlist$State$isPlaylistNew = function (playlistState) {
	if (!playlistState.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Playlist$State$isPlaylistTransferred = function (playlistState) {
	if (playlistState.$ === 3) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Playlist$State$isPlaylistTransferring = function (state) {
	if (state.$ === 2) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$playlistIconNew = function (d) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				d.bn,
				$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.bV)
			]),
		$mdgriffith$elm_ui$Element$text('new!'));
};
var $elm$html$Html$i = _VirtualDom_node('i');
var $author$project$Main$icon = function (name) {
	return $mdgriffith$elm_ui$Element$html(
		A2(
			$elm$html$Html$i,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(name)
				]),
			_List_Nil));
};
var $author$project$Main$playlistIconTransferring = function (d) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				d.bb,
				$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.dM)
			]),
		$author$project$Main$icon('fas fa-sync-alt spinning'));
};
var $author$project$Playlist$Import$failedTracks = function (rpt) {
	if (!rpt.$) {
		return _List_Nil;
	} else {
		var tracks = rpt.a;
		return A2(
			$elm$core$List$filterMap,
			function (_v1) {
				var t = _v1.a;
				var m = _v1.b;
				if (!m.$) {
					return $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Just(t);
				}
			},
			tracks);
	}
};
var $author$project$Maybe$Extra$filter = function (f) {
	return $elm$core$Maybe$andThen(
		function (value) {
			return f(value) ? $elm$core$Maybe$Just(value) : $elm$core$Maybe$Nothing;
		});
};
var $author$project$Playlist$Import$isSuccessful = function (rpt) {
	if (!rpt.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Playlist$State$importWarnings = function (playlistState) {
	if (playlistState.$ === 3) {
		var result = playlistState.a;
		return $author$project$Playlist$Import$isSuccessful(result.d4) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(result.d4);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Main$playlistIconWarnings = F2(
	function (d, state) {
		var whenWarnings = function (f) {
			return A2(
				$elm$core$Maybe$map,
				f,
				A2(
					$author$project$Maybe$Extra$filter,
					function (w) {
						return $elm$core$List$length(
							$author$project$Playlist$Import$failedTracks(w)) > 0;
					},
					$author$project$Playlist$State$importWarnings(state)));
		};
		var orElse = $elm$core$Maybe$withDefault;
		return A2(
			orElse,
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						d.bb,
						$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.dM)
					]),
				$author$project$Main$icon('far fa-check-circle')),
			whenWarnings(
				function (report) {
					return A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								d.bb,
								$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.ea),
								$mdgriffith$elm_ui$Element$htmlAttribute(
								$elm$html$Html$Attributes$title(
									$elm$core$String$fromInt(
										$elm$core$List$length(
											$author$project$Playlist$Import$failedTracks(report))) + ' tracks failed to be imported'))
							]),
						$author$project$Main$icon('fas fa-exclamation-triangle'));
				}));
	});
var $author$project$Main$playlistState = F2(
	function (model, state) {
		var d = $author$project$Dimensions$dimensions(model);
		return $author$project$Playlist$State$isPlaylistTransferring(state) ? $author$project$Main$playlistIconTransferring(d) : ($author$project$Playlist$State$isPlaylistTransferred(state) ? A2($author$project$Main$playlistIconWarnings, d, state) : ($author$project$Playlist$State$isPlaylistNew(state) ? $author$project$Main$playlistIconNew(d) : $mdgriffith$elm_ui$Element$none));
	});
var $author$project$Playlist$summary = function (_v0) {
	var name = _v0.dy;
	return name;
};
var $mdgriffith$elm_ui$Element$Border$widthXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$borderWidth,
			A5(
				$mdgriffith$elm_ui$Internal$Model$BorderWidth,
				'b-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Element$Border$widthEach = function (_v0) {
	var bottom = _v0.am;
	var top = _v0.aE;
	var left = _v0.aw;
	var right = _v0.aB;
	return (_Utils_eq(top, bottom) && _Utils_eq(left, right)) ? (_Utils_eq(top, right) ? $mdgriffith$elm_ui$Element$Border$width(top) : A2($mdgriffith$elm_ui$Element$Border$widthXY, left, top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left))))))),
			top,
			right,
			bottom,
			left));
};
var $author$project$Main$playlistRow = F4(
	function (model, connection, isSelected, _v0) {
		var playlist = _v0.a;
		var state = _v0.b;
		var d = $author$project$Dimensions$dimensions(model);
		var style = _Utils_ap(
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$clip,
					$mdgriffith$elm_ui$Element$Border$widthEach(
					{am: 1, aw: 0, aB: 0, aE: 0}),
					$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.bW),
					A2($mdgriffith$elm_ui$Element$paddingXY, d.X, d._),
					$author$project$Styles$transition(
					_List_fromArray(
						['background']))
				]),
			isSelected ? _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.b8),
					A2($mdgriffith$elm_ui$Element$Border$innerGlow, $author$project$Graphics$Palette$palette.ef, 1)
				]) : _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.b8)
						]))
				]));
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			style,
			{
				s: A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							d.bd
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Main$providerLogoOrName,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(28))
								]),
							$author$project$Connection$Connected$type_(connection)),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_Utils_ap(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
										$mdgriffith$elm_ui$Element$clip
									]),
								$author$project$Main$hack_textEllipsis),
							$mdgriffith$elm_ui$Element$text(
								$author$project$Playlist$summary(playlist))),
							A2($author$project$Main$playlistState, model, state),
							$mdgriffith$elm_ui$Element$text(
							$elm$core$String$fromInt(playlist.eu) + ' tracks')
						])),
				u: $elm$core$Result$toMaybe(
					A2(
						$elm$core$Result$map,
						$author$project$Main$Navigated,
						A2(
							$author$project$Page$navigate,
							model,
							$author$project$Page$Request$PlaylistDetails(
								A2($author$project$Playlist$Dict$key, connection, playlist.av)))))
			});
	});
var $author$project$List$Extra$withDefault = F2(
	function (placeholderList, list) {
		return $elm$core$List$isEmpty(list) ? placeholderList : list;
	});
var $author$project$Main$playlistsGroup = F4(
	function (model, selected, connection, playlistIds) {
		var isSelected = function (id) {
			return A2(
				$elm$core$Maybe$withDefault,
				false,
				A2(
					$elm$core$Maybe$map,
					A2($author$project$Playlist$Dict$matches, connection, id),
					selected));
		};
		return A2(
			$author$project$List$Extra$withDefault,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text('No tracks')
				]),
			A2(
				$elm$core$List$map,
				function (data) {
					var playlist = data.a;
					return A4(
						$author$project$Main$playlistRow,
						model,
						connection,
						isSelected(playlist.av),
						data);
				},
				A2(
					$elm$core$List$filterMap,
					function (key) {
						return A2($author$project$Playlist$Dict$get, key, model.n);
					},
					A2(
						$elm$core$List$map,
						$author$project$Playlist$Dict$key(connection),
						playlistIds))));
	});
var $author$project$Main$hack_forceSticky = $mdgriffith$elm_ui$Element$htmlAttribute(
	A2($elm$html$Html$Attributes$style, 'position', 'sticky'));
var $author$project$Main$playlistTableFooter = F2(
	function (padding, items) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					padding,
					$mdgriffith$elm_ui$Element$Background$color(
					$author$project$Graphics$Palette$palette.cf(0.9)),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$alignBottom
				]),
			$mdgriffith$elm_ui$Element$text(
				A2($elm$core$Basics$composeR, $elm$core$List$length, $elm$core$String$fromInt)(items) + ' playlists in your library'));
	});
var $author$project$Main$playlistsTableHeader = F2(
	function (style, d) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2($mdgriffith$elm_ui$Element$paddingXY, d.X, d.T),
						d.a_,
						$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.ef),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{am: 1, aw: 0, aB: 0, aE: 0})
					]),
				style),
			$mdgriffith$elm_ui$Element$text('Playlists'));
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.dU);
var $author$project$Main$playlistsTableItemsContainer = F2(
	function (items, d) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$scrollbarY
				]),
			_Utils_ap(
				items,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$paddingEach(
								{am: d.X, aw: 0, aB: 0, aE: d.T})
							]),
						$mdgriffith$elm_ui$Element$none)
					])));
	});
var $author$project$Main$playlistsTableFrame = F2(
	function (model, items) {
		var d = $author$project$Dimensions$dimensions(model);
		var _v0 = function () {
			var _v1 = model.by.dF;
			if (!_v1) {
				return _Utils_Tuple3(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_Nil,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$shadow(
							{
								aK: 14,
								aN: $author$project$Graphics$Palette$palette.eb,
								a1: _Utils_Tuple2(0, 2),
								ba: -7
							})
						]));
			} else {
				return _Utils_Tuple3(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							A2($mdgriffith$elm_ui$Element$maximum, 1024, $mdgriffith$elm_ui$Element$fill)),
							$mdgriffith$elm_ui$Element$Border$solid,
							$mdgriffith$elm_ui$Element$Border$rounded(5),
							$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.b_),
							$mdgriffith$elm_ui$Element$Border$shadow(
							{
								aK: 10,
								aN: $author$project$Graphics$Palette$palette.eb,
								a1: _Utils_Tuple2(0, 2),
								ba: 0
							})
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$paddingEach(
							{am: d.T, aw: 0, aB: 0, aE: d.X})
						]),
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$Border$solid]));
			}
		}();
		var tableStyle = _v0.a;
		var containerStyle = _v0.b;
		var headerStyle = _v0.c;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$clip,
						$mdgriffith$elm_ui$Element$centerX,
						$author$project$Main$hack_forceSticky
					]),
				_Utils_ap(containerStyle, $author$project$Main$hack_forceClip)),
			A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$inFront(
							A2($author$project$Main$playlistTableFooter, d.bc, items)),
							$author$project$Main$hack_forceSticky
						]),
					_Utils_ap(tableStyle, $author$project$Main$hack_forceClip)),
				_List_fromArray(
					[
						A2($author$project$Main$playlistsTableHeader, headerStyle, d),
						A2($author$project$Main$playlistsTableItemsContainer, items, d)
					])));
	});
var $author$project$Main$playlistsTable = F2(
	function (model, selected) {
		var groupByProvider = function (p) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (key, grouped) {
						var _v0 = $author$project$Playlist$Dict$destructureKey(key);
						var c = _v0.a;
						var id = _v0.b;
						return A3(
							$turboMaCk$any_dict$Dict$Any$update,
							c,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Maybe$map(
									A2(
										$elm$core$Basics$composeL,
										$elm$core$Maybe$Just,
										$elm$core$List$cons(id))),
								$elm$core$Maybe$withDefault(
									$elm$core$Maybe$Just(
										_List_fromArray(
											[id])))),
							grouped);
					}),
				$turboMaCk$any_dict$Dict$Any$empty($author$project$Connection$Connected$connectionToString),
				$turboMaCk$any_dict$Dict$Any$keys(p));
		};
		var withPlaylistsGroups = function (f) {
			return $author$project$List$Extra$flatten(
				$turboMaCk$any_dict$Dict$Any$values(
					A2(
						$turboMaCk$any_dict$Dict$Any$map,
						f,
						groupByProvider(model.n))));
		};
		return A2(
			$author$project$Main$playlistsTableFrame,
			model,
			withPlaylistsGroups(
				A2($author$project$Main$playlistsGroup, model, selected)));
	});
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 9};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $author$project$Spinner$progressBar = F2(
	function (attrs, message) {
		var ifMessage = function (v) {
			return A2(
				$elm$core$Maybe$withDefault,
				$mdgriffith$elm_ui$Element$none,
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeL, v, $mdgriffith$elm_ui$Element$text),
					message));
		};
		return A2(
			$mdgriffith$elm_ui$Element$column,
			attrs,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$html(
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('progress progress-sm progress-indeterminate')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('progress-bar')
									]),
								_List_Nil)
							]))),
					ifMessage(
					function (msg) {
						return A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
									$mdgriffith$elm_ui$Element$centerX,
									$mdgriffith$elm_ui$Element$centerY,
									$mdgriffith$elm_ui$Element$Font$center
								]),
							_List_fromArray(
								[msg]));
					})
				]));
	});
var $author$project$Main$newRouteMainView = function (model) {
	var page = model.dH;
	return A2(
		$author$project$Page$match,
		{
			bw: F2(
				function (key, _v0) {
					return A2(
						$author$project$Main$playlistsTable,
						model,
						$elm$core$Maybe$Just(key));
				}),
			bx: function (key) {
				return A2(
					$author$project$Main$playlistsTable,
					model,
					$elm$core$Maybe$Just(key));
			},
			bR: function (key) {
				return A2(
					$author$project$Main$playlistsTable,
					model,
					$elm$core$Maybe$Just(key));
			},
			bS: A2(
				$author$project$Spinner$progressBar,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
				$elm$core$Maybe$Just('Fetching your playlists')),
			bT: A2($author$project$Main$playlistsTable, model, $elm$core$Maybe$Nothing),
			b3: $author$project$Main$connectView(model),
			cb: function (result) {
				return A2(
					$author$project$Main$playlistsTable,
					model,
					$elm$core$Maybe$Just(
						$author$project$Main$resultToKey(result)));
			},
			cc: F2(
				function (key, _v1) {
					return A2(
						$author$project$Main$playlistsTable,
						model,
						$elm$core$Maybe$Just(key));
				})
		},
		page);
};
var $author$project$Main$isPanelOpen = function (page) {
	return !A2(
		$author$project$Page$oneOf,
		page,
		_List_fromArray(
			[$author$project$Page$Request$ServiceConnection, $author$project$Page$Request$PlaylistsSpinner, $author$project$Page$Request$PlaylistPicker]));
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $mdgriffith$elm_ui$Element$transparent = function (on) {
	return on ? A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2($mdgriffith$elm_ui$Internal$Model$Transparency, 'transparent', 1.0)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2($mdgriffith$elm_ui$Internal$Model$Transparency, 'visible', 0.0));
};
var $author$project$Main$overlay = function (model) {
	var page = model.dH;
	var clickHandler = A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		A2(
			$elm$core$Result$map,
			A2(
				$elm$core$Basics$composeL,
				A2($elm$core$Basics$composeL, $elm$core$List$singleton, $mdgriffith$elm_ui$Element$Events$onClick),
				$author$project$Main$Navigated),
			A2($author$project$Page$navigate, model, $author$project$Page$Request$PlaylistPicker)));
	var attrs = _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
			$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
			$author$project$Styles$transition(
			_List_fromArray(
				['background-color'])),
			$mdgriffith$elm_ui$Element$mouseDown(_List_Nil)
		]);
	return $mdgriffith$elm_ui$Element$inFront(
		$author$project$Main$isPanelOpen(page) ? A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				attrs,
				_Utils_ap(
					clickHandler,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.ef)
						]))),
			$mdgriffith$elm_ui$Element$none) : A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				attrs,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$transparent(true),
						$mdgriffith$elm_ui$Element$htmlAttribute(
						A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'))
					])),
			$mdgriffith$elm_ui$Element$none));
};
var $mdgriffith$elm_ui$Internal$Model$Below = 1;
var $mdgriffith$elm_ui$Element$below = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 1, element);
};
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveDown = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(y));
};
var $mdgriffith$elm_ui$Internal$Model$MoveX = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveX = $mdgriffith$elm_ui$Internal$Flag$flag(25);
var $mdgriffith$elm_ui$Element$moveLeft = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveX,
		$mdgriffith$elm_ui$Internal$Model$MoveX(-x));
};
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Internal$Model$Heading = function (a) {
	return {$: 4, a: a};
};
var $mdgriffith$elm_ui$Element$Region$heading = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Describe, $mdgriffith$elm_ui$Internal$Model$Heading);
var $author$project$Main$panelDefaultStyle = function (model) {
	var d = $author$project$Dimensions$dimensions(model);
	return _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$paddingEach(
			{am: d.T, aw: d.X, aB: d.X, aE: d.T})
		]);
};
var $author$project$Main$panelContainer = F3(
	function (model, maybeTitle, children) {
		var style = _Utils_ap(
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$clip,
					$mdgriffith$elm_ui$Element$spaceEvenly,
					$mdgriffith$elm_ui$Element$Border$shadow(
					{
						aK: 6,
						aN: $author$project$Graphics$Palette$palette.ef,
						a1: _Utils_Tuple2(0, 0),
						ba: 1
					})
				]),
			$author$project$Main$hack_forceClip);
		var ifTitle = function (v) {
			return A2(
				$elm$core$Maybe$withDefault,
				$mdgriffith$elm_ui$Element$none,
				A2($elm$core$Maybe$map, v, maybeTitle));
		};
		return A2(
			$mdgriffith$elm_ui$Element$column,
			style,
			A2(
				$elm$core$List$cons,
				ifTitle(
					function (title) {
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_Utils_ap(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Region$heading(2),
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
										$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.ef),
										$mdgriffith$elm_ui$Element$Border$widthEach(
										{am: 1, aw: 0, aB: 0, aE: 0})
									]),
								$author$project$Main$panelDefaultStyle(model)),
							$mdgriffith$elm_ui$Element$text(title));
					}),
				children));
	});
var $author$project$Main$transferConfigStep1 = F3(
	function (model, key, _v0) {
		var name = _v0.dy;
		return A3(
			$author$project$Main$panelContainer,
			model,
			$elm$core$Maybe$Just('Transfer playlist'),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$scrollbarY
							]),
						_Utils_ap(
							$author$project$Main$panelDefaultStyle(model),
							$author$project$Main$hack_forceClip)),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text(name)
						])),
					A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						$author$project$Main$primaryButtonStyle(model),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							])),
					{
						s: $mdgriffith$elm_ui$Element$text('Next'),
						u: $elm$core$Result$toMaybe(
							A2(
								$elm$core$Result$map,
								$author$project$Main$Navigated,
								A2(
									$author$project$Page$navigate,
									model,
									$author$project$Page$Request$DestinationPicker(key))))
					})
				]));
	});
var $author$project$Main$transferConfigStep3 = function (model) {
	var d = $author$project$Dimensions$dimensions(model);
	return A3(
		$author$project$Main$panelContainer,
		model,
		$elm$core$Maybe$Nothing,
		_List_fromArray(
			[
				A2(
				$author$project$Spinner$progressBar,
				_List_fromArray(
					[d.bc, $mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
				$elm$core$Maybe$Just('Transferring playlist')),
				A2(
				$mdgriffith$elm_ui$Element$Input$button,
				_Utils_ap(
					$author$project$Main$primaryButtonStyle(model),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						])),
				{
					s: $mdgriffith$elm_ui$Element$text('Run in background'),
					u: $elm$core$Result$toMaybe(
						A2(
							$elm$core$Result$map,
							$author$project$Main$Navigated,
							A2($author$project$Page$navigate, model, $author$project$Page$Request$PlaylistPicker)))
				})
			]));
};
var $author$project$Main$transferConfigStep4 = function (model) {
	var factor = function () {
		var _v0 = model.by.dF;
		if (!_v0) {
			return '3';
		} else {
			return '7';
		}
	}();
	var d = $author$project$Dimensions$dimensions(model);
	return A3(
		$author$project$Main$panelContainer,
		model,
		$elm$core$Maybe$Nothing,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerY, $mdgriffith$elm_ui$Element$centerX, d.bd]),
					$author$project$Main$panelDefaultStyle(model)),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.dY)
							]),
						$author$project$Main$icon('far fa-check-circle fa-' + (factor + 'x'))),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$center]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('Your playlist was transferred successfully!')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$Input$button,
				_Utils_ap(
					$author$project$Main$primaryButtonStyle(model),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						])),
				{
					s: $mdgriffith$elm_ui$Element$text('Back to playlists'),
					u: $elm$core$Result$toMaybe(
						A2(
							$elm$core$Result$map,
							$author$project$Main$Navigated,
							A2($author$project$Page$navigate, model, $author$project$Page$Request$PlaylistPicker)))
				})
			]));
};
var $author$project$Playlist$Import$duplicateCount = function (status) {
	if (!status.$) {
		return 0;
	} else {
		var dupes = status.b;
		return dupes;
	}
};
var $author$project$Main$transferConfigStep4Warnings = F2(
	function (model, report) {
		var tracks = $author$project$Playlist$Import$failedTracks(report);
		var factor = function () {
			var _v0 = model.by.dF;
			if (!_v0) {
				return '3';
			} else {
				return '7';
			}
		}();
		var dupes = $author$project$Playlist$Import$duplicateCount(report);
		var d = $author$project$Dimensions$dimensions(model);
		return A3(
			$author$project$Main$panelContainer,
			model,
			$elm$core$Maybe$Nothing,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerY,
								$mdgriffith$elm_ui$Element$centerX,
								d.bd,
								$mdgriffith$elm_ui$Element$paddingEach(
								{am: 0, aw: d.X, aB: d.X, aE: d.X}),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$clip
							]),
						$author$project$Main$hack_forceClip),
					A2(
						$elm$core$List$cons,
						A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$centerX,
									$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.ea)
								]),
							$author$project$Main$icon('fas fa-exclamation-triangle fa-' + (factor + 'x'))),
						A2(
							$elm$core$List$cons,
							(dupes > 0) ? A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$Font$center]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text(
										$elm$core$String$fromInt(dupes) + ' duplicate tracks were removed')
									])) : $mdgriffith$elm_ui$Element$none,
							($elm$core$List$length(tracks) > 0) ? _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$center]),
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('-----')
										])),
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$center]),
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('Some tracks could not be transferred')
										])),
									A2(
									$mdgriffith$elm_ui$Element$column,
									_Utils_ap(
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
												$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
												d.bd,
												$mdgriffith$elm_ui$Element$clip,
												$mdgriffith$elm_ui$Element$scrollbarY
											]),
										$author$project$Main$hack_forceClip),
									A2(
										$elm$core$List$map,
										function (t) {
											return A2(
												$mdgriffith$elm_ui$Element$el,
												_Utils_ap(
													_List_fromArray(
														[
															$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
															$mdgriffith$elm_ui$Element$clip,
															$mdgriffith$elm_ui$Element$Font$center
														]),
													$author$project$Main$hack_textEllipsis),
												$mdgriffith$elm_ui$Element$text(
													$author$project$Track$toString(t)));
										},
										tracks))
								]) : _List_Nil))),
					A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						$author$project$Main$primaryButtonStyle(model),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							])),
					{
						s: $mdgriffith$elm_ui$Element$text('Back to playlists'),
						u: $elm$core$Result$toMaybe(
							A2(
								$elm$core$Result$map,
								$author$project$Main$Navigated,
								A2($author$project$Page$navigate, model, $author$project$Page$Request$PlaylistPicker)))
					})
				]));
	});
var $author$project$Main$playlistDetail = F2(
	function (model, playlist) {
		return A2(
			$elm$core$Maybe$withDefault,
			$mdgriffith$elm_ui$Element$none,
			A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var p = _v0.a;
					var state = _v0.b;
					return $author$project$Playlist$State$isPlaylistTransferring(state) ? $author$project$Main$transferConfigStep3(model) : ($author$project$Playlist$State$isPlaylistTransferred(state) ? A2(
						$elm$core$Maybe$withDefault,
						$author$project$Main$transferConfigStep4(model),
						A2(
							$elm$core$Maybe$map,
							$author$project$Main$transferConfigStep4Warnings(model),
							$author$project$Playlist$State$importWarnings(state))) : A3($author$project$Main$transferConfigStep1, model, playlist, p));
				},
				A2($author$project$Playlist$Dict$get, playlist, model.n)));
	});
var $author$project$Main$Disabled = 2;
var $author$project$Main$disabledButtonStyle = function (_v0) {
	var device = _v0.by;
	return A3(
		$author$project$Main$baseButtonStyle,
		device,
		_Utils_Tuple2($author$project$Graphics$Palette$palette.ef, $author$project$Graphics$Palette$palette.cj),
		_Utils_Tuple2($author$project$Graphics$Palette$palette.ef, $author$project$Graphics$Palette$palette.cj));
};
var $author$project$SelectableList$NotSelected = function (a) {
	return {$: 1, a: a};
};
var $author$project$SelectableList$fromList = function (list) {
	return $author$project$SelectableList$NotSelected(list);
};
var $author$project$SelectableList$selected = function (sList) {
	if (!sList.$) {
		var _v1 = sList.a;
		var el = _v1.a;
		return $elm$core$Maybe$Just(el);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$SelectableList$hasSelection = function (sList) {
	return !_Utils_eq(
		$elm$core$Maybe$Nothing,
		$author$project$SelectableList$selected(sList));
};
var $author$project$SelectableList$Selected = function (a) {
	return {$: 0, a: a};
};
var $author$project$SelectableList$Selection = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$SelectableList$map = F2(
	function (f, sList) {
		if (!sList.$) {
			var _v1 = sList.a;
			var el = _v1.a;
			var list = _v1.b;
			return $author$project$SelectableList$Selected(
				A2(
					$author$project$SelectableList$Selection,
					f(el),
					A2($elm$core$List$map, f, list)));
		} else {
			var list = sList.a;
			return $author$project$SelectableList$NotSelected(
				A2($elm$core$List$map, f, list));
		}
	});
var $author$project$SelectableList$toList = function (sList) {
	if (!sList.$) {
		var _v1 = sList.a;
		var list = _v1.b;
		return list;
	} else {
		var list = sList.a;
		return list;
	}
};
var $author$project$SelectableList$selectFirst = F2(
	function (predicate, sList) {
		var list = $author$project$SelectableList$toList(sList);
		return A3(
			$elm$core$List$foldl,
			F2(
				function (el, selection) {
					if (!selection.$) {
						var _v1 = selection.a;
						return selection;
					} else {
						var l = selection.a;
						return predicate(el) ? $author$project$SelectableList$Selected(
							A2($author$project$SelectableList$Selection, el, l)) : selection;
					}
				}),
			$author$project$SelectableList$NotSelected(list),
			list);
	});
var $author$project$Main$transferConfigStep2 = F3(
	function (model, key, destination) {
		var unavailable = $author$project$Playlist$Dict$keyToCon(key);
		var services = A2(
			$author$project$SelectableList$selectFirst,
			function (c) {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Basics$eq(c),
						destination));
			},
			$author$project$SelectableList$fromList(
				$author$project$Connection$Dict$connectedConnections(model.A)));
		var goButtonStyle = _Utils_ap(
			$author$project$SelectableList$hasSelection(services) ? $author$project$Main$primaryButtonStyle(model) : $author$project$Main$disabledButtonStyle(model),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]));
		var d = $author$project$Dimensions$dimensions(model);
		var buttonState = function (con) {
			return _Utils_eq(con, unavailable) ? 2 : (A2(
				$elm$core$Maybe$withDefault,
				false,
				A2(
					$elm$core$Maybe$map,
					$elm$core$Basics$eq(con),
					$author$project$SelectableList$selected(services))) ? 1 : 0);
		};
		return A3(
			$author$project$Main$panelContainer,
			model,
			$elm$core$Maybe$Just('Transfer to'),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_Utils_ap(
						_List_fromArray(
							[d.bd, $mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
						$author$project$Main$panelDefaultStyle(model)),
					$author$project$SelectableList$toList(
						A2(
							$author$project$SelectableList$map,
							function (connection) {
								return A2(
									$mdgriffith$elm_ui$Element$Input$button,
									A2(
										$author$project$Main$squareToggleButtonStyle,
										model,
										buttonState(connection)),
									{
										s: A2(
											$elm$core$Basics$composeR,
											$author$project$Connection$Connected$type_,
											$author$project$Main$providerLogoOrName(
												_List_fromArray(
													[d.aM, $mdgriffith$elm_ui$Element$centerX])))(connection),
										u: (!_Utils_eq(unavailable, connection)) ? $elm$core$Result$toMaybe(
											A2(
												$elm$core$Result$map,
												$author$project$Main$Navigated,
												A2(
													$author$project$Page$navigate,
													model,
													A2($author$project$Page$Request$DestinationPicked, key, connection)))) : $elm$core$Maybe$Nothing
									});
							},
							services))),
					A2(
					$mdgriffith$elm_ui$Element$Input$button,
					goButtonStyle,
					{
						s: $mdgriffith$elm_ui$Element$text('GO!'),
						u: A2(
							$elm$core$Maybe$andThen,
							function (dest) {
								return $elm$core$Result$toMaybe(
									A2(
										$elm$core$Result$map,
										$author$project$Main$Navigated,
										A2(
											$author$project$Page$navigate,
											model,
											A2($author$project$Page$Request$TransferSpinner, key, dest))));
							},
							destination)
					})
				]));
	});
var $author$project$Main$newRoutePanel = function (model) {
	var d = $author$project$Dimensions$dimensions(model);
	var placeholderStyle = _List_fromArray(
		[
			function () {
			var _v3 = model.by.dF;
			if (!_v3) {
				return $mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(d.a4));
			} else {
				return $mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(d.a4));
			}
		}()
		]);
	return A2(
		$author$project$Page$match,
		{
			bw: F2(
				function (key, con) {
					return A3(
						$author$project$Main$transferConfigStep2,
						model,
						key,
						$elm$core$Maybe$Just(con));
				}),
			bx: function (key) {
				return A3($author$project$Main$transferConfigStep2, model, key, $elm$core$Maybe$Nothing);
			},
			bR: function (key) {
				return A2($author$project$Main$playlistDetail, model, key);
			},
			bS: A2($mdgriffith$elm_ui$Element$el, placeholderStyle, $mdgriffith$elm_ui$Element$none),
			bT: A2($mdgriffith$elm_ui$Element$el, placeholderStyle, $mdgriffith$elm_ui$Element$none),
			b3: A2($mdgriffith$elm_ui$Element$el, placeholderStyle, $mdgriffith$elm_ui$Element$none),
			cb: function (_v0) {
				return $author$project$Main$transferConfigStep4(model);
			},
			cc: F2(
				function (_v1, _v2) {
					return $author$project$Main$transferConfigStep3(model);
				})
		},
		model.dH);
};
var $mdgriffith$elm_ui$Internal$Model$OnRight = 2;
var $mdgriffith$elm_ui$Element$onRight = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 2, element);
};
var $author$project$Main$panel = function (model) {
	var device = model.by;
	var page = model.dH;
	var panelPositioner = function () {
		var _v1 = device.dF;
		if (!_v1) {
			return $mdgriffith$elm_ui$Element$below;
		} else {
			return $mdgriffith$elm_ui$Element$onRight;
		}
	}();
	var d = $author$project$Dimensions$dimensions(model);
	var panelStyle = function () {
		var _v0 = device.dF;
		if (!_v0) {
			return _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(d.a4)),
					(!$author$project$Main$isPanelOpen(page)) ? $mdgriffith$elm_ui$Element$moveDown(0) : $mdgriffith$elm_ui$Element$moveUp(d.a4)
				]);
		} else {
			return _Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(d.a4)),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						(!$author$project$Main$isPanelOpen(page)) ? $mdgriffith$elm_ui$Element$moveLeft(0) : $mdgriffith$elm_ui$Element$moveLeft(d.a4)
					]),
				$author$project$Main$hack_forceClip);
		}
	}();
	return panelPositioner(
		A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				panelStyle,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.cj),
						$author$project$Styles$transition(
						_List_fromArray(
							['transform']))
					])),
			$author$project$Main$newRoutePanel(model)));
};
var $mdgriffith$elm_ui$Element$Font$typeface = $mdgriffith$elm_ui$Internal$Model$Typeface;
var $author$project$Main$view = function (model) {
	var d = $author$project$Dimensions$dimensions(model);
	var _v0 = function () {
		var _v1 = model.by.dF;
		if (!_v1) {
			return _Utils_Tuple2(_List_Nil, _List_Nil);
		} else {
			return _Utils_Tuple2(
				_List_fromArray(
					[d.bd]),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, d.T, 0)
					]));
		}
	}();
	var bodyStyle = _v0.a;
	var mainContentStyle = _v0.b;
	return A3(
		$mdgriffith$elm_ui$Element$layoutWith,
		{
			dE: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$focusStyle(
					{cE: $elm$core$Maybe$Nothing, cL: $elm$core$Maybe$Nothing, dZ: $elm$core$Maybe$Nothing})
				])
		},
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$family(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$typeface('Fira Code')
					])),
				$mdgriffith$elm_ui$Element$Font$color($author$project$Graphics$Palette$palette.eb),
				d.d0,
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		A2(
			$mdgriffith$elm_ui$Element$column,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$author$project$Main$overlay(model),
						$author$project$Main$panel(model),
						$mdgriffith$elm_ui$Element$clip
					]),
				bodyStyle),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Region$navigation,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							d.bc,
							$mdgriffith$elm_ui$Element$Border$color($author$project$Graphics$Palette$palette.b8),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Graphics$Palette$palette.bW),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{am: 1, aw: 0, aB: 0, aE: 0})
						]),
					$author$project$Main$header(model)),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$paddingEach(
							{am: 0, aw: 0, aB: 0, aE: 32}),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					A2(
						$author$project$Breadcrumb$breadcrumb,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								A2($mdgriffith$elm_ui$Element$maximum, 800, $mdgriffith$elm_ui$Element$fill)),
								$mdgriffith$elm_ui$Element$centerX
							]),
						model)),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Region$mainContent,
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$clip
							]),
						_Utils_ap($author$project$Main$hack_forceClip, mainContentStyle)),
					$author$project$Main$newRouteMainView(model))
				])));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{dp: $author$project$Main$init, d9: $author$project$Main$subscriptions, ew: $author$project$Main$update, ey: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (window) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (rawTokens) {
					return $elm$json$Json$Decode$succeed(
						{a6: rawTokens, bk: window});
				},
				A2(
					$elm$json$Json$Decode$field,
					'rawTokens',
					$elm$json$Json$Decode$list(
						A2(
							$elm$json$Json$Decode$andThen,
							function (_v0) {
								return A2(
									$elm$json$Json$Decode$andThen,
									function (_v1) {
										return $elm$json$Json$Decode$succeed(
											_Utils_Tuple2(_v0, _v1));
									},
									A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string));
							},
							A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)))));
		},
		A2(
			$elm$json$Json$Decode$field,
			'window',
			A2(
				$elm$json$Json$Decode$andThen,
				function (width) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (height) {
							return $elm$json$Json$Decode$succeed(
								{bE: height, ck: width});
						},
						A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$int));
				},
				A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$int)))))(0)}});}(this));