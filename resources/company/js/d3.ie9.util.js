module.exports = function() {
	var d3_style_prototype   = this.CSSStyleDeclaration.prototype;
	var d3_style_setProperty = d3_style_prototype.setProperty;
	d3_style_prototype.setProperty = function(name, value, priority) {
		try {
			d3_style_setProperty.call(this, name, value + "", priority);
		} catch(exception) {
			switch(name) {
				case    'left':  name = 'start';  break;
				case    'right': name = 'end';    break;
				default:         name = 'middle'; break;
			}
			d3_style_setProperty.call(this, name, value + "", priority);
		}
	};
}
