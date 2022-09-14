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