/*! Contient tout votre code, vos appels aux plugins, etc. */

var monsite = (function($) {

	/**
	 * Une petite fonction au pif
	 */
	var petiteFonction = function() {
		console.log('function ok');
	};

	return {
		petiteFonction: petiteFonction
	}
})(jQuery);

$(function() {
	monsite.petiteFonction();
})