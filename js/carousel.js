(function($){
	
	var Templates = {
		container: 	'<div class="carousel"></div>',
		content: '<div class="carousel-content"></div>',
		backBtn: '<a href="#" class="back-button">Prev</a>',
		nextBtn: '<a href="#" class="next-button">Next</a>'
	};
	
	/**
	 *  Creates a new Carousel from an unordered list of elements
	 *  
	 *  @param options options for the Carousel
	 *  @param options.itemsPerPage no of items to show per page
	 *  @param list unordered list element
	 */
	function Carousel(options, list){
		
		this.list = $(list);
		
		if(this.list.data("carousel")){
			this.list.data("carousel")._destroy();
		}
		this.list.data("carousel", this);
		
		this.settings = $.extend({
			itemsPerPage: 4,
			animate: false
		}, options);
		
		this.action = this.settings.animate ? "animate" : "css";
		
		this._init();
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._init = function(){
		var list = this.list;
		var settings = this.settings;
		
		var container = list.wrap(Templates.container).parent();
		var content = list.wrap(Templates.content).parent();
		var backBtn = $(Templates.backBtn).prependTo(container);
		var nextBtn = $(Templates.nextBtn).prependTo(container);
		var items = list.find(">li");
		
		// width of item + left and right margin
		var itemWidth = items.first().width() + (2 * 15);
		var noOfItems = items.length;
		var ulWidth = noOfItems * itemWidth;
		var contentWidth = settings.itemsPerPage * itemWidth;
		
		// width of carousel is width of content + left and right margin to accommodate the buttons
		var carouselWidth = contentWidth + (2 * 35);
		
		list.width(ulWidth);
		content.width(contentWidth);
		container.width(carouselWidth);
		
		this.contentWidth = contentWidth;
		this.loopIndex = 0;
		this.noOfLoops = Math.ceil(noOfItems/settings.itemsPerPage);
		
		backBtn.click($.proxy(this._goBack, this));
		nextBtn.click($.proxy(this._goForward, this));
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._goBack = function(e){
		e.preventDefault();
		
		if(this.loopIndex < 1){
			this.loopIndex = this.noOfLoops;
		}
		this._updateListPos(-this.contentWidth * (--this.loopIndex));
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._goForward = function(e){
		e.preventDefault();
		if(this.loopIndex >= this.noOfLoops - 1){
			this.loopIndex = -1;
		}
		this._updateListPos(-this.contentWidth * (++this.loopIndex));
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._updateListPos = function(pos){
		this.list[this.action]({"left": pos});
	}
	
	/**
	 *  @private
	 */
	Carousel.prototype._destroy = function(){
		var list = this.list;
		list.parent().parent().find(">a").remove();
		list.unwrap().unwrap();
		var self = this;
		// IE7 needs some redirection when deleting "this"
		setTimeout(function(){
			delete self;
		}, 100);
	}
	
	
	// jQuery plugin
	$.fn.Carousel = function(options){
		
		return this.each(function(){
			new Carousel(options, this);
		});
	}
})(jQuery);