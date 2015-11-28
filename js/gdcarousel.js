function gdCarousel(root, options){

    var self = this;
    defaultSettings = {
        time: {
            main: 2500,
            sub: 500,
            frame: 17
        },
        displayed: 5
    };
    if(!!options) {
        var time = {};
        if(!!options['time']){
            time = {
                main:   options['time']['main'] || defaultSettings.time.main,
                sub:    options['time']['sub'] || defaultSettings.time.sub,
                frame:  options['time']['frame'] || defaultSettings.time.frame
            };
        }else{
            time = {
                main:   defaultSettings.time.main,
                sub:    defaultSettings.time.sub,
                frame:  defaultSettings.time.frame
            };
        }
        this.settings = {
            time: time,
            displayed: options['displayed'] || defaultSettings.time.displayed
        };
    } else {
        this.settings = defaultSettings;
    }
   var attributes = {
        selector: root,
        root: document.getElementById(root)
    };
    attributes.root.className += ((attributes.root.className != "") ? " " : "") + "gdCarousel";
    attributes.list = attributes.root.children[0];
    attributes.items = attributes.list.children;
    attributes.width = attributes.items[0].offsetWidth + widthStrToInt(window.getComputedStyle(attributes.items[0]).marginLeft) * 2;
    attributes.originPersp = [attributes.width * this.settings.displayed / 2, attributes.root.offsetHeight / 2];
    this.pos = 0;
    if(attributes.items.length === 0)
        return;



    var functions = {
        rotateIndex: function(i, self) {
            var ret = i % attributes.items.length;
            while(ret < 0)
                ret += attributes.items.length;
            return ret;
        },

        rotate: function(self) {
            if(attributes.isRunning)
                return;
            attributes.isRunning = true;
            //TODO check promises syntax
            var inIndex = 0;
            var outIndex = 0;
            {//Start
                var center = attributes.root.querySelector('.center');
                if(!!center) {
                    center.className = center.className.replace("center", "");
                }
                for(var i = 0; i <= self.settings.displayed; i++) {
                    attributes.items[i].style.display = "inline-block";
                    attributes.items[i].style.opacity = 1;
                    if(i === parseInt(self.settings.displayed / 2) + 1) {
                        attributes.items[i].className = attributes.items[i].className + " center";
                    }
                }
                attributes.items[self.settings.displayed].style.opacity = 0;
                var rp = parseInt(functions.rotateIndex(self.pos + self.settings.displayed, self));
            }
            var timeElapsed = 0;
            self.before = +new Date();
            attributes.frame = setInterval(function(){
                if(timeElapsed < self.settings.time.sub){
                    //Running

                    var now = +new Date();
                    timeElapsed += (now - self.before);
                    self.before = now;
                    var percent = timeElapsed / self.settings.time.sub;
                    var ponderated = (Math.cos((percent + 1) * Math.PI) + 1) / 2;
                    //Out
                    attributes.items[0].style.opacity = 1- ponderated * 2.5;
                    //In
                    attributes.items[self.settings.displayed].style.opacity = ponderated * 2.5;
                    //console.log(timeElapsed, percent, ponderated);
                    {//Main
                        //Persp
                        attributes.list.style.perspectiveOrigin = attributes.originPersp[0] + (attributes.width * ponderated) + "px " + attributes.originPersp[1] + "px";
                        //Left
                        attributes.list.style.left = (-attributes.width * ponderated) + "px";
                    }
                } else {
                    //Ended
                    clearInterval(attributes.frame);
                    //				attributes.items[self.pos].style.display = "none";
                    attributes.list.style.left = "0px";
                    attributes.list.style.perspectiveOrigin = attributes.originPersp[0] + "px " + attributes.originPersp[1] + "px";
                    self.pos = functions.rotateIndex(self.pos + 1, self);
                    attributes.list.appendChild(attributes.list.removeChild(attributes.items[0])).style.display = "none";
                    attributes.isRunning = false;
                }
            }, self.settings.time.frame);
        },

        init: function(self) {
            attributes.list.style.perspectiveOrigin = attributes.originPersp[0] + "px " + attributes.originPersp[1] + "px";
            var len = attributes.items.length;
            for(var i = 0; i < len; i++){
                attributes.items[i].style.opacity = 0.01;
                attributes.items[i].style.display = "none";
            }
            var len = attributes.items.length;
            while(!attributes.items.length > self.settings.displayed) {
                for(var i = 0; i < len; i++) {
                    attributes.items.append(attributes.items[i].cloneNode(true));
                }
            }
            var len = attributes.items.length;
            for(var i = 0; i < len; i++) {
                attributes.list.appendChild(attributes.items[i]);
            }
            for(var i = 0; i < self.settings.displayed; i++) {
                var item = attributes.items[functions.rotateIndex(self.pos + i, self)];
                item.style.opacity = 0.99;
                item.style.display = "inline-block";
                if(parseInt(i + 1) === parseInt(self.settings.displayed / 2) + 1) {
                    item.className = item.className + " center";
                }
            }
        }
    };

    /* Object built
    console.log(this); /**/



    functions.init(self);

    if(options['autostart'] === true)
        attributes.main = setInterval(function(){functions.rotate(self)}, self.settings.time.main);

    attributes.root.onmouseover = function(){
        clearInterval(attributes.main);
    };
    attributes.root.onmouseout = function(){
        attributes.main = setInterval(function(){functions.rotate(self)}, self.settings.time.main);
    };
    //this.interval = setInterval(function(){functions.rotate(self)}, self.settings.time.main);
    //TODO convert unit to px/other?
    function widthStrToInt(input) {
        return parseInt(input);
    }







    this.stop = function(){
        clearInterval(attributes.main);
    };
    this.start = function(){
        attributes.main = setInterval(function(){functions.rotate(self)}, self.settings.time.main);
    };
    this.rotateNow = function(){
        self.stop();
        functions.rotate(self);
        self.start();
    };
};
