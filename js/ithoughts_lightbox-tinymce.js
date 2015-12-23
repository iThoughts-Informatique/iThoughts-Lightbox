(function($) {
	tinymce.PluginManager.add('ithoughts_lightbox_tinymce', function(editor, url) {
		editorG = editor;
		// Add a button that opens a window
		editor.addButton('lightbox', {
			title : editor.getLang('ithoughts_lightbox_tinymce.set_lightboxes'),
			image : url + '/icon/lightbox.png',
			onclick: lightboxfct
		});

		//CSS
		editor.contentCSS.push(url + "/../css/ithoughts_lightbox-admin.css");

		//fcts
		function lightboxfct(event){
			var elems = $(editor.getDoc()).find('img, a[data-mediatip-type="localimage"], a[data-mediatip-type="webimage"]');
			imageUrls = [];
			elems.each(function(index, elem){
				switch(elem.tagName){
					case "IMG":{
						imageUrls.push({
							image: elem.getAttribute("src"),
							element: elem,
							state: elem.getAttribute("data-lightbox")
						});
					} break;

					default:{
						var content = elem.getAttribute("data-mediatip-content");
						switch(elem.getAttribute("data-mediatip-type")){
							case "localimage":{
								try{
									content = JSON.parse(content)["url"];
									imageUrls.push({
										image: content,
										element: elem,
										state: elem.getAttribute("data-lightbox")
									});
								}catch(e){
									console.error("Invalid local image content: ", content, e);
								}
							} break;

							case "webimage":{
								imageUrls.push({
									image: content,
									element: elem,
									state: elem.getAttribute("data-lightbox")
								});
							} break;
						}
					}
				}
			});
			console.log(imageUrls);
			var newDom = $($.parseHTML('<div id="ithoughts_lightbox-form-container" style="opacity: 0">\
<div style="z-index: 100100;" id="mce-modal-block" class="mce-reset mce-fade mce-in">\
</div>\
<div aria-label="Configure lightboxes" role="dialog" style="border-width: 1px; z-index: 999999; width: 500px; height: 400px; left: 698.5px; top: 82px;" class="mce-container mce-panel mce-floatpanel mce-window mce-in" hidefocus="1" id="ithoughts_lightbox-form">\
<div class="mce-reset" role="application">\
<div class="mce-window-head">\
<div class="mce-title">\
Configure lightboxes</div>\
<button aria-hidden="true" class="mce-close ithoughts_lightbox-tinymce-discard" type="button">×</button>\
</div>\
<div class="mce-container-body mce-window-body">\
<div class="mce-container mce-form mce-first mce-last">\
<div class="mce-container-body" style="height: 100%;">\
<form>\
<div style="padding:10px;flex:0 0 auto;display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content: space-between;">\
</div>\
</form>\
</div>\
</div>\
</div>\
<div class="mce-container mce-panel mce-foot" tabindex="-1">\
<div class="mce-container-body">\
<div>\
</div>\
<div aria-labelledby="mceu_78" class="mce-widget mce-btn mce-primary mce-first mce-btn-has-text" role="button" tabindex="-1">\
<button role="presentation" style="height: 100%; width: 100%;" tabindex="-1" type="button" id="ithoughts_lightbox-tinymce-validate">\
Ok						</button>\
</div>\
<div aria-labelledby="mceu_79" class="mce-widget mce-btn mce-last mce-btn-has-text" role="button" tabindex="-1">\
<button role="presentation" style="height: 100%; width: 100%;" tabindex="-1" type="button" class="ithoughts_lightbox-tinymce-discard">\
Discard						</button>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>')).animate({opacity: 1}, 500);
			$("body").append(newDom);
			newDom[0].finish = (function(){
				var domC = newDom;
				return function(data){
					domC.animate({opacity:0}, 500, function(){
						domC.remove();
					});
					console.log(data);
					for(var i = 0; i < data.length; i++){
						if(data[i]["state"] == null)
							data[i]["element"].removeAttribute("data-lightbox");
						else
							data[i]["element"].setAttribute("data-lightbox", data[i]["state"]);
					}
				}
			})();
			var bodyContainer = $('#ithoughts_lightbox-form-container form div');
			for(var i = 0; i < imageUrls.length; i++){
				bodyContainer.append('<div class="thumb-image lightbox-' + ((imageUrls[i]['state'] != null && (imageUrls[i]['state'] == "true" || imageUrls[i]['state'] == "false")) ? imageUrls[i]['state'] : 'default') + '" data-image-index="' + i + '"><img src="' + imageUrls[i]["image"] + '"/></div>');
			}
			var cycle = ["true", "false", "default"];
			newDom.find(".thumb-image").click(function(){
				var indexState = -1;
				var $this = $(this);
				for(var i = 0; i < cycle.length; i++){
					if($this.hasClass("lightbox-" + cycle[i])){
						indexState = i;
						break;
					}
				}
				for(var i = 0; i < cycle.length; i++){
					$this.removeClass("lightbox-" + cycle[i]);
				}
				$this.addClass("lightbox-" + cycle[(indexState + 1) % cycle.length]);
			});
			$("#ithoughts_lightbox-tinymce-validate").click(function(){
				bodyContainer.find(".thumb-image").each(function(index, elem){
					var state;
					$elem = $(elem);
					if($elem.hasClass("lightbox-true"))
						state = true;
					if($elem.hasClass("lightbox-false"))
						state = false;
					if($elem.hasClass("lightbox-default"))
						state = null;
					imageUrls[elem.getAttribute("data-image-index")]["state"] = state;
				})
				$("#ithoughts_lightbox-form-container")[0].finish(imageUrls);
			});
			$(".ithoughts_lightbox-tinymce-discard").click(function(){
				$("#ithoughts_lightbox-form-container")[0].finish()
			});
		}
	});
})(jQuery);