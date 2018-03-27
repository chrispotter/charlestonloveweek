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

		$('.request-list').on('click', function(e) {
			e.preventDefault();
			$(".loading").toggle();
			var href = $(e.target).attr('href');
			$.ajax({
				url     : href,
				type    : 'GET',
				dataType: 'json',
				success : function(data){
						$('.request-list').hide();
						$('.search').show();
						$('.main').append($(data.body));
						$(".loading").toggle(); 
						var evt = document.createEvent('HTMLEvents');
						evt.initEvent('load-filters', true, true);		
						document.dispatchEvent(evt);
						// Form toggle
						$('.js-form-toggle').on('click', function (e) {
							e.preventDefault();

							$(this).toggleClass('active');
							$(this).closest('.form').find('.form__inner').stop().slideToggle();
						});
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
				}
			});
		})

		// Form toggle
		$('.js-form-toggle').on('click', function (e) {
			e.preventDefault();

			$(this).toggleClass('active');
			$(this).closest('.form').find('.form__inner').stop().slideToggle();
		});

		if($('.eventbase__body a')) {
			$('#agree').click(function(e){
				$('.eventbase__body a').toggleClass('disabled');
			})
		}
		if($('.trigger')){
			$('.trigger').on('click', function (event) {
				event.preventDefault();
				$('.trigger').iziModal({
					iframe: true,
					iframeHeight: 800
				});
			});
		}
		//pagination
		// $.fn.instantiateButton = function(selector) {
		// 	if(selector){
		// 		selector.on('click', function(event) {
		// 			event.preventDefault();
		// 			var element = event.target;
		// 			var href = (event.target.href) ? event.target.href : $(event.target).find('.join')[0].href
		// 			$(".loading").toggle();
		// 			$.ajax({
		// 				url     : href,
		// 				type    : 'GET',
		// 				dataType: 'json',
		// 				success : function(data){
		// 						$(data.select).each(function(index, option){
		// 							if(!$('#campus').find("[value=\""+$(option).val()+"\"]").length){
		// 								$('#campus').append(option);
		// 							}
		// 						});
		// 						$('.events__container').append($(data.body));
		// 						$.fn.instantiateButton($('.event__get_more_container'))
		// 						$(element).parents('.event').remove();
		// 						window.demo = new Demo(document.querySelector('.events__container'));
		// 						window.demo.filter();
		// 						$(".loading").toggle();
		// 				}
		// 			});
		// 		});
		// 	}	
		// }
		// if($('.event__get_more_container')){
		// 	$.fn.instantiateButton($('.event__get_more_container'));	
		// }
	});

})(jQuery, window, document);
