var flowCarousel = function(baseSelector){
    var items = jQuery(baseSelector + " li");
    var displayed = 5;
    var width;
    var originPersp = [];// Variable nous permettant de garder en mémoire l'origine de la perspective à faire varier
    
    function duplicateItems()
    {
        var i = 0;
        while(!(jQuery(items).length > displayed))
            items = items.add(jQuery(items).clone());
    }
    
    function rotateIndex(i)
    {
        var ret = i % items.length;
        while(ret < 0)
            ret += items.length;
        return ret;
    }
 
    function init()
    {
        width = jQuery(items[0]).width;
	originPersp = [width * displayed / 2, jQuery(baseSelector).height() / 2];// Sur x, l'origine de la perspective doit être au milieu des "displayed" éléments de la liste. Sur y, on centre verticalement.
        duplicateItems();
        jQuery(baseSelector + " ul").append(items).css("perspectiveOrigin", originPersp[0] + "px " + originPersp[1] + "px");// On définit manuellement l'origine de la perspective au milieu du viewport
        jQuery(items).css({
            opacity: 0,
            display: "none"
        });
        for(var i = 0; i < displayed; i++)
            jQuery(items[rotateIndex(pos + i)]).css({
                opacity: 1,
                display: "inline-block"
            }).addClass((parseInt(i + 1) === parseInt(displayed/ 2) + 1) ? "center" : "");// La condition ternaire nous permet d'ajouter la classe ".center" si l'élément est le central, et sinon la classe "", c'est à dire aucune.
    }
 
    function rotate()
    {
        jQuery(baseSelector + " ul").animate(
            {left: (-width) + "px"},
            {
                duration: 500,
                start: function(){
		    jQuery(".center").removeClass("center");// On réinitialise l'élément considéré comme central
		    for(var i = 0; i < displayed; i++)
		    {
			var ri = parseInt(rotateIndex(pos + i));
			jQuery(items[ri]).css({
                            display: "inline-block",							    opacity: 1
                        }).addClass((parseInt(i) === parseInt(displayed / 2) + 1) ? "center" : "");// La dernière partie nous permet de re-définir l'élément central.
		    }// Cette boucle nous permet de nous assurer que le carrousel reprendra son état normal à chaque défilement. En effet, au changement d'onglet, certaines manipulations du DOM ne sont pas prises en compte, et on peut se retrouver avec un carrousel de 2, 3 ou 4 éléments alors que nous en voulions 5. De cette façon, on force la reprise systématique à 5 éléments.
                    var rp = parseInt(rotateIndex(pos + displayed));
                    jQuery(this).append(jQuery(items[rp]).detach());
                    jQuery(items[rp]).css("display", "inline-block");
                },
		progress: function(a, p, c ){// Puisqu'il est impossible d'utiliser la fonction jQuery "animate" avec l'attribut "perspective-origin", on le fait manuellement.
		    jQuery(this).css("perspectiveOrigin", (originPersp[0] + (width * p)) + "px " + originPersp[1] + "px");// On re-calcule l'origine de la perspective en rectifiant le défilement grâce à (width * p)
		},
                complete: function(){
                    jQuery(items[pos]).css("display", "none");
                    jQuery(this).css("left", "0px");
		    jQuery(this).css("perspectiveOrigin", originPersp[0] + "px " + originPersp[1] + "px");// On réinitialise l'origine de la perspective avec le replacement du slider.
                    pos = rotateIndex(pos + 1);
                },
                queue: false
            }
        );
    }
	init();
}