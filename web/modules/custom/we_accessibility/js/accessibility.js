(function ($,Drupal) {
	'use strict';

	var App = (function () {

		function accessibility() {
			$('body').on('click', '[data-accessibility-toggle]', function (e) {
				e.preventDefault();
				$('.u-accessibility-drop').slideToggle(200);
			});
		}

		return {
			init: function () {
				accessibility();
			}
		};

	})();

	App.init();

	$.fn.setAccessibility = function(data,value) {
		if (data.indexOf("font_size") != -1) {
			if (value == '0') {
				$('html').removeClass('u-fz-1 u-fz-2');
			} else {
				$('html').removeClass('u-fz-1 u-fz-2');
				$('html').addClass(value);
			}
		}
		if (data.indexOf("line_height") != -1) {
			if (value == '0') {
				$('html').removeClass('u-lh-1 u-lh-2');
			} else {
				$('html').removeClass('u-lh-1 u-lh-2');
				$('html').addClass(value);
			}
		}
		if (data.indexOf("contrast") != -1) {
			if (value == '0') {
				$('html').removeClass('u-contrast-1');
			} else {
				$('html').addClass(value);
			}
		}
		if (data.indexOf("options[u-no-styles]") != -1) {
			if (value == '0') {
				$('html').removeClass('u-no-styles');
				$('style,link[rel="stylesheet"]').attr('media', 'all');
			} else {
				$('html').addClass(value);
				$('style,link[rel="stylesheet"]').attr('media', 'max-width: 1px');
			}
		}
		if (data.indexOf("options[u-no-colors]") != -1) {
			if (value == '0') {
				$('html').removeClass('u-no-colors');
			} else {
				$('html').addClass(value);
			}
		}
		if (data.indexOf("reset") != -1) {
			console.log('do reset');
			document.querySelector(value).reset();
		}
  };

})(jQuery,Drupal);