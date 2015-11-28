(function($){
	var ithoughts_lightbox_opened = false;
	var images = $('[data-lightbox="true"]');
	ithoughts_lightbox_images = images;
	console.log(images);
	images.click(function(e){
		e.preventDefault();
		e.stopPropagation();
		startLightbox($(this));
	});

	function startLightbox($elem){
		ithoughts_lightbox_opened = true;
		console.log($elem);
		var $lightbox = $($.parseHTML('\
<div id="ithoughts_lightbox-lightboxContainer" class="'+ithoughts_lightbox.theme+'">\
<div id="ithoughts_lightbox-lightboxSubContainer">\
<div id="ithoughts_lightbox-header">\
<button id="ithoughts_lightbox-header-close">&times;</button>\
<h2></h2>\
</div>\
<div id="ithoughts_lightbox-subContainer">\
<button class="ithoughts_lightbox-left">&lt;</button>\
<div id="ithoughts_lightbox-container">\
</div>\
<button class="ithoughts_lightbox-right">&gt;</button>\
</div>\
</div>\
</div>')).css("opacity",0).animate({opacity: 1}, 500);
		$("body").append($lightbox);
		$lightboxSub = $lightbox.find("#ithoughts_lightbox-lightboxSubContainer");
		if(window.chrome && /android/i.test(navigator.userAgent)){
			console.log("chrome on android");
			$(window).resize(function(){
				$lightboxSub.stop().animate({height: $(window).height()});
			});
		}
		var buttons = {
			right: $lightbox.find(".ithoughts_lightbox-right"),
			left: $lightbox.find(".ithoughts_lightbox-left"),
			close: $lightbox.find("#ithoughts_lightbox-header-close")
		};
		var rotate;
		var index = images.index($elem);

		//Hide switch buttons if needed
		if(images.length < 2){
			console.log("Hide both buttons");
			buttons.right.css("opacity", 0);
			buttons.left.css("opacity", 0);
		} else {
			if(ithoughts_lightbox.loopbox === "1"){ // Loopbox, both directions are available
				rotate = function(indexIncrement){
					index += indexIncrement;
					index = index % images.length;
					return index;
				};
			} else {
				rotate = function(indexIncrement){
					index += indexIncrement;
					buttons.right.stop().animate({opacity: 1});
					buttons.left.stop().animate({opacity: 1});
					if(index <= 0){
						index = 0;
						buttons.left.stop().animate({opacity: 0});
					}
					else if(index >= images.length - 1){
						index = images.length - 1;
						buttons.right.stop().animate({opacity: 0});
					}
					return index;
				};
				if(index === 0){
					console.log("Hide left button");
					buttons.left.css("opacity", 0);
				} else if(index === images.length - 1){
					console.log("Hide right button");
					buttons.right.css("opacity", 0);
				}
			}
		}
		buttons.right.click(function(){
			rotate(1);
		});
		buttons.left.click(function(){
			rotate(-1);
		});

		$container = $lightbox.find("#ithoughts_lightbox-container");
		$container.append($.parseHTML('<img onload="jQuery(this).show();console.log(\'Loaded\');" style="display:none;" class="ithoughts_lightbox-img" src="' + ($elem[0].getAttribute("data-lightbox-fullwidth") || $elem[0].getAttribute("src")) + '">'))
		$header = $lightbox.find("#ithoughts_lightbox-header h2");
		buttons.close.click(function(e){closeLightbox(e, false)});
		window.onbeforeunload = function(e){closeLightbox(e, true)};
		window.onkeydown = function(e){
			if(e.keyCode == 27)
				closeLightbox(e, false);
		};

		function closeLightbox(event, isRefresh){
			if(ithoughts_lightbox_opened){
				ithoughts_lightbox_opened = false;
				$lightbox.find("#ithoughts_lightbox-header").addClass("closing");
				$lightbox.animate({opacity:0}, 500, function(){
					$lightbox.remove();
				});
				return false;
			}
		}
	}
})(jQuery);