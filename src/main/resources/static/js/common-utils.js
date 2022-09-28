function gfn_util_decode() {
	let rtnval = null;
	const args = this.gfn_util_decode.arguments;
	
	if (args.length < 3) return rtnval;
	
	bDefval = args.length % 2 == 0;
	const baseval = args[0];
	for (var i=1; i<args.length; i+=2) {
		if (baseval === args[i]) {
			rtnval = args[i+1];
			break;
		}
	}
	
	//일치하지 않을경우 기본값
	if (rtnval === null && bDefval) rtnval = args[args.length-1];
	
	return rtnval;
}

function gfn_util_camelCase(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

// Merge a `source` object to a `target` recursively
function gfn_util_merge(pTarget, source) {
	const target = {...pTarget};
  	// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
	for (let key of Object.keys(source)) {
		if (source[key] instanceof Object) Object.assign(source[key], gfn_util_merge(target[key], source[key]));
  	}

  	// Join `target` and modified `source`
  	Object.assign(target || {}, source);
  	return target
}