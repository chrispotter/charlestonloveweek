;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);

	$doc.ready(function() {
		// Datepicker
		$('.js-datepicker').datepicker({
			showAnim: 'fadeIn',
			minDate: "12/03/2017",
			maxDate: "12/09/2017",
			onClose: function(dateText,datePickerInstance) {
        var oldValue = $(this).data('oldValue');
        if (dateText !== oldValue) {
						$(this).data('oldValue', dateText);
						var evt = document.createEvent('HTMLEvents');
						evt.initEvent('datechange', true, true);		
						this.dispatchEvent(evt);
        }
    }
		});

		// Form toggle
		$('.js-form-toggle').on('click', function (e) {
			e.preventDefault();

			$(this).toggleClass('active');
			$(this).closest('.form').find('.form__inner').stop().slideToggle();
		});
	});

})(jQuery, window, document);
