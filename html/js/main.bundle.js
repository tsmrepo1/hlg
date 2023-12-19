/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 253:
/***/ (() => {

/*!
*  - v1.6.1
* Homepage: https://bqworks.net/slider-pro/
* Author: bqworks
* Author URL: https://bqworks.net/
*/
;(function( window, $ ) {

	"use strict";

	// Static methods for Slider Pro
	$.SliderPro = {

		// List of added modules
		modules: [],

		// Add a module by extending the core prototype
		addModule: function( name, module ) {
			this.modules.push( name );
			$.extend( SliderPro.prototype, module );
		}
	};

	// namespace
	var NS = $.SliderPro.namespace = 'SliderPro';

	var SliderPro = function( instance, options ) {

		// Reference to the slider instance
		this.instance = instance;

		// Reference to the slider jQuery element
		this.$slider = $( this.instance );

		// Reference to the slides (sp-slides) jQuery element
		this.$slides = null;

		// Reference to the mask (sp-mask) jQuery element
		this.$slidesMask = null;

		// Reference to the slides (sp-slides-container) jQuery element
		this.$slidesContainer = null;

		// Array of SliderProSlide objects, ordered by their DOM index
		this.slides = [];

		// Array of SliderProSlide objects, ordered by their left/top position in the slider.
		// This will be updated continuously if the slider is loopable.
		this.slidesOrder = [];

		// Holds the options passed to the slider when it was instantiated
		this.options = options;

		// Holds the final settings of the slider after merging the specified
		// ones with the default ones.
		this.settings = {};

		// Another reference to the settings which will not be altered by breakpoints or by other means
		this.originalSettings = {};

		// Reference to the original 'gotoSlide' method
		this.originalGotoSlide = null;

		// The index of the currently selected slide (starts with 0)
		this.selectedSlideIndex = 0;

		// The index of the previously selected slide
		this.previousSlideIndex = 0;

		// Indicates the position of the slide considered to be in the middle.
		// If there are 5 slides (0, 1, 2, 3, 4) the middle position will be 2.
		// If there are 6 slides (0, 1, 2, 3, 4, 5) the middle position will be approximated to 2.
		this.middleSlidePosition = 0;

		// Indicates the type of supported transition (CSS3 2D, CSS3 3D or JavaScript)
		this.supportedAnimation = null;

		// Indicates the required vendor prefix for CSS (i.e., -webkit, -moz, etc.)
		this.vendorPrefix = null;

		// Indicates the name of the CSS transition's complete event (i.e., transitionend, webkitTransitionEnd, etc.)
		this.transitionEvent = null;

		// Indicates the 'left' or 'top' position, depending on the orientation of the slides
		this.positionProperty = null;

		// Indicates the 'width' or 'height', depending on the orientation of the slides
		this.sizeProperty = null;

		// Indicates if the current browser is IE
		this.isIE = null;

		// The position of the slides container
		this.slidesPosition = 0;

		// The total width/height of the slides
		this.slidesSize = 0;

		// The average width/height of a slide
		this.averageSlideSize = 0;

		// The width of the individual slide
		this.slideWidth = 0;

		// The height of the individual slide
		this.slideHeight = 0;

		// Reference to the old slide width, used to check if the width has changed
		this.previousSlideWidth = 0;

		// Reference to the old slide height, used to check if the height has changed
		this.previousSlideHeight = 0;
		
		// Reference to the old window width, used to check if the window width has changed
		this.previousWindowWidth = 0;
		
		// Reference to the old window height, used to check if the window height has changed
		this.previousWindowHeight = 0;

		// Property used for deferring the resizing of the slider
		this.allowResize = true;

		// Unique ID to be used for event listening
		this.uniqueId = new Date().valueOf();

		// Stores size breakpoints
		this.breakpoints = [];

		// Indicates the current size breakpoint
		this.currentBreakpoint = -1;

		// An array of shuffled indexes, based on which the slides will be shuffled
		this.shuffledIndexes = [];

		// Initialize the slider
		this._init();
	};

	SliderPro.prototype = {

		// The starting place for the slider
		_init: function() {
			var that = this;

			this.supportedAnimation = SliderProUtils.getSupportedAnimation();
			this.vendorPrefix = SliderProUtils.getVendorPrefix();
			this.transitionEvent = SliderProUtils.getTransitionEvent();
			this.isIE = SliderProUtils.checkIE();

			// Remove the 'sp-no-js' when the slider's JavaScript code starts running
			this.$slider.removeClass( 'sp-no-js' );

			// Add the 'ios' class if it's an iOS device
			if ( window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
				this.$slider.addClass( 'ios' );
			}

			// Check if IE (older than 11) is used and add the version number as a class to the slider since
			// older IE versions might need CSS tweaks.
			var rmsie = /(msie) ([\w.]+)/,
				ieVersion = rmsie.exec( window.navigator.userAgent.toLowerCase() );
			
			if ( this.isIE ) {
				this.$slider.addClass( 'ie' );
			}

			if ( ieVersion !== null ) {
				this.$slider.addClass( 'ie' + parseInt( ieVersion[2], 10 ) );
			}

			// Set up the slides containers
			// slider-pro > sp-slides-container > sp-mask > sp-slides > sp-slide
			this.$slidesContainer = $( '<div class="sp-slides-container"></div>' ).appendTo( this.$slider );
			this.$slidesMask = $( '<div class="sp-mask"></div>' ).appendTo( this.$slidesContainer );
			this.$slides = this.$slider.find( '.sp-slides' ).appendTo( this.$slidesMask );
			this.$slider.find( '.sp-slide' ).appendTo( this.$slides );
			
			var modules = $.SliderPro.modules;

			// Merge the modules' default settings with the core's default settings
			if ( typeof modules !== 'undefined' ) {
				for ( var i = 0; i < modules.length; i++ ) {
					var defaults = modules[ i ].substring( 0, 1 ).toLowerCase() + modules[ i ].substring( 1 ) + 'Defaults';

					if ( typeof this[ defaults ] !== 'undefined' ) {
						$.extend( this.defaults, this[ defaults ] );
					}
				}
			}

			// Merge the specified setting with the default ones
			this.settings = $.extend( {}, this.defaults, this.options );

			// Initialize the modules
			if ( typeof modules !== 'undefined' ) {
				for ( var j = 0; j < modules.length; j++ ) {
					if ( typeof this[ 'init' + modules[ j ] ] !== 'undefined' ) {
						this[ 'init' + modules[ j ] ]();
					}
				}
			}

			// Keep a reference of the original settings and use it
			// to restore the settings when the breakpoints are used.
			this.originalSettings = $.extend( {}, this.settings );

			// Get the reference to the 'gotoSlide' method
			this.originalGotoSlide = this.gotoSlide;

			// Parse the breakpoints object and store the values into an array,
			// sorting them in ascending order based on the specified size.
			if ( this.settings.breakpoints !== null ) {
				for ( var sizes in this.settings.breakpoints ) {
					this.breakpoints.push({ size: parseInt( sizes, 10 ), properties:this.settings.breakpoints[ sizes ] });
				}

				this.breakpoints = this.breakpoints.sort(function( a, b ) {
					return a.size >= b.size ? 1: -1;
				});
			}

			// Set which slide should be selected initially
			this.selectedSlideIndex = this.settings.startSlide;

			// Shuffle/randomize the slides
			if ( this.settings.shuffle === true ) {
				var slides = this.$slides.find( '.sp-slide' ),
					shuffledSlides = [];

				// Populate the 'shuffledIndexes' with index numbers
				slides.each(function( index ) {
					that.shuffledIndexes.push( index );
				});

				for ( var k = this.shuffledIndexes.length - 1; k > 0; k-- ) {
					var l = Math.floor( Math.random() * ( k + 1 ) ),
						temp = this.shuffledIndexes[ k ];

					this.shuffledIndexes[ k ] = this.shuffledIndexes[ l ];
					this.shuffledIndexes[ l ] = temp;
				}

				// Reposition the slides based on the order of the indexes in the
				// 'shuffledIndexes' array
				$.each( this.shuffledIndexes, function( index, element ) {
					shuffledSlides.push( slides[ element ] );
				});
				
				// Append the sorted slides to the slider
				this.$slides.empty().append( shuffledSlides ) ;
			}
			
			// Resize the slider when the browser window resizes.
			// Also, deffer the resizing in order to not allow multiple
			// resizes in a 200 milliseconds interval.
			$( window ).on( 'resize.' + this.uniqueId + '.' + NS, function() {
			
				// Get the current width and height of the window
				var newWindowWidth = $( window ).width(),
					newWindowHeight = $( window ).height();
				
				// If the resize is not allowed yet or if the window size hasn't changed (this needs to be verified
				// because in IE8 and lower the resize event is triggered whenever an element from the page changes
				// its size) return early.
				if ( that.allowResize === false ||
					( that.previousWindowWidth === newWindowWidth && that.previousWindowHeight === newWindowHeight ) ) {
					return;
				}
				
				// Assign the new values for the window width and height
				that.previousWindowWidth = newWindowWidth;
				that.previousWindowHeight = newWindowHeight;
			
				that.allowResize = false;

				setTimeout(function() {
					that.resize();
					that.allowResize = true;
				}, 200 );
			});

			// Resize the slider when the 'update' method is called.
			this.on( 'update.' + NS, function() {

				// Reset the previous slide width
				that.previousSlideWidth = 0;

				// Some updates might require a resize
				that.resize();
			});

			this.update();

			// add the 'sp-selected' class to the initially selected slide
			this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );

			// Fire the 'init' event
			this.trigger({ type: 'init' });
			if ( $.isFunction( this.settings.init ) ) {
				this.settings.init.call( this, { type: 'init' });
			}
		},

		// Update the slider by checking for setting changes and for slides
		// that weren't initialized yet.
		update: function() {
			var that = this;

			// Check the current slider orientation and reset CSS that might have been
			// added for a different orientation, since the orientation can be changed
			// at runtime.
			if ( this.settings.orientation === 'horizontal' ) {
				this.$slider.removeClass( 'sp-vertical' ).addClass( 'sp-horizontal' );
				this.$slider.css({ 'height': '', 'max-height': '' });
				this.$slides.find( '.sp-slide' ).css( 'top', '' );
			} else if ( this.settings.orientation === 'vertical' ) {
				this.$slider.removeClass( 'sp-horizontal' ).addClass( 'sp-vertical' );
				this.$slides.find( '.sp-slide' ).css( 'left', '' );
			}

			if ( this.settings.rightToLeft === true ) {
				this.$slider.addClass( 'sp-rtl' );
			} else {
				this.$slider.removeClass( 'sp-rtl' );
			}

			this.positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
			this.sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';

			// Reset the 'gotoSlide' method
			this.gotoSlide = this.originalGotoSlide;

			// Loop through the array of SliderProSlide objects and if a stored slide is found
			// which is not in the DOM anymore, destroy that slide.
			for ( var i = this.slides.length - 1; i >= 0; i-- ) {
				if ( this.$slider.find( '.sp-slide[data-index="' + i + '"]' ).length === 0 ) {
					var slide = this.slides[ i ];

					slide.off( 'imagesLoaded.' + NS );
					slide.destroy();
					this.slides.splice( i, 1 );
				}
			}

			this.slidesOrder.length = 0;

			// Loop through the list of slides and initialize newly added slides if any,
			// and reset the index of each slide.
			this.$slider.find( '.sp-slide' ).each(function( index ) {
				var $slide = $( this );

				if ( typeof $slide.attr( 'data-init' ) === 'undefined' ) {
					that._createSlide( index, $slide );
				} else {
					that.slides[ index ].setIndex( index );
				}

				that.slidesOrder.push( index );
			});

			// Calculate the position/index of the middle slide
			this.middleSlidePosition = parseInt( ( that.slidesOrder.length - 1 ) / 2, 10 );

			// Arrange the slides in a loop
			if ( this.settings.loop === true ) {
				this._updateSlidesOrder();
			}

			// Fire the 'update' event
			this.trigger({ type: 'update' });
			if ( $.isFunction( this.settings.update ) ) {
				this.settings.update.call( this, { type: 'update' } );
			}
		},

		// Create a SliderProSlide instance for the slide passed as a jQuery element
		_createSlide: function( index, element ) {
			var that = this,
				slide = new SliderProSlide( $( element ), index, this.settings );

			this.slides.splice( index, 0, slide );

			slide.on( 'imagesLoaded.' + NS, function( event ) {
				if ( that.settings.autoSlideSize === true ) {
					if ( that.$slides.hasClass( 'sp-animated' ) === false ) {
						that._resetSlidesPosition();
					}

					that._calculateSlidesSize();
				}

				if ( that.settings.autoHeight === true && event.index === that.selectedSlideIndex ) {
					that._resizeHeightTo( slide.getSize().height);
				}
			});
		},

		// Arrange the slide elements in a loop inside the 'slidesOrder' array
		_updateSlidesOrder: function() {
			var	slicedItems,
				i,

				// Calculate the distance between the selected element and the middle position
				distance = $.inArray( this.selectedSlideIndex, this.slidesOrder ) - this.middleSlidePosition;

			// If the distance is negative it means that the selected slider is before the middle position, so
			// slides from the end of the array will be added at the beginning, in order to shift the selected slide
			// forward.
			// 
			// If the distance is positive, slides from the beginning of the array will be added at the end.
			if ( distance < 0 ) {
				slicedItems = this.slidesOrder.splice( distance, Math.abs( distance ) );

				for ( i = slicedItems.length - 1; i >= 0; i-- ) {
					this.slidesOrder.unshift( slicedItems[ i ] );
				}
			} else if ( distance > 0 ) {
				slicedItems = this.slidesOrder.splice( 0, distance );

				for ( i = 0; i <= slicedItems.length - 1; i++ ) {
					this.slidesOrder.push( slicedItems[ i ] );
				}
			}
		},

		// Set the left/top position of the slides based on their position in the 'slidesOrder' array
		_updateSlidesPosition: function() {
			var selectedSlidePixelPosition = parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ),
				slide,
				$slideElement,
				slideIndex,
				previousPosition = selectedSlidePixelPosition,
				directionMultiplier,
				slideSize;
			
			if ( this.settings.autoSlideSize === true ) {
				if ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) {
					for ( slideIndex = this.middleSlidePosition; slideIndex >= 0; slideIndex-- ) {
						slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
						$slideElement = slide.$slide;
						$slideElement.css( this.positionProperty, previousPosition );
						previousPosition = parseInt( $slideElement.css( this.positionProperty ), 10 ) + slide.getSize()[ this.sizeProperty ] + this.settings.slideDistance;
					}

					previousPosition = selectedSlidePixelPosition;

					for ( slideIndex = this.middleSlidePosition + 1; slideIndex < this.slidesOrder.length; slideIndex++ ) {
						slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
						$slideElement = slide.$slide;
						$slideElement.css( this.positionProperty, previousPosition - ( slide.getSize()[ this.sizeProperty ] + this.settings.slideDistance ) );
						previousPosition = parseInt( $slideElement.css( this.positionProperty ), 10 );
					}
				} else {
					for ( slideIndex = this.middleSlidePosition - 1; slideIndex >= 0; slideIndex-- ) {
						slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
						$slideElement = slide.$slide;
						$slideElement.css( this.positionProperty, previousPosition - ( slide.getSize()[ this.sizeProperty ] + this.settings.slideDistance ) );
						previousPosition = parseInt( $slideElement.css( this.positionProperty ), 10 );
					}

					previousPosition = selectedSlidePixelPosition;

					for ( slideIndex = this.middleSlidePosition; slideIndex < this.slidesOrder.length; slideIndex++ ) {
						slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
						$slideElement = slide.$slide;
						$slideElement.css( this.positionProperty, previousPosition );
						previousPosition = parseInt( $slideElement.css( this.positionProperty ), 10 ) + slide.getSize()[ this.sizeProperty ] + this.settings.slideDistance;
					}
				}
			} else {
				directionMultiplier = ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) ? -1 : 1;
				slideSize = ( this.settings.orientation === 'horizontal' ) ? this.slideWidth : this.slideHeight;

				for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
					$slideElement = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ slideIndex ] );
					$slideElement.css( this.positionProperty, selectedSlidePixelPosition + directionMultiplier * ( slideIndex - this.middleSlidePosition  ) * ( slideSize + this.settings.slideDistance ) );
				}
			}
		},

		// Set the left/top position of the slides based on their position in the 'slidesOrder' array,
		// and also set the position of the slides container.
		_resetSlidesPosition: function() {
			var previousPosition = 0,
				slide,
				$slideElement,
				slideIndex,
				selectedSlideSize,
				directionMultiplier,
				slideSize;

			if ( this.settings.autoSlideSize === true ) {
				if ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) {
					for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
						slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
						$slideElement = slide.$slide;
						$slideElement.css( this.positionProperty, previousPosition - ( slide.getSize()[ this.sizeProperty ] + this.settings.slideDistance ) );
						previousPosition = parseInt( $slideElement.css( this.positionProperty ), 10 );
					}
				} else {
					for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
						slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
						$slideElement = slide.$slide;
						$slideElement.css( this.positionProperty, previousPosition );
						previousPosition = parseInt( $slideElement.css( this.positionProperty ), 10 ) + slide.getSize()[ this.sizeProperty ] + this.settings.slideDistance;
					}
				}

				selectedSlideSize = this.getSlideAt( this.selectedSlideIndex ).getSize()[ this.sizeProperty ];
			} else {
				directionMultiplier = ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) === true ? -1 : 1;
				slideSize = ( this.settings.orientation === 'horizontal' ) ? this.slideWidth : this.slideHeight;
 
				for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
					$slideElement = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ slideIndex ] );
					$slideElement.css( this.positionProperty, directionMultiplier * slideIndex * ( slideSize + this.settings.slideDistance ) );
				}

				selectedSlideSize = slideSize;
			}

			var selectedSlideOffset = this.settings.centerSelectedSlide === true && this.settings.visibleSize !== 'auto' ? Math.round( ( parseInt( this.$slidesMask.css( this.sizeProperty ), 10 ) - selectedSlideSize ) / 2 ) : 0,
				newSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + selectedSlideOffset;
			
			this._moveTo( newSlidesPosition, true );
		},

		// Calculate the total size of the slides and the average size of a single slide
		_calculateSlidesSize: function() {
			if ( this.settings.autoSlideSize === true ) {
				var firstSlide = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ 0 ] ),
					firstSlidePosition = parseInt( firstSlide.css( this.positionProperty ), 10 ),
					lastSlide = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ this.slidesOrder.length - 1 ] ),
					lastSlidePosition = parseInt( lastSlide.css( this.positionProperty ), 10 ) + ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ? -1 : 1 ) * parseInt( lastSlide.css( this.sizeProperty ), 10 );
				
				this.slidesSize = Math.abs( lastSlidePosition - firstSlidePosition );
				this.averageSlideSize = Math.round( this.slidesSize / this.slides.length );
			} else {
				this.slidesSize = ( ( this.settings.orientation === 'horizontal' ? this.slideWidth : this.slideHeight ) + this.settings.slideDistance ) * this.slides.length - this.settings.slideDistance;
				this.averageSlideSize = this.settings.orientation === 'horizontal' ? this.slideWidth : this.slideHeight;
			}
		},

		// Called when the slider needs to resize
		resize: function() {
			var that = this;

			// Check if the current window width is bigger than the biggest breakpoint
			// and if necessary reset the properties to the original settings.
			// 
			// If the window width is smaller than a certain breakpoint, apply the settings specified
			// for that breakpoint but only after merging them with the original settings
			// in order to make sure that only the specified settings for the breakpoint are applied
			if ( this.settings.breakpoints !== null && this.breakpoints.length > 0 ) {
				if ( $( window ).width() > this.breakpoints[ this.breakpoints.length - 1 ].size && this.currentBreakpoint !== -1 ) {
					this.currentBreakpoint = -1;
					this._setProperties( this.originalSettings, false );
				} else {
					for ( var i = 0, n = this.breakpoints.length; i < n; i++ ) {
						if ( $( window ).width() <= this.breakpoints[ i ].size ) {
							if ( this.currentBreakpoint !== this.breakpoints[ i ].size ) {
								var eventObject = { type: 'breakpointReach', size: this.breakpoints[ i ].size, settings: this.breakpoints[ i ].properties };
								this.trigger( eventObject );
								if ( $.isFunction( this.settings.breakpointReach ) )
									this.settings.breakpointReach.call( this, eventObject );

								this.currentBreakpoint = this.breakpoints[ i ].size;
								var settings = $.extend( {}, this.originalSettings, this.breakpoints[ i ].properties );
								this._setProperties( settings, false );
								
								return;
							}

							break;
						}
					}
				}
			}

			// Set the width of the main slider container based on whether or not the slider is responsive,
			// full width or full size
			if ( this.settings.responsive === true ) {
				if ( ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) &&
					( this.settings.visibleSize === 'auto' || this.settings.visibleSize !== 'auto' && this.settings.orientation === 'vertical' )
				) {
					this.$slider.css( 'margin', 0 );
					this.$slider.css({ 'width': $( window ).width(), 'max-width': '', 'marginLeft': - this.$slider.offset().left });
				} else {
					this.$slider.css({ 'width': '100%', 'max-width': this.settings.width, 'marginLeft': '' });
				}
			} else {
				this.$slider.css({ 'width': this.settings.width });
			}

			// Calculate the aspect ratio of the slider
			if ( this.settings.aspectRatio === -1 ) {
				this.settings.aspectRatio = this.settings.width / this.settings.height;
			}
			
			// Initially set the slide width to the size of the slider.
			// Later, this will be set to less if there are multiple visible slides.
			this.slideWidth = this.$slider.width();

			// Set the height to the same size as the browser window if the slider is set to be 'fullWindow',
			// or calculate the height based on the width and the aspect ratio.
			if ( this.settings.forceSize === 'fullWindow' ) {
				this.slideHeight = $( window ).height();
			} else {
				this.slideHeight = isNaN( this.settings.aspectRatio ) ? this.settings.height : this.slideWidth / this.settings.aspectRatio;
			}

			// Resize the slider only if the size of the slider has changed
			// If it hasn't, return.
			if ( this.previousSlideWidth !== this.slideWidth ||
				this.previousSlideHeight !== this.slideHeight ||
				this.settings.visibleSize !== 'auto' ||
				this.$slider.outerWidth() > this.$slider.parent().width() ||
				this.$slider.width() !== this.$slidesMask.width()
			) {
				this.previousSlideWidth = this.slideWidth;
				this.previousSlideHeight = this.slideHeight;
			} else {
				return;
			}

			this._resizeSlides();

			// Set the initial size of the mask container to the size of an individual slide
			this.$slidesMask.css({ 'width': this.slideWidth, 'height': this.slideHeight });

			// Adjust the height if it's set to 'auto'
			if ( this.settings.autoHeight === true ) {

				// Delay the resizing of the height to allow for other resize handlers
				// to execute first before calculating the final height of the slide
				setTimeout( function() {
					that._resizeHeight();
				}, 1 );
			} else {
				this.$slidesMask.css( this.vendorPrefix + 'transition', '' );
			}

			// The 'visibleSize' option can be set to fixed or percentage size to make more slides
			// visible at a time.
			// By default it's set to 'auto'.
			if ( this.settings.visibleSize !== 'auto' ) {
				if ( this.settings.orientation === 'horizontal' ) {

					// If the size is forced to full width or full window, the 'visibleSize' option will be
					// ignored and the slider will become as wide as the browser window.
					if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css( 'margin', 0 );
						this.$slider.css({ 'width': $( window ).width(), 'max-width': '', 'marginLeft': - this.$slider.offset().left });
					} else {
						this.$slider.css({ 'width': this.settings.visibleSize, 'max-width': '100%', 'marginLeft': 0 });
					}
					
					this.$slidesMask.css( 'width', this.$slider.width() );
				} else {

					// If the size is forced to full window, the 'visibleSize' option will be
					// ignored and the slider will become as high as the browser window.
					if ( this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css({ 'height': $( window ).height(), 'max-height': '' });
					} else {
						this.$slider.css({ 'height': this.settings.visibleSize, 'max-height': '100%' });
					}

					this.$slidesMask.css( 'height', this.$slider.height() );
				}
			}

			this._resetSlidesPosition();
			this._calculateSlidesSize();

			// Fire the 'sliderResize' event
			this.trigger({ type: 'sliderResize' });
			if ( $.isFunction( this.settings.sliderResize ) ) {
				this.settings.sliderResize.call( this, { type: 'sliderResize' });
			}
		},

		// Resize each individual slide
		_resizeSlides: function() {
			var slideWidth = this.slideWidth,
				slideHeight = this.slideHeight;

			if ( this.settings.autoSlideSize === true ) {
				if ( this.settings.orientation === 'horizontal' ) {
					slideWidth = 'auto';
				} else if ( this.settings.orientation === 'vertical' ) {
					slideHeight = 'auto';
				}
			} else if ( this.settings.autoHeight === true ) {
				slideHeight = 'auto';
			}

			// Loop through the existing slides and reset their size.
			$.each( this.slides, function( index, element ) {
				element.setSize( slideWidth, slideHeight );
			});
		},

		// Resize the height of the slider to the height of the selected slide.
		// It's used when the 'autoHeight' option is set to 'true'.
		_resizeHeight: function() {
			var that = this,
				selectedSlide = this.getSlideAt( this.selectedSlideIndex );

			this._resizeHeightTo( selectedSlide.getSize().height );
		},

		// Open the slide at the specified index
		gotoSlide: function( index ) {
			if ( index === this.selectedSlideIndex || typeof this.slides[ index ] === 'undefined' ) {
				return;
			}

			var that = this;

			this.previousSlideIndex = this.selectedSlideIndex;
			this.selectedSlideIndex = index;

			// Re-assign the 'sp-selected' class to the currently selected slide
			this.$slides.find( '.sp-selected' ).removeClass( 'sp-selected' );
			this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );

			// If the slider is loopable reorder the slides to have the selected slide in the middle
			// and update the slides' position.
			if ( this.settings.loop === true ) {
				this._updateSlidesOrder();
				this._updateSlidesPosition();
			}

			// Adjust the height of the slider
			if ( this.settings.autoHeight === true ) {
				this._resizeHeight();
			}

			var selectedSlideOffset = this.settings.centerSelectedSlide === true && this.settings.visibleSize !== 'auto' ? Math.round( ( parseInt( this.$slidesMask.css( this.sizeProperty ), 10 ) - this.getSlideAt( this.selectedSlideIndex ).getSize()[ this.sizeProperty ] ) / 2 ) : 0,
				newSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + selectedSlideOffset;

			// Move the slides container to the new position
			this._moveTo( newSlidesPosition, false, function() {
				that._resetSlidesPosition();

				// Fire the 'gotoSlideComplete' event
				that.trigger({ type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex });
				if ( $.isFunction( that.settings.gotoSlideComplete ) ) {
					that.settings.gotoSlideComplete.call( that, { type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex } );
				}
			});

			// Fire the 'gotoSlide' event
			this.trigger({ type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
			if ( $.isFunction( this.settings.gotoSlide ) ) {
				this.settings.gotoSlide.call( this, { type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex } );
			}
		},

		// Open the next slide
		nextSlide: function() {
			var index = ( this.selectedSlideIndex >= this.getTotalSlides() - 1 ) ? 0 : ( this.selectedSlideIndex + 1 );
			this.gotoSlide( index );
		},

		// Open the previous slide
		previousSlide: function() {
			var index = this.selectedSlideIndex <= 0 ? ( this.getTotalSlides() - 1 ) : ( this.selectedSlideIndex - 1 );
			this.gotoSlide( index );
		},

		// Move the slides container to the specified position.
		// The movement can be instant or animated.
		_moveTo: function( position, instant, callback ) {
			var that = this,
				css = {};

			if ( position === this.slidesPosition ) {
				return;
			}
			
			this.slidesPosition = position;
			
			if ( ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) && this.isIE === false ) {
				var transition,
					left = this.settings.orientation === 'horizontal' ? position : 0,
					top = this.settings.orientation === 'horizontal' ? 0 : position;

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				if ( typeof instant !== 'undefined' && instant === true ) {
					transition = '';
				} else {
					this.$slides.addClass( 'sp-animated' );
					transition = this.vendorPrefix + 'transform ' + this.settings.slideAnimationDuration / 1000 + 's';

					this.$slides.on( this.transitionEvent, function( event ) {
						if ( event.target !== event.currentTarget ) {
							return;
						}

						that.$slides.off( that.transitionEvent );
						that.$slides.removeClass( 'sp-animated' );
						
						if ( typeof callback === 'function' ) {
							callback();
						}
					});
				}

				css[ this.vendorPrefix + 'transition' ] = transition;

				this.$slides.css( css );
			} else {
				css[ 'margin-' + this.positionProperty ] = position;

				if ( typeof instant !== 'undefined' && instant === true ) {
					this.$slides.css( css );
				} else {
					this.$slides.addClass( 'sp-animated' );
					this.$slides.animate( css, this.settings.slideAnimationDuration, function() {
						that.$slides.removeClass( 'sp-animated' );

						if ( typeof callback === 'function' ) {
							callback();
						}
					});
				}
			}
		},

		// Stop the movement of the slides
		_stopMovement: function() {
			var css = {};

			if ( ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) && this.isIE === false) {

				// Get the current position of the slides by parsing the 'transform' property
				var	matrixString = this.$slides.css( this.vendorPrefix + 'transform' ),
					matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
					matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9\.]+/g ),
					left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 ),
					top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );
					
				// Set the transform property to the value that the transform had when the function was called
				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				css[ this.vendorPrefix + 'transition' ] = '';

				this.$slides.css( css );
				this.$slides.off( this.transitionEvent );
				this.slidesPosition = this.settings.orientation === 'horizontal' ? left : top;
			} else {
				this.$slides.stop();
				this.slidesPosition = parseInt( this.$slides.css( 'margin-' + this.positionProperty ), 10 );
			}

			this.$slides.removeClass( 'sp-animated' );
		},

		// Resize the height of the slider to the specified value
		_resizeHeightTo: function( height ) {
			var that = this,
				css = { 'height': height };

			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				css[ this.vendorPrefix + 'transition' ] = 'height ' + this.settings.heightAnimationDuration / 1000 + 's';

				this.$slidesMask.off( this.transitionEvent );
				this.$slidesMask.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$slidesMask.off( that.transitionEvent );

					// Fire the 'resizeHeightComplete' event
					that.trigger({ type: 'resizeHeightComplete' });
					if ( $.isFunction( that.settings.resizeHeightComplete ) ) {
						that.settings.resizeHeightComplete.call( that, { type: 'resizeHeightComplete' } );
					}
				});

				this.$slidesMask.css( css );
			} else {
				this.$slidesMask.stop().animate( css, this.settings.heightAnimationDuration, function( event ) {
					// Fire the 'resizeHeightComplete' event
					that.trigger({ type: 'resizeHeightComplete' });
					if ( $.isFunction( that.settings.resizeHeightComplete ) ) {
						that.settings.resizeHeightComplete.call( that, { type: 'resizeHeightComplete' } );
					}
				});
			}
		},

		// Destroy the slider instance
		destroy: function() {
			// Remove the stored reference to this instance
			this.$slider.removeData( 'sliderPro' );
			
			// Clean the CSS
			this.$slider.removeAttr( 'style' );
			this.$slides.removeAttr( 'style' );

			// Remove event listeners
			this.off( 'update.' + NS );
			$( window ).off( 'resize.' + this.uniqueId + '.' + NS );

			// Destroy modules
			var modules = $.SliderPro.modules;

			if ( typeof modules !== 'undefined' ) {
				for ( var i = 0; i < modules.length; i++ ) {
					if ( typeof this[ 'destroy' + modules[ i ] ] !== 'undefined' ) {
						this[ 'destroy' + modules[ i ] ]();
					}
				}
			}

			// Destroy all slides
			$.each( this.slides, function( index, element ) {
				element.destroy();
			});

			this.slides.length = 0;

			// Move the slides to their initial position in the DOM and 
			// remove the container elements created dynamically.
			this.$slides.prependTo( this.$slider );
			this.$slidesContainer.remove();
		},

		// Set properties on runtime
		_setProperties: function( properties, store ) {
			// Parse the properties passed as an object
			for ( var prop in properties ) {
				this.settings[ prop ] = properties[ prop ];

				// Alter the original settings as well unless 'false' is passed to the 'store' parameter
				if ( store !== false ) {
					this.originalSettings[ prop ] = properties[ prop ];
				}
			}

			this.update();
		},

		// Attach an event handler to the slider
		on: function( type, callback ) {
			return this.$slider.on( type, callback );
		},

		// Detach an event handler
		off: function( type ) {
			return this.$slider.off( type );
		},

		// Trigger an event on the slider
		trigger: function( data ) {
			return this.$slider.triggerHandler( data );
		},

		// Return the slide at the specified index
		getSlideAt: function( index ) {
			return this.slides[ index ];
		},

		// Return the index of the currently opened slide
		getSelectedSlide: function() {
			return this.selectedSlideIndex;
		},

		// Return the total amount of slides
		getTotalSlides: function() {
			return this.slides.length;
		},

		// The default options of the slider
		defaults: {
			// Width of the slide
			width: 500,

			// Height of the slide
			height: 300,

			// Indicates if the slider is responsive
			responsive: true,

			// The aspect ratio of the slider (width/height)
			aspectRatio: -1,

			// The scale mode for images (cover, contain, exact and none)
			imageScaleMode: 'cover',

			// Indicates if the image will be centered
			centerImage: true,

			// Indicates if the image can be scaled up more than its original size
			allowScaleUp: true,

			// Indicates if height of the slider will be adjusted to the
			// height of the selected slide
			autoHeight: false,

			// Will maintain all the slides at the same height, but will allow the width
			// of the slides to be variable if the orientation of the slides is horizontal
			// and vice-versa if the orientation is vertical
			autoSlideSize: false,

			// Indicates the initially selected slide
			startSlide: 0,

			// Indicates if the slides will be shuffled
			shuffle: false,

			// Indicates whether the slides will be arranged horizontally
			// or vertically. Can be set to 'horizontal' or 'vertical'.
			orientation: 'horizontal',

			// Indicates if the size of the slider will be forced to 'fullWidth' or 'fullWindow'
			forceSize: 'none',

			// Indicates if the slider will be loopable
			loop: true,

			// The distance between slides
			slideDistance: 10,

			// The duration of the slide animation
			slideAnimationDuration: 700,

			// The duration of the height animation
			heightAnimationDuration: 700,

			// Sets the size of the visible area, allowing the increase of it in order
			// to make more slides visible.
			// By default, only the selected slide will be visible. 
			visibleSize: 'auto',

			// Indicates whether the selected slide will be in the center of the slider, when there
			// are more slides visible at a time. If set to false, the selected slide will be in the
			// left side of the slider.
			centerSelectedSlide: true,

			// Indicates if the direction of the slider will be from right to left,
			// instead of the default left to right
			rightToLeft: false,

			// Breakpoints for allowing the slider's options to be changed
			// based on the size of the window.
			breakpoints: null,

			// Called when the slider is initialized
			init: function() {},

			// Called when the slider is updates
			update: function() {},

			// Called when the slider is resized
			sliderResize: function() {},

			// Called when a new slide is selected
			gotoSlide: function() {},

			// Called when the navigation to the newly selected slide is complete
			gotoSlideComplete: function() {},

			// Called when the height animation of the slider is complete
			resizeHeightComplete: function() {},

			// Called when a breakpoint is reached
			breakpointReach: function() {}
		}
	};

	var SliderProSlide = function( slide, index, settings ) {

		// Reference to the slide jQuery element
		this.$slide = slide;

		// Reference to the main slide image
		this.$mainImage = null;

		// Reference to the container that will hold the main image
		this.$imageContainer = null;

		// Indicates whether the slide has a main image
		this.hasMainImage = false;

		// Indicates whether the main image is loaded
		this.isMainImageLoaded = false;

		// Indicates whether the main image is in the process of being loaded
		this.isMainImageLoading = false;

		// Indicates whether the slide has any image. There could be other images (i.e., in layers)
		// besides the main slide image.
		this.hasImages = false;

		// Indicates if all the images in the slide are loaded
		this.areImagesLoaded = false;

		// Indicates if the images inside the slide are in the process of being loaded
		this.areImagesLoading = false;

		// The width and height of the slide
		this.width = 0;
		this.height = 0;

		// Reference to the global settings of the slider
		this.settings = settings;

		// Set the index of the slide
		this.setIndex( index );

		// Initialize the slide
		this._init();
	};

	SliderProSlide.prototype = {

		// The starting point for the slide
		_init: function() {
			var that = this;

			// Mark the slide as initialized
			this.$slide.attr( 'data-init', true );

			// Get the main slide image if there is one
			this.$mainImage = this.$slide.find( '.sp-image' ).length !== 0 ? this.$slide.find( '.sp-image' ) : null;

			// If there is a main slide image, create a container for it and add the image to this container.
			// The container will allow the isolation of the image from the rest of the slide's content. This is
			// helpful when you want to show some content below the image and not cover it.
			if ( this.$mainImage !== null ) {
				this.hasMainImage = true;

				this.$imageContainer = $( '<div class="sp-image-container"></div>' ).prependTo( this.$slide );

				if ( this.$mainImage.parent( 'a' ).length !== 0 ) {
					this.$mainImage.parent( 'a' ).appendTo( this.$imageContainer );
				} else {
					this.$mainImage.appendTo( this.$imageContainer );
				}
			}

			this.hasImages = this.$slide.find( 'img' ).length !== 0 ? true : false;
		},

		// Set the size of the slide
		setSize: function( width, height ) {
			var that = this;

			this.width = width;
			this.height = height;

			this.$slide.css({
				'width': this.width,
				'height': this.height
			});

			if ( this.hasMainImage === true ) {

				// Initially set the width and height of the container to the width and height
				// specified in the settings. This will prevent content overflowing if the width or height
				// are 'auto'. The 'auto' value will be passed only after the image is loaded.
				this.$imageContainer.css({
					'width': this.settings.width,
					'height': this.settings.height
				});

				// Resize the main image if it's loaded. If the 'data-src' attribute is present it means
				// that the image will be lazy-loaded
				if ( typeof this.$mainImage.attr( 'data-src' ) === 'undefined' ) {
					this.resizeMainImage();
				}
			}
		},

		// Get the size (width and height) of the slide
		getSize: function() {
			var that = this,
				size;

			// Check if all images have loaded, and if they have, return the size, else, return
			// the original width and height of the slide
			if ( this.hasImages === true && this.areImagesLoaded === false && this.areImagesLoading === false ) {
				this.areImagesLoading = true;
				
				var status = SliderProUtils.checkImagesStatus( this.$slide );

				if ( status !== 'complete' ) {
					SliderProUtils.checkImagesComplete( this.$slide, function() {
						that.areImagesLoaded = true;
						that.areImagesLoading = false;
						that.trigger({ type: 'imagesLoaded.' + NS, index: that.index });
					});

					// if the image is not loaded yet, return the original width and height of the slider
					return {
						'width': this.settings.width,
						'height': this.settings.height
					};
				}
			}

			size = this.calculateSize();

			return {
				'width': size.width,
				'height': size.height
			};
		},

		// Calculate the width and height of the slide by going
		// through all the child elements and measuring their 'bottom'
		// and 'right' properties. The element with the biggest
		// 'right'/'bottom' property will determine the slide's
		// width/height.
		calculateSize: function() {
			var width = this.$slide.width(),
				height = this.$slide.height();

			this.$slide.children().each(function( index, element ) {
				var child = $( element );

				if ( child.is( ':hidden' ) === true ) {
					return;
				}

				var	rect = element.getBoundingClientRect(),
					bottom = child.position().top + ( rect.bottom - rect.top ),
					right = child.position().left + ( rect.right - rect.left );

				if ( bottom > height ) {
					height = bottom;
				}

				if ( right > width ) {
					width = right;
				}
			});

			return {
				width: width,
				height: height
			};
		},

		// Resize the main image.
		// 
		// Call this when the slide resizes or when the main image has changed to a different image.
		resizeMainImage: function( isNewImage ) {
			var that = this;

			// If the main image has changed, reset the 'flags'
			if ( isNewImage === true ) {
				this.isMainImageLoaded = false;
				this.isMainImageLoading = false;
			}

			// If the image was not loaded yet and it's not in the process of being loaded, load it
			if ( this.isMainImageLoaded === false && this.isMainImageLoading === false ) {
				this.isMainImageLoading = true;

				SliderProUtils.checkImagesComplete( this.$mainImage, function() {
					that.isMainImageLoaded = true;
					that.isMainImageLoading = false;
					that.resizeMainImage();
					that.trigger({ type: 'imagesLoaded.' + NS, index: that.index });
				});

				return;
			}

			// Set the size of the image container element to the proper 'width' and 'height'
			// values, as they were calculated. Previous values were the 'width' and 'height'
			// from the settings. 
			this.$imageContainer.css({
				'width': this.width,
				'height': this.height
			});

			if ( this.settings.allowScaleUp === false ) {
				// reset the image to its natural size
				this.$mainImage.css({ 'width': '', 'height': '', 'maxWidth': '', 'maxHeight': '' });

				// set the boundaries
				this.$mainImage.css({ 'maxWidth': this.$mainImage.width(), 'maxHeight': this.$mainImage.height() });
			}

			// After the main image has loaded, resize it
			if ( this.settings.autoSlideSize === true ) {
				if ( this.settings.orientation === 'horizontal' ) {
					this.$mainImage.css({ width: 'auto', height: '100%' });

					// resize the slide's width to a fixed value instead of 'auto', to
					// prevent incorrect sizing caused by links added to the main image
					this.$slide.css( 'width', this.$mainImage.width() );
				} else if ( this.settings.orientation === 'vertical' ) {
					this.$mainImage.css({ width: '100%', height: 'auto' });

					// resize the slide's height to a fixed value instead of 'auto', to
					// prevent incorrect sizing caused by links added to the main image
					this.$slide.css( 'height', this.$mainImage.height() );
				}
			} else if ( this.settings.autoHeight === true ) {
				this.$mainImage.css({ width: '100%', height: 'auto' });

				if ( this.settings.centerImage === true ) {
					this.$mainImage.css({ 'marginLeft': ( this.$imageContainer.width() - this.$mainImage.width() ) * 0.5 });
				}
			} else {
				if ( this.settings.imageScaleMode === 'cover' ) {
					if ( this.$mainImage.width() / this.$mainImage.height() <= this.$slide.width() / this.$slide.height() ) {
						this.$mainImage.css({ width: '100%', height: 'auto' });
					} else {
						this.$mainImage.css({ width: 'auto', height: '100%' });
					}
				} else if ( this.settings.imageScaleMode === 'contain' ) {
					if ( this.$mainImage.width() / this.$mainImage.height() >= this.$slide.width() / this.$slide.height() ) {
						this.$mainImage.css({ width: '100%', height: 'auto' });
					} else {
						this.$mainImage.css({ width: 'auto', height: '100%' });
					}
				} else if ( this.settings.imageScaleMode === 'exact' ) {
					this.$mainImage.css({ width: '100%', height: '100%' });
				}

				if ( this.settings.centerImage === true ) {
					this.$mainImage.css({ 'marginLeft': ( this.$imageContainer.width() - this.$mainImage.width() ) * 0.5, 'marginTop': ( this.$imageContainer.height() - this.$mainImage.height() ) * 0.5 });
				}
			}
		},

		// Destroy the slide
		destroy: function() {
			// Clean the slide element from attached styles and data
			this.$slide.removeAttr( 'style' );
			this.$slide.removeAttr( 'data-init' );
			this.$slide.removeAttr( 'data-index' );
			this.$slide.removeAttr( 'data-loaded' );

			// If there is a main image, remove its container
			if ( this.hasMainImage === true ) {
				this.$slide.find( '.sp-image' )
					.removeAttr( 'style' )
					.appendTo( this.$slide );

				this.$slide.find( '.sp-image-container' ).remove();
			}
		},

		// Return the index of the slide
		getIndex: function() {
			return this.index;
		},

		// Set the index of the slide
		setIndex: function( index ) {
			this.index = index;
			this.$slide.attr( 'data-index', this.index );
		},

		// Attach an event handler to the slide
		on: function( type, callback ) {
			return this.$slide.on( type, callback );
		},

		// Detach an event handler to the slide
		off: function( type ) {
			return this.$slide.off( type );
		},

		// Trigger an event on the slide
		trigger: function( data ) {
			return this.$slide.triggerHandler( data );
		}
	};

	window.SliderPro = SliderPro;
	window.SliderProSlide = SliderProSlide;

	$.fn.sliderPro = function( options ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		return this.each(function() {
			// Instantiate the slider or alter it
			if ( typeof $( this ).data( 'sliderPro' ) === 'undefined' ) {
				var newInstance = new SliderPro( this, options );

				// Store a reference to the instance created
				$( this ).data( 'sliderPro', newInstance );
			} else if ( typeof options !== 'undefined' ) {
				var	currentInstance = $( this ).data( 'sliderPro' );

				// Check the type of argument passed
				if ( typeof currentInstance[ options ] === 'function' ) {
					currentInstance[ options ].apply( currentInstance, args );
				} else if ( typeof currentInstance.settings[ options ] !== 'undefined' ) {
					var obj = {};
					obj[ options ] = args[ 0 ];
					currentInstance._setProperties( obj );
				} else if ( typeof options === 'object' ) {
					currentInstance._setProperties( options );
				} else {
					$.error( options + ' does not exist in sliderPro.' );
				}
			}
		});
	};

	// Contains useful utility functions
	var SliderProUtils = {

		// Indicates what type of animations are supported in the current browser
		// Can be CSS 3D, CSS 2D or JavaScript
		supportedAnimation: null,

		// Indicates the required vendor prefix for the current browser
		vendorPrefix: null,

		// Indicates the name of the transition's complete event for the current browser
		transitionEvent: null,

		// Indicates if the current browser is Internet Explorer (any version)
		isIE: null,

		// Check whether CSS3 3D or 2D transforms are supported. If they aren't, use JavaScript animations
		getSupportedAnimation: function() {
			if ( this.supportedAnimation !== null ) {
				return this.supportedAnimation;
			}

			var element = document.body || document.documentElement,
				elementStyle = element.style,
				isCSSTransitions = typeof elementStyle.transition !== 'undefined' ||
									typeof elementStyle.WebkitTransition !== 'undefined' ||
									typeof elementStyle.MozTransition !== 'undefined' ||
									typeof elementStyle.OTransition !== 'undefined';

			if ( isCSSTransitions === true ) {
				var div = document.createElement( 'div' );

				// Check if 3D transforms are supported
				if ( typeof div.style.WebkitPerspective !== 'undefined' || typeof div.style.perspective !== 'undefined' ) {
					this.supportedAnimation = 'css-3d';
				}

				// Additional checks for Webkit
				if ( this.supportedAnimation === 'css-3d' && typeof div.styleWebkitPerspective !== 'undefined' ) {
					var style = document.createElement( 'style' );
					style.textContent = '@media (transform-3d),(-webkit-transform-3d){#test-3d{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0;}}';
					document.getElementsByTagName( 'head' )[0].appendChild( style );

					div.id = 'test-3d';
					document.body.appendChild( div );

					if ( ! ( div.offsetLeft === 9 && div.offsetHeight === 5 ) ) {
						this.supportedAnimation = null;
					}

					style.parentNode.removeChild( style );
					div.parentNode.removeChild( div );
				}

				// If CSS 3D transforms are not supported, check if 2D transforms are supported
				if ( this.supportedAnimation === null && ( typeof div.style['-webkit-transform'] !== 'undefined' || typeof div.style.transform !== 'undefined' ) ) {
					this.supportedAnimation = 'css-2d';
				}
			} else {
				this.supportedAnimation = 'javascript';
			}
			
			return this.supportedAnimation;
		},

		// Check what vendor prefix should be used in the current browser
		getVendorPrefix: function() {
			if ( this.vendorPrefix !== null ) {
				return this.vendorPrefix;
			}

			var div = document.createElement( 'div' ),
				prefixes = [ 'Webkit', 'Moz', 'ms', 'O' ];
			
			if ( 'transform' in div.style ) {
				this.vendorPrefix = '';
				return this.vendorPrefix;
			}
			
			for ( var i = 0; i < prefixes.length; i++ ) {
				if ( ( prefixes[ i ] + 'Transform' ) in div.style ) {
					this.vendorPrefix = '-' + prefixes[ i ].toLowerCase() + '-';
					break;
				}
			}
			
			return this.vendorPrefix;
		},

		// Check the name of the transition's complete event in the current browser
		getTransitionEvent: function() {
			if ( this.transitionEvent !== null ) {
				return this.transitionEvent;
			}

			var div = document.createElement( 'div' ),
				transitions = {
					'transition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd'
				};

			for ( var transition in transitions ) {
				if ( transition in div.style ) {
					this.transitionEvent = transitions[ transition ];
					break;
				}
			}

			return this.transitionEvent;
		},

		// If a single image is passed, check if it's loaded.
		// If a different element is passed, check if there are images
		// inside it, and check if these images are loaded.
		checkImagesComplete: function( target, callback ) {
			var that = this,

				// Check the initial status of the image(s)
				status = this.checkImagesStatus( target );

			// If there are loading images, wait for them to load.
			// If the images are loaded, call the callback function directly.
			if ( status === 'loading' ) {
				var checkImages = setInterval(function() {
					status = that.checkImagesStatus( target );

					if ( status === 'complete' ) {
						clearInterval( checkImages );

						if ( typeof callback === 'function' ) {
							callback();
						}
					}
				}, 100 );
			} else if ( typeof callback === 'function' ) {
				callback();
			}

			return status;
		},

		checkImagesStatus: function( target ) {
			var status = 'complete';

			if ( target.is( 'img' ) && target[0].complete === false ) {
				status = 'loading';
			} else {
				target.find( 'img' ).each(function( index ) {
					var image = $( this )[0];

					if ( image.complete === false ) {
						status = 'loading';
					}
				});
			}

			return status;
		},

		checkIE: function() {
			if ( this.isIE !== null ) {
				return this.isIE;
			}

			var userAgent = window.navigator.userAgent,
				msie = userAgent.indexOf( 'MSIE' );

			if ( userAgent.indexOf( 'MSIE' ) !== -1 || userAgent.match( /Trident.*rv\:11\./ ) ) {
				this.isIE = true;
			} else {
				this.isIE = false;
			}

			return this.isIE;
		}
	};

	window.SliderProUtils = SliderProUtils;

})( window, jQuery );

// Thumbnails module for Slider Pro.
// 
// Adds the possibility to create a thumbnail scroller, each thumbnail
// corresponding to a slide.
;(function( window, $ ) {

	"use strict";

	var NS = 'Thumbnails.' + $.SliderPro.namespace;

	var Thumbnails = {

		// Reference to the thumbnail scroller 
		$thumbnails: null,

		// Reference to the container of the thumbnail scroller
		$thumbnailsContainer: null,

		// List of Thumbnail objects
		thumbnails: null,

		// Index of the selected thumbnail
		selectedThumbnailIndex: 0,

		// Total size (width or height, depending on the orientation) of the thumbnails
		thumbnailsSize: 0,

		// Size of the thumbnail's container
		thumbnailsContainerSize: 0,

		// The position of the thumbnail scroller inside its container
		thumbnailsPosition: 0,

		// Orientation of the thumbnails
		thumbnailsOrientation: null,

		// Indicates the 'left' or 'top' position based on the orientation of the thumbnails
		thumbnailsPositionProperty: null,

		// Indicates if there are thumbnails in the slider
		isThumbnailScroller: false,

		initThumbnails: function() {
			var that = this;

			this.thumbnails = [];

			this.on( 'update.' + NS, $.proxy( this._thumbnailsOnUpdate, this ) );
			this.on( 'sliderResize.' + NS, $.proxy( this._thumbnailsOnResize, this ) );
			this.on( 'gotoSlide.' + NS, function( event ) {
				that._gotoThumbnail( event.index );
			});
		},

		// Called when the slider is updated
		_thumbnailsOnUpdate: function() {
			var that = this;

			if ( this.$slider.find( '.sp-thumbnail' ).length === 0 && this.thumbnails.length === 0 ) {
				this.isThumbnailScroller = false;
				return;
			}

			this.isThumbnailScroller = true;

			// Create the container of the thumbnail scroller, if it wasn't created yet
			if ( this.$thumbnailsContainer === null ) {
				this.$thumbnailsContainer = $( '<div class="sp-thumbnails-container"></div>' ).insertAfter( this.$slidesContainer );
			}

			// If the thumbnails' main container doesn't exist, create it, and get a reference to it
			if ( this.$thumbnails === null ) {
				if ( this.$slider.find( '.sp-thumbnails' ).length !== 0 ) {
					this.$thumbnails = this.$slider.find( '.sp-thumbnails' ).appendTo( this.$thumbnailsContainer );

					// Shuffle/randomize the thumbnails
					if ( this.settings.shuffle === true ) {
						var thumbnails = this.$thumbnails.find( '.sp-thumbnail' ),
							shuffledThumbnails = [];

						// Reposition the thumbnails based on the order of the indexes in the
						// 'shuffledIndexes' array
						$.each( this.shuffledIndexes, function( index, element ) {
							var $thumbnail = $( thumbnails[ element ] );

							if ( $thumbnail.parent( 'a' ).length !== 0 ) {
								$thumbnail = $thumbnail.parent( 'a' );
							}

							shuffledThumbnails.push( $thumbnail );
						});
						
						// Append the sorted thumbnails to the thumbnail scroller
						this.$thumbnails.empty().append( shuffledThumbnails ) ;
					}
				} else {
					this.$thumbnails = $( '<div class="sp-thumbnails"></div>' ).appendTo( this.$thumbnailsContainer );
				}
			}

			// Check if there are thumbnails inside the slides and move them in the thumbnails container
			this.$slides.find( '.sp-thumbnail' ).each( function( index ) {
				var $thumbnail = $( this ),
					thumbnailIndex = $thumbnail.parents( '.sp-slide' ).index(),
					lastThumbnailIndex = that.$thumbnails.find( '.sp-thumbnail' ).length - 1;

				if ( $thumbnail.parent( 'a' ).length !== 0 ) {
					$thumbnail = $thumbnail.parent( 'a' );
				}

				// If the index of the slide that contains the thumbnail is greater than the total number
				// of thumbnails from the thumbnails container, position the thumbnail at the end.
				// Otherwise, add the thumbnails at the corresponding position.
				if ( thumbnailIndex > lastThumbnailIndex ) {
					$thumbnail.appendTo( that.$thumbnails );
				} else {
					$thumbnail.insertBefore( that.$thumbnails.find( '.sp-thumbnail' ).eq( thumbnailIndex ) );
				}
			});

			// Loop through the Thumbnail objects and if a corresponding element is not found in the DOM,
			// it means that the thumbnail might have been removed. In this case, destroy that Thumbnail instance.
			for ( var i = this.thumbnails.length - 1; i >= 0; i-- ) {
				if ( this.$thumbnails.find( '.sp-thumbnail[data-index="' + i + '"]' ).length === 0 ) {
					var thumbnail = this.thumbnails[ i ];

					thumbnail.destroy();
					this.thumbnails.splice( i, 1 );
				}
			}

			// Loop through the thumbnails and if there is any uninitialized thumbnail,
			// initialize it, else update the thumbnail's index.
			this.$thumbnails.find( '.sp-thumbnail' ).each(function( index ) {
				var $thumbnail = $( this );

				if ( typeof $thumbnail.attr( 'data-init' ) === 'undefined' ) {
					that._createThumbnail( $thumbnail, index );
				} else {
					that.thumbnails[ index ].setIndex( index );
				}
			});

			// Remove the previous class that corresponds to the position of the thumbnail scroller
			this.$thumbnailsContainer.removeClass( 'sp-top-thumbnails sp-bottom-thumbnails sp-left-thumbnails sp-right-thumbnails' );

			// Check the position of the thumbnail scroller and assign it the appropriate class and styling
			if ( this.settings.thumbnailsPosition === 'top' ) {
				this.$thumbnailsContainer.addClass( 'sp-top-thumbnails' );
				this.thumbnailsOrientation = 'horizontal';
			} else if ( this.settings.thumbnailsPosition === 'bottom' ) {
				this.$thumbnailsContainer.addClass( 'sp-bottom-thumbnails' );
				this.thumbnailsOrientation = 'horizontal';
			} else if ( this.settings.thumbnailsPosition === 'left' ) {
				this.$thumbnailsContainer.addClass( 'sp-left-thumbnails' );
				this.thumbnailsOrientation = 'vertical';
			} else if ( this.settings.thumbnailsPosition === 'right' ) {
				this.$thumbnailsContainer.addClass( 'sp-right-thumbnails' );
				this.thumbnailsOrientation = 'vertical';
			}

			// Check if the pointer needs to be created
			if ( this.settings.thumbnailPointer === true ) {
				this.$thumbnailsContainer.addClass( 'sp-has-pointer' );
			} else {
				this.$thumbnailsContainer.removeClass( 'sp-has-pointer' );
			}

			// Mark the thumbnail that corresponds to the selected slide
			this.selectedThumbnailIndex = this.selectedSlideIndex;
			this.$thumbnails.find( '.sp-thumbnail-container' ).eq( this.selectedThumbnailIndex ).addClass( 'sp-selected-thumbnail' );
			
			// Calculate the total size of the thumbnails
			this.thumbnailsSize = 0;

			$.each( this.thumbnails, function( index, thumbnail ) {
				thumbnail.setSize( that.settings.thumbnailWidth, that.settings.thumbnailHeight );
				that.thumbnailsSize += that.thumbnailsOrientation === 'horizontal' ? thumbnail.getSize().width : thumbnail.getSize().height;
			});

			// Set the size of the thumbnails
			if ( this.thumbnailsOrientation === 'horizontal' ) {
				this.$thumbnails.css({ 'width': this.thumbnailsSize, 'height': this.settings.thumbnailHeight });
				this.$thumbnailsContainer.css( 'height', '' );
				this.thumbnailsPositionProperty = 'left';
			} else {
				this.$thumbnails.css({ 'width': this.settings.thumbnailWidth, 'height': this.thumbnailsSize });
				this.$thumbnailsContainer.css( 'width', '' );
				this.thumbnailsPositionProperty = 'top';
			}

			// Fire the 'thumbnailsUpdate' event
			this.trigger({ type: 'thumbnailsUpdate' });
			if ( $.isFunction( this.settings.thumbnailsUpdate ) ) {
				this.settings.thumbnailsUpdate.call( this, { type: 'thumbnailsUpdate' } );
			}
		},

		// Create an individual thumbnail
		_createThumbnail: function( element, index ) {
			var that = this,
				thumbnail = new Thumbnail( element, this.$thumbnails, index );

			// When the thumbnail is clicked, navigate to the corresponding slide
			thumbnail.on( 'thumbnailClick.' + NS, function( event ) {
				that.gotoSlide( event.index );
			});

			// Add the thumbnail at the specified index
			this.thumbnails.splice( index, 0, thumbnail );
		},

		// Called when the slider is resized.
		// Resets the size and position of the thumbnail scroller container.
		_thumbnailsOnResize: function() {
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			var that = this,
				newThumbnailsPosition;

			if ( this.thumbnailsOrientation === 'horizontal' ) {
				this.thumbnailsContainerSize = Math.min( this.$slidesMask.width(), this.thumbnailsSize );
				this.$thumbnailsContainer.css( 'width', this.thumbnailsContainerSize );

				// Reduce the slide mask's height, to make room for the thumbnails
				if ( this.settings.forceSize === 'fullWindow' ) {
					this.$slidesMask.css( 'height', this.$slidesMask.height() - this.$thumbnailsContainer.outerHeight( true ) );

					// Resize the slides
					this.slideHeight = this.$slidesMask.height();
					this._resizeSlides();

					// Re-arrange the slides
					this._resetSlidesPosition();
				}
			} else if ( this.thumbnailsOrientation === 'vertical' ) {

				// Check if the width of the slide mask plus the width of the thumbnail scroller is greater than
				// the width of the slider's container and if that's the case, reduce the slides container width
				// in order to make the entire slider fit inside the slider's container.
				if ( this.$slidesMask.width() + this.$thumbnailsContainer.outerWidth( true ) > this.$slider.parent().width() ) {
					// Reduce the slider's width, to make room for the thumbnails
					if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css( 'max-width', $( window ).width() - this.$thumbnailsContainer.outerWidth( true ) );
					} else {
						this.$slider.css( 'max-width', this.$slider.parent().width() - this.$thumbnailsContainer.outerWidth( true ) );
					}
					
					this.$slidesMask.css( 'width', this.$slider.width() );

					// If the slides are vertically oriented, update the width and height (to maintain the aspect ratio)
					// of the slides.
					if ( this.settings.orientation === 'vertical' ) {
						this.slideWidth = this.$slider.width();

						this._resizeSlides();
					}

					// Re-arrange the slides
					this._resetSlidesPosition();
				}

				this.thumbnailsContainerSize = Math.min( this.$slidesMask.height(), this.thumbnailsSize );
				this.$thumbnailsContainer.css( 'height', this.thumbnailsContainerSize );
			}

			// If the total size of the thumbnails is smaller than the thumbnail scroller' container (which has
			// the same size as the slides container), it means that all the thumbnails will be visible, so set
			// the position of the thumbnail scroller to 0.
			// 
			// If that's not the case, the thumbnail scroller will be positioned based on which thumbnail is selected.
			if ( this.thumbnailsSize <= this.thumbnailsContainerSize || this.$thumbnails.find( '.sp-selected-thumbnail' ).length === 0 ) {
				newThumbnailsPosition = 0;
			} else {
				newThumbnailsPosition = Math.max( - this.thumbnails[ this.selectedThumbnailIndex ].getPosition()[ this.thumbnailsPositionProperty ], this.thumbnailsContainerSize - this.thumbnailsSize );
			}

			// Add a padding to the slider, based on the thumbnail scroller's orientation, to make room
			// for the thumbnails.
			if ( this.settings.thumbnailsPosition === 'top' ) {
				this.$slider.css({ 'paddingTop': this.$thumbnailsContainer.outerHeight( true ), 'paddingLeft': '', 'paddingRight': '' });
			} else if ( this.settings.thumbnailsPosition === 'bottom' ) {
				this.$slider.css({ 'paddingTop': '', 'paddingLeft': '', 'paddingRight': '' });
			} else if ( this.settings.thumbnailsPosition === 'left' ) {
				this.$slider.css({ 'paddingTop': '', 'paddingLeft': this.$thumbnailsContainer.outerWidth( true ), 'paddingRight': '' });
			} else if ( this.settings.thumbnailsPosition === 'right' ) {
				this.$slider.css({ 'paddingTop': '', 'paddingLeft': '', 'paddingRight': this.$thumbnailsContainer.outerWidth( true ) });
			}

			this._moveThumbnailsTo( newThumbnailsPosition, true );
		},

		// Selects the thumbnail at the indicated index and moves the thumbnail scroller
		// accordingly.
		_gotoThumbnail: function( index ) {
			if ( this.isThumbnailScroller === false || typeof this.thumbnails[ index ] === 'undefined' ) {
				return;
			}

			var previousIndex = this.selectedThumbnailIndex,
				newThumbnailsPosition = this.thumbnailsPosition;

			this.selectedThumbnailIndex = index;

			// Set the 'selected' class to the appropriate thumbnail
			this.$thumbnails.find( '.sp-selected-thumbnail' ).removeClass( 'sp-selected-thumbnail' );
			this.$thumbnails.find( '.sp-thumbnail-container' ).eq( this.selectedThumbnailIndex ).addClass( 'sp-selected-thumbnail' );

			// Calculate the new position that the thumbnail scroller needs to go to.
			// 
			// If the selected thumbnail has a higher index than the previous one, make sure that the thumbnail
			// that comes after the selected thumbnail will be visible, if the selected thumbnail is not the
			// last thumbnail in the list.
			// 
			// If the selected thumbnail has a lower index than the previous one, make sure that the thumbnail
			// that's before the selected thumbnail will be visible, if the selected thumbnail is not the
			// first thumbnail in the list.
			if ( this.settings.rightToLeft === true && this.thumbnailsOrientation === 'horizontal' ) {
				if ( this.selectedThumbnailIndex >= previousIndex ) {
					var rtlNextThumbnailIndex = this.selectedThumbnailIndex === this.thumbnails.length - 1 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex + 1,
						rtlNextThumbnail = this.thumbnails[ rtlNextThumbnailIndex ];

					if ( rtlNextThumbnail.getPosition().left < - this.thumbnailsPosition ) {
						newThumbnailsPosition = - rtlNextThumbnail.getPosition().left;
					}
				} else if ( this.selectedThumbnailIndex < previousIndex ) {
					var rtlPreviousThumbnailIndex = this.selectedThumbnailIndex === 0 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex - 1,
						rtlPreviousThumbnail = this.thumbnails[ rtlPreviousThumbnailIndex ],
						rtlThumbnailsRightPosition = - this.thumbnailsPosition + this.thumbnailsContainerSize;

					if ( rtlPreviousThumbnail.getPosition().right > rtlThumbnailsRightPosition ) {
						newThumbnailsPosition = this.thumbnailsPosition - ( rtlPreviousThumbnail.getPosition().right - rtlThumbnailsRightPosition );
					}
				}
			} else {
				if ( this.selectedThumbnailIndex >= previousIndex ) {
					var nextThumbnailIndex = this.selectedThumbnailIndex === this.thumbnails.length - 1 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex + 1,
						nextThumbnail = this.thumbnails[ nextThumbnailIndex ],
						nextThumbnailPosition = this.thumbnailsOrientation === 'horizontal' ? nextThumbnail.getPosition().right : nextThumbnail.getPosition().bottom,
						thumbnailsRightPosition = - this.thumbnailsPosition + this.thumbnailsContainerSize;

					if ( nextThumbnailPosition > thumbnailsRightPosition ) {
						newThumbnailsPosition = this.thumbnailsPosition - ( nextThumbnailPosition - thumbnailsRightPosition );
					}
				} else if ( this.selectedThumbnailIndex < previousIndex ) {
					var previousThumbnailIndex = this.selectedThumbnailIndex === 0 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex - 1,
						previousThumbnail = this.thumbnails[ previousThumbnailIndex ],
						previousThumbnailPosition = this.thumbnailsOrientation === 'horizontal' ? previousThumbnail.getPosition().left : previousThumbnail.getPosition().top;

					if ( previousThumbnailPosition < - this.thumbnailsPosition ) {
						newThumbnailsPosition = - previousThumbnailPosition;
					}
				}
			}

			// Move the thumbnail scroller to the calculated position
			this._moveThumbnailsTo( newThumbnailsPosition );

			// Fire the 'gotoThumbnail' event
			this.trigger({ type: 'gotoThumbnail' });
			if ( $.isFunction( this.settings.gotoThumbnail ) ) {
				this.settings.gotoThumbnail.call( this, { type: 'gotoThumbnail' });
			}
		},

		// Move the thumbnail scroller to the indicated position
		_moveThumbnailsTo: function( position, instant, callback ) {
			var that = this,
				css = {};

			// Return if the position hasn't changed
			if ( position === this.thumbnailsPosition ) {
				return;
			}

			this.thumbnailsPosition = position;

			// Use CSS transitions if they are supported. If not, use JavaScript animation
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				var transition,
					left = this.thumbnailsOrientation === 'horizontal' ? position : 0,
					top = this.thumbnailsOrientation === 'horizontal' ? 0 : position;

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				if ( typeof instant !== 'undefined' && instant === true ) {
					transition = '';
				} else {
					this.$thumbnails.addClass( 'sp-animated' );
					transition = this.vendorPrefix + 'transform ' + 700 / 1000 + 's';

					this.$thumbnails.on( this.transitionEvent, function( event ) {
						if ( event.target !== event.currentTarget ) {
							return;
						}

						that.$thumbnails.off( that.transitionEvent );
						that.$thumbnails.removeClass( 'sp-animated' );

						if ( typeof callback === 'function' ) {
							callback();
						}

						// Fire the 'thumbnailsMoveComplete' event
						that.trigger({ type: 'thumbnailsMoveComplete' });
						if ( $.isFunction( that.settings.thumbnailsMoveComplete ) ) {
							that.settings.thumbnailsMoveComplete.call( that, { type: 'thumbnailsMoveComplete' });
						}
					});
				}

				css[ this.vendorPrefix + 'transition' ] = transition;

				this.$thumbnails.css( css );
			} else {
				css[ 'margin-' + this.thumbnailsPositionProperty ] = position;

				if ( typeof instant !== 'undefined' && instant === true ) {
					this.$thumbnails.css( css );
				} else {
					this.$thumbnails
						.addClass( 'sp-animated' )
						.animate( css, 700, function() {
							that.$thumbnails.removeClass( 'sp-animated' );

							if ( typeof callback === 'function' ) {
								callback();
							}

							// Fire the 'thumbnailsMoveComplete' event
							that.trigger({ type: 'thumbnailsMoveComplete' });
							if ( $.isFunction( that.settings.thumbnailsMoveComplete ) ) {
								that.settings.thumbnailsMoveComplete.call( that, { type: 'thumbnailsMoveComplete' });
							}
						});
				}
			}
		},

		// Stop the movement of the thumbnail scroller
		_stopThumbnailsMovement: function() {
			var css = {};

			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				var	matrixString = this.$thumbnails.css( this.vendorPrefix + 'transform' ),
					matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
					matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9\.]+/g ),
					left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 ),
					top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				css[ this.vendorPrefix + 'transition' ] = '';

				this.$thumbnails.css( css );
				this.$thumbnails.off( this.transitionEvent );
				this.thumbnailsPosition = this.thumbnailsOrientation === 'horizontal' ? parseInt( matrixArray[ 4 ] , 10 ) : parseInt( matrixArray[ 5 ] , 10 );
			} else {
				this.$thumbnails.stop();
				this.thumbnailsPosition = parseInt( this.$thumbnails.css( 'margin-' + this.thumbnailsPositionProperty ), 10 );
			}

			this.$thumbnails.removeClass( 'sp-animated' );
		},

		// Destroy the module
		destroyThumbnails: function() {
			var that = this;

			// Remove event listeners
			this.off( 'update.' + NS );

			if ( this.isThumbnailScroller === false ) {
				return;
			}
			
			this.off( 'sliderResize.' + NS );
			this.off( 'gotoSlide.' + NS );
			$( window ).off( 'resize.' + this.uniqueId + '.' + NS );

			// Destroy the individual thumbnails
			this.$thumbnails.find( '.sp-thumbnail' ).each( function() {
				var $thumbnail = $( this ),
					index = parseInt( $thumbnail.attr( 'data-index' ), 10 ),
					thumbnail = that.thumbnails[ index ];

				thumbnail.off( 'thumbnailClick.' + NS );
				thumbnail.destroy();
			});

			this.thumbnails.length = 0;

			// Add the thumbnail scroller directly in the slider and
			// remove the thumbnail scroller container
			this.$thumbnails.appendTo( this.$slider );
			this.$thumbnailsContainer.remove();
			
			// Remove any created padding
			this.$slider.css({ 'paddingTop': '', 'paddingLeft': '', 'paddingRight': '' });
		},

		thumbnailsDefaults: {

			// Sets the width of the thumbnail
			thumbnailWidth: 100,

			// Sets the height of the thumbnail
			thumbnailHeight: 80,

			// Sets the position of the thumbnail scroller (top, bottom, right, left)
			thumbnailsPosition: 'bottom',

			// Indicates if a pointer will be displayed for the selected thumbnail
			thumbnailPointer: false,

			// Called when the thumbnails are updated
			thumbnailsUpdate: function() {},

			// Called when a new thumbnail is selected
			gotoThumbnail: function() {},

			// Called when the thumbnail scroller has moved
			thumbnailsMoveComplete: function() {}
		}
	};

	var Thumbnail = function( thumbnail, thumbnails, index ) {

		// Reference to the thumbnail jQuery element
		this.$thumbnail = thumbnail;

		// Reference to the thumbnail scroller
		this.$thumbnails = thumbnails;

		// Reference to the thumbnail's container, which will be 
		// created dynamically.
		this.$thumbnailContainer = null;

		// The width and height of the thumbnail
		this.width = 0;
		this.height = 0;

		// Indicates whether the thumbnail's image is loaded
		this.isImageLoaded = false;

		// Set the index of the slide
		this.setIndex( index );

		// Initialize the thumbnail
		this._init();
	};

	Thumbnail.prototype = {

		_init: function() {
			var that = this;

			// Mark the thumbnail as initialized
			this.$thumbnail.attr( 'data-init', true );

			// Create a container for the thumbnail and add the original thumbnail to this container.
			// Having a container will help crop the thumbnail image if it's too large.
			this.$thumbnailContainer = $( '<div class="sp-thumbnail-container"></div>' ).appendTo( this.$thumbnails );

			if ( this.$thumbnail.parent( 'a' ).length !== 0 ) {
				this.$thumbnail.parent( 'a' ).appendTo( this.$thumbnailContainer );
			} else {
				this.$thumbnail.appendTo( this.$thumbnailContainer );
			}

			// When the thumbnail container is clicked, fire an event
			this.$thumbnailContainer.on( 'click.' + NS, function() {
				that.trigger({ type: 'thumbnailClick.' + NS, index: that.index });
			});
		},

		// Set the width and height of the thumbnail
		setSize: function( width, height ) {
			this.width = width;
			this.height = height;

			// Apply the width and height to the thumbnail's container
			this.$thumbnailContainer.css({ 'width': this.width, 'height': this.height });

			// If there is an image, resize it to fit the thumbnail container
			if ( this.$thumbnail.is( 'img' ) && typeof this.$thumbnail.attr( 'data-src' ) === 'undefined' ) {
				this.resizeImage();
			}
		},

		// Return the width and height of the thumbnail
		getSize: function() {
			return {
				width: this.$thumbnailContainer.outerWidth( true ),
				height: this.$thumbnailContainer.outerHeight( true )
			};
		},

		// Return the top, bottom, left and right position of the thumbnail
		getPosition: function() {
			return {
				left: this.$thumbnailContainer.position().left + parseInt( this.$thumbnailContainer.css( 'marginLeft' ) , 10 ),
				right: this.$thumbnailContainer.position().left + parseInt( this.$thumbnailContainer.css( 'marginLeft' ) , 10 ) + this.$thumbnailContainer.outerWidth(),
				top: this.$thumbnailContainer.position().top + parseInt( this.$thumbnailContainer.css( 'marginTop' ) , 10 ),
				bottom: this.$thumbnailContainer.position().top + parseInt( this.$thumbnailContainer.css( 'marginTop' ) , 10 ) + this.$thumbnailContainer.outerHeight()
			};
		},

		// Set the index of the thumbnail
		setIndex: function( index ) {
			this.index = index;
			this.$thumbnail.attr( 'data-index', this.index );
		},

		// Resize the thumbnail's image
		resizeImage: function() {
			var that = this;

			// If the image is not loaded yet, load it
			if ( this.isImageLoaded === false ) {
				SliderProUtils.checkImagesComplete( this.$thumbnailContainer , function() {
					that.isImageLoaded = true;
					that.resizeImage();
				});

				return;
			}

			// Get the reference to the thumbnail image again because it was replaced by
			// another img element during the loading process
			this.$thumbnail = this.$thumbnailContainer.find( '.sp-thumbnail' );

			// Calculate whether the image should stretch horizontally or vertically
			var imageWidth = this.$thumbnail.width(),
				imageHeight = this.$thumbnail.height();

			if ( imageWidth / imageHeight <= this.width / this.height ) {
				this.$thumbnail.css({ width: '100%', height: 'auto' });
			} else {
				this.$thumbnail.css({ width: 'auto', height: '100%' });
			}

			this.$thumbnail.css({ 'marginLeft': ( this.$thumbnailContainer.width() - this.$thumbnail.width() ) * 0.5, 'marginTop': ( this.$thumbnailContainer.height() - this.$thumbnail.height() ) * 0.5 });
		},

		// Destroy the thumbnail
		destroy: function() {
			this.$thumbnailContainer.off( 'click.' + NS );

			// Remove added attributes
			this.$thumbnail.removeAttr( 'data-init' );
			this.$thumbnail.removeAttr( 'data-index' );

			// Remove the thumbnail's container and add the thumbnail
			// back to the thumbnail scroller container
			if ( this.$thumbnail.parent( 'a' ).length !== 0 ) {
				this.$thumbnail.parent( 'a' ).insertBefore( this.$thumbnailContainer );
			} else {
				this.$thumbnail.insertBefore( this.$thumbnailContainer );
			}
			
			this.$thumbnailContainer.remove();
		},

		// Attach an event handler to the slide
		on: function( type, callback ) {
			return this.$thumbnailContainer.on( type, callback );
		},

		// Detach an event handler to the slide
		off: function( type ) {
			return this.$thumbnailContainer.off( type );
		},

		// Trigger an event on the slide
		trigger: function( data ) {
			return this.$thumbnailContainer.triggerHandler( data );
		}
	};

	$.SliderPro.addModule( 'Thumbnails', Thumbnails );

})( window, jQuery );

// ConditionalImages module for Slider Pro.
// 
// Adds the possibility to specify multiple sources for each image and
// load the image that's the most appropriate for the size of the slider.
// For example, instead of loading a large image even if the slider will be small
// you can specify a smaller image that will be loaded instead.
;(function( window, $ ) {

	"use strict";

	var NS = 'ConditionalImages.' + $.SliderPro.namespace;

	var ConditionalImages = {

		// Reference to the previous size
		previousImageSize: null,

		// Reference to the current size
		currentImageSize: null,

		// Indicates if the current display supports high PPI
		isRetinaScreen: false,

		initConditionalImages: function() {
			this.currentImageSize = this.previousImageSize = 'default';
			this.isRetinaScreen = ( typeof this._isRetina !== 'undefined' ) && ( this._isRetina() === true );

			this.on( 'update.' + NS, $.proxy( this._conditionalImagesOnUpdate, this ) );
			this.on( 'sliderResize.' + NS, $.proxy( this._conditionalImagesOnResize, this ) );
		},

		// Loop through all the existing images and specify the original path of the image
		// inside the 'data-default' attribute.
		_conditionalImagesOnUpdate: function() {
			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				$slide.find( 'img:not([ data-default ])' ).each(function() {
					var $image = $( this );

					if ( typeof $image.attr( 'data-src' ) !== 'undefined' ) {
						$image.attr( 'data-default', $image.attr( 'data-src' ) );
					} else {
						$image.attr( 'data-default', $image.attr( 'src' ) );
					}
				});
			});
		},

		// When the window resizes, identify the applyable image size based on the current size of the slider
		// and apply it to all images that have a version of the image specified for this size.
		_conditionalImagesOnResize: function() {
			if ( this.slideWidth <= this.settings.smallSize ) {
				this.currentImageSize = 'small';
			} else if ( this.slideWidth <= this.settings.mediumSize ) {
				this.currentImageSize = 'medium';
			} else if ( this.slideWidth <= this.settings.largeSize ) {
				this.currentImageSize = 'large';
			} else {
				this.currentImageSize = 'default';
			}

			if ( this.previousImageSize !== this.currentImageSize ) {
				var that = this;

				$.each( this.slides, function( index, element ) {
					var $slide = element.$slide;

					$slide.find( 'img' ).each(function() {
						var $image = $( this ),
							imageSource = '';

						// Check if the current display supports high PPI and if a retina version of the current size was specified
						if ( that.isRetinaScreen === true && typeof $image.attr( 'data-retina' + that.currentImageSize ) !== 'undefined' ) {
							imageSource = $image.attr( 'data-retina' + that.currentImageSize );

							// If the retina image was not loaded yet, replace the default image source with the one
							// that corresponds to the current slider size
							if ( typeof $image.attr( 'data-retina' ) !== 'undefined' && $image.attr( 'data-retina' ) !== imageSource ) {
								$image.attr( 'data-retina', imageSource );
							}
						} else if ( ( that.isRetinaScreen === false || that.isRetinaScreen === true && typeof $image.attr( 'data-retina' ) === 'undefined' ) && typeof $image.attr( 'data-' + that.currentImageSize ) !== 'undefined' ) {
							imageSource = $image.attr( 'data-' + that.currentImageSize );

							// If the image is set to lazy load, replace the image source with the one
							// that corresponds to the current slider size
							if ( typeof $image.attr( 'data-src' ) !== 'undefined' && $image.attr( 'data-src' ) !== imageSource ) {
								$image.attr( 'data-src', imageSource );
							}
						}

						// If a new image was found
						if ( imageSource !== '' ) {

							// The existence of the 'data-src' attribute indicates that the image
							// will be lazy loaded, so don't load the new image yet
							if ( typeof $image.attr( 'data-src' ) === 'undefined' && $image.attr( 'src' ) !== imageSource  ) {
								that._loadConditionalImage( $image, imageSource, function( newImage ) {
									if ( newImage.hasClass( 'sp-image' ) ) {
										element.$mainImage = newImage;
										element.resizeMainImage( true );
									}
								});
							}
						}
					});
				});

				this.previousImageSize = this.currentImageSize;
			}
		},

		// Replace the target image with a new image
		_loadConditionalImage: function( image, source, callback ) {

			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr( 'class' ) );
			newImage.attr( 'style', image.attr( 'style' ) );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined') {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined') {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			newImage.attr( 'src', source );

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;
				
			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyConditionalImages: function() {
			this.off( 'update.' + NS );
			this.off( 'sliderResize.' + NS );
		},

		conditionalImagesDefaults: {

			// If the slider size is below this size, the small version of the images will be used
			smallSize: 480,

			// If the slider size is below this size, the small version of the images will be used
			mediumSize: 768,

			// If the slider size is below this size, the small version of the images will be used
			largeSize: 1024
		}
	};

	$.SliderPro.addModule( 'ConditionalImages', ConditionalImages );

})( window, jQuery );

// Retina module for Slider Pro.
// 
// Adds the possibility to load a different image when the slider is
// viewed on a retina screen.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Retina.' + $.SliderPro.namespace;

	var Retina = {

		initRetina: function() {
			var that = this;

			// Return if it's not a retina screen
			if ( this._isRetina() === false ) {
				return;
			}
			
			this.on( 'sliderResize.' + NS, $.proxy( this._checkRetinaImages, this ) );

			if ( this.$slider.find( '.sp-thumbnail' ).length !== 0 ) {
				this.on( 'update.Thumbnails.' + NS, $.proxy( this._checkRetinaThumbnailImages, this ) );
			}
		},

		// Checks if the current display supports high PPI
		_isRetina: function() {
			if ( window.devicePixelRatio >= 2 ) {
				return true;
			}

			if ( window.matchMedia && ( window.matchMedia( "(-webkit-min-device-pixel-ratio: 2),(min-resolution: 2dppx)" ).matches ) ) {
				return true;
			}

			return false;
		},

		// Loop through the slides and replace the images with their retina version
		_checkRetinaImages: function() {
			var that = this;

			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				if ( typeof $slide.attr( 'data-retina-loaded' ) === 'undefined' ) {
					$slide.attr( 'data-retina-loaded', true );

					$slide.find( 'img[data-retina]' ).each(function() {
						var $image = $( this );

						if ( typeof $image.attr( 'data-src' ) !== 'undefined' ) {
							$image.attr( 'data-src', $image.attr( 'data-retina' ) );
						} else {
							that._loadRetinaImage( $image, function( newImage ) {
								if ( newImage.hasClass( 'sp-image' ) ) {
									element.$mainImage = newImage;
									element.resizeMainImage( true );
								}
							});
						}
					});
				}
			});
		},

		// Loop through the thumbnails and replace the images with their retina version
		_checkRetinaThumbnailImages: function() {
			var that = this;

			$.each( this.thumbnails, function( index, element ) {
				var $thumbnail = element.$thumbnailContainer;

				if ( typeof $thumbnail.attr( 'data-retina-loaded' ) === 'undefined' ) {
					$thumbnail.attr( 'data-retina-loaded', true );

					$thumbnail.find( 'img[data-retina]' ).each(function() {
						var $image = $( this );

						if ( typeof $image.attr( 'data-src' ) !== 'undefined' ) {
							$image.attr( 'data-src', $image.attr( 'data-retina' ) );
						} else {
							that._loadRetinaImage( $image, function( newImage ) {
								if ( newImage.hasClass( 'sp-thumbnail' ) ) {
									element.resizeImage();
								}
							});
						}
					});
				}
			});
		},

		// Load the retina image
		_loadRetinaImage: function( image, callback ) {
			var retinaFound = false,
				newImagePath = '';

			// Check if there is a retina image specified
			if ( typeof image.attr( 'data-retina' ) !== 'undefined' ) {
				retinaFound = true;

				newImagePath = image.attr( 'data-retina' );
			}

			// Check if there is a lazy loaded, non-retina, image specified
			if ( typeof image.attr( 'data-src' ) !== 'undefined' ) {
				if ( retinaFound === false ) {
					newImagePath = image.attr( 'data-src') ;
				}

				image.removeAttr('data-src');
			}

			// Return if there isn't a retina or lazy loaded image
			if ( newImagePath === '' ) {
				return;
			}

			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr('class') );
			newImage.attr( 'style', image.attr('style') );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined' ) {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined' ) {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;

			// Assign the source of the image
			newImage.attr( 'src', newImagePath );

			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyRetina: function() {
			this.off( 'update.' + NS );
			this.off( 'update.Thumbnails.' + NS );
		}
	};

	$.SliderPro.addModule( 'Retina', Retina );
	
})( window, jQuery );

// Lazy Loading module for Slider Pro.
// 
// Adds the possibility to delay the loading of the images until the slides/thumbnails
// that contain them become visible. This technique improves the initial loading
// performance.
;(function( window, $ ) {

	"use strict";

	var NS = 'LazyLoading.' + $.SliderPro.namespace;

	var LazyLoading = {

		allowLazyLoadingCheck: true,

		initLazyLoading: function() {
			var that = this;

			// The 'resize' event is fired after every update, so it's possible to use it for checking
			// if the update made new slides become visible
			// 
			// Also, resizing the slider might make new slides or thumbnails visible
			this.on( 'sliderResize.' + NS, $.proxy( this._lazyLoadingOnResize, this ) );

			// Check visible images when a new slide is selected
			this.on( 'gotoSlide.' + NS, $.proxy( this._checkAndLoadVisibleImages, this ) );

			// Check visible thumbnail images when the thumbnails are updated because new thumbnail
			// might have been added or the settings might have been changed so that more thumbnail
			// images become visible
			// 
			// Also, check visible thumbnail images after the thumbnails have moved because new thumbnails might
			// have become visible
			this.on( 'thumbnailsUpdate.' + NS + ' ' + 'thumbnailsMoveComplete.' + NS, $.proxy( this._checkAndLoadVisibleThumbnailImages, this ) );
		},

		_lazyLoadingOnResize: function() {
			var that = this;

			if ( this.allowLazyLoadingCheck === false ) {
				return;
			}

			this.allowLazyLoadingCheck = false;
			
			this._checkAndLoadVisibleImages();

			if ( this.$slider.find( '.sp-thumbnail' ).length !== 0 ) {
				this._checkAndLoadVisibleThumbnailImages();
			}

			// Use a timer to deffer the loading of images in order to prevent too many
			// checking attempts
			setTimeout(function() {
				that.allowLazyLoadingCheck = true;
			}, 500 );
		},

		// Check visible slides and load their images
		_checkAndLoadVisibleImages: function() {
			if ( this.$slider.find( '.sp-slide:not([ data-loaded ])' ).length === 0 ) {
				return;
			}

			var that = this,

				// Use either the middle position or the index of the selected slide as a reference, depending on
				// whether the slider is loopable
				referencePosition = this.settings.loop === true ? this.middleSlidePosition : this.selectedSlideIndex,

				// Calculate how many slides are visible at the sides of the selected slide
				visibleOnSides = Math.ceil( ( parseInt( this.$slidesMask.css( this.sizeProperty ), 10) - this.averageSlideSize ) / 2 / this.averageSlideSize ),

				// Calculate the indexes of the first and last slide that will be checked
				from = this.settings.centerSelectedSlide === true ? Math.max( referencePosition - visibleOnSides - 1, 0 ) : Math.max( referencePosition - 1, 0 ),
				to = this.settings.centerSelectedSlide === true ? Math.min( referencePosition + visibleOnSides + 1, this.getTotalSlides() - 1 ) : Math.min( referencePosition + visibleOnSides * 2 + 1, this.getTotalSlides() - 1  ),
				
				// Get all the slides that need to be checked
				slidesToCheck = this.slidesOrder.slice( from, to + 1 );

			// Loop through the selected slides and if the slide is not marked as having
			// been loaded yet, loop through its images and load them.
			$.each( slidesToCheck, function( index, element ) {
				var slide = that.slides[ element ],
					$slide = slide.$slide;

				if ( typeof $slide.attr( 'data-loaded' ) === 'undefined' ) {
					$slide.attr( 'data-loaded', true );

					$slide.find( 'img[ data-src ]' ).each(function() {
						var image = $( this );
						that._loadImage( image, function( newImage ) {
							if ( newImage.hasClass( 'sp-image' ) ) {
								slide.$mainImage = newImage;
								slide.resizeMainImage( true );
							}
						});
					});
				}
			});
		},

		// Check visible thumbnails and load their images
		_checkAndLoadVisibleThumbnailImages: function() {
			if ( this.$slider.find( '.sp-thumbnail-container:not([ data-loaded ])' ).length === 0 ) {
				return;
			}

			var that = this,
				thumbnailSize = this.thumbnailsSize / this.thumbnails.length,

				// Calculate the indexes of the first and last thumbnail that will be checked
				from = Math.floor( Math.abs( this.thumbnailsPosition / thumbnailSize ) ),
				to = Math.floor( ( - this.thumbnailsPosition + this.thumbnailsContainerSize ) / thumbnailSize ),

				// Get all the thumbnails that need to be checked
				thumbnailsToCheck = this.thumbnails.slice( from, to + 1 );

			// Loop through the selected thumbnails and if the thumbnail is not marked as having
			// been loaded yet, load its image.
			$.each( thumbnailsToCheck, function( index, element ) {
				var $thumbnailContainer = element.$thumbnailContainer;

				if ( typeof $thumbnailContainer.attr( 'data-loaded' ) === 'undefined' ) {
					$thumbnailContainer.attr( 'data-loaded', true );

					$thumbnailContainer.find( 'img[ data-src ]' ).each(function() {
						var image = $( this );

						that._loadImage( image, function() {
							element.resizeImage();
						});
					});
				}
			});
		},

		// Load an image
		_loadImage: function( image, callback ) {
			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr( 'class' ) );
			newImage.attr( 'style', image.attr( 'style' ) );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined') {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined') {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			// Assign the source of the image
			newImage.attr( 'src', image.attr( 'data-src' ) );
			newImage.removeAttr( 'data-src' );

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;
			
			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyLazyLoading: function() {
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'sliderResize.' + NS );
			this.off( 'thumbnailsUpdate.' + NS );
			this.off( 'thumbnailsMoveComplete.' + NS );
		}
	};

	$.SliderPro.addModule( 'LazyLoading', LazyLoading );

})( window, jQuery );

// Layers module for Slider Pro.
// 
// Adds support for animated and static layers. The layers can contain any content,
// from simple text for video elements.
;(function( window, $ ) {

	"use strict";

	var NS = 'Layers.' +  $.SliderPro.namespace;

	var Layers = {

		// Reference to the original 'gotoSlide' method
		layersGotoSlideReference: null,

		// Reference to the timer that will delay the overriding
		// of the 'gotoSlide' method
		waitForLayersTimer: null,

		initLayers: function() {
			this.on( 'update.' + NS, $.proxy( this._layersOnUpdate, this ) );
			this.on( 'sliderResize.' + NS, $.proxy( this._layersOnResize, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._layersOnGotoSlide, this ) );
		},

		// Loop through the slides and initialize all layers
		_layersOnUpdate: function( event ) {
			var that = this;

			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				// Initialize the layers
				this.$slide.find( '.sp-layer:not([ data-layer-init ])' ).each(function() {
					var layer = new Layer( $( this ) );

					// Add the 'layers' array to the slide objects (instance of SliderProSlide)
					if ( typeof element.layers === 'undefined' ) {
						element.layers = [];
					}

					element.layers.push( layer );

					if ( $( this ).hasClass( 'sp-static' ) === false ) {

						// Add the 'animatedLayers' array to the slide objects (instance of SliderProSlide)
						if ( typeof element.animatedLayers === 'undefined' ) {
							element.animatedLayers = [];
						}

						element.animatedLayers.push( layer );
					}
				});
			});

			// If the 'waitForLayers' option is enabled, the slider will not move to another slide
			// until all the layers from the previous slide will be hidden. To achieve this,
			// replace the current 'gotoSlide' function with another function that will include the 
			// required functionality.
			// 
			// Since the 'gotoSlide' method might be overridden by other modules as well, delay this
			// override to make sure it's the last override.
			if ( this.settings.waitForLayers === true ) {
				clearTimeout( this.waitForLayersTimer );

				this.waitForLayersTimer = setTimeout(function() {
					that.layersGotoSlideReference = that.gotoSlide;
					that.gotoSlide = that._layersGotoSlide;
				}, 1 );
			}

			// Show the layers for the initial slide
			// Delay the call in order to make sure the layers
			// are scaled properly before displaying them
			setTimeout(function() {
				that.showLayers( that.selectedSlideIndex );
			}, 1);
		},

		// When the slider resizes, try to scale down the layers proportionally. The automatic scaling
		// will make use of an option, 'autoScaleReference', by comparing the current width of the slider
		// with the reference width. So, if the reference width is 1000 pixels and the current width is
		// 500 pixels, it means that the layers will be scaled down to 50% of their size.
		_layersOnResize: function() {
			var that = this,
				autoScaleReference,
				useAutoScale = this.settings.autoScaleLayers,
				scaleRatio;

			if ( this.settings.autoScaleLayers === false ) {
				return;
			}

			// If there isn't a reference for how the layers should scale down automatically, use the 'width'
			// option as a reference, unless the width was set to a percentage. If there isn't a set reference and
			// the width was set to a percentage, auto scaling will not be used because it's not possible to
			// calculate how much should the layers scale.
			if ( this.settings.autoScaleReference === -1 ) {
				if ( typeof this.settings.width === 'string' && this.settings.width.indexOf( '%' ) !== -1 ) {
					useAutoScale = false;
				} else {
					autoScaleReference = parseInt( this.settings.width, 10 );
				}
			} else {
				autoScaleReference = this.settings.autoScaleReference;
			}

			if ( useAutoScale === true && this.slideWidth < autoScaleReference ) {
				scaleRatio = that.slideWidth / autoScaleReference;
			} else {
				scaleRatio = 1;
			}

			$.each( this.slides, function( index, slide ) {
				if ( typeof slide.layers !== 'undefined' ) {
					$.each( slide.layers, function( index, layer ) {
						layer.scale( scaleRatio );
					});
				}
			});
		},

		// Replace the 'gotoSlide' method with this one, which makes it possible to 
		// change the slide only after the layers from the previous slide are hidden.
		_layersGotoSlide: function( index ) {
			var that = this,
				animatedLayers = this.slides[ this.selectedSlideIndex ].animatedLayers;

			// If the slider is dragged, don't wait for the layer to hide
			if ( this.$slider.hasClass( 'sp-swiping' ) || typeof animatedLayers === 'undefined' || animatedLayers.length === 0  ) {
				this.layersGotoSlideReference( index );
			} else {
				this.on( 'hideLayersComplete.' + NS, function() {
					that.off( 'hideLayersComplete.' + NS );
					that.layersGotoSlideReference( index );
				});

				this.hideLayers( this.selectedSlideIndex );
			}
		},

		// When a new slide is selected, hide the layers from the previous slide
		// and show the layers from the current slide.
		_layersOnGotoSlide: function( event ) {
			if ( this.previousSlideIndex !== this.selectedSlideIndex ) {
				this.hideLayers( this.previousSlideIndex );
			}

			this.showLayers( this.selectedSlideIndex );
		},

		// Show the animated layers from the slide at the specified index,
		// and fire an event when all the layers from the slide become visible.
		showLayers: function( index ) {
			var that = this,
				animatedLayers = this.slides[ index ].animatedLayers,
				layerCounter = 0;

			if ( typeof animatedLayers === 'undefined' ) {
				return;
			}

			$.each( animatedLayers, function( index, element ) {

				// If the layer is already visible, increment the counter directly, else wait 
				// for the layer's showing animation to complete.
				if ( element.isVisible() === true ) {
					layerCounter++;

					if ( layerCounter === animatedLayers.length ) {
						that.trigger({ type: 'showLayersComplete', index: index });
						if ( $.isFunction( that.settings.showLayersComplete ) ) {
							that.settings.showLayersComplete.call( that, { type: 'showLayersComplete', index: index });
						}
					}
				} else {
					element.show(function() {
						layerCounter++;

						if ( layerCounter === animatedLayers.length ) {
							that.trigger({ type: 'showLayersComplete', index: index });
							if ( $.isFunction( that.settings.showLayersComplete ) ) {
								that.settings.showLayersComplete.call( that, { type: 'showLayersComplete', index: index });
							}
						}
					});
				}
			});
		},

		// Hide the animated layers from the slide at the specified index,
		// and fire an event when all the layers from the slide become invisible.
		hideLayers: function( index ) {
			var that = this,
				animatedLayers = this.slides[ index ].animatedLayers,
				layerCounter = 0;

			if ( typeof animatedLayers === 'undefined' ) {
				return;
			}

			$.each( animatedLayers, function( index, element ) {

				// If the layer is already invisible, increment the counter directly, else wait 
				// for the layer's hiding animation to complete.
				if ( element.isVisible() === false ) {
					layerCounter++;

					if ( layerCounter === animatedLayers.length ) {
						that.trigger({ type: 'hideLayersComplete', index: index });
						if ( $.isFunction( that.settings.hideLayersComplete ) ) {
							that.settings.hideLayersComplete.call( that, { type: 'hideLayersComplete', index: index });
						}
					}
				} else {
					element.hide(function() {
						layerCounter++;

						if ( layerCounter === animatedLayers.length ) {
							that.trigger({ type: 'hideLayersComplete', index: index });
							if ( $.isFunction( that.settings.hideLayersComplete ) ) {
								that.settings.hideLayersComplete.call( that, { type: 'hideLayersComplete', index: index });
							}
						}
					});
				}
			});
		},

		// Destroy the module
		destroyLayers: function() {
			this.off( 'update.' + NS );
			this.off( 'sliderResize.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'hideLayersComplete.' + NS );
		},

		layersDefaults: {

			// Indicates whether the slider will wait for the layers to disappear before
			// going to a new slide
			waitForLayers: false,

			// Indicates whether the layers will be scaled automatically
			autoScaleLayers: true,

			// Sets a reference width which will be compared to the current slider width
			// in order to determine how much the layers need to scale down. By default,
			// the reference width will be equal to the slide width. However, if the slide width
			// is set to a percentage value, then it's necessary to set a specific value for 'autoScaleReference'.
			autoScaleReference: -1,

			// Called when all animated layers become visible
			showLayersComplete: function() {},

			// Called when all animated layers become invisible
			hideLayersComplete: function() {}
		}
	};

	// Override the slide's 'destroy' method in order to destroy the 
	// layers that where added to the slide as well.
	var slideDestroy = window.SliderProSlide.prototype.destroy;

	window.SliderProSlide.prototype.destroy = function() {
		if ( typeof this.layers !== 'undefined' ) {
			$.each( this.layers, function( index, element ) {
				element.destroy();
			});

			this.layers.length = 0;
		}

		if ( typeof this.animatedLayers !== 'undefined' ) {
			this.animatedLayers.length = 0;
		}

		slideDestroy.apply( this );
	};

	var Layer = function( layer ) {

		// Reference to the layer jQuery element
		this.$layer = layer;

		// Indicates whether a layer is currently visible or hidden
		this.visible = false;

		// Indicates whether the layer was styled
		this.styled = false;

		// Holds the data attributes added to the layer
		this.data = null;

		// Indicates the layer's reference point (topLeft, bottomLeft, topRight or bottomRight)
		this.position = null;
		
		// Indicates which CSS property (left or right) will be used for positioning the layer 
		this.horizontalProperty = null;
		
		// Indicates which CSS property (top or bottom) will be used for positioning the layer 
		this.verticalProperty = null;

		// Indicates the value of the horizontal position
		this.horizontalPosition = null;
		
		// Indicates the value of the vertical position
		this.verticalPosition = null;

		// Indicates how much the layers needs to be scaled
		this.scaleRatio = 1;

		// Indicates the type of supported transition (CSS3 2D, CSS3 3D or JavaScript)
		this.supportedAnimation = SliderProUtils.getSupportedAnimation();

		// Indicates the required vendor prefix for CSS (i.e., -webkit, -moz, etc.)
		this.vendorPrefix = SliderProUtils.getVendorPrefix();

		// Indicates the name of the CSS transition's complete event (i.e., transitionend, webkitTransitionEnd, etc.)
		this.transitionEvent = SliderProUtils.getTransitionEvent();

		// Reference to the timer that will be used to hide/show the layers
		this.delayTimer = null;

		// Reference to the timer that will be used to hide the layers automatically after a given time interval
		this.stayTimer = null;

		this._init();
	};

	Layer.prototype = {

		// Initialize the layers
		_init: function() {
			this.$layer.attr( 'data-layer-init', true );

			if ( this.$layer.hasClass( 'sp-static' ) ) {
				this._setStyle();
			} else {
				this.$layer.css({ 'visibility': 'hidden' });
			}
		},

		// Set the size and position of the layer
		_setStyle: function() {
			this.styled = true;

			// Get the data attributes specified in HTML
			this.data = this.$layer.data();
			
			if ( typeof this.data.width !== 'undefined' ) {
				this.$layer.css( 'width', this.data.width );
			}

			if ( typeof this.data.height !== 'undefined' ) {
				this.$layer.css( 'height', this.data.height );
			}

			if ( typeof this.data.depth !== 'undefined' ) {
				this.$layer.css( 'z-index', this.data.depth );
			}

			this.position = this.data.position ? ( this.data.position ).toLowerCase() : 'topleft';

			if ( this.position.indexOf( 'right' ) !== -1 ) {
				this.horizontalProperty = 'right';
			} else if ( this.position.indexOf( 'left' ) !== -1 ) {
				this.horizontalProperty = 'left';
			} else {
				this.horizontalProperty = 'center';
			}

			if ( this.position.indexOf( 'bottom' ) !== -1 ) {
				this.verticalProperty = 'bottom';
			} else if ( this.position.indexOf( 'top' ) !== -1 ) {
				this.verticalProperty = 'top';
			} else {
				this.verticalProperty = 'center';
			}

			this._setPosition();

			this.scale( this.scaleRatio );
		},

		// Set the position of the layer
		_setPosition: function() {
			var inlineStyle = this.$layer.attr( 'style' );

			this.horizontalPosition = typeof this.data.horizontal !== 'undefined' ? this.data.horizontal : 0;
			this.verticalPosition = typeof this.data.vertical !== 'undefined' ? this.data.vertical : 0;

			// Set the horizontal position of the layer based on the data set
			if ( this.horizontalProperty === 'center' ) {
				
				// prevent content wrapping while setting the width
				if ( this.$layer.is( 'img' ) === false && ( typeof inlineStyle === 'undefined' || ( typeof inlineStyle !== 'undefined' && inlineStyle.indexOf( 'width' ) === -1 ) ) ) {
					this.$layer.css( 'white-space', 'nowrap' );
					this.$layer.css( 'width', this.$layer.outerWidth( true ) );
				}

				this.$layer.css({ 'marginLeft': 'auto', 'marginRight': 'auto', 'left': this.horizontalPosition, 'right': 0 });
			} else {
				this.$layer.css( this.horizontalProperty, this.horizontalPosition );
			}

			// Set the vertical position of the layer based on the data set
			if ( this.verticalProperty === 'center' ) {

				// prevent content wrapping while setting the height
				if ( this.$layer.is( 'img' ) === false && ( typeof inlineStyle === 'undefined' || ( typeof inlineStyle !== 'undefined' && inlineStyle.indexOf( 'height' ) === -1 ) ) ) {
					this.$layer.css( 'white-space', 'nowrap' );
					this.$layer.css( 'height', this.$layer.outerHeight( true ) );
				}

				this.$layer.css({ 'marginTop': 'auto', 'marginBottom': 'auto', 'top': this.verticalPosition, 'bottom': 0 });
			} else {
				this.$layer.css( this.verticalProperty, this.verticalPosition );
			}
		},

		// Scale the layer
		scale: function( ratio ) {

			// Return if the layer is set to be unscalable
			if ( this.$layer.hasClass( 'sp-no-scale' ) ) {
				return;
			}

			// Store the ratio (even if the layer is not ready to be scaled yet)
			this.scaleRatio = ratio;

			// Return if the layer is not styled yet
			if ( this.styled === false ) {
				return;
			}

			var horizontalProperty = this.horizontalProperty === 'center' ? 'left' : this.horizontalProperty,
				verticalProperty = this.verticalProperty === 'center' ? 'top' : this.verticalProperty,
				css = {};

			// Apply the scaling
			css[ this.vendorPrefix + 'transform-origin' ] = this.horizontalProperty + ' ' + this.verticalProperty;
			css[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';

			// If the position is not set to a percentage value, apply the scaling to the position
			if ( typeof this.horizontalPosition !== 'string' ) {
				css[ horizontalProperty ] = this.horizontalPosition * this.scaleRatio;
			}

			// If the position is not set to a percentage value, apply the scaling to the position
			if ( typeof this.verticalPosition !== 'string' ) {
				css[ verticalProperty ] = this.verticalPosition * this.scaleRatio;
			}

			// If the width or height is set to a percentage value, increase the percentage in order to
			// maintain the same layer to slide proportions. This is necessary because otherwise the scaling
			// transform would minimize the layers more than intended.
			if ( typeof this.data.width === 'string' && this.data.width.indexOf( '%' ) !== -1 ) {
				css.width = ( parseInt( this.data.width, 10 ) / this.scaleRatio ).toString() + '%';
			}

			if ( typeof this.data.height === 'string' && this.data.height.indexOf( '%' ) !== -1 ) {
				css.height = ( parseInt( this.data.height, 10 ) / this.scaleRatio ).toString() + '%';
			}

			this.$layer.css( css );
		},

		// Show the layer
		show: function( callback ) {
			if ( this.visible === true ) {
				return;
			}

			this.visible = true;

			// First, style the layer if it's not already styled
			if ( this.styled === false ) {
				this._setStyle();
			}

			var that = this,
				offset = typeof this.data.showOffset !== 'undefined' ? this.data.showOffset : 50,
				duration = typeof this.data.showDuration !== 'undefined' ? this.data.showDuration / 1000 : 0.4,
				delay = typeof this.data.showDelay !== 'undefined' ? this.data.showDelay : 10,
				stayDuration = typeof that.data.stayDuration !== 'undefined' ? parseInt( that.data.stayDuration, 10 ) : -1;

			// Animate the layers with CSS3 or with JavaScript
			if ( this.supportedAnimation === 'javascript' ) {
				this.$layer
					.stop()
					.delay( delay )
					.css({ 'opacity': 0, 'visibility': 'visible' })
					.animate( { 'opacity': 1 }, duration * 1000, function() {

						// Hide the layer after a given time interval
						if ( stayDuration !== -1 ) {
							that.stayTimer = setTimeout(function() {
								that.hide();
								that.stayTimer = null;
							}, stayDuration );
						}

						if ( typeof callback !== 'undefined' ) {
							callback();
						}
					});
			} else {
				var start = { 'opacity': 0, 'visibility': 'visible' },
					target = { 'opacity': 1 },
					transformValues = '';

				start[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';
				target[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';
				target[ this.vendorPrefix + 'transition' ] = 'opacity ' + duration + 's';

				if ( typeof this.data.showTransition !== 'undefined' ) {
					if ( this.data.showTransition === 'left' ) {
						transformValues = offset + 'px, 0';
					} else if ( this.data.showTransition === 'right' ) {
						transformValues = '-' + offset + 'px, 0';
					} else if ( this.data.showTransition === 'up' ) {
						transformValues = '0, ' + offset + 'px';
					} else if ( this.data.showTransition === 'down') {
						transformValues = '0, -' + offset + 'px';
					}

					start[ this.vendorPrefix + 'transform' ] += this.supportedAnimation === 'css-3d' ? ' translate3d(' + transformValues + ', 0)' : ' translate(' + transformValues + ')';
					target[ this.vendorPrefix + 'transform' ] += this.supportedAnimation === 'css-3d' ? ' translate3d(0, 0, 0)' : ' translate(0, 0)';
					target[ this.vendorPrefix + 'transition' ] += ', ' + this.vendorPrefix + 'transform ' + duration + 's';
				}

				// Listen when the layer animation is complete
				this.$layer.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$layer
						.off( that.transitionEvent )
						.css( that.vendorPrefix + 'transition', '' );

					// Hide the layer after a given time interval
					if ( stayDuration !== -1 ) {
						that.stayTimer = setTimeout(function() {
							that.hide();
							that.stayTimer = null;
						}, stayDuration );
					}

					if ( typeof callback !== 'undefined' ) {
						callback();
					}
				});

				this.$layer.css( start );

				this.delayTimer = setTimeout( function() {
					that.$layer.css( target );
				}, delay );
			}
		},

		// Hide the layer
		hide: function( callback ) {
			if ( this.visible === false ) {
				return;
			}

			var that = this,
				offset = typeof this.data.hideOffset !== 'undefined' ? this.data.hideOffset : 50,
				duration = typeof this.data.hideDuration !== 'undefined' ? this.data.hideDuration / 1000 : 0.4,
				delay = typeof this.data.hideDelay !== 'undefined' ? this.data.hideDelay : 10;

			this.visible = false;

			// If the layer is hidden before it hides automatically, clear the timer
			if ( this.stayTimer !== null ) {
				clearTimeout( this.stayTimer );
			}

			// Animate the layers with CSS3 or with JavaScript
			if ( this.supportedAnimation === 'javascript' ) {
				this.$layer
					.stop()
					.delay( delay )
					.animate({ 'opacity': 0 }, duration * 1000, function() {
						$( this ).css( 'visibility', 'hidden' );

						if ( typeof callback !== 'undefined' ) {
							callback();
						}
					});
			} else {
				var transformValues = '',
					target = { 'opacity': 0 };

				target[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';
				target[ this.vendorPrefix + 'transition' ] = 'opacity ' + duration + 's';

				if ( typeof this.data.hideTransition !== 'undefined' ) {
					if ( this.data.hideTransition === 'left' ) {
						transformValues = '-' + offset + 'px, 0';
					} else if ( this.data.hideTransition === 'right' ) {
						transformValues = offset + 'px, 0';
					} else if ( this.data.hideTransition === 'up' ) {
						transformValues = '0, -' + offset + 'px';
					} else if ( this.data.hideTransition === 'down' ) {
						transformValues = '0, ' + offset + 'px';
					}

					target[ this.vendorPrefix + 'transform' ] += this.supportedAnimation === 'css-3d' ? ' translate3d(' + transformValues + ', 0)' : ' translate(' + transformValues + ')';
					target[ this.vendorPrefix + 'transition' ] += ', ' + this.vendorPrefix + 'transform ' + duration + 's';
				}

				// Listen when the layer animation is complete
				this.$layer.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$layer
						.off( that.transitionEvent )
						.css( that.vendorPrefix + 'transition', '' );

					// Hide the layer after transition
					if ( that.visible === false ) {
						that.$layer.css( 'visibility', 'hidden' );
					}

					if ( typeof callback !== 'undefined' ) {
						callback();
					}
				});

				this.delayTimer = setTimeout( function() {
					that.$layer.css( target );
				}, delay );
			}
		},

		isVisible: function() {
			if ( this.visible === false || this.$layer.is( ':hidden' ) ) {
				return false;
			}

			return true;
		},

		// Destroy the layer
		destroy: function() {
			this.$layer.removeAttr( 'style' );
			this.$layer.removeAttr( 'data-layer-init' );
			clearTimeout( this.delayTimer );
			clearTimeout( this.stayTimer );
			this.delayTimer = null;
			this.stayTimer = null;
		}
	};

	$.SliderPro.addModule( 'Layers', Layers );
	
})( window, jQuery );

// Fade module for Slider Pro.
// 
// Adds the possibility to navigate through slides using a cross-fade effect.
;(function( window, $ ) {

	"use strict";

	var NS = 'Fade.' + $.SliderPro.namespace;

	var Fade = {

		// Reference to the original 'gotoSlide' method
		fadeGotoSlideReference: null,

		initFade: function() {
			this.on( 'update.' + NS, $.proxy( this._fadeOnUpdate, this ) );
		},

		// If fade is enabled, store a reference to the original 'gotoSlide' method
		// and then assign a new function to 'gotoSlide'.
		_fadeOnUpdate: function() {
			if ( this.settings.fade === true ) {
				this.fadeGotoSlideReference = this.gotoSlide;
				this.gotoSlide = this._fadeGotoSlide;
			}
		},

		// Will replace the original 'gotoSlide' function by adding a cross-fade effect
		// between the previous and the next slide.
		_fadeGotoSlide: function( index ) {
			if ( index === this.selectedSlideIndex ) {
				return;
			}
			
			// If the slides are being swiped/dragged, don't use fade, but call the original method instead.
			// If not, which means that a new slide was selected through a button, arrows or direct call, then
			// use fade.
			if ( this.$slider.hasClass( 'sp-swiping' ) ) {
				this.fadeGotoSlideReference( index );
			} else {
				var that = this,
					$nextSlide,
					$previousSlide,
					newIndex = index;

				// Loop through all the slides and overlap the previous and next slide,
				// and hide the other slides.
				$.each( this.slides, function( index, element ) {
					var slideIndex = element.getIndex(),
						$slide = element.$slide;

					if ( slideIndex === newIndex ) {
						$slide.css({ 'opacity': 0, 'left': 0, 'top': 0, 'z-index': 20, visibility: 'visible' });
						$nextSlide = $slide;
					} else if ( slideIndex === that.selectedSlideIndex ) {
						$slide.css({ 'opacity': 1, 'left': 0, 'top': 0, 'z-index': 10, visibility: 'visible' });
						$previousSlide = $slide;
					} else {
						$slide.css({ 'opacity': 1, visibility: 'hidden', 'z-index': '' });
					}
				});

				// Set the new indexes for the previous and selected slides
				this.previousSlideIndex = this.selectedSlideIndex;
				this.selectedSlideIndex = index;

				// Re-assign the 'sp-selected' class to the currently selected slide
				this.$slides.find( '.sp-selected' ).removeClass( 'sp-selected' );
				this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );
			
				// Rearrange the slides if the slider is loop-able
				if ( that.settings.loop === true ) {
					that._updateSlidesOrder();
				}

				// Move the slides container so that the cross-fading slides (which now have the top and left
				// position set to 0) become visible.
				this._moveTo( 0, true );

				// Fade in the selected slide
				this._fadeSlideTo( $nextSlide, 1, function() {

					// This flag will indicate if all the fade transitions are complete,
					// in case there are multiple running at the same time, which happens
					// when the slides are navigated very quickly
					var allTransitionsComplete = true;

					// Go through all the slides and check if there is at least one slide 
					// that is still transitioning.
					$.each( that.slides, function( index, element ) {
						if ( typeof element.$slide.attr( 'data-transitioning' ) !== 'undefined' ) {
							allTransitionsComplete = false;
						}
					});

					if ( allTransitionsComplete === true ) {

						// After all the transitions are complete, make all the slides visible again
						$.each( that.slides, function( index, element ) {
							var $slide = element.$slide;
							$slide.css({ 'visibility': '', 'opacity': '', 'z-index': '' });
						});
						
						// Reset the position of the slides and slides container
						that._resetSlidesPosition();
					}

					// Fire the 'gotoSlideComplete' event
					that.trigger({ type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex });
					if ( $.isFunction( that.settings.gotoSlideComplete ) ) {
						that.settings.gotoSlideComplete.call( that, { type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex } );
					}
				});

				// Fade out the previous slide, if indicated, in addition to fading in the next slide
				if ( this.settings.fadeOutPreviousSlide === true ) {
					this._fadeSlideTo( $previousSlide, 0 );
				}

				if ( this.settings.autoHeight === true ) {
					this._resizeHeight();
				}

				// Fire the 'gotoSlide' event
				this.trigger({ type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
				if ( $.isFunction( this.settings.gotoSlide ) ) {
					this.settings.gotoSlide.call( this, { type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
				}
			}
		},

		// Fade the target slide to the specified opacity (0 or 1)
		_fadeSlideTo: function( target, opacity, callback ) {
			var that = this;

			// apply the attribute only to slides that fade in
			if ( opacity === 1 ) {
				target.attr( 'data-transitioning', true );
			}

			// Use CSS transitions if they are supported. If not, use JavaScript animation.
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {

				// There needs to be a delay between the moment the opacity is set
				// and the moment the transitions starts.
				setTimeout(function(){
					var css = { 'opacity': opacity };
					css[ that.vendorPrefix + 'transition' ] = 'opacity ' + that.settings.fadeDuration / 1000 + 's';
					target.css( css );
				}, 100 );

				target.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}
					
					target.off( that.transitionEvent );
					target.css( that.vendorPrefix + 'transition', '' );
					target.removeAttr( 'data-transitioning');

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			} else {
				target.stop().animate({ 'opacity': opacity }, this.settings.fadeDuration, function() {
					target.removeAttr( 'data-transitioning' );

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			}
		},

		// Destroy the module
		destroyFade: function() {
			this.off( 'update.' + NS );

			if ( this.fadeGotoSlideReference !== null ) {
				this.gotoSlide = this.fadeGotoSlideReference;
			}
		},

		fadeDefaults: {

			// Indicates if fade will be used
			fade: false,

			// Indicates if the previous slide will be faded out (in addition to the next slide being faded in)
			fadeOutPreviousSlide: true,

			// Sets the duration of the fade effect
			fadeDuration: 500
		}
	};

	$.SliderPro.addModule( 'Fade', Fade );

})( window, jQuery );

// Touch Swipe module for Slider Pro.
// 
// Adds touch-swipe functionality for slides.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'TouchSwipe.' + $.SliderPro.namespace;

	var TouchSwipe = {

		// The x and y coordinates of the pointer/finger's starting position
		touchStartPoint: {x: 0, y: 0},

		// The x and y coordinates of the pointer/finger's end position
		touchEndPoint: {x: 0, y: 0},

		// The distance from the starting to the end position on the x and y axis
		touchDistance: {x: 0, y: 0},

		// The position of the slides when the touch swipe starts
		touchStartPosition: 0,

		// Indicates if the slides are being swiped
		isTouchMoving: false,

		// Stores the names of the events
		touchSwipeEvents: { startEvent: '', moveEvent: '', endEvent: '' },

		// Indicates if scrolling (the page) in the opposite direction of the
		// slides' layout is allowed. This is used to block vertical (or horizontal)
		// scrolling when the user is scrolling through the slides.
		allowOppositeScrolling: true,

		// Indicates whether the previous 'start' event was a 'touchstart' or 'mousedown'
		previousStartEvent: '',

		initTouchSwipe: function() {
			var that = this;

			// check if touch swipe is enabled
			if ( this.settings.touchSwipe === false ) {
				return;
			}

			this.touchSwipeEvents.startEvent = 'touchstart' + '.' + NS + ' mousedown' + '.' + NS;
			this.touchSwipeEvents.moveEvent = 'touchmove' + '.' + NS + ' mousemove' + '.' + NS;
			this.touchSwipeEvents.endEvent = 'touchend' + '.' + this.uniqueId + '.' + NS + ' mouseup' + '.' + this.uniqueId + '.' + NS;

			// Listen for touch swipe/mouse move events
			this.$slidesMask.on( this.touchSwipeEvents.startEvent, $.proxy( this._onTouchStart, this ) );
			this.$slidesMask.on( 'dragstart.' + NS, function( event ) {
				event.preventDefault();
			});

			// Prevent 'click' events unless there is intention for a 'click'
			this.$slidesMask.find( 'a' ).on( 'click.' + NS, function( event ) {
				if ( that.$slider.hasClass( 'sp-swiping' ) ) {
					event.preventDefault();
				}
			});

			// Add the grabbing icon
			this.$slidesMask.addClass( 'sp-grab' );
		},

		// Called when the slides starts being dragged
		_onTouchStart: function( event ) {

			// Return if a 'mousedown' event follows a 'touchstart' event
			if ( event.type === 'mousedown' && this.previousStartEvent === 'touchstart' ) {
				this.previousStartEvent = event.type;
				return;
			}

			// Assign the new 'start' event
			this.previousStartEvent = event.type;

			// Disable dragging if the element is set to allow selections
			if ( $( event.target ).closest( '.sp-selectable' ).length >= 1 ) {
				return;
			}

			var that = this,
				eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Get the initial position of the mouse pointer and the initial position
			// of the slides' container
			this.touchStartPoint.x = eventObject.pageX || eventObject.clientX;
			this.touchStartPoint.y = eventObject.pageY || eventObject.clientY;
			this.touchStartPosition = this.slidesPosition;

			// Clear the previous distance values
			this.touchDistance.x = this.touchDistance.y = 0;

			// If the slides are being grabbed while they're still animating, stop the
			// current movement
			if ( this.$slides.hasClass( 'sp-animated' ) ) {
				this.isTouchMoving = true;
				this._stopMovement();
				this.touchStartPosition = this.slidesPosition;
			}

			// Listen for move and end events
			this.$slidesMask.on( this.touchSwipeEvents.moveEvent, $.proxy( this._onTouchMove, this ) );
			$( document ).on( this.touchSwipeEvents.endEvent, $.proxy( this._onTouchEnd, this ) );

			// Swap grabbing icons
			this.$slidesMask.removeClass( 'sp-grab' ).addClass( 'sp-grabbing' );
		},

		// Called during the slides' dragging
		_onTouchMove: function( event ) {
			var eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Indicate that the move event is being fired
			this.isTouchMoving = true;

			// Add 'sp-swiping' class to indicate that the slides are being swiped
			if ( this.$slider.hasClass( 'sp-swiping' ) === false ) {
				this.$slider.addClass( 'sp-swiping' );
			}

			// Get the current position of the mouse pointer
			this.touchEndPoint.x = eventObject.pageX || eventObject.clientX;
			this.touchEndPoint.y = eventObject.pageY || eventObject.clientY;

			// Calculate the distance of the movement on both axis
			this.touchDistance.x = this.touchEndPoint.x - this.touchStartPoint.x;
			this.touchDistance.y = this.touchEndPoint.y - this.touchStartPoint.y;
			
			// Calculate the distance of the swipe that takes place in the same direction as the orientation of the slides
			// and calculate the distance from the opposite direction.
			// 
			// For a swipe to be valid there should more distance in the same direction as the orientation of the slides.
			var distance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y,
				oppositeDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.y : this.touchDistance.x;

			// If the movement is in the same direction as the orientation of the slides, the swipe is valid
			// and opposite scrolling will not be allowed.
			if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
				this.allowOppositeScrolling = false;
			}

			// If opposite scrolling is still allowed, the swipe wasn't valid, so return.
			if ( this.allowOppositeScrolling === true ) {
				return;
			}
			
			// Don't allow opposite scrolling
			event.preventDefault();

			if ( this.settings.loop === false ) {
				// Make the slides move slower if they're dragged outside its bounds
				if ( ( this.slidesPosition > this.touchStartPosition && this.selectedSlideIndex === 0 ) ||
					( this.slidesPosition < this.touchStartPosition && this.selectedSlideIndex === this.getTotalSlides() - 1 )
				) {
					distance = distance * 0.2;
				}
			}

			this._moveTo( this.touchStartPosition + distance, true );
		},

		// Called when the slides are released
		_onTouchEnd: function( event ) {
			var that = this,
				touchDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;

			// Remove the 'move' and 'end' listeners
			this.$slidesMask.off( this.touchSwipeEvents.moveEvent );
			$( document ).off( this.touchSwipeEvents.endEvent );

			this.allowOppositeScrolling = true;

			// Swap grabbing icons
			this.$slidesMask.removeClass( 'sp-grabbing' ).addClass( 'sp-grab' );

			// Remove the 'sp-swiping' class with a delay, to allow
			// other event listeners (i.e. click) to check the existance
			// of the swipe event.
			if ( this.$slider.hasClass( 'sp-swiping' ) ) {
				setTimeout(function() {
					that.$slider.removeClass( 'sp-swiping' );
				}, 100 );
			}

			// Return if the slides didn't move
			if ( this.isTouchMoving === false ) {
				return;
			}

			this.isTouchMoving = false;

			// Calculate the old position of the slides in order to return to it if the swipe
			// is below the threshold
			var selectedSlideOffset = this.settings.centerSelectedSlide === true && this.settings.visibleSize !== 'auto' ? Math.round( ( parseInt( this.$slidesMask.css( this.sizeProperty ), 10 ) - this.getSlideAt( this.selectedSlideIndex ).getSize()[ this.sizeProperty ] ) / 2 ) : 0,
				oldSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + selectedSlideOffset;

			if ( Math.abs( touchDistance ) < this.settings.touchSwipeThreshold ) {
				this._moveTo( oldSlidesPosition );
			} else {
				
				// Calculate by how many slides the slides container has moved
				var	slideArrayDistance = ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ? -1 : 1 ) * touchDistance / ( this.averageSlideSize + this.settings.slideDistance );

				// Floor the obtained value and add or subtract 1, depending on the direction of the swipe
				slideArrayDistance = parseInt( slideArrayDistance, 10 ) + ( slideArrayDistance > 0 ? 1 : - 1 );

				// Get the index of the currently selected slide and subtract the position index in order to obtain
				// the new index of the selected slide. 
				var nextSlideIndex = this.slidesOrder[ $.inArray( this.selectedSlideIndex, this.slidesOrder ) - slideArrayDistance ];

				if ( this.settings.loop === true ) {
					this.gotoSlide( nextSlideIndex );
				} else {
					if ( typeof nextSlideIndex !== 'undefined' ) {
						this.gotoSlide( nextSlideIndex );
					} else {
						this._moveTo( oldSlidesPosition );
					}
				}
			}
		},

		// Destroy the module
		destroyTouchSwipe: function() {
			this.$slidesMask.off( 'dragstart.' + NS );
			this.$slidesMask.find( 'a' ).off( 'click.' + NS );

			this.$slidesMask.off( this.touchSwipeEvents.startEvent );
			this.$slidesMask.off( this.touchSwipeEvents.moveEvent );
			$( document ).off( this.touchSwipeEvents.endEvent );
			
			this.$slidesMask.removeClass( 'sp-grab' );
		},

		touchSwipeDefaults: {
			
			// Indicates whether the touch swipe will be enabled
			touchSwipe: true,

			// Sets the minimum amount that the slides should move
			touchSwipeThreshold: 50
		}
	};

	$.SliderPro.addModule( 'TouchSwipe', TouchSwipe );
	
})( window, jQuery );

// Caption module for Slider Pro.
// 
// Adds a corresponding caption for each slide. The caption
// will appear and disappear with the slide.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Caption.' + $.SliderPro.namespace;

	var Caption = {

		// Reference to the container element that will hold the caption
		$captionContainer: null,

		// The caption content/text
		captionContent: '',

		initCaption: function() {
			this.on( 'update.' + NS, $.proxy( this._captionOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._updateCaptionContent, this ) );
		},

		// Create the caption container and hide the captions inside the slides
		_captionOnUpdate: function() {
			this.$captionContainer = this.$slider.find( '.sp-caption-container' );

			if ( this.$slider.find( '.sp-caption' ).length && this.$captionContainer.length === 0 ) {
				this.$captionContainer = $( '<div class="sp-caption-container"></div>' ).appendTo( this.$slider );

				// Show the caption for the selected slide
				this._updateCaptionContent();
			}

			// Hide the captions inside the slides
			this.$slides.find( '.sp-caption' ).each(function() {
				$( this ).css( 'display', 'none' );
			});
		},

		// Show the caption content for the selected slide
		_updateCaptionContent: function() {
			var that = this,
				newCaptionField = this.$slider.find( '.sp-slide' ).eq( this.selectedSlideIndex ).find( '.sp-caption' ),
				newCaptionContent = newCaptionField.length !== 0 ? newCaptionField.html() : '';

			// Either use a fade effect for swapping the captions or use an instant change
			if ( this.settings.fadeCaption === true ) {
				
				// If the previous slide had a caption, fade out that caption first and when the animation is over
				// fade in the current caption.
				// If the previous slide didn't have a caption, fade in the current caption directly.
				if ( this.captionContent !== '' ) {

					// If the caption container has 0 opacity when the fade out transition starts, set it
					// to 1 because the transition wouldn't work if the initial and final values are the same,
					// and the callback functions wouldn't fire in this case.
					if ( parseFloat( this.$captionContainer.css( 'opacity' ), 10 ) === 0 ) {
						this.$captionContainer.css( this.vendorPrefix + 'transition', '' );
						this.$captionContainer.css( 'opacity', 1 );
					}

					this._fadeCaptionTo( 0, function() {
						that.captionContent = newCaptionContent;

						if ( newCaptionContent !== '' ) {
							that.$captionContainer.html( that.captionContent );
							that._fadeCaptionTo( 1 );
						} else {
							that.$captionContainer.empty();
						}
					});
				} else {
					this.captionContent = newCaptionContent;
					this.$captionContainer.html( this.captionContent );
					this.$captionContainer.css( 'opacity', 0 );
					this._fadeCaptionTo( 1 );
				}
			} else {
				this.captionContent = newCaptionContent;
				this.$captionContainer.html( this.captionContent );
			}
		},

		// Fade the caption container to the specified opacity
		_fadeCaptionTo: function( opacity, callback ) {
			var that = this;

			// Use CSS transitions if they are supported. If not, use JavaScript animation.
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				
				// There needs to be a delay between the moment the opacity is set
				// and the moment the transitions starts.
				setTimeout(function(){
					var css = { 'opacity': opacity };
					css[ that.vendorPrefix + 'transition' ] = 'opacity ' + that.settings.captionFadeDuration / 1000 + 's';
					that.$captionContainer.css( css );
				}, 1 );

				this.$captionContainer.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$captionContainer.off( that.transitionEvent );
					that.$captionContainer.css( that.vendorPrefix + 'transition', '' );

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			} else {
				this.$captionContainer.stop().animate({ 'opacity': opacity }, this.settings.captionFadeDuration, function() {
					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			}
		},

		// Destroy the module
		destroyCaption: function() {
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );

			this.$captionContainer.remove();

			this.$slider.find( '.sp-caption' ).each(function() {
				$( this ).css( 'display', '' );
			});
		},

		captionDefaults: {

			// Indicates whether or not the captions will be faded
			fadeCaption: true,

			// Sets the duration of the fade animation
			captionFadeDuration: 500
		}
	};

	$.SliderPro.addModule( 'Caption', Caption );
	
})( window, jQuery );

// Deep Linking module for Slider Pro.
// 
// Updates the hash of the URL as the user navigates through the slides.
// Also, allows navigating to a specific slide by indicating it in the hash.
;(function( window, $ ) {

	"use strict";

	var NS = 'DeepLinking.' + $.SliderPro.namespace;

	var DeepLinking = {

		initDeepLinking: function() {
			var that = this;

			// Parse the initial hash
			this.on( 'init.' + NS, function() {
				that._gotoHash( window.location.hash );
			});

			// Update the hash when a new slide is selected
			this.on( 'gotoSlide.' + NS, function( event ) {
				if ( that.settings.updateHash === true ) {

					// get the 'id' attribute of the slide
					var slideId = that.$slider.find( '.sp-slide' ).eq( event.index ).attr( 'id' );

					// if the slide doesn't have an 'id' attribute, use the slide index
					if ( typeof slideId === 'undefined' ) {
						slideId = event.index;
					}

					window.location.hash = that.$slider.attr( 'id' ) + '/' + slideId;
				}
			});

			// Check when the hash changes and navigate to the indicated slide
			$( window ).on( 'hashchange.' + this.uniqueId + '.' + NS, function() {
				that._gotoHash( window.location.hash );
			});
		},

		// Parse the hash and return the slider id and the slide id
		_parseHash: function( hash ) {
			if ( hash !== '' ) {
				// Eliminate the # symbol
				hash = hash.substring(1);

				// Get the specified slider id and slide id
				var values = hash.split( '/' ),
					slideId = values.pop(),
					sliderId = hash.slice( 0, - slideId.toString().length - 1 );

				if ( this.$slider.attr( 'id' ) === sliderId ) {
					return { 'sliderID': sliderId, 'slideId': slideId };
				}
			}

			return false;
		},

		// Navigate to the appropriate slide, based on the specified hash
		_gotoHash: function( hash ) {
			var result = this._parseHash( hash );

			if ( result === false ) {
				return;
			}

			var slideId = result.slideId,
				slideIdNumber = parseInt( slideId, 10 );

			// check if the specified slide id is a number or string
			if ( isNaN( slideIdNumber ) ) {
				// get the index of the slide based on the specified id
				var slideIndex = this.$slider.find( '.sp-slide#' + slideId ).index();

				if ( slideIndex !== -1 && slideIndex !== this.selectedSlideIndex ) {
					this.gotoSlide( slideIndex );
				}
			} else if ( slideIdNumber !== this.selectedSlideIndex ) {
				this.gotoSlide( slideIdNumber );
			}
		},

		// Destroy the module
		destroyDeepLinking: function() {
			this.off( 'init.' + NS );
			this.off( 'gotoSlide.' + NS );
			$( window ).off( 'hashchange.' + this.uniqueId + '.' + NS );
		},

		deepLinkingDefaults: {

			// Indicates whether the hash will be updated when a new slide is selected
			updateHash: false
		}
	};

	$.SliderPro.addModule( 'DeepLinking', DeepLinking );
	
})( window, jQuery );

// Autoplay module for Slider Pro.
// 
// Adds automatic navigation through the slides by calling the
// 'nextSlide' or 'previousSlide' methods at certain time intervals.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Autoplay.' + $.SliderPro.namespace;

	var Autoplay = {

		autoplayTimer: null,

		isTimerRunning: false,

		isTimerPaused: false,

		initAutoplay: function() {
			this.on( 'update.' + NS, $.proxy( this._autoplayOnUpdate, this ) );
		},

		// Start the autoplay if it's enabled, or stop it if it's disabled but running 
		_autoplayOnUpdate: function( event ) {
			if ( this.settings.autoplay === true ) {
				this.on( 'gotoSlide.' + NS, $.proxy( this._autoplayOnGotoSlide, this ) );
				this.on( 'mouseenter.' + NS, $.proxy( this._autoplayOnMouseEnter, this ) );
				this.on( 'mouseleave.' + NS, $.proxy( this._autoplayOnMouseLeave, this ) );

				this.startAutoplay();
			} else {
				this.off( 'gotoSlide.' + NS );
				this.off( 'mouseenter.' + NS );
				this.off( 'mouseleave.' + NS );

				this.stopAutoplay();
			}
		},

		// Restart the autoplay timer when a new slide is selected
		_autoplayOnGotoSlide: function( event ) {
			// stop previous timers before starting a new one
			if ( this.isTimerRunning === true ) {
				this.stopAutoplay();
			}
			
			if ( this.isTimerPaused === false ) {
				this.startAutoplay();
			}
		},

		// Pause the autoplay when the slider is hovered
		_autoplayOnMouseEnter: function( event ) {
			if ( this.isTimerRunning && ( this.settings.autoplayOnHover === 'pause' || this.settings.autoplayOnHover === 'stop' ) ) {
				this.stopAutoplay();
				this.isTimerPaused = true;
			}
		},

		// Start the autoplay when the mouse moves away from the slider
		_autoplayOnMouseLeave: function( event ) {
			if ( this.settings.autoplay === true && this.isTimerRunning === false && this.settings.autoplayOnHover !== 'stop' ) {
				this.startAutoplay();
				this.isTimerPaused = false;
			}
		},

		// Starts the autoplay
		startAutoplay: function() {
			var that = this;
			
			this.isTimerRunning = true;

			this.autoplayTimer = setTimeout(function() {
				if ( that.settings.autoplayDirection === 'normal' ) {
					that.nextSlide();
				} else if ( that.settings.autoplayDirection === 'backwards' ) {
					that.previousSlide();
				}
			}, this.settings.autoplayDelay );
		},

		// Stops the autoplay
		stopAutoplay: function() {
			this.isTimerRunning = false;
			this.isTimerPaused = false;

			clearTimeout( this.autoplayTimer );
		},

		// Destroy the module
		destroyAutoplay: function() {
			clearTimeout( this.autoplayTimer );

			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'mouseenter.' + NS );
			this.off( 'mouseleave.' + NS );
		},

		autoplayDefaults: {
			// Indicates whether or not autoplay will be enabled
			autoplay: true,

			// Sets the delay/interval at which the autoplay will run
			autoplayDelay: 5000,

			// Indicates whether autoplay will navigate to the next slide or previous slide
			autoplayDirection: 'normal',

			// Indicates if the autoplay will be paused or stopped when the slider is hovered.
			// Possible values are 'pause', 'stop' or 'none'.
			autoplayOnHover: 'pause'
		}
	};

	$.SliderPro.addModule( 'Autoplay', Autoplay );
	
})(window, jQuery);

// Keyboard module for Slider Pro.
// 
// Adds the possibility to navigate through slides using the keyboard arrow keys, or
// open the link attached to the main slide image by using the Enter key.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Keyboard.' + $.SliderPro.namespace;

	var Keyboard = {

		initKeyboard: function() {
			var that = this,
				hasFocus = false;

			if ( this.settings.keyboard === false ) {
				return;
			}

			// Detect when the slide is in focus and when it's not, and, optionally, make it
			// responsive to keyboard input only when it's in focus
			this.$slider.on( 'focus.' + NS, function() {
				hasFocus = true;
			});

			this.$slider.on( 'blur.' + NS, function() {
				hasFocus = false;
			});

			$( document ).on( 'keydown.' + this.uniqueId + '.' + NS, function( event ) {
				if ( that.settings.keyboardOnlyOnFocus === true && hasFocus === false ) {
					return;
				}

				// If the left arrow key is pressed, go to the previous slide.
				// If the right arrow key is pressed, go to the next slide.
				// If the Enter key is pressed, open the link attached to the main slide image.
				if ( event.which === 37 ) {
					that.previousSlide();
				} else if ( event.which === 39 ) {
					that.nextSlide();
				} else if ( event.which === 13 ) {
					var link = that.$slider.find( '.sp-slide' ).eq( that.selectedSlideIndex ).find( '.sp-image-container a' );
					
					if ( link.length !== 0 ) {
						link[0].click();
					}
				}
			});
		},

		// Destroy the module
		destroyKeyboard: function() {
			this.$slider.off( 'focus.' + NS );
			this.$slider.off( 'blur.' + NS );
			$( document ).off( 'keydown.' + this.uniqueId + '.' + NS );
		},

		keyboardDefaults: {

			// Indicates whether keyboard navigation will be enabled
			keyboard: true,

			// Indicates whether the slider will respond to keyboard input only when
			// the slider is in focus.
			keyboardOnlyOnFocus: false
		}
	};

	$.SliderPro.addModule( 'Keyboard', Keyboard );
	
})( window, jQuery );

;( function( window, $ ) {

    "use strict";

    var NS = 'MouseWheel.' + $.SliderPro.namespace;

    var MouseWheel = {

        mouseWheelEventType: '',

        initMouseWheel: function() {
            var that = this;

            if ( this.settings.mouseWheel === false ) {
                return;
            }

            // get the current mouse wheel event used in the browser
            if ( 'onwheel' in document ) {
                this.mouseWheelEventType = 'wheel';
            } else if ( 'onmousewheel' in document ) {
                this.mouseWheelEventType = 'mousewheel';
            } else if ( 'onDomMouseScroll' in document ) {
                this.mouseWheelEventType = 'DomMouseScroll';
            } else if ( 'onMozMousePixelScroll' in document ) {
                this.mouseWheelEventType = 'MozMousePixelScroll';
            }

            this.on( this.mouseWheelEventType + '.' + NS, function( event ) {
                event.preventDefault();

                var eventObject = event.originalEvent,
                    delta;

                // get the movement direction and speed indicated in the delta property
                if ( typeof eventObject.detail !== 'undefined' ) {
                    delta = eventObject.detail;
                }

                if ( typeof eventObject.wheelDelta !== 'undefined' ) {
                    delta = eventObject.wheelDelta;
                }

                if ( typeof eventObject.deltaY !== 'undefined' ) {
                    delta = eventObject.deltaY * -1;
                }

                if ( that.thumbnailsPosition + delta < 0 && that.thumbnailsPosition + delta > that.thumbnailsContainerSize - that.thumbnailsSize ) {
                   that._moveThumbnailsTo( that.thumbnailsPosition + delta, true );
                } else if ( that.thumbnailsPosition + delta >= 0 ) {
                    that._moveThumbnailsTo( 0, true );
                } else if ( that.thumbnailsPosition + delta < that.thumbnailsContainerSize - that.thumbnailsSize ) {
                    that._moveThumbnailsTo( that.thumbnailsContainerSize - that.thumbnailsSize, true );
                }
            });
        },

        destroyMouseWheel: function() {
            this.off( this.mouseWheelEventType + '.' + NS );
        },

        mouseWheelDefaults: {
            mouseWheel: false
        }
    };

    $.SliderPro.addModule( 'MouseWheel', MouseWheel );

})( window, jQuery );

// Full Screen module for Slider Pro.
// 
// Adds the possibility to open the slider full-screen, using the HTML5 FullScreen API.
;(function( window, $ ) {

	"use strict";

	var NS = 'FullScreen.' + $.SliderPro.namespace;

	var FullScreen = {

		// Indicates whether the slider is currently in full-screen mode
		isFullScreen: false,

		// Reference to the full-screen button
		$fullScreenButton: null,

		// Reference to a set of settings that influence the slider's size
		// before it goes full-screen
		sizeBeforeFullScreen: {},

		initFullScreen: function() {
			if ( ! ( document.fullscreenEnabled ||
				document.webkitFullscreenEnabled ||
				document.mozFullScreenEnabled ||
				document.msFullscreenEnabled ) ) {
				return;
			}
		
			this.on( 'update.' + NS, $.proxy( this._fullScreenOnUpdate, this ) );
		},

		// Create or remove the full-screen button depending on the value of the 'fullScreen' option
		_fullScreenOnUpdate: function() {
			if ( this.settings.fullScreen === true && this.$fullScreenButton === null ) {
				this._addFullScreen();
			} else if ( this.settings.fullScreen === false && this.$fullScreenButton !== null ) {
				this._removeFullScreen();
			}

			if ( this.settings.fullScreen === true ) {
				if ( this.settings.fadeFullScreen === true ) {
					this.$fullScreenButton.addClass( 'sp-fade-full-screen' );
				} else if ( this.settings.fadeFullScreen === false ) {
					this.$fullScreenButton.removeClass( 'sp-fade-full-screen' );
				}
			}
		},

		// Create the full-screen button
		_addFullScreen: function() {
			this.$fullScreenButton = $('<div class="sp-full-screen-button"></div>').appendTo( this.$slider );
			this.$fullScreenButton.on( 'click.' + NS, $.proxy( this._onFullScreenButtonClick, this ) );

			document.addEventListener( 'fullscreenchange', $.proxy( this._onFullScreenChange, this ) );
			document.addEventListener( 'mozfullscreenchange', $.proxy( this._onFullScreenChange, this ) );
			document.addEventListener( 'webkitfullscreenchange', $.proxy( this._onFullScreenChange, this ) );
			document.addEventListener( 'MSFullscreenChange', $.proxy( this._onFullScreenChange, this ) );
		},

		// Remove the full-screen button
		_removeFullScreen: function() {
			if ( this.$fullScreenButton !== null ) {
				this.$fullScreenButton.off( 'click.' + NS );
				this.$fullScreenButton.remove();
				this.$fullScreenButton = null;
				document.removeEventListener( 'fullscreenchange', this._onFullScreenChange );
				document.removeEventListener( 'mozfullscreenchange', this._onFullScreenChange );
				document.removeEventListener( 'webkitfullscreenchange', this._onFullScreenChange );
				document.removeEventListener( 'MSFullscreenChange', this._onFullScreenChange );
			}
		},

		// When the full-screen button is clicked, put the slider into full-screen mode, and
		// take it out of the full-screen mode when it's clicked again.
		_onFullScreenButtonClick: function() {
			if ( this.isFullScreen === false ) {
				if ( this.instance.requestFullScreen ) {
					this.instance.requestFullScreen();
				} else if ( this.instance.mozRequestFullScreen ) {
					this.instance.mozRequestFullScreen();
				} else if ( this.instance.webkitRequestFullScreen ) {
					this.instance.webkitRequestFullScreen();
				} else if ( this.instance.msRequestFullscreen ) {
					this.instance.msRequestFullscreen();
				}
			} else {
				if ( document.exitFullScreen ) {
					document.exitFullScreen();
				} else if ( document.mozCancelFullScreen ) {
					document.mozCancelFullScreen();
				} else if ( document.webkitCancelFullScreen ) {
					document.webkitCancelFullScreen();
				} else if ( document.msExitFullscreen ) {
					document.msExitFullscreen();
				}
			}
		},

		// This will be called whenever the full-screen mode changes.
		// If the slider is in full-screen mode, set it to 'full window', and if it's
		// not in full-screen mode anymore, set it back to the original size.
		_onFullScreenChange: function() {
			this.isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement ? true : false;

			if ( this.isFullScreen === true ) {
				this.sizeBeforeFullScreen = { forceSize: this.settings.forceSize, autoHeight: this.settings.autoHeight };
				this.$slider.addClass( 'sp-full-screen' );
				this.settings.forceSize = 'fullWindow';
				this.settings.autoHeight = false;
			} else {
				this.$slider.css( 'margin', '' );
				this.$slider.removeClass( 'sp-full-screen' );
				this.settings.forceSize = this.sizeBeforeFullScreen.forceSize;
				this.settings.autoHeight = this.sizeBeforeFullScreen.autoHeight;
			}

			this.resize();
		},

		// Destroy the module
		destroyFullScreen: function() {
			this.off( 'update.' + NS );
			this._removeFullScreen();
		},

		fullScreenDefaults: {

			// Indicates whether the full-screen button is enabled
			fullScreen: false,

			// Indicates whether the button will fade in only on hover
			fadeFullScreen: true
		}
	};

	$.SliderPro.addModule( 'FullScreen', FullScreen );

})( window, jQuery );


// Buttons module for Slider Pro.
// 
// Adds navigation buttons at the bottom of the slider.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Buttons.' + $.SliderPro.namespace;

	var Buttons = {

		// Reference to the buttons container
		$buttons: null,

		initButtons: function() {
			this.on( 'update.' + NS, $.proxy( this._buttonsOnUpdate, this ) );
		},

		_buttonsOnUpdate: function() {
			this.$buttons = this.$slider.find('.sp-buttons');
			
			// If there is more that one slide but the buttons weren't created yet, create the buttons.
			// If the buttons were created but their number differs from the total number of slides, re-create the buttons.
			// If the buttons were created but there are less than one slide, remove the buttons.s
			if ( this.settings.buttons === true && this.getTotalSlides() > 1 && this.$buttons.length === 0 ) {
				this._createButtons();
			} else if ( this.settings.buttons === true && this.getTotalSlides() !== this.$buttons.find( '.sp-button' ).length && this.$buttons.length !== 0 ) {
				this._adjustButtons();
			} else if ( this.settings.buttons === false || ( this.getTotalSlides() <= 1 && this.$buttons.length !== 0 ) ) {
				this._removeButtons();
			}
		},

		// Create the buttons
		_createButtons: function() {
			var that = this;

			// Create the buttons' container
			this.$buttons = $( '<div class="sp-buttons"></div>' ).appendTo( this.$slider );

			// Create the buttons
			for ( var i = 0; i < this.getTotalSlides(); i++ ) {
				$( '<div class="sp-button"></div>' ).appendTo( this.$buttons );
			}

			// Listen for button clicks 
			this.$buttons.on( 'click.' + NS, '.sp-button', function() {
				that.gotoSlide( $( this ).index() );
			});

			// Set the initially selected button
			this.$buttons.find( '.sp-button' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected-button' );

			// Select the corresponding button when the slide changes
			this.on( 'gotoSlide.' + NS, function( event ) {
				that.$buttons.find( '.sp-selected-button' ).removeClass( 'sp-selected-button' );
				that.$buttons.find( '.sp-button' ).eq( event.index ).addClass( 'sp-selected-button' );
			});

			// Indicate that the slider has buttons 
			this.$slider.addClass( 'sp-has-buttons' );
		},

		// Re-create the buttons. This is calles when the number of slides changes.
		_adjustButtons: function() {
			this.$buttons.empty();

			// Create the buttons
			for ( var i = 0; i < this.getTotalSlides(); i++ ) {
				$( '<div class="sp-button"></div>' ).appendTo( this.$buttons );
			}

			// Change the selected the buttons
			this.$buttons.find( '.sp-selected-button' ).removeClass( 'sp-selected-button' );
			this.$buttons.find( '.sp-button' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected-button' );
		},

		// Remove the buttons
		_removeButtons: function() {
			this.$buttons.off( 'click.' + NS, '.sp-button' );
			this.off( 'gotoSlide.' + NS );
			this.$buttons.remove();
			this.$slider.removeClass( 'sp-has-buttons' );
		},

		destroyButtons: function() {
			this._removeButtons();
			this.off( 'update.' + NS );
		},

		buttonsDefaults: {
			
			// Indicates whether the buttons will be created
			buttons: true
		}
	};

	$.SliderPro.addModule( 'Buttons', Buttons );

})( window, jQuery );

// Arrows module for Slider Pro.
// 
// Adds arrows for navigating to the next or previous slide.
;(function( window, $ ) {

	"use strict";

	var NS = 'Arrows.' + $.SliderPro.namespace;

	var Arrows = {

		// Reference to the arrows container
		$arrows: null,

		// Reference to the previous arrow
		$previousArrow: null,

		// Reference to the next arrow
		$nextArrow: null,

		initArrows: function() {
			this.on( 'update.' + NS, $.proxy( this._arrowsOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._checkArrowsVisibility, this ) );
		},

		_arrowsOnUpdate: function() {
			var that = this;

			// Create the arrows if the 'arrows' option is set to true
			if ( this.settings.arrows === true && this.$arrows === null ) {
				this.$arrows = $( '<div class="sp-arrows"></div>' ).appendTo( this.$slidesContainer );
				
				this.$previousArrow = $( '<div class="sp-arrow sp-previous-arrow"></div>' ).appendTo( this.$arrows );
				this.$nextArrow = $( '<div class="sp-arrow sp-next-arrow"></div>' ).appendTo( this.$arrows );

				this.$previousArrow.on( 'click.' + NS, function() {
					that.previousSlide();
				});

				this.$nextArrow.on( 'click.' + NS, function() {
					that.nextSlide();
				});

				this._checkArrowsVisibility();
			} else if ( this.settings.arrows === false && this.$arrows !== null ) {
				this._removeArrows();
			}

			if ( this.settings.arrows === true ) {
				if ( this.settings.fadeArrows === true ) {
					this.$arrows.addClass( 'sp-fade-arrows' );
				} else if ( this.settings.fadeArrows === false ) {
					this.$arrows.removeClass( 'sp-fade-arrows' );
				}
			}
		},

		// Show or hide the arrows depending on the position of the selected slide
		_checkArrowsVisibility: function() {
			if ( this.settings.arrows === false || this.settings.loop === true ) {
				return;
			}

			if ( this.selectedSlideIndex === 0 ) {
				this.$previousArrow.css( 'display', 'none' );
			} else {
				this.$previousArrow.css( 'display', 'block' );
			}

			if ( this.selectedSlideIndex === this.getTotalSlides() - 1 ) {
				this.$nextArrow.css( 'display', 'none' );
			} else {
				this.$nextArrow.css( 'display', 'block' );
			}
		},
		
		_removeArrows: function() {
			if ( this.$arrows !== null ) {
				this.$previousArrow.off( 'click.' + NS );
				this.$nextArrow.off( 'click.' + NS );
				this.$arrows.remove();
				this.$arrows = null;
			}
		},

		destroyArrows: function() {
			this._removeArrows();
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
		},

		arrowsDefaults: {

			// Indicates whether the arrow buttons will be created
			arrows: false,

			// Indicates whether the arrows will fade in only on hover
			fadeArrows: true
		}
	};

	$.SliderPro.addModule( 'Arrows', Arrows );

})( window, jQuery );

// Thumbnail Touch Swipe module for Slider Pro.
// 
// Adds touch-swipe functionality for thumbnails.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'ThumbnailTouchSwipe.' + $.SliderPro.namespace;

	var ThumbnailTouchSwipe = {

		// The x and y coordinates of the pointer/finger's starting position
		thumbnailTouchStartPoint: { x: 0, y: 0 },

		// The x and y coordinates of the pointer/finger's end position
		thumbnailTouchEndPoint: { x: 0, y: 0 },

		// The distance from the starting to the end position on the x and y axis
		thumbnailTouchDistance: { x: 0, y: 0 },

		// The position of the thumbnail scroller when the touch swipe starts
		thumbnailTouchStartPosition: 0,

		// Indicates if the thumbnail scroller is being swiped
		isThumbnailTouchMoving: false,

		// Indicates if the touch swipe was initialized
		isThumbnailTouchSwipe: false,

		// Stores the names of the events
		thumbnailTouchSwipeEvents: { startEvent: '', moveEvent: '', endEvent: '' },

		// Indicates whether the previous 'start' event was a 'touchstart' or 'mousedown'
		thumbnailPreviousStartEvent: '',

		initThumbnailTouchSwipe: function() {
			this.on( 'update.' + NS, $.proxy( this._thumbnailTouchSwipeOnUpdate, this ) );
		},

		_thumbnailTouchSwipeOnUpdate: function() {

			// Return if there are no thumbnails
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			// Initialize the touch swipe functionality if it wasn't initialized yet
			if ( this.settings.thumbnailTouchSwipe === true && this.isThumbnailTouchSwipe === false ) {
				this.isThumbnailTouchSwipe = true;

				this.thumbnailTouchSwipeEvents.startEvent = 'touchstart' + '.' + NS + ' mousedown' + '.' + NS;
				this.thumbnailTouchSwipeEvents.moveEvent = 'touchmove' + '.' + NS + ' mousemove' + '.' + NS;
				this.thumbnailTouchSwipeEvents.endEvent = 'touchend' + '.' + this.uniqueId + '.' + NS + ' mouseup' + '.' + this.uniqueId + '.' + NS;
				
				// Listen for touch swipe/mouse move events
				this.$thumbnails.on( this.thumbnailTouchSwipeEvents.startEvent, $.proxy( this._onThumbnailTouchStart, this ) );
				this.$thumbnails.on( 'dragstart.' + NS, function( event ) {
					event.preventDefault();
				});
			
				// Add the grabbing icon
				this.$thumbnails.addClass( 'sp-grab' );

				// Remove the default thumbnailClick
				$.each( this.thumbnails, function( index, thumbnail ) {
					thumbnail.off( 'thumbnailClick' );
				});
			}
		},

		// Called when the thumbnail scroller starts being dragged
		_onThumbnailTouchStart: function( event ) {

			// Return if a 'mousedown' event follows a 'touchstart' event
			if ( event.type === 'mousedown' && this.thumbnailPreviousStartEvent === 'touchstart' ) {
				this.thumbnailPreviousStartEvent = event.type;
				return;
			}

			// Assign the new 'start' event
			this.thumbnailPreviousStartEvent = event.type;

			// Disable dragging if the element is set to allow selections
			if ( $( event.target ).closest( '.sp-selectable' ).length >= 1 ) {
				return;
			}

			var that = this,
				eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Prevent default behavior for mouse events
			if ( typeof event.originalEvent.touches === 'undefined' ) {
				event.preventDefault();
			}

			// Disable click events on links
			$( event.target ).parents( '.sp-thumbnail-container' ).find( 'a' ).one( 'click.' + NS, function( event ) {
				event.preventDefault();
			});

			// Get the initial position of the mouse pointer and the initial position
			// of the thumbnail scroller
			this.thumbnailTouchStartPoint.x = eventObject.pageX || eventObject.clientX;
			this.thumbnailTouchStartPoint.y = eventObject.pageY || eventObject.clientY;
			this.thumbnailTouchStartPosition = this.thumbnailsPosition;

			// Clear the previous distance values
			this.thumbnailTouchDistance.x = this.thumbnailTouchDistance.y = 0;

			// If the thumbnail scroller is being grabbed while it's still animating, stop the
			// current movement
			if ( this.$thumbnails.hasClass( 'sp-animated' ) ) {
				this.isThumbnailTouchMoving = true;
				this._stopThumbnailsMovement();
				this.thumbnailTouchStartPosition = this.thumbnailsPosition;
			}

			// Listen for move and end events
			this.$thumbnails.on( this.thumbnailTouchSwipeEvents.moveEvent, $.proxy( this._onThumbnailTouchMove, this ) );
			$( document ).on( this.thumbnailTouchSwipeEvents.endEvent, $.proxy( this._onThumbnailTouchEnd, this ) );

			// Swap grabbing icons
			this.$thumbnails.removeClass( 'sp-grab' ).addClass( 'sp-grabbing' );

			// Add 'sp-swiping' class to indicate that the thumbnail scroller is being swiped
			this.$thumbnailsContainer.addClass( 'sp-swiping' );
		},

		// Called during the thumbnail scroller's dragging
		_onThumbnailTouchMove: function( event ) {
			var eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Indicate that the move event is being fired
			this.isThumbnailTouchMoving = true;

			// Get the current position of the mouse pointer
			this.thumbnailTouchEndPoint.x = eventObject.pageX || eventObject.clientX;
			this.thumbnailTouchEndPoint.y = eventObject.pageY || eventObject.clientY;

			// Calculate the distance of the movement on both axis
			this.thumbnailTouchDistance.x = this.thumbnailTouchEndPoint.x - this.thumbnailTouchStartPoint.x;
			this.thumbnailTouchDistance.y = this.thumbnailTouchEndPoint.y - this.thumbnailTouchStartPoint.y;
			
			// Calculate the distance of the swipe that takes place in the same direction as the orientation of the thumbnails
			// and calculate the distance from the opposite direction.
			// 
			// For a swipe to be valid there should more distance in the same direction as the orientation of the thumbnails.
			var distance = this.thumbnailsOrientation === 'horizontal' ? this.thumbnailTouchDistance.x : this.thumbnailTouchDistance.y,
				oppositeDistance = this.thumbnailsOrientation === 'horizontal' ? this.thumbnailTouchDistance.y : this.thumbnailTouchDistance.x;

			// If the movement is in the same direction as the orientation of the thumbnails, the swipe is valid
			if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
				event.preventDefault();
			} else {
				return;
			}

			// Make the thumbnail scroller move slower if it's dragged outside its bounds
			if ( this.thumbnailsPosition >= 0 ) {
				var infOffset = - this.thumbnailTouchStartPosition;
				distance = infOffset + ( distance - infOffset ) * 0.2;
			} else if ( this.thumbnailsPosition <= - this.thumbnailsSize + this.thumbnailsContainerSize ) {
				var supOffset = this.thumbnailsSize - this.thumbnailsContainerSize + this.thumbnailTouchStartPosition;
				distance = - supOffset + ( distance + supOffset ) * 0.2;
			}
			
			this._moveThumbnailsTo( this.thumbnailTouchStartPosition + distance, true );
		},

		// Called when the thumbnail scroller is released
		_onThumbnailTouchEnd: function( event ) {
			var that = this,
				thumbnailTouchDistance = this.thumbnailsOrientation === 'horizontal' ? this.thumbnailTouchDistance.x : this.thumbnailTouchDistance.y;

			// Remove the move and end listeners
			this.$thumbnails.off( this.thumbnailTouchSwipeEvents.moveEvent );
			$( document ).off( this.thumbnailTouchSwipeEvents.endEvent );

			// Swap grabbing icons
			this.$thumbnails.removeClass( 'sp-grabbing' ).addClass( 'sp-grab' );

			// Check if there is intention for a tap/click
			if ( this.isThumbnailTouchMoving === false ||
				this.isThumbnailTouchMoving === true &&
				Math.abs( this.thumbnailTouchDistance.x ) < 10 &&
				Math.abs( this.thumbnailTouchDistance.y ) < 10
			) {
				var targetThumbnail = $( event.target ).hasClass( 'sp-thumbnail-container' ) ? $( event.target ) : $( event.target ).parents( '.sp-thumbnail-container' ),
					index = targetThumbnail.index();

				// If a link is cliked, navigate to that link, else navigate to the slide that corresponds to the thumbnail
				if ( $( event.target ).parents( 'a' ).length !== 0 ) {
					$( event.target ).parents( 'a' ).off( 'click.' + NS );
					this.$thumbnailsContainer.removeClass( 'sp-swiping' );
				} else if ( index !== this.selectedThumbnailIndex && index !== -1 ) {
					this.gotoSlide( index );
				}

				return;
			}

			this.isThumbnailTouchMoving = false;

			$( event.target ).parents( '.sp-thumbnail' ).one( 'click', function( event ) {
				event.preventDefault();
			});

			// Remove the 'sp-swiping' class but with a delay
			// because there might be other event listeners that check
			// the existence of this class, and this class should still be 
			// applied for those listeners, since there was a swipe event
			setTimeout(function() {
				that.$thumbnailsContainer.removeClass( 'sp-swiping' );
			}, 1 );

			// Keep the thumbnail scroller inside the bounds
			if ( this.thumbnailsPosition > 0 ) {
				this._moveThumbnailsTo( 0 );
			} else if ( this.thumbnailsPosition < this.thumbnailsContainerSize - this.thumbnailsSize ) {
				this._moveThumbnailsTo( this.thumbnailsContainerSize - this.thumbnailsSize );
			}

			// Fire the 'thumbnailsMoveComplete' event
			this.trigger({ type: 'thumbnailsMoveComplete' });
			if ( $.isFunction( this.settings.thumbnailsMoveComplete ) ) {
				this.settings.thumbnailsMoveComplete.call( this, { type: 'thumbnailsMoveComplete' });
			}
		},

		// Destroy the module
		destroyThumbnailTouchSwipe: function() {
			this.off( 'update.' + NS );

			if ( this.isThumbnailScroller === false ) {
				return;
			}

			this.$thumbnails.off( this.thumbnailTouchSwipeEvents.startEvent );
			this.$thumbnails.off( this.thumbnailTouchSwipeEvents.moveEvent );
			this.$thumbnails.off( 'dragstart.' + NS );
			$( document ).off( this.thumbnailTouchSwipeEvents.endEvent );
			this.$thumbnails.removeClass( 'sp-grab' );
		},

		thumbnailTouchSwipeDefaults: {

			// Indicates whether the touch swipe will be enabled for thumbnails
			thumbnailTouchSwipe: true
		}
	};

	$.SliderPro.addModule( 'ThumbnailTouchSwipe', ThumbnailTouchSwipe );

})( window, jQuery );

// Thumbnail Arrows module for Slider Pro.
// 
// Adds thumbnail arrows for moving the thumbnail scroller.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'ThumbnailArrows.' + $.SliderPro.namespace;

	var ThumbnailArrows = {

		// Reference to the arrows container
		$thumbnailArrows: null,

		// Reference to the 'previous' thumbnail arrow
		$previousThumbnailArrow: null,

		// Reference to the 'next' thumbnail arrow
		$nextThumbnailArrow: null,

		initThumbnailArrows: function() {
			var that = this;

			this.on( 'update.' + NS, $.proxy( this._thumbnailArrowsOnUpdate, this ) );
			
			// Check if the arrows need to be visible or invisible when the thumbnail scroller
			// resizes and when the thumbnail scroller moves.
			this.on( 'sliderResize.' + NS + ' ' + 'thumbnailsMoveComplete.' + NS, function() {
				if ( that.isThumbnailScroller === true && that.settings.thumbnailArrows === true ) {
					that._checkThumbnailArrowsVisibility();
				}
			});
		},
		
		// Called when the slider is updated
		_thumbnailArrowsOnUpdate: function() {
			var that = this;
			
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			// Create or remove the thumbnail scroller arrows
			if ( this.settings.thumbnailArrows === true && this.$thumbnailArrows === null ) {
				this.$thumbnailArrows = $( '<div class="sp-thumbnail-arrows"></div>' ).appendTo( this.$thumbnailsContainer );
				
				this.$previousThumbnailArrow = $( '<div class="sp-thumbnail-arrow sp-previous-thumbnail-arrow"></div>' ).appendTo( this.$thumbnailArrows );
				this.$nextThumbnailArrow = $( '<div class="sp-thumbnail-arrow sp-next-thumbnail-arrow"></div>' ).appendTo( this.$thumbnailArrows );

				this.$previousThumbnailArrow.on( 'click.' + NS, function() {
					var previousPosition = Math.min( 0, that.thumbnailsPosition + that.thumbnailsContainerSize );
					that._moveThumbnailsTo( previousPosition );
				});

				this.$nextThumbnailArrow.on( 'click.' + NS, function() {
					var nextPosition = Math.max( that.thumbnailsContainerSize - that.thumbnailsSize, that.thumbnailsPosition - that.thumbnailsContainerSize );
					that._moveThumbnailsTo( nextPosition );
				});
			} else if ( this.settings.thumbnailArrows === false && this.$thumbnailArrows !== null ) {
				this._removeThumbnailArrows();
			}

			// Add fading functionality and check if the arrows need to be visible or not
			if ( this.settings.thumbnailArrows === true ) {
				if ( this.settings.fadeThumbnailArrows === true ) {
					this.$thumbnailArrows.addClass( 'sp-fade-thumbnail-arrows' );
				} else if ( this.settings.fadeThumbnailArrows === false ) {
					this.$thumbnailArrows.removeClass( 'sp-fade-thumbnail-arrows' );
				}

				this._checkThumbnailArrowsVisibility();
			}
		},

		// Checks if the 'next' or 'previous' arrows need to be visible or hidden,
		// based on the position of the thumbnail scroller
		_checkThumbnailArrowsVisibility: function() {
			if ( this.thumbnailsPosition === 0 ) {
				this.$previousThumbnailArrow.css( 'display', 'none' );
			} else {
				this.$previousThumbnailArrow.css( 'display', 'block' );
			}

			if ( this.thumbnailsPosition === this.thumbnailsContainerSize - this.thumbnailsSize ) {
				this.$nextThumbnailArrow.css( 'display', 'none' );
			} else {
				this.$nextThumbnailArrow.css( 'display', 'block' );
			}
		},

		// Remove the thumbnail arrows
		_removeThumbnailArrows: function() {
			if ( this.$thumbnailArrows !== null ) {
				this.$previousThumbnailArrow.off( 'click.' + NS );
				this.$nextThumbnailArrow.off( 'click.' + NS );
				this.$thumbnailArrows.remove();
				this.$thumbnailArrows = null;
			}
		},

		// Destroy the module
		destroyThumbnailArrows: function() {
			this._removeThumbnailArrows();
			this.off( 'update.' + NS );
			this.off( 'sliderResize.' + NS );
			this.off( 'thumbnailsMoveComplete.' + NS );
		},

		thumbnailArrowsDefaults: {

			// Indicates whether the thumbnail arrows will be enabled
			thumbnailArrows: false,

			// Indicates whether the thumbnail arrows will be faded
			fadeThumbnailArrows: true
		}
	};

	$.SliderPro.addModule( 'ThumbnailArrows', ThumbnailArrows );

})( window, jQuery );

// Video module for Slider Pro
//
// Adds automatic control for several video players and providers
;(function( window, $ ) {

	"use strict";

	var NS = 'Video.' + $.SliderPro.namespace;
	
	var Video = {

		firstInit: false,

		initVideo: function() {
			this.on( 'update.' + NS, $.proxy( this._videoOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._videoOnGotoSlide, this ) );
			this.on( 'gotoSlideComplete.' + NS, $.proxy( this._videoOnGotoSlideComplete, this ) );
		},

		_videoOnUpdate: function() {
			var that = this;

			// Find all the inline videos and initialize them
			this.$slider.find( '.sp-video' ).not( 'a, [data-video-init]' ).each(function() {
				var video = $( this );
				that._initVideo( video );
			});

			// Find all the lazy-loaded videos and preinitialize them. They will be initialized
			// only when their play button is clicked.
			this.$slider.find( 'a.sp-video' ).not( '[data-video-preinit]' ).each(function() {
				var video = $( this );
				that._preinitVideo( video );
			});

			// call the 'gotoSlideComplete' method in case the first slide contains a video that
			// needs to play automatically
			if ( this.firstInit === false ) {
				this.firstInit = true;
				this._videoOnGotoSlideComplete({ index: this.selectedSlideIndex, previousIndex: -1 });
			}
		},

		// Initialize the target video
		_initVideo: function( video ) {
			var that = this;

			video.attr( 'data-video-init', true )
				.videoController();

			// When the video starts playing, pause the autoplay if it's running
			video.on( 'videoPlay.' + NS, function() {
				if ( that.settings.playVideoAction === 'stopAutoplay' && typeof that.stopAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.settings.autoplay = false;
				}

				// Fire the 'videoPlay' event
				var eventObject = { type: 'videoPlay', video: video };
				that.trigger( eventObject );
				if ( $.isFunction( that.settings.videoPlay ) ) {
					that.settings.videoPlay.call( that, eventObject );
				}
			});

			// When the video is paused, restart the autoplay
			video.on( 'videoPause.' + NS, function() {
				if ( that.settings.pauseVideoAction === 'startAutoplay' && typeof that.startAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.startAutoplay();
					that.settings.autoplay = true;
				}

				// Fire the 'videoPause' event
				var eventObject = { type: 'videoPause', video: video };
				that.trigger( eventObject );
				if ( $.isFunction( that.settings.videoPause ) ) {
					that.settings.videoPause.call( that, eventObject );
				}
			});

			// When the video ends, restart the autoplay (which was paused during the playback), or
			// go to the next slide, or replay the video
			video.on( 'videoEnded.' + NS, function() {
				if ( that.settings.endVideoAction === 'startAutoplay' && typeof that.startAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.startAutoplay();
					that.settings.autoplay = true;
				} else if ( that.settings.endVideoAction === 'nextSlide' ) {
					that.nextSlide();
				} else if ( that.settings.endVideoAction === 'replayVideo' ) {
					video.videoController( 'replay' );
				}

				// Fire the 'videoEnd' event
				var eventObject = { type: 'videoEnd', video: video };
				that.trigger( eventObject );
				if ( $.isFunction(that.settings.videoEnd ) ) {
					that.settings.videoEnd.call( that, eventObject );
				}
			});
		},

		// Pre-initialize the video. This is for lazy loaded videos.
		_preinitVideo: function( video ) {
			var that = this;

			video.attr( 'data-video-preinit', true );

			// When the video poster is clicked, remove the poster and create
			// the inline video
			video.on( 'click.' + NS, function( event ) {

				// If the video is being dragged, don't start the video
				if ( that.$slider.hasClass( 'sp-swiping' ) ) {
					return;
				}

				event.preventDefault();

				var href = video.attr( 'href' ),
					iframe,
					provider,
					regExp,
					match,
					id,
					src,
					videoAttributes,
					videoWidth = video.children( 'img' ).attr( 'width' ) || video.children( 'img' ).width(),
					videoHeight = video.children( 'img' ).attr( 'height') || video.children( 'img' ).height();

				// Check if it's a youtube or vimeo video
				if ( href.indexOf( 'youtube' ) !== -1 || href.indexOf( 'youtu.be' ) !== -1 ) {
					provider = 'youtube';
				} else if ( href.indexOf( 'vimeo' ) !== -1 ) {
					provider = 'vimeo';
				}

				// Get the id of the video
				regExp = provider === 'youtube' ? /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/ : /http:\/\/(www\.)?vimeo.com\/(\d+)/;
				match = href.match( regExp );
				id = match[2];

				// Get the source of the iframe that will be created
				src = provider === 'youtube' ? '//www.youtube.com/embed/' + id + '?enablejsapi=1&wmode=opaque' : '//player.vimeo.com/video/'+ id;
				
				// Get the attributes passed to the video link and then pass them to the iframe's src
				videoAttributes = href.split( '?' )[ 1 ];

				if ( typeof videoAttributes !== 'undefined' ) {
					videoAttributes = videoAttributes.split( '&' );

					$.each( videoAttributes, function( index, value ) {
						if ( value.indexOf( id ) === -1 ) {
							src += '&' + value;
						}
					});
				}

				// Create the iframe
				iframe = $( '<iframe></iframe>' )
					.attr({
						'src': src,
						'width': videoWidth,
						'height': videoHeight,
						'class': video.attr( 'class' ),
						'frameborder': 0,
						'allowfullscreen': 'allowfullscreen'
					}).insertBefore( video );

				// Initialize the video and play it
				that._initVideo( iframe );
				iframe.videoController( 'play' );

				// Hide the video poster
				video.css( 'display', 'none' );
			});
		},

		// Called when a new slide is selected
		_videoOnGotoSlide: function( event ) {

			// Get the video from the previous slide
			var previousVideo = this.$slides.find( '.sp-slide' ).eq( event.previousIndex ).find( '.sp-video[data-video-init]' );

			// Handle the video from the previous slide by stopping it, or pausing it,
			// or remove it, depending on the value of the 'leaveVideoAction' option.
			if ( event.previousIndex !== -1 && previousVideo.length !== 0 ) {
				if ( this.settings.leaveVideoAction === 'stopVideo' ) {
					previousVideo.videoController( 'stop' );
				} else if ( this.settings.leaveVideoAction === 'pauseVideo' ) {
					previousVideo.videoController( 'pause' );
				} else if ( this.settings.leaveVideoAction === 'removeVideo'  ) {
					// If the video was lazy-loaded, remove it and show the poster again. If the video
					// was not lazy-loaded, but inline, stop the video.
					if ( previousVideo.siblings( 'a.sp-video' ).length !== 0 ) {
						previousVideo.siblings( 'a.sp-video' ).css( 'display', '' );
						previousVideo.videoController( 'destroy' );
						previousVideo.remove();
					} else {
						previousVideo.videoController( 'stop' );
					}
				}
			}
		},

		// Called when a new slide is selected, 
		// after the transition animation is complete.
		_videoOnGotoSlideComplete: function( event ) {

			// Handle the video from the selected slide
			if ( this.settings.reachVideoAction === 'playVideo' && event.index === this.selectedSlideIndex ) {
				var loadedVideo = this.$slides.find( '.sp-slide' ).eq( event.index ).find( '.sp-video[data-video-init]' ),
					unloadedVideo = this.$slides.find( '.sp-slide' ).eq( event.index ).find( '.sp-video[data-video-preinit]' );

				// If the video was already initialized, play it. If it's not initialized (because
				// it's lazy loaded) initialize it and play it.
				if ( loadedVideo.length !== 0 ) {
					loadedVideo.videoController( 'play' );
				} else if ( unloadedVideo.length !== 0 ) {
					unloadedVideo.trigger( 'click.' + NS );
				}

				// Autoplay is stopped when the video starts playing
				// and the video's 'play' event is fired, but on slower connections,
				// the video's playing will be delayed and the 'play' event
				// will not fire in time to stop the autoplay, so we'll
				// stop it here as well.
				if ( ( loadedVideo.length !== 0 || unloadedVideo.length !== 0 ) && this.settings.playVideoAction === 'stopAutoplay' && typeof this.stopAutoplay !== 'undefined' ) {
					this.stopAutoplay();
					this.settings.autoplay = false;
				}
			}
		},

		// Destroy the module
		destroyVideo: function() {
			this.$slider.find( '.sp-video[ data-video-preinit ]' ).each(function() {
				var video = $( this );
				video.removeAttr( 'data-video-preinit' );
				video.off( 'click.' + NS );
			});

			// Loop through the all the videos and destroy them
			this.$slider.find( '.sp-video[ data-video-init ]' ).each(function() {
				var video = $( this );
				video.removeAttr( 'data-video-init' );
				video.off( 'Video' );
				video.videoController( 'destroy' );
			});

			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'gotoSlideComplete.' + NS );
		},

		videoDefaults: {

			// Sets the action that the video will perform when its slide container is selected
			// ( 'playVideo' and 'none' )
			reachVideoAction: 'none',

			// Sets the action that the video will perform when another slide is selected
			// ( 'stopVideo', 'pauseVideo', 'removeVideo' and 'none' )
			leaveVideoAction: 'pauseVideo',

			// Sets the action that the slider will perform when the video starts playing
			// ( 'stopAutoplay' and 'none' )
			playVideoAction: 'stopAutoplay',

			// Sets the action that the slider will perform when the video is paused
			// ( 'startAutoplay' and 'none' )
			pauseVideoAction: 'none',

			// Sets the action that the slider will perform when the video ends
			// ( 'startAutoplay', 'nextSlide', 'replayVideo' and 'none' )
			endVideoAction: 'none',

			// Called when the video starts playing
			videoPlay: function() {},

			// Called when the video is paused
			videoPause: function() {},

			// Called when the video ends
			videoEnd: function() {}
		}
	};

	$.SliderPro.addModule( 'Video', Video );
	
})( window, jQuery );

// Video Controller jQuery plugin
// Creates a universal controller for multiple video types and providers
;(function( $ ) {

	"use strict";

// Check if an iOS device is used.
// This information is important because a video can not be
// controlled programmatically unless the user has started the video manually.
var	isIOS = window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ? true : false;

var VideoController = function( instance, options ) {
	this.$video = $( instance );
	this.options = options;
	this.settings = {};
	this.player = null;

	this._init();
};

VideoController.prototype = {

	_init: function() {
		this.settings = $.extend( {}, this.defaults, this.options );

		var that = this,
			players = $.VideoController.players,
			videoID = this.$video.attr( 'id' );

		// Loop through the available video players
		// and check if the targeted video element is supported by one of the players.
		// If a compatible type is found, store the video type.
		for ( var name in players ) {
			if ( typeof players[ name ] !== 'undefined' && players[ name ].isType( this.$video ) ) {
				this.player = new players[ name ]( this.$video );
				break;
			}
		}

		// Return if the player could not be instantiated
		if ( this.player === null ) {
			return;
		}

		// Add event listeners
		var events = [ 'ready', 'start', 'play', 'pause', 'ended' ];
		
		$.each( events, function( index, element ) {
			var event = 'video' + element.charAt( 0 ).toUpperCase() + element.slice( 1 );

			that.player.on( element, function() {
				that.trigger({ type: event, video: videoID });
				if ( $.isFunction( that.settings[ event ] ) ) {
					that.settings[ event ].call( that, { type: event, video: videoID } );
				}
			});
		});
	},
	
	play: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'playing' ) {
			return;
		}

		this.player.play();
	},
	
	stop: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'stopped' ) {
			return;
		}

		this.player.stop();
	},
	
	pause: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'paused' ) {
			return;
		}

		this.player.pause();
	},

	replay: function() {
		if ( isIOS === true && this.player.isStarted() === false ) {
			return;
		}
		
		this.player.replay();
	},

	on: function( type, callback ) {
		return this.$video.on( type, callback );
	},
	
	off: function( type ) {
		return this.$video.off( type );
	},

	trigger: function( data ) {
		return this.$video.triggerHandler( data );
	},

	destroy: function() {
		if ( this.player.isStarted() === true ) {
			this.stop();
		}

		this.player.off( 'ready' );
		this.player.off( 'start' );
		this.player.off( 'play' );
		this.player.off( 'pause' );
		this.player.off( 'ended' );

		this.$video.removeData( 'videoController' );
	},

	defaults: {
		videoReady: function() {},
		videoStart: function() {},
		videoPlay: function() {},
		videoPause: function() {},
		videoEnded: function() {}
	}
};

$.VideoController = {
	players: {},

	addPlayer: function( name, player ) {
		this.players[ name ] = player;
	}
};

$.fn.videoController = function( options ) {
	var args = Array.prototype.slice.call( arguments, 1 );

	return this.each(function() {
		// Instantiate the video controller or call a function on the current instance
		if ( typeof $( this ).data( 'videoController' ) === 'undefined' ) {
			var newInstance = new VideoController( this, options );

			// Store a reference to the instance created
			$( this ).data( 'videoController', newInstance );
		} else if ( typeof options !== 'undefined' ) {
			var	currentInstance = $( this ).data( 'videoController' );

			// Check the type of argument passed
			if ( typeof currentInstance[ options ] === 'function' ) {
				currentInstance[ options ].apply( currentInstance, args );
			} else {
				$.error( options + ' does not exist in videoController.' );
			}
		}
	});
};

// Base object for the video players
var Video = function( video ) {
	this.$video = video;
	this.player = null;
	this.ready = false;
	this.started = false;
	this.state = '';
	this.events = $({});

	this._init();
};

Video.prototype = {
	_init: function() {},

	play: function() {},

	pause: function() {},

	stop: function() {},

	replay: function() {},

	isType: function() {},

	isReady: function() {
		return this.ready;
	},

	isStarted: function() {
		return this.started;
	},

	getState: function() {
		return this.state;
	},

	on: function( type, callback ) {
		return this.events.on( type, callback );
	},
	
	off: function( type ) {
		return this.events.off( type );
	},

	trigger: function( data ) {
		return this.events.triggerHandler( data );
	}
};

// YouTube video
var YoutubeVideoHelper = {
	youtubeAPIAdded: false,
	youtubeVideos: []
};

var YoutubeVideo = function( video ) {
	this.init = false;
	var youtubeAPILoaded = window.YT && window.YT.Player;

	if ( typeof youtubeAPILoaded !== 'undefined' ) {
		Video.call( this, video );
	} else {
		YoutubeVideoHelper.youtubeVideos.push({ 'video': video, 'scope': this });
		
		if ( YoutubeVideoHelper.youtubeAPIAdded === false ) {
			YoutubeVideoHelper.youtubeAPIAdded = true;

			var tag = document.createElement( 'script' );
			tag.src = "//www.youtube.com/player_api";
			var firstScriptTag = document.getElementsByTagName( 'script' )[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

			window.onYouTubePlayerAPIReady = function() {
				$.each( YoutubeVideoHelper.youtubeVideos, function( index, element ) {
					Video.call( element.scope, element.video );
				});
			};
		}
	}
};

YoutubeVideo.prototype = new Video();
YoutubeVideo.prototype.constructor = YoutubeVideo;
$.VideoController.addPlayer( 'YoutubeVideo', YoutubeVideo );

YoutubeVideo.isType = function( video ) {
	if ( video.is( 'iframe' ) ) {
		var src = video.attr( 'src' );

		if ( src.indexOf( 'youtube.com' ) !== -1 || src.indexOf( 'youtu.be' ) !== -1 ) {
			return true;
		}
	}

	return false;
};

YoutubeVideo.prototype._init = function() {
	this.init = true;
	this._setup();
};
	
YoutubeVideo.prototype._setup = function() {
	var that = this;

	// Get a reference to the player
	this.player = new YT.Player( this.$video[0], {
		events: {
			'onReady': function() {
				that.trigger({ type: 'ready' });
				that.ready = true;
			},
			
			'onStateChange': function( event ) {
				switch ( event.data ) {
					case YT.PlayerState.PLAYING:
						if (that.started === false) {
							that.started = true;
							that.trigger({ type: 'start' });
						}

						that.state = 'playing';
						that.trigger({ type: 'play' });
						break;
					
					case YT.PlayerState.PAUSED:
						that.state = 'paused';
						that.trigger({ type: 'pause' });
						break;
					
					case YT.PlayerState.ENDED:
						that.state = 'ended';
						that.trigger({ type: 'ended' });
						break;
				}
			}
		}
	});
};

YoutubeVideo.prototype.play = function() {
	var that = this;

	if ( this.ready === true ) {
		this.player.playVideo();
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.playVideo();
			}
		}, 100 );
	}
};

YoutubeVideo.prototype.pause = function() {
	// On iOS, simply pausing the video can make other videos unresponsive
	// so we stop the video instead.
	if ( isIOS === true ) {
		this.stop();
	} else {
		this.player.pauseVideo();
	}
};

YoutubeVideo.prototype.stop = function() {
	this.player.seekTo( 1 );
	this.player.stopVideo();
	this.state = 'stopped';
};

YoutubeVideo.prototype.replay = function() {
	this.player.seekTo( 1 );
	this.player.playVideo();
};

YoutubeVideo.prototype.on = function( type, callback ) {
	var that = this;

	if ( this.init === true ) {
		Video.prototype.on.call( this, type, callback );
	} else {
		var timer = setInterval(function() {
			if ( that.init === true ) {
				clearInterval( timer );
				Video.prototype.on.call( that, type, callback );
			}
		}, 100 );
	}
};

// Vimeo video
var VimeoVideoHelper = {
	vimeoAPIAdded: false,
	vimeoVideos: []
};

var VimeoVideo = function( video ) {
	this.init = false;

	if ( typeof window.Vimeo !== 'undefined' ) {
		Video.call( this, video );
	} else {
		VimeoVideoHelper.vimeoVideos.push({ 'video': video, 'scope': this });

		if ( VimeoVideoHelper.vimeoAPIAdded === false ) {
			VimeoVideoHelper.vimeoAPIAdded = true;

			var tag = document.createElement('script');
			tag.src = "//player.vimeo.com/api/player.js";
			var firstScriptTag = document.getElementsByTagName( 'script' )[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
		
			var checkVimeoAPITimer = setInterval(function() {
				if ( typeof window.Vimeo !== 'undefined' ) {
					clearInterval( checkVimeoAPITimer );
					
					$.each( VimeoVideoHelper.vimeoVideos, function( index, element ) {
						Video.call( element.scope, element.video );
					});
				}
			}, 100 );
		}
	}
};

VimeoVideo.prototype = new Video();
VimeoVideo.prototype.constructor = VimeoVideo;
$.VideoController.addPlayer( 'VimeoVideo', VimeoVideo );

VimeoVideo.isType = function( video ) {
	if ( video.is( 'iframe' ) ) {
		var src = video.attr('src');

		if ( src.indexOf( 'vimeo.com' ) !== -1 ) {
			return true;
		}
	}

	return false;
};

VimeoVideo.prototype._init = function() {
	this.init = true;
	this._setup();
};

VimeoVideo.prototype._setup = function() {
	var that = this;

	// Get a reference to the player
	this.player = new Vimeo.Player( this.$video[0] );
	
	that.ready = true;
	that.trigger({ type: 'ready' });
		
	that.player.on( 'play', function() {
		if ( that.started === false ) {
			that.started = true;
			that.trigger({ type: 'start' });
		}

		that.state = 'playing';
		that.trigger({ type: 'play' });
	});
		
	that.player.on( 'pause', function() {
		that.state = 'paused';
		that.trigger({ type: 'pause' });
	});
		
	that.player.on( 'ended', function() {
		that.state = 'ended';
		that.trigger({ type: 'ended' });
	});
};

VimeoVideo.prototype.play = function() {
	var that = this;
 
    if ( this.ready === true ) {
        this.player.play();
    } else {
        var timer = setInterval(function() {
            if ( that.ready === true ) {
                clearInterval( timer );
                that.player.play();
            }
        }, 100 );
    }
};

VimeoVideo.prototype.pause = function() {
	this.player.pause();
};

VimeoVideo.prototype.stop = function() {
	var that = this;

	this.player.setCurrentTime( 0 ).then( function() {
		that.player.pause();
		that.state = 'stopped';
	} );
};

VimeoVideo.prototype.replay = function() {
	var that = this;

	this.player.setCurrentTime( 0 ).then( function() {
		that.player.play();
	} );
};

VimeoVideo.prototype.on = function( type, callback ) {
	var that = this;

	if ( this.init === true ) {
		Video.prototype.on.call( this, type, callback );
	} else {
		var timer = setInterval(function() {
			if ( that.init === true ) {
				clearInterval( timer );
				Video.prototype.on.call( that, type, callback );
			}
		}, 100 );
	}
};

// HTML5 video
var HTML5Video = function( video ) {
	Video.call( this, video );
};

HTML5Video.prototype = new Video();
HTML5Video.prototype.constructor = HTML5Video;
$.VideoController.addPlayer( 'HTML5Video', HTML5Video );

HTML5Video.isType = function( video ) {
	if ( video.is( 'video' ) && video.hasClass( 'video-js' ) === false && video.hasClass( 'sublime' ) === false ) {
		return true;
	}

	return false;
};

HTML5Video.prototype._init = function() {
	var that = this;

	// Get a reference to the player
	this.player = this.$video[0];
	
	var checkVideoReady = setInterval(function() {
		if ( that.player.readyState === 4 ) {
			clearInterval( checkVideoReady );

			that.ready = true;
			that.trigger({ type: 'ready' });

			that.player.addEventListener( 'play', function() {
				if ( that.started === false ) {
					that.started = true;
					that.trigger({ type: 'start' });
				}

				that.state = 'playing';
				that.trigger({ type: 'play' });
			});
			
			that.player.addEventListener( 'pause', function() {
				that.state = 'paused';
				that.trigger({ type: 'pause' });
			});
			
			that.player.addEventListener( 'ended', function() {
				that.state = 'ended';
				that.trigger({ type: 'ended' });
			});
		}
	}, 100 );
};

HTML5Video.prototype.play = function() {
	var that = this;

	if ( this.ready === true ) {
		this.player.play();
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.play();
			}
		}, 100 );
	}
};

HTML5Video.prototype.pause = function() {
	this.player.pause();
};

HTML5Video.prototype.stop = function() {
	this.player.currentTime = 0;
	this.player.pause();
	this.state = 'stopped';
};

HTML5Video.prototype.replay = function() {
	this.player.currentTime = 0;
	this.player.play();
};

// VideoJS video
var VideoJSVideo = function( video ) {
	Video.call( this, video );
};

VideoJSVideo.prototype = new Video();
VideoJSVideo.prototype.constructor = VideoJSVideo;
$.VideoController.addPlayer( 'VideoJSVideo', VideoJSVideo );

VideoJSVideo.isType = function( video ) {
	if ( ( typeof video.attr( 'data-videojs-id' ) !== 'undefined' || video.hasClass( 'video-js' ) ) && typeof videojs !== 'undefined' ) {
		return true;
	}

	return false;
};

VideoJSVideo.prototype._init = function() {
	var that = this,
		videoID = this.$video.hasClass( 'video-js' ) ? this.$video.attr( 'id' ) : this.$video.attr( 'data-videojs-id' );
	
	this.player = videojs( videoID );

	this.player.ready(function() {
		that.ready = true;
		that.trigger({ type: 'ready' });

		that.player.on( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});
		
		that.player.on( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.on( 'ended', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

VideoJSVideo.prototype.play = function() {
	this.player.play();
};

VideoJSVideo.prototype.pause = function() {
	this.player.pause();
};

VideoJSVideo.prototype.stop = function() {
	this.player.currentTime( 0 );
	this.player.pause();
	this.state = 'stopped';
};

VideoJSVideo.prototype.replay = function() {
	this.player.currentTime( 0 );
	this.player.play();
};

// Sublime video
var SublimeVideo = function( video ) {
	Video.call( this, video );
};

SublimeVideo.prototype = new Video();
SublimeVideo.prototype.constructor = SublimeVideo;
$.VideoController.addPlayer( 'SublimeVideo', SublimeVideo );

SublimeVideo.isType = function( video ) {
	if ( video.hasClass( 'sublime' ) && typeof sublime !== 'undefined' ) {
		return true;
	}

	return false;
};

SublimeVideo.prototype._init = function() {
	var that = this;

	sublime.ready(function() {
		// Get a reference to the player
		that.player = sublime.player( that.$video.attr( 'id' ) );

		that.ready = true;
		that.trigger({ type: 'ready' });

		that.player.on( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});

		that.player.on( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});

		that.player.on( 'stop', function() {
			that.state = 'stopped';
			that.trigger({ type: 'stop' });
		});

		that.player.on( 'end', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

SublimeVideo.prototype.play = function() {
	this.player.play();
};

SublimeVideo.prototype.pause = function() {
	this.player.pause();
};

SublimeVideo.prototype.stop = function() {
	this.player.stop();
};

SublimeVideo.prototype.replay = function() {
	this.player.stop();
	this.player.play();
};

// JWPlayer video
var JWPlayerVideo = function( video ) {
	Video.call( this, video );
};

JWPlayerVideo.prototype = new Video();
JWPlayerVideo.prototype.constructor = JWPlayerVideo;
$.VideoController.addPlayer( 'JWPlayerVideo', JWPlayerVideo );

JWPlayerVideo.isType = function( video ) {
	if ( ( typeof video.attr( 'data-jwplayer-id' ) !== 'undefined' || video.hasClass( 'jwplayer' ) || video.find( "object[data*='jwplayer']" ).length !== 0 ) &&
		typeof jwplayer !== 'undefined') {
		return true;
	}

	return false;
};

JWPlayerVideo.prototype._init = function() {
	var that = this,
		videoID;

	if ( this.$video.hasClass( 'jwplayer' ) ) {
		videoID = this.$video.attr( 'id' );
	} else if ( typeof this.$video.attr( 'data-jwplayer-id' ) !== 'undefined' ) {
		videoID = this.$video.attr( 'data-jwplayer-id');
	} else if ( this.$video.find( "object[data*='jwplayer']" ).length !== 0 ) {
		videoID = this.$video.find( 'object' ).attr( 'id' );
	}

	// Get a reference to the player
	this.player = jwplayer( videoID );

	this.player.onReady(function() {
		that.ready = true;
		that.trigger({ type: 'ready' });
	
		that.player.onPlay(function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});

		that.player.onPause(function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.onComplete(function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

JWPlayerVideo.prototype.play = function() {
	this.player.play( true );
};

JWPlayerVideo.prototype.pause = function() {
	this.player.pause( true );
};

JWPlayerVideo.prototype.stop = function() {
	this.player.stop();
	this.state = 'stopped';
};

JWPlayerVideo.prototype.replay = function() {
	this.player.seek( 0 );
	this.player.play( true );
};

})( jQuery );

/***/ }),

/***/ 619:
/***/ (() => {

!function(n){var r={};function o(t){if(r[t])return r[t].exports;var e=r[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,o),e.l=!0,e.exports}o.m=n,o.c=r,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=193)}([function(n,t,e){!function(t){function e(t){return t&&t.Math==Math&&t}n.exports=e("object"==typeof globalThis&&globalThis)||e("object"==typeof window&&window)||e("object"==typeof self&&self)||e("object"==typeof t&&t)||function(){return this}()||Function("return this")()}.call(this,e(154))},function(t,e,n){var n=n(60),r=Function.prototype,o=r.bind,i=r.call,a=n&&o.bind(i,i);t.exports=n?function(t){return t&&a(t)}:function(t){return t&&function(){return i.apply(t,arguments)}}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var u=n(0),l=n(42).f,f=n(45),d=n(37),p=n(98),h=n(126),v=n(81);t.exports=function(t,e){var n,r,o,i=t.target,a=t.global,c=t.stat,s=a?u:c?u[i]||p(i,{}):(u[i]||{}).prototype;if(s)for(n in e){if(r=e[n],o=t.noTargetGet?(o=l(s,n))&&o.value:s[n],!v(a?n:i+(c?".":"#")+n,t.forced)&&void 0!==o){if(typeof r==typeof o)continue;h(r,o)}(t.sham||o&&o.sham)&&f(r,"sham",!0),d(s,n,r,t)}}},function(t,e,n){var r=n(105),o=n(37),n=n(158);r||o(Object.prototype,"toString",n,{unsafe:!0})},function(t,e,n){"use strict";var r=n(30),o=n(89),i=n(68),a=n(49),c=n(22).f,s=n(109),u=n(54),n=n(17),l="Array Iterator",f=a.set,d=a.getterFor(l),a=(t.exports=s(Array,"Array",function(t,e){f(this,{type:l,target:r(t),index:0,kind:e})},function(){var t=d(this),e=t.target,n=t.kind,r=t.index++;return!e||r>=e.length?{value:t.target=void 0,done:!0}:"keys"==n?{value:r,done:!1}:"values"==n?{value:e[r],done:!1}:{value:[r,e[r]],done:!1}},"values"),i.Arguments=i.Array);if(o("keys"),o("values"),o("entries"),!u&&n&&"values"!==a.name)try{c(a,"name",{value:"values"})}catch(t){}},function(t,e,n){"use strict";var r=n(137).charAt,o=n(23),i=n(49),n=n(109),a="String Iterator",c=i.set,s=i.getterFor(a);n(String,"String",function(t){c(this,{type:a,string:o(t),index:0})},function(){var t=s(this),e=t.string,n=t.index;return n>=e.length?{value:void 0,done:!0}:(e=r(e,n),t.index+=e.length,{value:e,done:!1})})},function(N,R,t){"use strict";function r(t,e){var n=P[t]=g(T);return ft(n,{type:x,tag:t,description:e}),u||(n.description=e),n}function o(t,e,n){return t===E&&o(M,e,n),h(t),e=y(e),h(n),d(P,e)?(n.enumerable?(d(t,S)&&t[S][e]&&(t[S][e]=!1),n=g(n,{enumerable:m(0,!1)})):(d(t,S)||D(t,S,m(1,{})),t[S][e]=!0),bt(t,e,n)):D(t,e,n)}function n(e,t){h(e);var n=v(t),t=Q(n).concat(a(n));return C(t,function(t){u&&!s(i,n,t)||o(e,t,n[t])}),e}function i(t){var t=y(t),e=s(yt,this,t);return!(this===E&&d(P,t)&&!d(M,t))&&(!(e||!d(this,t)||!d(P,t)||d(this,S)&&this[S][t])||e)}function B(t,e){var n,t=v(t),e=y(e);if(t!==E||!d(P,e)||d(M,e))return!(n=ht(t,e))||!d(P,e)||d(t,S)&&t[S][e]||(n.enumerable=!0),n}function H(t){var t=vt(v(t)),e=[];return C(t,function(t){d(P,t)||d(it,t)||mt(e,t)}),e}function a(t){var e=t===E,t=vt(e?M:v(t)),n=[];return C(t,function(t){!d(P,t)||e&&!d(E,t)||mt(n,P[t])}),n}var F,e=t(3),c=t(0),V=t(43),Y=t(84),s=t(21),W=t(1),z=t(54),u=t(17),l=t(96),f=t(2),d=t(20),U=t(86),q=t(14),K=t(19),$=t(44),p=t(73),h=t(18),X=t(36),v=t(30),y=t(72),G=t(23),m=t(61),g=t(50),Q=t(66),Z=t(55),J=t(107),b=t(103),tt=t(42),et=t(22),nt=t(132),rt=t(70),ot=t(106),_=t(37),w=t(77),O=t(79),it=t(63),at=t(78),ct=t(12),st=t(133),ut=t(134),lt=t(87),k=t(49),C=t(56).forEach,S=O("hidden"),x="Symbol",t="prototype",O=ct("toPrimitive"),ft=k.set,dt=k.getterFor(x),E=Object[t],j=c.Symbol,T=j&&j[t],pt=c.TypeError,k=c.QObject,A=V("JSON","stringify"),ht=tt.f,D=et.f,vt=J.f,yt=rt.f,mt=W([].push),P=w("symbols"),M=w("op-symbols"),I=w("string-to-symbol-registry"),L=w("symbol-to-string-registry"),c=w("wks"),gt=!k||!k[t]||!k[t].findChild,bt=u&&f(function(){return 7!=g(D({},"a",{get:function(){return D(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=ht(E,e);r&&delete E[e],D(t,e,n),r&&t!==E&&D(E,e,r)}:D;l||(_(T=(j=function(){if($(T,this))throw pt("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?G(arguments[0]):void 0,e=at(t),n=function(t){this===E&&s(n,M,t),d(this,S)&&d(this[S],e)&&(this[S][e]=!1),bt(this,e,m(1,t))};return u&&gt&&bt(E,e,{configurable:!0,set:n}),r(e,t)})[t],"toString",function(){return dt(this).tag}),_(j,"withoutSetter",function(t){return r(at(t),t)}),rt.f=i,et.f=o,nt.f=n,tt.f=B,Z.f=J.f=H,b.f=a,st.f=function(t){return r(ct(t),t)},u&&(D(T,"description",{configurable:!0,get:function(){return dt(this).description}}),z||_(E,"propertyIsEnumerable",i,{unsafe:!0}))),e({global:!0,wrap:!0,forced:!l,sham:!l},{Symbol:j}),C(Q(c),function(t){ut(t)}),e({target:x,stat:!0,forced:!l},{for:function(t){t=G(t);if(d(I,t))return I[t];var e=j(t);return I[t]=e,L[e]=t,e},keyFor:function(t){if(!p(t))throw pt(t+" is not a symbol");if(d(L,t))return L[t]},useSetter:function(){gt=!0},useSimple:function(){gt=!1}}),e({target:"Object",stat:!0,forced:!l,sham:!u},{create:function(t,e){return void 0===e?g(t):n(g(t),e)},defineProperty:o,defineProperties:n,getOwnPropertyDescriptor:B}),e({target:"Object",stat:!0,forced:!l},{getOwnPropertyNames:H,getOwnPropertySymbols:a}),e({target:"Object",stat:!0,forced:f(function(){b.f(1)})},{getOwnPropertySymbols:function(t){return b.f(X(t))}}),A&&e({target:"JSON",stat:!0,forced:!l||f(function(){var t=j();return"[null]"!=A([t])||"{}"!=A({a:t})||"{}"!=A(Object(t))})},{stringify:function(t,e,n){var r=ot(arguments),o=e;if((K(e)||void 0!==t)&&!p(t))return U(e)||(e=function(t,e){if(q(o)&&(e=s(o,this,t,e)),!p(e))return e}),r[1]=e,Y(A,null,r)}}),T[O]||(F=T.valueOf,_(T,O,function(t){return s(F,this)})),lt(j,x),it[S]=!0},function(t,e,n){function r(e,t){if(e){if(e[l]!==d)try{u(e,l,d)}catch(t){e[l]=d}if(e[f]||u(e,f,t),a[t])for(var n in s)if(e[n]!==s[n])try{u(e,n,s[n])}catch(t){e[n]=s[n]}}}var o,i=n(0),a=n(138),c=n(139),s=n(5),u=n(45),n=n(12),l=n("iterator"),f=n("toStringTag"),d=s.values;for(o in a)r(i[o]&&i[o].prototype,o);r(c,"DOMTokenList")},function(t,e,n){function r(e){if(e&&e.forEach!==s)try{u(e,"forEach",s)}catch(t){e.forEach=s}}var o,i=n(0),a=n(138),c=n(139),s=n(168),u=n(45);for(o in a)a[o]&&r(i[o]&&i[o].prototype);r(c)},function(t,e,n){"use strict";var r,o,i,a,c,s,u,l=n(3),f=n(17),d=n(0),p=n(1),h=n(20),v=n(14),y=n(44),m=n(23),g=n(22).f,n=n(126),b=d.Symbol,_=b&&b.prototype;!f||!v(b)||"description"in _&&void 0===b().description||(r={},n(d=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:m(arguments[0]),e=y(_,this)?new b(t):void 0===t?b():b(t);return""===t&&(r[e]=!0),e},b),(d.prototype=_).constructor=d,o="Symbol(test)"==String(b("test")),i=p(_.toString),a=p(_.valueOf),c=/^Symbol\((.*)\)[^)]+$/,s=p("".replace),u=p("".slice),g(_,"description",{configurable:!0,get:function(){var t=a(this),e=i(t);if(h(r,t))return"";t=o?u(e,7,-1):s(e,c,"$1");return""===t?void 0:t}}),l({global:!0,forced:!0},{Symbol:d}))},function(t,e,n){n(134)("iterator")},function(t,e,n){var r=n(0),o=n(77),i=n(20),a=n(78),c=n(96),s=n(123),u=o("wks"),l=r.Symbol,f=l&&l.for,d=s?l:l&&l.withoutSetter||a;t.exports=function(t){var e;return i(u,t)&&(c||"string"==typeof u[t])||(e="Symbol."+t,c&&i(l,t)?u[t]=l[t]:u[t]=(s&&f?f:d)(e)),u[t]}},function(t,e,n){var r=n(3),o=n(36),i=n(66);r({target:"Object",stat:!0,forced:n(2)(function(){i(1)})},{keys:function(t){return i(o(t))}})},function(t,e){t.exports=function(t){return"function"==typeof t}},function(t,e,n){"use strict";var r=n(3),o=n(56).filter;r({target:"Array",proto:!0,forced:!n(94)("filter")},{filter:function(t){return o(this,t,1<arguments.length?arguments[1]:void 0)}})},function(t,e,n){"use strict";var r=n(3),n=n(90);r({target:"RegExp",proto:!0,forced:/./.exec!==n},{exec:n})},function(t,e,n){n=n(2);t.exports=!n(function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})},function(t,e,n){var r=n(0),o=n(19),i=r.String,a=r.TypeError;t.exports=function(t){if(o(t))return t;throw a(i(t)+" is not an object")}},function(t,e,n){var r=n(14);t.exports=function(t){return"object"==typeof t?null!==t:r(t)}},function(t,e,n){var r=n(1),o=n(36),i=r({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,e){return i(o(t),e)}},function(t,e,n){var n=n(60),r=Function.prototype.call;t.exports=n?r.bind(r):function(){return r.apply(r,arguments)}},function(t,e,n){var r=n(0),o=n(17),i=n(124),a=n(125),c=n(18),s=n(72),u=r.TypeError,l=Object.defineProperty,f=Object.getOwnPropertyDescriptor,d="enumerable",p="configurable",h="writable";e.f=o?a?function(t,e,n){var r;return c(t),e=s(e),c(n),"function"==typeof t&&"prototype"===e&&"value"in n&&h in n&&!n[h]&&((r=f(t,e))&&r[h]&&(t[e]=n.value,n={configurable:(p in n?n:r)[p],enumerable:(d in n?n:r)[d],writable:!1})),l(t,e,n)}:l:function(t,e,n){if(c(t),e=s(e),c(n),i)try{return l(t,e,n)}catch(t){}if("get"in n||"set"in n)throw u("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(0),o=n(83),i=r.String;t.exports=function(t){if("Symbol"===o(t))throw TypeError("Cannot convert a Symbol value to a string");return i(t)}},function(t,e,n){var r=n(3),o=n(2),i=n(30),a=n(42).f,n=n(17),o=o(function(){a(1)});r({target:"Object",stat:!0,forced:!n||o,sham:!n},{getOwnPropertyDescriptor:function(t,e){return a(i(t),e)}})},function(t,e,n){var r=n(3),o=n(17),s=n(127),u=n(30),l=n(42),f=n(67);r({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(t){for(var e,n,r=u(t),o=l.f,i=s(r),a={},c=0;i.length>c;)void 0!==(n=o(r,e=i[c++]))&&f(a,e,n);return a}})},function(t,e,n){"use strict";var r=n(3),o=n(0),i=n(2),u=n(86),l=n(19),f=n(36),d=n(46),p=n(67),h=n(135),a=n(94),c=n(12),n=n(74),v=c("isConcatSpreadable"),y=9007199254740991,m="Maximum allowed index exceeded",g=o.TypeError,c=51<=n||!i(function(){var t=[];return t[v]=!1,t.concat()[0]!==t}),o=a("concat");r({target:"Array",proto:!0,forced:!c||!o},{concat:function(t){for(var e,n,r,o=f(this),i=h(o,0),a=0,c=-1,s=arguments.length;c<s;c++)if(function(t){if(!l(t))return!1;var e=t[v];return void 0!==e?!!e:u(t)}(r=-1===c?o:arguments[c])){if(n=d(r),y<a+n)throw g(m);for(e=0;e<n;e++,a++)e in r&&p(i,a,r[e])}else{if(y<=a)throw g(m);p(i,a++,r)}return i.length=a,i}})},function(t,e,n){"use strict";var r=n(3),o=n(0),u=n(86),l=n(85),f=n(19),d=n(101),p=n(46),h=n(30),v=n(67),i=n(12),a=n(94),y=n(106),n=a("slice"),m=i("species"),g=o.Array,b=Math.max;r({target:"Array",proto:!0,forced:!n},{slice:function(t,e){var n,r,o,i=h(this),a=p(i),c=d(t,a),s=d(void 0===e?a:e,a);if(u(i)&&(n=i.constructor,(n=l(n)&&(n===g||u(n.prototype))||f(n)&&null===(n=n[m])?void 0:n)===g||void 0===n))return y(i,c,s);for(r=new(void 0===n?g:n)(b(s-c,0)),o=0;c<s;c++,o++)c in i&&v(r,o,i[c]);return r.length=o,r}})},function(t,e,n){"use strict";var r=n(3),o=n(56).find,n=n(89),i="find",a=!0;i in[]&&Array(1)[i](function(){a=!1}),r({target:"Array",proto:!0,forced:a},{find:function(t){return o(this,t,1<arguments.length?arguments[1]:void 0)}}),n(i)},function(t,e,n){n(3)({target:"Object",stat:!0},{setPrototypeOf:n(104)})},function(t,e,n){var r=n(71),o=n(39);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(3),o=n(2),i=n(36),a=n(82),n=n(130);r({target:"Object",stat:!0,forced:o(function(){a(1)}),sham:!n},{getPrototypeOf:function(t){return a(i(t))}})},function(t,e,n){var r=n(3),o=n(43),i=n(84),a=n(159),c=n(131),s=n(18),u=n(19),l=n(50),n=n(2),f=o("Reflect","construct"),d=Object.prototype,p=[].push,h=n(function(){function t(){}return!(f(function(){},[],t)instanceof t)}),v=!n(function(){f(function(){})}),o=h||v;r({target:"Reflect",stat:!0,forced:o,sham:o},{construct:function(t,e){c(t),s(e);var n=arguments.length<3?t:c(arguments[2]);if(v&&!h)return f(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var r=[null];return i(p,r,e),new(i(a,t,r))}r=n.prototype,n=l(u(r)?r:d),r=i(t,n,e);return u(r)?r:n}})},function(t,e,n){"use strict";var r=n(3),o=n(129).includes,n=n(89);r({target:"Array",proto:!0},{includes:function(t){return o(this,t,1<arguments.length?arguments[1]:void 0)}}),n("includes")},function(t,e,n){"use strict";var r=n(17),o=n(0),i=n(1),a=n(81),c=n(37),s=n(20),u=n(117),l=n(44),f=n(73),d=n(122),p=n(2),h=n(55).f,v=n(42).f,y=n(22).f,m=n(167),g=n(92).trim,n="Number",b=o[n],_=b.prototype,w=o.TypeError,O=i("".slice),k=i("".charCodeAt),C=function(t){var e,n,r,o,i,a,c,s=d(t,"number");if(f(s))throw w("Cannot convert a Symbol value to a number");if("string"==typeof s&&2<s.length)if(s=g(s),43===(t=k(s,0))||45===t){if(88===(e=k(s,2))||120===e)return NaN}else if(48===t){switch(k(s,1)){case 66:case 98:n=2,r=49;break;case 79:case 111:n=8,r=55;break;default:return+s}for(i=(o=O(s,2)).length,a=0;a<i;a++)if((c=k(o,a))<48||r<c)return NaN;return parseInt(o,n)}return+s};if(a(n,!b(" 0o1")||!b("0b1")||b("+0x1"))){for(var S,x=function(t){var t=arguments.length<1?0:b(function(t){t=d(t,"number");return"bigint"==typeof t?t:C(t)}(t)),e=this;return l(_,e)&&p(function(){m(e)})?u(Object(t),e,x):t},E=r?h(b):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","),j=0;E.length>j;j++)s(b,S=E[j])&&!s(x,S)&&y(x,S,v(b,S));c(o,n,(x.prototype=_).constructor=x)}},function(t,e,n){var r=n(3),o=n(174);r({target:"Array",stat:!0,forced:!n(152)(function(t){Array.from(t)})},{from:o})},function(t,e,n){var r=n(0),o=n(39),i=r.Object;t.exports=function(t){return i(o(t))}},function(t,e,n){var s=n(0),u=n(14),l=n(20),f=n(45),d=n(98),r=n(100),o=n(49),p=n(64).CONFIGURABLE,i=o.get,h=o.enforce,v=String(String).split("String");(t.exports=function(t,e,n,r){var o,i=!!r&&!!r.unsafe,a=!!r&&!!r.enumerable,c=!!r&&!!r.noTargetGet,r=r&&void 0!==r.name?r.name:e;u(n)&&("Symbol("===String(r).slice(0,7)&&(r="["+String(r).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!l(n,"name")||p&&n.name!==r)&&f(n,"name",r),(o=h(n)).source||(o.source=v.join("string"==typeof r?r:""))),t===s?a?t[e]=n:d(e,n):(i?!c&&t[e]&&(a=!0):delete t[e],a?t[e]=n:f(t,e,n))})(Function.prototype,"toString",function(){return u(this)&&i(this).source||r(this)})},function(t,e,n){"use strict";var l=n(84),f=n(21),r=n(1),o=n(112),d=n(115),m=n(18),p=n(39),g=n(164),b=n(113),_=n(65),w=n(23),i=n(53),O=n(108),k=n(114),C=n(90),a=n(111),n=n(2),S=a.UNSUPPORTED_Y,x=4294967295,E=Math.min,j=[].push,T=r(/./.exec),A=r(j),D=r("".slice);o("split",function(o,h,v){var y="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||1<".".split(/()()/).length||"".split(/.?/).length?function(t,e){var n=w(p(this)),r=void 0===e?x:e>>>0;if(0==r)return[];if(void 0===t)return[n];if(!d(t))return f(h,n,t,r);for(var o,i,a,c=[],e=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),s=0,u=new RegExp(t.source,e+"g");(o=f(C,u,n))&&!(s<(i=u.lastIndex)&&(A(c,D(n,s,o.index)),1<o.length&&o.index<n.length&&l(j,c,O(o,1)),a=o[0].length,s=i,r<=c.length));)u.lastIndex===o.index&&u.lastIndex++;return s===n.length?!a&&T(u,"")||A(c,""):A(c,D(n,s)),r<c.length?O(c,0,r):c}:"0".split(void 0,0).length?function(t,e){return void 0===t&&0===e?[]:f(h,this,t,e)}:h;return[function(t,e){var n=p(this),r=null==t?void 0:i(t,o);return r?f(r,t,n,e):f(y,w(n),t,e)},function(t,e){var n=m(this),r=w(t),t=v(y,n,r,e,y!==h);if(t.done)return t.value;var t=g(n,RegExp),o=n.unicode,i=(n.ignoreCase?"i":"")+(n.multiline?"m":"")+(n.unicode?"u":"")+(S?"g":"y"),a=new t(S?"^(?:"+n.source+")":n,i),c=void 0===e?x:e>>>0;if(0==c)return[];if(0===r.length)return null===k(a,r)?[r]:[];for(var s=0,u=0,l=[];u<r.length;){a.lastIndex=S?0:u;var f,d=k(a,S?D(r,u):r);if(null===d||(f=E(_(a.lastIndex+(S?u:0)),r.length))===s)u=b(r,u,o);else{if(A(l,D(r,s,u)),l.length===c)return l;for(var p=1;p<=d.length-1;p++)if(A(l,d[p]),l.length===c)return l;u=s=f}}return A(l,D(r,s)),l}]},!!n(function(){var t=/(?:)/,e=t.exec,t=(t.exec=function(){return e.apply(this,arguments)},"ab".split(t));return 2!==t.length||"a"!==t[0]||"b"!==t[1]}),S)},function(t,e,n){var r=n(0).TypeError;t.exports=function(t){if(null==t)throw r("Can't call method on "+t);return t}},function(t,e,n){"use strict";var r=n(1),o=n(64).PROPER,i=n(37),a=n(18),c=n(44),s=n(23),u=n(2),n=n(110),l="toString",f=RegExp.prototype,d=f[l],p=r(n),r=u(function(){return"/a/b"!=d.call({source:"a",flags:"b"})}),n=o&&d.name!=l;(r||n)&&i(RegExp.prototype,l,function(){var t=a(this),e=s(t.source),n=t.flags;return"/"+e+"/"+s(void 0!==n||!c(f,t)||"flags"in f?n:p(t))},{unsafe:!0})},function(t,e,n){var r=n(17),o=n(64).EXISTS,i=n(1),n=n(22).f,a=Function.prototype,c=i(a.toString),s=/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,u=i(s.exec);r&&!o&&n(a,"name",{configurable:!0,get:function(){try{return u(s,c(this))[1]}catch(t){return""}}})},function(t,e,n){var r=n(17),o=n(21),i=n(70),a=n(61),c=n(30),s=n(72),u=n(20),l=n(124),f=Object.getOwnPropertyDescriptor;e.f=r?f:function(t,e){if(t=c(t),e=s(e),l)try{return f(t,e)}catch(t){}if(u(t,e))return a(!o(i.f,t,e),t[e])}},function(t,e,n){var r=n(0),o=n(14);t.exports=function(t,e){return arguments.length<2?(n=r[t],o(n)?n:void 0):r[t]&&r[t][e];var n}},function(t,e,n){n=n(1);t.exports=n({}.isPrototypeOf)},function(t,e,n){var r=n(17),o=n(22),i=n(61);t.exports=r?function(t,e,n){return o.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(65);t.exports=function(t){return r(t.length)}},function(t,e,n){"use strict";var O=n(84),o=n(21),r=n(1),i=n(112),a=n(2),k=n(18),C=n(14),S=n(80),x=n(65),E=n(23),c=n(39),j=n(113),s=n(53),T=n(173),A=n(114),u=n(12)("replace"),D=Math.max,P=Math.min,M=r([].concat),I=r([].push),L=r("".indexOf),N=r("".slice),n="$0"==="a".replace(/./,"$0"),l=!!/./[u]&&""===/./[u]("a","$0");i("replace",function(t,b,_){var w=l?"$":"$0";return[function(t,e){var n=c(this),r=null==t?void 0:s(t,u);return r?o(r,t,n,e):o(b,E(n),t,e)},function(t,e){var n=k(this),r=E(t);if("string"==typeof e&&-1===L(e,w)&&-1===L(e,"$<")){t=_(b,n,r,e);if(t.done)return t.value}for(var o,i=C(e),a=(i||(e=E(e)),n.global),c=(a&&(o=n.unicode,n.lastIndex=0),[]);null!==(d=A(n,r))&&(I(c,d),a);)""===E(d[0])&&(n.lastIndex=j(r,x(n.lastIndex),o));for(var s,u="",l=0,f=0;f<c.length;f++){for(var d,p=E((d=c[f])[0]),h=D(P(S(d.index),r.length),0),v=[],y=1;y<d.length;y++)I(v,void 0===(s=d[y])?s:String(s));var m=d.groups,g=i?(g=M([p],v,h,r),void 0!==m&&I(g,m),E(O(e,void 0,g))):T(p,r,h,v,m,e);l<=h&&(u+=N(r,l,h)+g,l=h+p.length)}return u+N(r,l)}]},!!a(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})||!n||l)},function(t,e,n){var n=n(1),r=n({}.toString),o=n("".slice);t.exports=function(t){return o(r(t),8,-1)}},function(t,e,n){var r,o,i,a,c,s,u,l,f=n(156),d=n(0),p=n(1),h=n(19),v=n(45),y=n(20),m=n(97),g=n(79),n=n(63),b="Object already initialized",_=d.TypeError,d=d.WeakMap;u=f||m.state?(r=m.state||(m.state=new d),o=p(r.get),i=p(r.has),a=p(r.set),c=function(t,e){if(i(r,t))throw new _(b);return e.facade=t,a(r,t,e),e},s=function(t){return o(r,t)||{}},function(t){return i(r,t)}):(n[l=g("state")]=!0,c=function(t,e){if(y(t,l))throw new _(b);return e.facade=t,v(t,l,e),e},s=function(t){return y(t,l)?t[l]:{}},function(t){return y(t,l)}),t.exports={set:c,get:s,has:u,enforce:function(t){return u(t)?s(t):c(t,{})},getterFor:function(e){return function(t){if(h(t)&&(t=s(t)).type===e)return t;throw _("Incompatible receiver, "+e+" required")}}}},function(t,e,n){function r(){}function o(t){t.write(v("")),t.close();var e=t.parentWindow.Object;return t=null,e}var i,a=n(18),c=n(132),s=n(102),u=n(63),l=n(160),f=n(99),n=n(79),d="prototype",p="script",h=n("IE_PROTO"),v=function(t){return"<"+p+">"+t+"</"+p+">"},y=function(){try{i=new ActiveXObject("htmlfile")}catch(t){}y="undefined"==typeof document||document.domain&&i?o(i):(t=f("iframe"),e="java"+p+":",t.style.display="none",l.appendChild(t),t.src=String(e),(e=t.contentWindow.document).open(),e.write(v("document.F=Object")),e.close(),e.F);for(var t,e,n=s.length;n--;)delete y[d][s[n]];return y()};u[h]=!0,t.exports=Object.create||function(t,e){var n;return null!==t?(r[d]=a(t),n=new r,r[d]=null,n[h]=t):n=y(),void 0===e?n:c.f(n,e)}},function(t,e,n){"use strict";var r=n(3),o=n(1),i=n(142),a=n(39),c=n(23),n=n(143),s=o("".indexOf);r({target:"String",proto:!0,forced:!n("includes")},{includes:function(t){return!!~s(c(a(this)),c(i(t)),1<arguments.length?arguments[1]:void 0)}})},function(N,R,t){var e=t(17),n=t(0),r=t(1),o=t(81),u=t(117),l=t(45),i=t(22).f,a=t(55).f,f=t(44),d=t(115),p=t(23),c=t(110),s=t(111),h=t(37),v=t(2),y=t(20),m=t(49).enforce,g=t(144),b=t(12),_=t(140),w=t(141),O=b("match"),k=n.RegExp,C=k.prototype,S=n.SyntaxError,x=r(c),B=r(C.exec),E=r("".charAt),j=r("".replace),T=r("".indexOf),H=r("".slice),F=/^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,A=/a/g,D=/a/g,t=new k(A)!==A,P=s.MISSED_STICKY,V=s.UNSUPPORTED_Y,b=e&&(!t||P||_||w||v(function(){return D[O]=!1,k(A)!=A||k(D)==D||"/a/i"!=k(A,"i")})),Y=function(t){for(var e,n=t.length,r=0,o="",i=!1;r<=n;r++)"\\"===(e=E(t,r))?o+=e+E(t,++r):i||"."!==e?("["===e?i=!0:"]"===e&&(i=!1),o+=e):o+="[\\s\\S]";return o},W=function(t){for(var e,n=t.length,r=0,o="",i=[],a={},c=!1,s=!1,u=0,l="";r<=n;r++){if("\\"===(e=E(t,r)))e+=E(t,++r);else if("]"===e)c=!1;else if(!c)switch(!0){case"["===e:c=!0;break;case"("===e:B(F,H(t,r+1))&&(r+=2,s=!0),o+=e,u++;continue;case">"===e&&s:if(""===l||y(a,l))throw new S("Invalid capture group name");a[l]=!0,s=!(i[i.length]=[l,u]),l="";continue}s?l+=e:o+=e}return[o,i]};if(o("RegExp",b)){for(var M=function(t,e){var n,r,o=f(C,this),i=d(t),a=void 0===e,c=[],s=t;if(!o&&i&&a&&t.constructor===M)return t;if((i||f(C,t))&&(t=t.source,a&&(e="flags"in s?s.flags:x(s))),t=void 0===t?"":p(t),e=void 0===e?"":p(e),s=t,i=e=_&&"dotAll"in A&&(n=!!e&&-1<T(e,"s"))?j(e,/s/g,""):e,P&&"sticky"in A&&(r=!!e&&-1<T(e,"y"))&&V&&(e=j(e,/y/g,"")),w&&(t=(a=W(t))[0],c=a[1]),a=u(k(t,e),o?this:C,M),(n||r||c.length)&&(e=m(a),n&&(e.dotAll=!0,e.raw=M(Y(t),i)),r&&(e.sticky=!0),c.length&&(e.groups=c)),t!==s)try{l(a,"source",""===s?"(?:)":s)}catch(t){}return a},I=a(k),L=0;I.length>L;)!function(e){e in M||i(M,e,{configurable:!0,get:function(){return k[e]},set:function(t){k[e]=t}})}(I[L++]);(C.constructor=M).prototype=C,h(n,"RegExp",M)}g("RegExp")},function(t,e,n){var r=n(62);t.exports=function(t,e){t=t[e];return null==t?void 0:r(t)}},function(t,e){t.exports=!1},function(t,e,n){var r=n(128),o=n(102).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},function(t,e,n){function r(d){var p=1==d,h=2==d,v=3==d,y=4==d,m=6==d,g=7==d,b=5==d||m;return function(t,e,n,r){for(var o,i,a=O(t),c=w(a),s=_(e,n),u=k(c),l=0,e=r||C,f=p?e(t,u):h||g?e(t,0):void 0;l<u;l++)if((b||l in c)&&(i=s(o=c[l],l,a),d))if(p)f[l]=i;else if(i)switch(d){case 3:return!0;case 5:return o;case 6:return l;case 2:S(f,o)}else switch(d){case 4:return!1;case 7:S(f,o)}return m?-1:v||y?y:f}}var _=n(88),o=n(1),w=n(71),O=n(36),k=n(46),C=n(135),S=o([].push);t.exports={forEach:r(0),map:r(1),filter:r(2),some:r(3),every:r(4),find:r(5),findIndex:r(6),filterReject:r(7)}},function(t,e,n){"use strict";var r=n(3),o=n(1),i=n(42).f,a=n(65),c=n(23),s=n(142),u=n(39),l=n(143),n=n(54),f=o("".startsWith),d=o("".slice),p=Math.min,o=l("startsWith");r({target:"String",proto:!0,forced:!!(n||o||(!(l=i(String.prototype,"startsWith"))||l.writable))&&!o},{startsWith:function(t){var e=c(u(this)),n=(s(t),a(p(1<arguments.length?arguments[1]:void 0,e.length))),t=c(t);return f?f(e,t,n):d(e,n,n+t.length)===t}})},function(t,e,n){"use strict";var r=n(3),o=n(56).map;r({target:"Array",proto:!0,forced:!n(94)("map")},{map:function(t){return o(this,t,1<arguments.length?arguments[1]:void 0)}})},function(t,e,n){var r=n(3),i=n(21),a=n(19),c=n(18),s=n(179),u=n(42),l=n(82);r({target:"Reflect",stat:!0},{get:function t(e,n){var r,o=arguments.length<3?e:arguments[2];return c(e)===o?e[n]:(r=u.f(e,n))?s(r)?r.value:void 0===r.get?void 0:i(r.get,o):a(r=l(e))?t(r,n,o):void 0}})},function(t,e,n){n=n(2);t.exports=!n(function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")})},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var r=n(0),o=n(14),i=n(76),a=r.TypeError;t.exports=function(t){if(o(t))return t;throw a(i(t)+" is not a function")}},function(t,e){t.exports={}},function(t,e,n){var r=n(17),n=n(20),o=Function.prototype,i=r&&Object.getOwnPropertyDescriptor,n=n(o,"name"),a=n&&"something"===function(){}.name,r=n&&(!r||i(o,"name").configurable);t.exports={EXISTS:n,PROPER:a,CONFIGURABLE:r}},function(t,e,n){var r=n(80),o=Math.min;t.exports=function(t){return 0<t?o(r(t),9007199254740991):0}},function(t,e,n){var r=n(128),o=n(102);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e,n){"use strict";var r=n(72),o=n(22),i=n(61);t.exports=function(t,e,n){e=r(e);e in t?o.f(t,e,i(0,n)):t[e]=n}},function(t,e){t.exports={}},function(t,e,n){"use strict";var o=n(21),r=n(112),u=n(18),l=n(65),f=n(23),i=n(39),a=n(53),d=n(113),p=n(114);r("match",function(r,c,s){return[function(t){var e=i(this),n=null==t?void 0:a(t,r);return n?o(n,t,e):new RegExp(t)[r](f(e))},function(t){var e=u(this),n=f(t),t=s(c,e,n);if(t.done)return t.value;if(!e.global)return p(e,n);for(var r=e.unicode,o=[],i=e.lastIndex=0;null!==(a=p(e,n));){var a=f(a[0]);""===(o[i]=a)&&(e.lastIndex=d(n,l(e.lastIndex),r)),i++}return 0===i?null:o}]})},function(t,e,n){"use strict";var r={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,i=o&&!r.call({1:2},1);e.f=i?function(t){t=o(this,t);return!!t&&t.enumerable}:r},function(t,e,n){var r=n(0),o=n(1),i=n(2),a=n(48),c=r.Object,s=o("".split);t.exports=i(function(){return!c("z").propertyIsEnumerable(0)})?function(t){return"String"==a(t)?s(t,""):c(t)}:c},function(t,e,n){var r=n(122),o=n(73);t.exports=function(t){t=r(t,"string");return o(t)?t:t+""}},function(t,e,n){var r=n(0),o=n(43),i=n(14),a=n(44),n=n(123),c=r.Object;t.exports=n?function(t){return"symbol"==typeof t}:function(t){var e=o("Symbol");return i(e)&&a(e.prototype,c(t))}},function(t,e,n){var r,o,i=n(0),n=n(75),a=i.process,i=i.Deno,a=a&&a.versions||i&&i.version,i=a&&a.v8;!(o=i?0<(r=i.split("."))[0]&&r[0]<4?1:+(r[0]+r[1]):o)&&n&&(!(r=n.match(/Edge\/(\d+)/))||74<=r[1])&&(r=n.match(/Chrome\/(\d+)/))&&(o=+r[1]),t.exports=o},function(t,e,n){n=n(43);t.exports=n("navigator","userAgent")||""},function(t,e,n){var r=n(0).String;t.exports=function(t){try{return r(t)}catch(t){return"Object"}}},function(t,e,n){var r=n(54),o=n(97);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.21.1",mode:r?"pure":"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",source:"https://github.com/zloirock/core-js"})},function(t,e,n){var n=n(1),r=0,o=Math.random(),i=n(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+i(++r+o,36)}},function(t,e,n){var r=n(77),o=n(78),i=r("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){t=+t;return t!=t||0==t?0:(0<t?r:n)(t)}},function(t,e,n){function r(t,e){return(t=s[c(t)])==l||t!=u&&(i(e)?o(e):!!e)}var o=n(2),i=n(14),a=/#|\.prototype\./,c=r.normalize=function(t){return String(t).replace(a,".").toLowerCase()},s=r.data={},u=r.NATIVE="N",l=r.POLYFILL="P";t.exports=r},function(t,e,n){var r=n(0),o=n(20),i=n(14),a=n(36),c=n(79),n=n(130),s=c("IE_PROTO"),u=r.Object,l=u.prototype;t.exports=n?u.getPrototypeOf:function(t){t=a(t);if(o(t,s))return t[s];var e=t.constructor;return i(e)&&t instanceof e?e.prototype:t instanceof u?l:null}},function(t,e,n){var r=n(0),o=n(105),i=n(14),a=n(48),c=n(12)("toStringTag"),s=r.Object,u="Arguments"==a(function(){return arguments}());t.exports=o?a:function(t){var e;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=function(t,e){try{return t[e]}catch(t){}}(t=s(t),c))?e:u?a(t):"Object"==(e=a(t))&&i(t.callee)?"Arguments":e}},function(t,e,n){var n=n(60),r=Function.prototype,o=r.apply,i=r.call;t.exports="object"==typeof Reflect&&Reflect.apply||(n?i.bind(o):function(){return i.apply(o,arguments)})},function(t,e,n){function r(){}function o(t){if(!s(t))return!1;try{return p(r,d,t),!0}catch(t){return!1}}function i(t){if(!s(t))return!1;switch(u(t)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return y||!!v(h,f(t))}catch(t){return!0}}var a=n(1),c=n(2),s=n(14),u=n(83),l=n(43),f=n(100),d=[],p=l("Reflect","construct"),h=/^\s*(?:class|function)\b/,v=a(h.exec),y=!h.exec(r);i.sham=!0,t.exports=!p||c(function(){var t;return o(o.call)||!o(Object)||!o(function(){t=!0})||t})?i:o},function(t,e,n){var r=n(48);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,e,n){var r=n(22).f,o=n(20),i=n(12)("toStringTag");t.exports=function(t,e,n){(t=t&&!n?t.prototype:t)&&!o(t,i)&&r(t,i,{configurable:!0,value:e})}},function(t,e,n){var r=n(1),o=n(62),i=n(60),a=r(r.bind);t.exports=function(t,e){return o(t),void 0===e?t:i?a(t,e):function(){return t.apply(e,arguments)}}},function(t,e,n){var r=n(12),o=n(50),n=n(22),i=r("unscopables"),a=Array.prototype;null==a[i]&&n.f(a,i,{configurable:!0,value:o(null)}),t.exports=function(t){a[i][t]=!0}},function(t,e,n){"use strict";var h=n(21),r=n(1),v=n(23),y=n(110),o=n(111),i=n(77),m=n(50),g=n(49).get,a=n(140),n=n(141),b=i("native-string-replace",String.prototype.replace),_=RegExp.prototype.exec,w=_,O=r("".charAt),k=r("".indexOf),C=r("".replace),S=r("".slice),x=(i=/b*/g,h(_,r=/a/,"a"),h(_,i,"a"),0!==r.lastIndex||0!==i.lastIndex),E=o.BROKEN_CARET,j=void 0!==/()??/.exec("")[1];(x||j||E||a||n)&&(w=function(t){var e,n,r,o,i,a,c=this,s=g(c),t=v(t),u=s.raw;if(u)return u.lastIndex=c.lastIndex,f=h(w,u,t),c.lastIndex=u.lastIndex,f;var l=s.groups,u=E&&c.sticky,f=h(y,c),s=c.source,d=0,p=t;if(u&&(f=C(f,"y",""),-1===k(f,"g")&&(f+="g"),p=S(t,c.lastIndex),0<c.lastIndex&&(!c.multiline||c.multiline&&"\n"!==O(t,c.lastIndex-1))&&(s="(?: "+s+")",p=" "+p,d++),e=new RegExp("^(?:"+s+")",f)),j&&(e=new RegExp("^"+s+"$(?!\\s)",f)),x&&(n=c.lastIndex),r=h(_,u?e:c,p),u?r?(r.input=S(r.input,d),r[0]=S(r[0],d),r.index=c.lastIndex,c.lastIndex+=r[0].length):c.lastIndex=0:x&&r&&(c.lastIndex=c.global?r.index+r[0].length:n),j&&r&&1<r.length&&h(b,r[0],e,function(){for(o=1;o<arguments.length-2;o++)void 0===arguments[o]&&(r[o]=void 0)}),r&&l)for(r.groups=i=m(null),o=0;o<l.length;o++)i[(a=l[o])[0]]=r[a[1]];return r}),t.exports=w},function(t,e,n){"use strict";var r=n(3),o=n(92).trim;r({target:"String",proto:!0,forced:n(165)("trim")},{trim:function(){return o(this)}})},function(t,e,n){function r(e){return function(t){t=a(i(t));return 1&e&&(t=c(t,s,"")),t=2&e?c(t,u,""):t}}var o=n(1),i=n(39),a=n(23),n=n(93),c=o("".replace),o="["+n+"]",s=RegExp("^"+o+o+"*"),u=RegExp(o+o+"*$");t.exports={start:r(1),end:r(2),trim:r(3)}},function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},function(t,e,n){var r=n(2),o=n(12),i=n(74),a=o("species");t.exports=function(e){return 51<=i||!r(function(){var t=[];return(t.constructor={})[a]=function(){return{foo:1}},1!==t[e](Boolean).foo})}},function(t,e,n){"use strict";var r=n(3),o=n(1),i=n(71),a=n(30),n=n(118),c=o([].join),o=i!=Object,i=n("join",",");r({target:"Array",proto:!0,forced:o||!i},{join:function(t){return c(a(this),void 0===t?",":t)}})},function(t,e,n){var r=n(74),n=n(2);t.exports=!!Object.getOwnPropertySymbols&&!n(function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41})},function(t,e,n){var r=n(0),n=n(98),o="__core-js_shared__",r=r[o]||n(o,{});t.exports=r},function(t,e,n){var r=n(0),o=Object.defineProperty;t.exports=function(e,n){try{o(r,e,{value:n,configurable:!0,writable:!0})}catch(t){r[e]=n}return n}},function(t,e,n){var r=n(0),n=n(19),o=r.document,i=n(o)&&n(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e,n){var r=n(1),o=n(14),n=n(97),i=r(Function.toString);o(n.inspectSource)||(n.inspectSource=function(t){return i(t)}),t.exports=n.inspectSource},function(t,e,n){var r=n(80),o=Math.max,i=Math.min;t.exports=function(t,e){t=r(t);return t<0?o(t+e,0):i(t,e)}},function(t,e){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){var o=n(1),i=n(18),a=n(157);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var n,r=!1,t={};try{(n=o(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(t,[]),r=t instanceof Array}catch(t){}return function(t,e){return i(t),a(e),r?n(t,e):t.__proto__=e,t}}():void 0)},function(t,e,n){var r={};r[n(12)("toStringTag")]="z",t.exports="[object z]"===String(r)},function(t,e,n){n=n(1);t.exports=n([].slice)},function(t,e,n){var r=n(48),o=n(30),i=n(55).f,a=n(108),c="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){if(!c||"Window"!=r(t))return i(o(t));try{return i(t)}catch(t){return a(c)}}},function(t,e,n){var r=n(0),s=n(101),u=n(46),l=n(67),f=r.Array,d=Math.max;t.exports=function(t,e,n){for(var r=u(t),o=s(e,r),i=s(void 0===n?r:n,r),a=f(d(i-o,0)),c=0;o<i;o++,c++)l(a,c,t[o]);return a.length=c,a}},function(t,e,n){"use strict";function v(){return this}var y=n(3),m=n(21),g=n(54),r=n(64),b=n(14),_=n(163),w=n(82),O=n(104),k=n(87),C=n(45),S=n(37),o=n(12),x=n(68),n=n(136),E=r.PROPER,j=r.CONFIGURABLE,T=n.IteratorPrototype,A=n.BUGGY_SAFARI_ITERATORS,D=o("iterator"),P="values",M="entries";t.exports=function(t,e,n,r,o,i,a){_(n,e,r);function c(t){if(t===o&&p)return p;if(!A&&t in f)return f[t];switch(t){case"keys":case P:case M:return function(){return new n(this,t)}}return function(){return new n(this)}}var s,u,r=e+" Iterator",l=!1,f=t.prototype,d=f[D]||f["@@iterator"]||o&&f[o],p=!A&&d||c(o),h="Array"==e&&f.entries||d;if(h&&(h=w(h.call(new t)))!==Object.prototype&&h.next&&(g||w(h)===T||(O?O(h,T):b(h[D])||S(h,D,v)),k(h,r,!0,!0),g&&(x[r]=v)),E&&o==P&&d&&d.name!==P&&(!g&&j?C(f,"name",P):(l=!0,p=function(){return m(d,this)})),o)if(s={values:c(P),keys:i?p:c("keys"),entries:c(M)},a)for(u in s)!A&&!l&&u in f||S(f,u,s[u]);else y({target:e,proto:!0,forced:A||l},s);return g&&!a||f[D]===p||S(f,D,p,{name:o}),x[e]=p,s}},function(t,e,n){"use strict";var r=n(18);t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},function(t,e,n){var r=n(2),o=n(0).RegExp,n=r(function(){var t=o("a","y");return t.lastIndex=2,null!=t.exec("abcd")}),i=n||r(function(){return!o("a","y").sticky}),r=n||r(function(){var t=o("^r","gy");return t.lastIndex=2,null!=t.exec("str")});t.exports={BROKEN_CARET:r,MISSED_STICKY:i,UNSUPPORTED_Y:n}},function(t,e,n){"use strict";n(16);var s=n(1),u=n(37),l=n(90),f=n(2),d=n(12),p=n(45),h=d("species"),v=RegExp.prototype;t.exports=function(n,t,e,r){var a,o=d(n),c=!f(function(){var t={};return t[o]=function(){return 7},7!=""[n](t)}),i=c&&!f(function(){var t=!1,e=/a/;return"split"===n&&((e={constructor:{}}).constructor[h]=function(){return e},e.flags="",e[o]=/./[o]),e.exec=function(){return t=!0,null},e[o](""),!t});c&&i&&!e||(a=s(/./[o]),i=t(o,""[n],function(t,e,n,r,o){var t=s(t),i=e.exec;return i===l||i===v.exec?c&&!o?{done:!0,value:a(e,n,r)}:{done:!0,value:t(n,e,r)}:{done:!1}}),u(String.prototype,n,i[0]),u(v,o,i[1])),r&&p(v[o],"sham",!0)}},function(t,e,n){"use strict";var r=n(137).charAt;t.exports=function(t,e,n){return e+(n?r(t,e).length:1)}},function(t,e,n){var r=n(0),o=n(21),i=n(18),a=n(14),c=n(48),s=n(90),u=r.TypeError;t.exports=function(t,e){var n=t.exec;if(a(n))return null!==(n=o(n,t,e))&&i(n),n;if("RegExp"===c(t))return o(s,t,e);throw u("RegExp#exec called on incompatible receiver")}},function(t,e,n){var r=n(19),o=n(48),i=n(12)("match");t.exports=function(t){var e;return r(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==o(t))}},function(t,e,n){var r=n(3),n=n(166);r({target:"Number",stat:!0,forced:Number.parseFloat!=n},{parseFloat:n})},function(t,e,n){var r=n(14),o=n(19),i=n(104);t.exports=function(t,e,n){return i&&r(e=e.constructor)&&e!==n&&o(e=e.prototype)&&e!==n.prototype&&i(t,e),t}},function(t,e,n){"use strict";var r=n(2);t.exports=function(t,e){var n=[][t];return!!n&&r(function(){n.call(null,e||function(){return 1},1)})}},function(t,e,n){"use strict";n(145)("Set",function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},n(153))},function(t,e,n){var r=n(83),o=n(53),i=n(68),a=n(12)("iterator");t.exports=function(t){if(null!=t)return o(t,a)||o(t,"@@iterator")||i[r(t)]}},function(t,e,n){var r=n(3),n=n(178);r({target:"Number",stat:!0,forced:Number.parseInt!=n},{parseInt:n})},function(t,e,n){var r=n(0),o=n(21),i=n(19),a=n(73),c=n(53),s=n(155),n=n(12),u=r.TypeError,l=n("toPrimitive");t.exports=function(t,e){if(!i(t)||a(t))return t;var n=c(t,l);if(n){if(n=o(n,t,e=void 0===e?"default":e),!i(n)||a(n))return n;throw u("Can't convert object to primitive value")}return s(t,e=void 0===e?"number":e)}},function(t,e,n){n=n(96);t.exports=n&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},function(t,e,n){var r=n(17),o=n(2),i=n(99);t.exports=!r&&!o(function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(17),n=n(2);t.exports=r&&n(function(){return 42!=Object.defineProperty(function(){},"prototype",{value:42,writable:!1}).prototype})},function(t,e,n){var s=n(20),u=n(127),l=n(42),f=n(22);t.exports=function(t,e,n){for(var r=u(e),o=f.f,i=l.f,a=0;a<r.length;a++){var c=r[a];s(t,c)||n&&s(n,c)||o(t,c,i(e,c))}}},function(t,e,n){var r=n(43),o=n(1),i=n(55),a=n(103),c=n(18),s=o([].concat);t.exports=r("Reflect","ownKeys")||function(t){var e=i.f(c(t)),n=a.f;return n?s(e,n(t)):e}},function(t,e,n){var r=n(1),a=n(20),c=n(30),s=n(129).indexOf,u=n(63),l=r([].push);t.exports=function(t,e){var n,r=c(t),o=0,i=[];for(n in r)!a(u,n)&&a(r,n)&&l(i,n);for(;e.length>o;)!a(r,n=e[o++])||~s(i,n)||l(i,n);return i}},function(t,e,n){function r(c){return function(t,e,n){var r,o=s(t),i=l(o),a=u(n,i);if(c&&e!=e){for(;a<i;)if((r=o[a++])!=r)return!0}else for(;a<i;a++)if((c||a in o)&&o[a]===e)return c||a||0;return!c&&-1}}var s=n(30),u=n(101),l=n(46);t.exports={includes:r(!0),indexOf:r(!1)}},function(t,e,n){n=n(2);t.exports=!n(function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype})},function(t,e,n){var r=n(0),o=n(85),i=n(76),a=r.TypeError;t.exports=function(t){if(o(t))return t;throw a(i(t)+" is not a constructor")}},function(t,e,n){var r=n(17),o=n(125),c=n(22),s=n(18),u=n(30),l=n(66);e.f=r&&!o?Object.defineProperties:function(t,e){s(t);for(var n,r=u(e),o=l(e),i=o.length,a=0;a<i;)c.f(t,n=o[a++],r[n]);return t}},function(t,e,n){n=n(12);e.f=n},function(t,e,n){var r=n(161),o=n(20),i=n(133),a=n(22).f;t.exports=function(t){var e=r.Symbol||(r.Symbol={});o(e,t)||a(e,t,{value:i.f(t)})}},function(t,e,n){var r=n(162);t.exports=function(t,e){return new(r(t))(0===e?0:e)}},function(t,e,n){"use strict";var r,o,i=n(2),a=n(14),c=n(50),s=n(82),u=n(37),l=n(12),n=n(54),f=l("iterator"),l=!1;[].keys&&("next"in(o=[].keys())?(s=s(s(o)))!==Object.prototype&&(r=s):l=!0),null==r||i(function(){var t={};return r[f].call(t)!==t})?r={}:n&&(r=c(r)),a(r[f])||u(r,f,function(){return this}),t.exports={IteratorPrototype:r,BUGGY_SAFARI_ITERATORS:l}},function(t,e,n){function r(o){return function(t,e){var n,t=a(c(t)),e=i(e),r=t.length;return e<0||r<=e?o?"":void 0:(n=u(t,e))<55296||56319<n||e+1===r||(r=u(t,e+1))<56320||57343<r?o?s(t,e):n:o?l(t,e,e+2):r-56320+(n-55296<<10)+65536}}var o=n(1),i=n(80),a=n(23),c=n(39),s=o("".charAt),u=o("".charCodeAt),l=o("".slice);t.exports={codeAt:r(!1),charAt:r(!0)}},function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},function(t,e,n){n=n(99)("span").classList,n=n&&n.constructor&&n.constructor.prototype;t.exports=n===Object.prototype?void 0:n},function(t,e,n){var r=n(2),o=n(0).RegExp;t.exports=r(function(){var t=o(".","s");return!(t.dotAll&&t.exec("\n")&&"s"===t.flags)})},function(t,e,n){var r=n(2),o=n(0).RegExp;t.exports=r(function(){var t=o("(?<a>b)","g");return"b"!==t.exec("b").groups.a||"bc"!=="b".replace(t,"$<a>c")})},function(t,e,n){var r=n(0),o=n(115),i=r.TypeError;t.exports=function(t){if(o(t))throw i("The method doesn't accept regular expressions");return t}},function(t,e,n){var r=n(12)("match");t.exports=function(e){var n=/./;try{"/./"[e](n)}catch(t){try{return n[r]=!1,"/./"[e](n)}catch(t){}}return!1}},function(t,e,n){"use strict";var r=n(43),o=n(22),i=n(12),a=n(17),c=i("species");t.exports=function(t){var t=r(t),e=o.f;a&&t&&!t[c]&&e(t,c,{configurable:!0,get:function(){return this}})}},function(t,e,n){"use strict";var y=n(3),m=n(0),g=n(1),b=n(81),_=n(37),w=n(146),O=n(147),k=n(151),C=n(14),S=n(19),x=n(2),E=n(152),j=n(87),T=n(117);t.exports=function(t,e,n){function r(t){var n=g(p[t]);_(p,t,"add"==t?function(t){return n(this,0===t?0:t),this}:"delete"==t?function(t){return!(l&&!S(t))&&n(this,0===t?0:t)}:"get"==t?function(t){return l&&!S(t)?void 0:n(this,0===t?0:t)}:"has"==t?function(t){return!(l&&!S(t))&&n(this,0===t?0:t)}:function(t,e){return n(this,0===t?0:t,e),this})}var o,i,a,c,s,u=-1!==t.indexOf("Map"),l=-1!==t.indexOf("Weak"),f=u?"set":"add",d=m[t],p=d&&d.prototype,h=d,v={};return b(t,!C(d)||!(l||p.forEach&&!x(function(){(new d).entries().next()})))?(h=n.getConstructor(e,t,u,f),w.enable()):b(t,!0)&&(i=(o=new h)[f](l?{}:-0,1)!=o,a=x(function(){o.has(1)}),c=E(function(t){new d(t)}),s=!l&&x(function(){for(var t=new d,e=5;e--;)t[f](e,e);return!t.has(-0)}),c||(((h=e(function(t,e){k(t,p);t=T(new d,t,h);return null!=e&&O(e,t[f],{that:t,AS_ENTRIES:u}),t})).prototype=p).constructor=h),(a||s)&&(r("delete"),r("has"),u&&r("get")),(s||i)&&r(f),l&&p.clear&&delete p.clear),v[t]=h,y({global:!0,forced:h!=d},v),j(h,t),l||n.setStrong(h,t,u),h}},function(t,e,n){function r(t){u(t,y,{value:{objectID:"O"+m++,weakData:{}}})}var a=n(3),c=n(1),o=n(63),i=n(19),s=n(20),u=n(22).f,l=n(55),f=n(107),d=n(169),p=n(78),h=n(171),v=!1,y=p("meta"),m=0,g=t.exports={enable:function(){g.enable=function(){},v=!0;var o=l.f,i=c([].splice),t={};t[y]=1,o(t).length&&(l.f=function(t){for(var e=o(t),n=0,r=e.length;n<r;n++)if(e[n]===y){i(e,n,1);break}return e},a({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:f.f}))},fastKey:function(t,e){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!s(t,y)){if(!d(t))return"F";if(!e)return"E";r(t)}return t[y].objectID},getWeakData:function(t,e){if(!s(t,y)){if(!d(t))return!0;if(!e)return!1;r(t)}return t[y].weakData},onFreeze:function(t){return h&&v&&d(t)&&!s(t,y)&&r(t),t}};o[y]=!0},function(t,e,n){function y(t,e){this.stopped=t,this.result=e}var r=n(0),m=n(88),g=n(21),b=n(18),_=n(76),w=n(148),O=n(46),k=n(44),C=n(149),S=n(120),x=n(150),E=r.TypeError,j=y.prototype;t.exports=function(t,e,n){function r(t){return i&&x(i,"normal",t),new y(!0,t)}function o(t){return d?(b(t),h?v(t[0],t[1],r):v(t[0],t[1])):h?v(t,r):v(t)}var i,a,c,s,u,l,f=n&&n.that,d=!(!n||!n.AS_ENTRIES),p=!(!n||!n.IS_ITERATOR),h=!(!n||!n.INTERRUPTED),v=m(e,f);if(p)i=t;else{if(!(n=S(t)))throw E(_(t)+" is not iterable");if(w(n)){for(a=0,c=O(t);a<c;a++)if((s=o(t[a]))&&k(j,s))return s;return new y(!1)}i=C(t,n)}for(u=i.next;!(l=g(u,i)).done;){try{s=o(l.value)}catch(t){x(i,"throw",t)}if("object"==typeof s&&s&&k(j,s))return s}return new y(!1)}},function(t,e,n){var r=n(12),o=n(68),i=r("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||a[i]===t)}},function(t,e,n){var r=n(0),o=n(21),i=n(62),a=n(18),c=n(76),s=n(120),u=r.TypeError;t.exports=function(t,e){var n=arguments.length<2?s(t):e;if(i(n))return a(o(n,t));throw u(c(t)+" is not iterable")}},function(t,e,n){var i=n(21),a=n(18),c=n(53);t.exports=function(t,e,n){var r,o;a(t);try{if(!(r=c(t,"return"))){if("throw"===e)throw n;return n}r=i(r,t)}catch(t){o=!0,r=t}if("throw"===e)throw n;if(o)throw r;return a(r),n}},function(t,e,n){var r=n(0),o=n(44),i=r.TypeError;t.exports=function(t,e){if(o(e,t))return t;throw i("Incorrect invocation")}},function(t,e,n){var o=n(12)("iterator"),i=!1;try{var r=0,a={next:function(){return{done:!!r++}},return:function(){i=!0}};a[o]=function(){return this},Array.from(a,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!i)return!1;var n=!1;try{var r={};r[o]=function(){return{next:function(){return{done:n=!0}}}},t(r)}catch(t){}return n}},function(t,e,n){"use strict";var u=n(22).f,l=n(50),f=n(172),d=n(88),p=n(151),h=n(147),a=n(109),c=n(144),v=n(17),y=n(146).fastKey,n=n(49),m=n.set,g=n.getterFor;t.exports={getConstructor:function(t,n,r,o){function i(t,e,n){var r,o=s(t),i=a(t,e);return i?i.value=n:(o.last=i={index:r=y(e,!0),key:e,value:n,previous:e=o.last,next:void 0,removed:!1},o.first||(o.first=i),e&&(e.next=i),v?o.size++:t.size++,"F"!==r&&(o.index[r]=i)),t}function a(t,e){var n,t=s(t),r=y(e);if("F"!==r)return t.index[r];for(n=t.first;n;n=n.next)if(n.key==e)return n}var t=t(function(t,e){p(t,c),m(t,{type:n,index:l(null),first:void 0,last:void 0,size:0}),v||(t.size=0),null!=e&&h(e,t[o],{that:t,AS_ENTRIES:r})}),c=t.prototype,s=g(n);return f(c,{clear:function(){for(var t=s(this),e=t.index,n=t.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete e[n.index],n=n.next;t.first=t.last=void 0,v?t.size=0:this.size=0},delete:function(t){var e,n,r=s(this),t=a(this,t);return t&&(e=t.next,n=t.previous,delete r.index[t.index],t.removed=!0,n&&(n.next=e),e&&(e.previous=n),r.first==t&&(r.first=e),r.last==t&&(r.last=n),v?r.size--:this.size--),!!t},forEach:function(t){for(var e,n=s(this),r=d(t,1<arguments.length?arguments[1]:void 0);e=e?e.next:n.first;)for(r(e.value,e.key,this);e&&e.removed;)e=e.previous},has:function(t){return!!a(this,t)}}),f(c,r?{get:function(t){t=a(this,t);return t&&t.value},set:function(t,e){return i(this,0===t?0:t,e)}}:{add:function(t){return i(this,t=0===t?0:t,t)}}),v&&u(c,"size",{get:function(){return s(this).size}}),t},setStrong:function(t,e,n){var r=e+" Iterator",o=g(e),i=g(r);a(t,e,function(t,e){m(this,{type:r,target:t,state:o(t),kind:e,last:void 0})},function(){for(var t=i(this),e=t.kind,n=t.last;n&&n.removed;)n=n.previous;return t.target&&(t.last=n=n?n.next:t.state.first)?"keys"==e?{value:n.key,done:!1}:"values"==e?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:{value:t.target=void 0,done:!0}},n?"entries":"values",!n,!0),c(e)}}},function(t,e){var n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){var r=n(0),o=n(21),i=n(14),a=n(19),c=r.TypeError;t.exports=function(t,e){var n,r;if("string"===e&&i(n=t.toString)&&!a(r=o(n,t)))return r;if(i(n=t.valueOf)&&!a(r=o(n,t)))return r;if("string"!==e&&i(n=t.toString)&&!a(r=o(n,t)))return r;throw c("Can't convert object to primitive value")}},function(t,e,n){var r=n(0),o=n(14),n=n(100),r=r.WeakMap;t.exports=o(r)&&/native code/.test(n(r))},function(t,e,n){var r=n(0),o=n(14),i=r.String,a=r.TypeError;t.exports=function(t){if("object"==typeof t||o(t))return t;throw a("Can't set "+i(t)+" as a prototype")}},function(t,e,n){"use strict";var r=n(105),o=n(83);t.exports=r?{}.toString:function(){return"[object "+o(this)+"]"}},function(t,e,n){"use strict";var r=n(0),o=n(1),i=n(62),l=n(19),f=n(20),d=n(106),n=n(60),p=r.Function,h=o([].concat),v=o([].join),y={};t.exports=n?p.bind:function(a){var c=i(this),t=c.prototype,s=d(arguments,1),u=function(){var t=h(s,d(arguments));if(this instanceof u){var e=c,n=t.length,r=t;if(!f(y,n)){for(var o=[],i=0;i<n;i++)o[i]="a["+i+"]";y[n]=p("C,a","return new C("+v(o,",")+")")}return y[n](e,r)}return c.apply(a,t)};return l(t)&&(u.prototype=t),u}},function(t,e,n){n=n(43);t.exports=n("document","documentElement")},function(t,e,n){n=n(0);t.exports=n},function(t,e,n){var r=n(0),o=n(86),i=n(85),a=n(19),c=n(12)("species"),s=r.Array;t.exports=function(t){var e;return o(t)&&(e=t.constructor,(i(e)&&(e===s||o(e.prototype))||a(e)&&null===(e=e[c]))&&(e=void 0)),void 0===e?s:e}},function(t,e,n){"use strict";function o(){return this}var i=n(136).IteratorPrototype,a=n(50),c=n(61),s=n(87),u=n(68);t.exports=function(t,e,n,r){e+=" Iterator";return t.prototype=a(i,{next:c(+!r,n)}),s(t,e,!1,!0),u[e]=o,t}},function(t,e,n){var r=n(18),o=n(131),i=n(12)("species");t.exports=function(t,e){var t=r(t).constructor;return void 0===t||null==(t=r(t)[i])?e:o(t)}},function(t,e,n){var r=n(64).PROPER,o=n(2),i=n(93);t.exports=function(t){return o(function(){return!!i[t]()||"​᠎"!=="​᠎"[t]()||r&&i[t].name!==t})}},function(t,e,n){var r=n(0),o=n(2),i=n(1),a=n(23),c=n(92).trim,n=n(93),s=i("".charAt),u=r.parseFloat,i=r.Symbol,l=i&&i.iterator,r=1/u(n+"-0")!=-1/0||l&&!o(function(){u(Object(l))});t.exports=r?function(t){var t=c(a(t)),e=u(t);return 0===e&&"-"==s(t,0)?-0:e}:u},function(t,e,n){n=n(1);t.exports=n(1..valueOf)},function(t,e,n){"use strict";var r=n(56).forEach,n=n(118)("forEach");t.exports=n?[].forEach:function(t){return r(this,t,1<arguments.length?arguments[1]:void 0)}},function(t,e,n){var r=n(2),o=n(19),i=n(48),a=n(170),c=Object.isExtensible,n=r(function(){c(1)});t.exports=n||a?function(t){return!!o(t)&&((!a||"ArrayBuffer"!=i(t))&&(!c||c(t)))}:c},function(t,e,n){n=n(2);t.exports=n(function(){var t;"function"==typeof ArrayBuffer&&(t=new ArrayBuffer(8),Object.isExtensible(t)&&Object.defineProperty(t,"a",{value:8}))})},function(t,e,n){n=n(2);t.exports=!n(function(){return Object.isExtensible(Object.preventExtensions({}))})},function(t,e,n){var o=n(37);t.exports=function(t,e,n){for(var r in e)o(t,r,e[r],n);return t}},function(t,e,n){var r=n(1),o=n(36),d=Math.floor,p=r("".charAt),h=r("".replace),v=r("".slice),y=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,m=/\$([$&'`]|\d{1,2})/g;t.exports=function(i,a,c,s,u,t){var l=c+i.length,f=s.length,e=m;return void 0!==u&&(u=o(u),e=y),h(t,e,function(t,e){var n;switch(p(e,0)){case"$":return"$";case"&":return i;case"`":return v(a,0,c);case"'":return v(a,l);case"<":n=u[v(e,1,-1)];break;default:var r,o=+e;if(0==o)return t;if(f<o)return 0!==(r=d(o/10))&&r<=f?void 0===s[r-1]?p(e,1):s[r-1]+p(e,1):t;n=s[o-1]}return void 0===n?"":n})}},function(t,e,n){"use strict";var r=n(0),d=n(88),p=n(21),h=n(36),v=n(175),y=n(148),m=n(85),g=n(46),b=n(67),_=n(149),w=n(120),O=r.Array;t.exports=function(t){var e,n,r,o,i,a,c=h(t),t=m(this),s=arguments.length,u=1<s?arguments[1]:void 0,l=void 0!==u,s=(l&&(u=d(u,2<s?arguments[2]:void 0)),w(c)),f=0;if(!s||this==O&&y(s))for(e=g(c),n=t?new this(e):O(e);f<e;f++)a=l?u(c[f],f):c[f],b(n,f,a);else for(i=(o=_(c,s)).next,n=t?new this:[];!(r=p(i,o)).done;f++)a=l?v(o,u,[r.value,f],!0):r.value,b(n,f,a);return n.length=f,n}},function(t,e,n){var o=n(18),i=n(150);t.exports=function(e,t,n,r){try{return r?t(o(n)[0],n[1]):t(n)}catch(t){i(e,"throw",t)}}},function(t,e,n){var r=n(3),o=n(2),n=n(107).f;r({target:"Object",stat:!0,forced:o(function(){return!Object.getOwnPropertyNames(1)})},{getOwnPropertyNames:n})},function(t,e,n){"use strict";n(145)("Map",function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},n(153))},function(t,e,n){var r=n(0),o=n(2),i=n(1),a=n(23),c=n(92).trim,n=n(93),s=r.parseInt,r=r.Symbol,u=r&&r.iterator,l=/^[+-]?0x/i,f=i(l.exec),r=8!==s(n+"08")||22!==s(n+"0x16")||u&&!o(function(){s(Object(u))});t.exports=r?function(t,e){t=c(a(t));return s(t,e>>>0||(f(l,t)?16:10))}:s},function(t,e,n){var r=n(20);t.exports=function(t){return void 0!==t&&(r(t,"value")||r(t,"writable"))}},function(t,e,n){"use strict";var r=n(3),o=n(1),c=n(62),s=n(36),u=n(46),l=n(23),i=n(2),f=n(181),a=n(118),d=n(182),p=n(183),h=n(74),v=n(184),y=[],m=o(y.sort),g=o(y.push),n=i(function(){y.sort(void 0)}),o=i(function(){y.sort(null)}),a=a("sort"),b=!i(function(){if(h)return h<70;if(!(d&&3<d)){if(p)return!0;if(v)return v<603;for(var t,e,n,r="",o=65;o<76;o++){switch(t=String.fromCharCode(o),o){case 66:case 69:case 70:case 72:e=3;break;case 68:case 71:e=4;break;default:e=2}for(n=0;n<47;n++)y.push({k:t+n,v:e})}for(y.sort(function(t,e){return e.v-t.v}),n=0;n<y.length;n++)t=y[n].k.charAt(0),r.charAt(r.length-1)!==t&&(r+=t);return"DGBEFHACIJK"!==r}});r({target:"Array",proto:!0,forced:n||!o||!a||!b},{sort:function(t){void 0!==t&&c(t);var e=s(this);if(b)return void 0===t?m(e):m(e,t);for(var n,r,o=[],i=u(e),a=0;a<i;a++)a in e&&g(o,e[a]);for(f(o,(r=t,function(t,e){return void 0===e?-1:void 0===t?1:void 0!==r?+r(t,e)||0:l(t)>l(e)?1:-1})),n=o.length,a=0;a<n;)e[a]=o[a++];for(;a<i;)delete e[a++];return e}})},function(t,e,n){function g(t,e){var n=t.length,r=_(n/2);if(n<8){for(var o,i,a=t,c=e,s=a.length,u=1;u<s;){for(o=a[i=u];i&&0<c(a[i-1],o);)a[i]=a[--i];i!==u++&&(a[i]=o)}return a}for(var l=t,f=g(b(t,0,r),e),d=g(b(t,r),e),p=e,h=f.length,v=d.length,y=0,m=0;y<h||m<v;)l[y+m]=y<h&&m<v?p(f[y],d[m])<=0?f[y++]:d[m++]:y<h?f[y++]:d[m++];return l}var b=n(108),_=Math.floor;t.exports=g},function(t,e,n){n=n(75).match(/firefox\/(\d+)/i);t.exports=!!n&&+n[1]},function(t,e,n){n=n(75);t.exports=/MSIE|Trident/.test(n)},function(t,e,n){n=n(75).match(/AppleWebKit\/(\d+)\./);t.exports=!!n&&+n[1]},function(t,e,n){var r=n(3),n=n(186);r({target:"Object",stat:!0,forced:Object.assign!==n},{assign:n})},function(t,e,n){"use strict";var d=n(17),r=n(1),p=n(21),o=n(2),h=n(66),v=n(103),y=n(70),m=n(36),g=n(71),i=Object.assign,a=Object.defineProperty,b=r([].concat);t.exports=!i||o(function(){if(d&&1!==i({b:1},i(a({},"a",{enumerable:!0,get:function(){a(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t}),7!=i({},t)[n]||h(i({},e)).join("")!=r})?function(t,e){for(var n=m(t),r=arguments.length,o=1,i=v.f,a=y.f;o<r;)for(var c,s=g(arguments[o++]),u=i?b(h(s),i(s)):h(s),l=u.length,f=0;f<l;)c=u[f++],d&&!p(a,s,c)||(n[c]=s[c]);return n}:i},function(t,e,n){"use strict";var r=n(3),o=n(56).findIndex,n=n(89),i="findIndex",a=!0;i in[]&&Array(1)[i](function(){a=!1}),r({target:"Array",proto:!0,forced:a},{findIndex:function(t){return o(this,t,1<arguments.length?arguments[1]:void 0)}}),n(i)},function(t,e,n){n(3)({target:"Number",stat:!0},{isNaN:function(t){return t!=t}})},function(t,e,n){var r=n(3),o=n(190).values;r({target:"Object",stat:!0},{values:function(t){return o(t)}})},function(t,e,n){function r(c){return function(t){for(var e,n=l(t),r=u(n),o=r.length,i=0,a=[];i<o;)e=r[i++],s&&!f(n,e)||d(a,c?[e,n[e]]:n[e]);return a}}var s=n(17),o=n(1),u=n(66),l=n(30),f=o(n(70).f),d=o([].push);t.exports={entries:r(!0),values:r(!1)}},function(t,e,n){var n=n(3),r=Math.ceil,o=Math.floor;n({target:"Math",stat:!0},{trunc:function(t){return(0<t?o:r)(t)}})},,function(N,R,t){"use strict";t.r(R);var i={};t.r(i),t.d(i,"top",function(){return E}),t.d(i,"bottom",function(){return j}),t.d(i,"right",function(){return T}),t.d(i,"left",function(){return A}),t.d(i,"auto",function(){return Lt}),t.d(i,"basePlacements",function(){return Nt}),t.d(i,"start",function(){return Rt}),t.d(i,"end",function(){return Bt}),t.d(i,"clippingParents",function(){return Ht}),t.d(i,"viewport",function(){return Ft}),t.d(i,"popper",function(){return Vt}),t.d(i,"reference",function(){return Yt}),t.d(i,"variationPlacements",function(){return Wt}),t.d(i,"placements",function(){return zt}),t.d(i,"beforeRead",function(){return Ut}),t.d(i,"read",function(){return qt}),t.d(i,"afterRead",function(){return Kt}),t.d(i,"beforeMain",function(){return $t}),t.d(i,"main",function(){return Xt}),t.d(i,"afterMain",function(){return Gt}),t.d(i,"beforeWrite",function(){return Qt}),t.d(i,"write",function(){return Zt}),t.d(i,"afterWrite",function(){return Jt}),t.d(i,"modifierPhases",function(){return te}),t.d(i,"applyStyles",function(){return oe}),t.d(i,"arrow",function(){return Oe}),t.d(i,"computeStyles",function(){return xe}),t.d(i,"eventListeners",function(){return je}),t.d(i,"flip",function(){return Ye}),t.d(i,"hide",function(){return Ue}),t.d(i,"offset",function(){return qe}),t.d(i,"popperOffsets",function(){return Ke}),t.d(i,"preventOverflow",function(){return $e}),t.d(i,"popperGenerator",function(){return Je}),t.d(i,"detectOverflow",function(){return Ve}),t.d(i,"createPopperBase",function(){return tn}),t.d(i,"createPopper",function(){return en}),t.d(i,"createPopperLite",function(){return nn}),t(29),t(31),t(4),t(32),t(7),t(10),t(11),t(5),t(6),t(8),t(16),t(69),t(33),t(51),t(57),t(38),t(91),t(116),t(34),t(9),t(13),t(52),t(40),t(26);function B(t){return(B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function H(t){return(t=et(t))&&document.querySelector(t)?t:null}function F(t){return(t=et(t))?document.querySelector(t):null}function V(t){t.dispatchEvent(new Event(tt))}function Y(t){return nt(t)?t.jquery?t[0]:t:"string"==typeof t&&0<t.length?document.querySelector(t):null}function W(r,o,i){Object.keys(i).forEach(function(t){var e=i[t],n=o[t],n=n&&nt(n)?"element":null==(n=n)?"".concat(n):{}.toString.call(n).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(e).test(n))throw new TypeError("".concat(r.toUpperCase(),': Option "').concat(t,'" provided type "').concat(n,'" but expected type "').concat(e,'".'))})}function z(t){return!(!nt(t)||0===t.getClientRects().length)&&"visible"===getComputedStyle(t).getPropertyValue("visibility")}function U(t){return!t||t.nodeType!==Node.ELEMENT_NODE||(!!t.classList.contains("disabled")||(void 0!==t.disabled?t.disabled:t.hasAttribute("disabled")&&"false"!==t.getAttribute("disabled")))}function q(t){return document.documentElement.attachShadow?"function"==typeof t.getRootNode?(e=t.getRootNode())instanceof ShadowRoot?e:null:t instanceof ShadowRoot?t:t.parentNode?q(t.parentNode):null:null;var e}function K(){}function $(t){t.offsetHeight}function X(){var t=window.jQuery;return t&&!document.body.hasAttribute("data-bs-no-jquery")?t:null}function a(){return"rtl"===document.documentElement.dir}function e(r){var t;t=function(){var t,e,n=X();n&&(t=r.NAME,e=n.fn[t],n.fn[t]=r.jQueryInterface,n.fn[t].Constructor=r,n.fn[t].noConflict=function(){return n.fn[t]=e,r.jQueryInterface})},"loading"===document.readyState?(rt.length||document.addEventListener("DOMContentLoaded",function(){rt.forEach(function(t){return t()})}),rt.push(t)):t()}function G(t){"function"==typeof t&&t()}function Q(n,r){var t,o;2<arguments.length&&void 0!==arguments[2]&&!arguments[2]?G(n):(t=function(t){if(!t)return 0;var t=window.getComputedStyle(t),e=t.transitionDuration,t=t.transitionDelay,n=Number.parseFloat(e),r=Number.parseFloat(t);return n||r?(e=e.split(",")[0],t=t.split(",")[0],(Number.parseFloat(e)+Number.parseFloat(t))*J):0}(r)+5,o=!1,r.addEventListener(tt,function t(e){e.target===r&&(o=!0,r.removeEventListener(tt,t),G(n))}),setTimeout(function(){o||V(r)},t))}function Z(t,e,n,r){if(-1===(e=t.indexOf(e)))return t[!n&&r?t.length-1:0];var o=t.length;return e+=n?1:-1,r&&(e=(e+o)%o),t[Math.max(0,Math.min(e,o-1))]}var J=1e3,tt="transitionend",et=function(t){var e=t.getAttribute("data-bs-target");if(!e||"#"===e){t=t.getAttribute("href");if(!t||!t.includes("#")&&!t.startsWith("."))return null;e=(t=t.includes("#")&&!t.startsWith("#")?"#".concat(t.split("#")[1]):t)&&"#"!==t?t.trim():null}return e},nt=function(t){return!(!t||"object"!==B(t))&&void 0!==(t=void 0!==t.jquery?t[0]:t).nodeType},rt=[];t(119),t(47),t(27),t(41),t(35);function ot(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i=[],a=!0,c=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){c=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(c)throw o}}return i}}(t,e)||function(t,e){if(t){if("string"==typeof t)return it(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?it(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function it(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var at=/[^.]*(?=\..*)\.|.*/,ct=/\..*/,st=/::\d+$/,ut={},lt=1,ft={mouseenter:"mouseover",mouseleave:"mouseout"},dt=/^(mouseenter|mouseleave)/i,pt=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function ht(t,e){return e&&"".concat(e,"::").concat(lt++)||t.uidEvent||lt++}function vt(t){var e=ht(t);return t.uidEvent=e,ut[e]=ut[e]||{},ut[e]}function yt(t,e,n){for(var r=2<arguments.length&&void 0!==n?n:null,o=Object.keys(t),i=0,a=o.length;i<a;i++){var c=t[o[i]];if(c.originalHandler===e&&c.delegationSelector===r)return c}return null}function mt(t,e,n){var r="string"==typeof e,n=r?n:e,e=_t(t);return[r,n,e=pt.has(e)?e:t]}function gt(t,e,n,r,o){var i,a,c,s,u,l,f,d,p,h;"string"==typeof e&&t&&(n||(n=r,r=null),dt.test(e)&&(c=function(e){return function(t){if(!t.relatedTarget||t.relatedTarget!==t.delegateTarget&&!t.delegateTarget.contains(t.relatedTarget))return e.call(this,t)}},r?r=c(r):n=c(n)),i=(c=ot(mt(e,n,r),3))[0],a=c[1],c=c[2],(u=yt(s=(s=vt(t))[c]||(s[c]={}),a,i?n:null))?u.oneOff=u.oneOff&&o:(u=ht(a,e.replace(at,"")),(e=i?(d=t,p=n,h=r,function t(e){for(var n=d.querySelectorAll(p),r=e.target;r&&r!==this;r=r.parentNode)for(var o=n.length;o--;)if(n[o]===r)return e.delegateTarget=r,t.oneOff&&wt.off(d,e.type,p,h),h.apply(r,[e]);return null}):(l=t,f=n,function t(e){return e.delegateTarget=l,t.oneOff&&wt.off(l,e.type,f),f.apply(l,[e])})).delegationSelector=i?n:null,e.originalHandler=a,e.oneOff=o,s[e.uidEvent=u]=e,t.addEventListener(c,e,i)))}function bt(t,e,n,r,o){r=yt(e[n],r,o);r&&(t.removeEventListener(n,r,Boolean(o)),delete e[n][r.uidEvent])}function _t(t){return t=t.replace(ct,""),ft[t]||t}var wt={on:function(t,e,n,r){gt(t,e,n,r,!1)},one:function(t,e,n,r){gt(t,e,n,r,!0)},off:function(a,c,t,e){if("string"==typeof c&&a){var e=ot(mt(c,t,e),3),n=e[0],r=e[1],o=e[2],i=o!==c,s=vt(a),e=c.startsWith(".");if(void 0!==r)return s&&s[o]?void bt(a,s,o,r,n?t:null):void 0;e&&Object.keys(s).forEach(function(t){var e,n,r,o,i;e=a,n=s,r=t,o=c.slice(1),i=n[r]||{},Object.keys(i).forEach(function(t){t.includes(o)&&(t=i[t],bt(e,n,r,t.originalHandler,t.delegationSelector))})});var u=s[o]||{};Object.keys(u).forEach(function(t){var e=t.replace(st,"");i&&!c.includes(e)||(e=u[t],bt(a,s,o,e.originalHandler,e.delegationSelector))})}},trigger:function(t,e,n){if("string"!=typeof e||!t)return null;var r,o=X(),i=_t(e),a=e!==i,c=pt.has(i),s=!0,u=!0,l=!1,f=null;return a&&o&&(r=o.Event(e,n),o(t).trigger(r),s=!r.isPropagationStopped(),u=!r.isImmediatePropagationStopped(),l=r.isDefaultPrevented()),c?(f=document.createEvent("HTMLEvents")).initEvent(i,s,!0):f=new CustomEvent(e,{bubbles:s,cancelable:!0}),void 0!==n&&Object.keys(n).forEach(function(t){Object.defineProperty(f,t,{get:function(){return n[t]}})}),l&&f.preventDefault(),u&&t.dispatchEvent(f),f.defaultPrevented&&void 0!==r&&r.preventDefault(),f}},d=wt,Ot=(t(176),t(177),new Map),kt=function(t,e,n){Ot.has(t)||Ot.set(t,new Map);t=Ot.get(t);t.has(e)||0===t.size?t.set(e,n):console.error("Bootstrap doesn't allow more than one instance per element. Bound instance: ".concat(Array.from(t.keys())[0],"."))},Ct=function(t,e){return Ot.has(t)&&Ot.get(t).get(e)||null},St=function(t,e){var n;Ot.has(t)&&((n=Ot.get(t)).delete(e),0===n.size&&Ot.delete(t))};function xt(t){return(xt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Et(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var c=function(){function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function");(t=Y(t))&&(this._element=t,kt(this._element,this.constructor.DATA_KEY,this))}var t,n,r;return t=e,r=[{key:"getInstance",value:function(t){return Ct(Y(t),this.DATA_KEY)}},{key:"getOrCreateInstance",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return this.getInstance(t)||new this(t,"object"===xt(e)?e:null)}},{key:"VERSION",get:function(){return"5.1.3"}},{key:"NAME",get:function(){throw new Error('You have to implement the static method "NAME", for each component!')}},{key:"DATA_KEY",get:function(){return"bs.".concat(this.NAME)}},{key:"EVENT_KEY",get:function(){return".".concat(this.DATA_KEY)}}],(n=[{key:"dispose",value:function(){var e=this;St(this._element,this.constructor.DATA_KEY),d.off(this._element,this.constructor.EVENT_KEY),Object.getOwnPropertyNames(this).forEach(function(t){e[t]=null})}},{key:"_queueCallback",value:function(t,e){Q(t,e,!(2<arguments.length&&void 0!==arguments[2])||arguments[2])}}])&&Et(t.prototype,n),r&&Et(t,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function jt(t){return(jt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Tt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function At(t,e){return(At=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Dt(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Pt(n),e=(t=r?(t=Pt(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===jt(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Pt(t){return(Pt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var R=".".concat("bs.button"),Mt='[data-bs-toggle="button"]',R="click".concat(R).concat(".data-api"),It=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&At(t,e);var n,r=Dt(o);function o(){var t=this,e=o;if(t instanceof e)return r.apply(this,arguments);throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"NAME",get:function(){return"button"}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this);"toggle"===e&&t[e]()})}}],(n=[{key:"toggle",value:function(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))}}])&&Tt(t.prototype,n),e&&Tt(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),R=(d.on(document,R,Mt,function(t){t.preventDefault();t=t.target.closest(Mt);It.getOrCreateInstance(t).toggle()}),e(It),It),E=(t(28),t(58),t(121),t(15),t(59),t(24),t(25),"top"),j="bottom",T="right",A="left",Lt="auto",Nt=[E,j,T,A],Rt="start",Bt="end",Ht="clippingParents",Ft="viewport",Vt="popper",Yt="reference",Wt=Nt.reduce(function(t,e){return t.concat([e+"-"+Rt,e+"-"+Bt])},[]),zt=[].concat(Nt,[Lt]).reduce(function(t,e){return t.concat([e,e+"-"+Rt,e+"-"+Bt])},[]),Ut="beforeRead",qt="read",Kt="afterRead",$t="beforeMain",Xt="main",Gt="afterMain",Qt="beforeWrite",Zt="write",Jt="afterWrite",te=[Ut,qt,Kt,$t,Xt,Gt,Qt,Zt,Jt];function ee(t){return t?(t.nodeName||"").toLowerCase():null}function b(t){return null==t?window:"[object Window]"!==t.toString()?(e=t.ownerDocument)&&e.defaultView||window:t;var e}function ne(t){return t instanceof b(t).Element||t instanceof Element}function s(t){return t instanceof b(t).HTMLElement||t instanceof HTMLElement}function re(t){if("undefined"!=typeof ShadowRoot)return t instanceof b(t).ShadowRoot||t instanceof ShadowRoot}var oe={name:"applyStyles",enabled:!0,phase:"write",fn:function(t){var o=t.state;Object.keys(o.elements).forEach(function(t){var e=o.styles[t]||{},n=o.attributes[t]||{},r=o.elements[t];s(r)&&ee(r)&&(Object.assign(r.style,e),Object.keys(n).forEach(function(t){var e=n[t];!1===e?r.removeAttribute(t):r.setAttribute(t,!0===e?"":e)}))})},effect:function(t){var r=t.state,o={popper:{position:r.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(r.elements.popper.style,o.popper),r.styles=o,r.elements.arrow&&Object.assign(r.elements.arrow.style,o.arrow),function(){Object.keys(r.elements).forEach(function(t){var e=r.elements[t],n=r.attributes[t]||{},t=Object.keys((r.styles.hasOwnProperty(t)?r.styles:o)[t]).reduce(function(t,e){return t[e]="",t},{});s(e)&&ee(e)&&(Object.assign(e.style,t),Object.keys(n).forEach(function(t){e.removeAttribute(t)}))})}},requires:["computeStyles"]};function ie(t){return t.split("-")[0]}var ae=Math.max,ce=Math.min,se=Math.round;function ue(t,e){void 0===e&&(e=!1);var n=t.getBoundingClientRect(),r=1,o=1;return s(t)&&e&&(e=t.offsetHeight,0<(t=t.offsetWidth)&&(r=se(n.width)/t||1),0<e&&(o=se(n.height)/e||1)),{width:n.width/r,height:n.height/o,top:n.top/o,right:n.right/r,bottom:n.bottom/o,left:n.left/r,x:n.left/r,y:n.top/o}}function le(t){var e=ue(t),n=t.offsetWidth,r=t.offsetHeight;return Math.abs(e.width-n)<=1&&(n=e.width),Math.abs(e.height-r)<=1&&(r=e.height),{x:t.offsetLeft,y:t.offsetTop,width:n,height:r}}function fe(t,e){var n=e.getRootNode&&e.getRootNode();if(t.contains(e))return!0;if(n&&re(n)){var r=e;do{if(r&&t.isSameNode(r))return!0}while(r=r.parentNode||r.host)}return!1}function de(t){return b(t).getComputedStyle(t)}function pe(t){return((ne(t)?t.ownerDocument:t.document)||window.document).documentElement}function he(t){return"html"===ee(t)?t:t.assignedSlot||t.parentNode||(re(t)?t.host:null)||pe(t)}function ve(t){return s(t)&&"fixed"!==de(t).position?t.offsetParent:null}function ye(t){for(var e,n=b(t),r=ve(t);r&&(e=r,0<=["table","td","th"].indexOf(ee(e)))&&"static"===de(r).position;)r=ve(r);return(!r||"html"!==ee(r)&&("body"!==ee(r)||"static"!==de(r).position))&&(r||function(t){var e=-1!==navigator.userAgent.toLowerCase().indexOf("firefox"),n=-1!==navigator.userAgent.indexOf("Trident");if(n&&s(t)&&"fixed"===de(t).position)return null;var r=he(t);for(re(r)&&(r=r.host);s(r)&&["html","body"].indexOf(ee(r))<0;){var o=de(r);if("none"!==o.transform||"none"!==o.perspective||"paint"===o.contain||-1!==["transform","perspective"].indexOf(o.willChange)||e&&"filter"===o.willChange||e&&o.filter&&"none"!==o.filter)return r;r=r.parentNode}return null}(t))||n}function me(t){return 0<=["top","bottom"].indexOf(t)?"x":"y"}function ge(t,e,n){return ae(t,ce(e,n))}function be(){return{top:0,right:0,bottom:0,left:0}}function _e(t){return Object.assign({},be(),t)}function we(n,t){return t.reduce(function(t,e){return t[e]=n,t},{})}var Oe={name:"arrow",enabled:!0,phase:"main",fn:function(t){var e,n,r,o,i=t.state,a=t.name,t=t.options,c=i.elements.arrow,s=i.modifiersData.popperOffsets,u=me(l=ie(i.placement)),l=0<=[A,T].indexOf(l)?"height":"width";c&&s&&(t=t.padding,n=i,n=_e("number"!=typeof(t="function"==typeof t?t(Object.assign({},n.rects,{placement:n.placement})):t)?t:we(t,Nt)),t=le(c),o="y"===u?E:A,r="y"===u?j:T,e=i.rects.reference[l]+i.rects.reference[u]-s[u]-i.rects.popper[l],s=s[u]-i.rects.reference[u],c=(c=ye(c))?"y"===u?c.clientHeight||0:c.clientWidth||0:0,o=n[o],n=c-t[l]-n[r],o=ge(o,r=c/2-t[l]/2+(e/2-s/2),n),i.modifiersData[a]=((c={})[u]=o,c.centerOffset=o-r,c))},effect:function(t){var e=t.state;null!=(t=void 0===(t=t.options.element)?"[data-popper-arrow]":t)&&("string"!=typeof t||(t=e.elements.popper.querySelector(t)))&&fe(e.elements.popper,t)&&(e.elements.arrow=t)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function ke(t){return t.split("-")[1]}var Ce={top:"auto",right:"auto",bottom:"auto",left:"auto"};function Se(t){var e,n,r,o=t.popper,i=t.popperRect,a=t.placement,c=t.variation,s=t.offsets,u=t.position,l=t.gpuAcceleration,f=t.adaptive,d=t.roundOffsets,t=t.isFixed,p=s.x,p=void 0===p?0:p,h=s.y,h=void 0===h?0:h,v="function"==typeof d?d({x:p,y:h}):{x:p,y:h},v=(p=v.x,h=v.y,s.hasOwnProperty("x")),s=s.hasOwnProperty("y"),y=A,m=E,g=window,o=(f&&(n="clientHeight",e="clientWidth",(r=ye(o))===b(o)&&"static"!==de(r=pe(o)).position&&"absolute"===u&&(n="scrollHeight",e="scrollWidth"),a!==E&&(a!==A&&a!==T||c!==Bt)||(m=j,h=(h-((t&&r===g&&g.visualViewport?g.visualViewport.height:r[n])-i.height))*(l?1:-1)),a!==A&&(a!==E&&a!==j||c!==Bt)||(y=T,p=(p-((t&&r===g&&g.visualViewport?g.visualViewport.width:r[e])-i.width))*(l?1:-1))),Object.assign({position:u},f&&Ce)),t=!0===d?(a=(n={x:p,y:h}).x,n=n.y,c=window.devicePixelRatio||1,{x:se(a*c)/c||0,y:se(n*c)/c||0}):{x:p,y:h};return p=t.x,h=t.y,l?Object.assign({},o,((r={})[m]=s?"0":"",r[y]=v?"0":"",r.transform=(g.devicePixelRatio||1)<=1?"translate("+p+"px, "+h+"px)":"translate3d("+p+"px, "+h+"px, 0)",r)):Object.assign({},o,((e={})[m]=s?h+"px":"",e[y]=v?p+"px":"",e.transform="",e))}var xe={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(t){var e=t.state,t=t.options,n=void 0===(n=t.gpuAcceleration)||n,r=void 0===(r=t.adaptive)||r,t=void 0===(t=t.roundOffsets)||t,n={placement:ie(e.placement),variation:ke(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:n,isFixed:"fixed"===e.options.strategy};null!=e.modifiersData.popperOffsets&&(e.styles.popper=Object.assign({},e.styles.popper,Se(Object.assign({},n,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:r,roundOffsets:t})))),null!=e.modifiersData.arrow&&(e.styles.arrow=Object.assign({},e.styles.arrow,Se(Object.assign({},n,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:t})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement})},data:{}},Ee={passive:!0};var je={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(t){var e=t.state,n=t.instance,r=(t=t.options).scroll,o=void 0===r||r,i=void 0===(r=t.resize)||r,a=b(e.elements.popper),c=[].concat(e.scrollParents.reference,e.scrollParents.popper);return o&&c.forEach(function(t){t.addEventListener("scroll",n.update,Ee)}),i&&a.addEventListener("resize",n.update,Ee),function(){o&&c.forEach(function(t){t.removeEventListener("scroll",n.update,Ee)}),i&&a.removeEventListener("resize",n.update,Ee)}},data:{}},Te={left:"right",right:"left",bottom:"top",top:"bottom"};function Ae(t){return t.replace(/left|right|bottom|top/g,function(t){return Te[t]})}var De={start:"end",end:"start"};function Pe(t){return t.replace(/start|end/g,function(t){return De[t]})}function Me(t){t=b(t);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function Ie(t){return ue(pe(t)).left+Me(t).scrollLeft}function Le(t){var t=de(t),e=t.overflow,n=t.overflowX,t=t.overflowY;return/auto|scroll|overlay|hidden/.test(e+t+n)}function Ne(t,e){void 0===e&&(e=[]);var n=function t(e){return 0<=["html","body","#document"].indexOf(ee(e))?e.ownerDocument.body:s(e)&&Le(e)?e:t(he(e))}(t),t=n===(null==(t=t.ownerDocument)?void 0:t.body),r=b(n),r=t?[r].concat(r.visualViewport||[],Le(n)?n:[]):n,n=e.concat(r);return t?n:n.concat(Ne(he(r)))}function Re(t){return Object.assign({},t,{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}function Be(t,e){return e===Ft?Re((r=b(n=t),o=pe(n),r=r.visualViewport,i=o.clientWidth,o=o.clientHeight,c=a=0,r&&(i=r.width,o=r.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(a=r.offsetLeft,c=r.offsetTop)),{width:i,height:o,x:a+Ie(n),y:c})):ne(e)?((i=ue(r=e)).top=i.top+r.clientTop,i.left=i.left+r.clientLeft,i.bottom=i.top+r.clientHeight,i.right=i.left+r.clientWidth,i.width=r.clientWidth,i.height=r.clientHeight,i.x=i.left,i.y=i.top,i):Re((o=pe(t),a=pe(o),n=Me(o),c=null==(c=o.ownerDocument)?void 0:c.body,e=ae(a.scrollWidth,a.clientWidth,c?c.scrollWidth:0,c?c.clientWidth:0),t=ae(a.scrollHeight,a.clientHeight,c?c.scrollHeight:0,c?c.clientHeight:0),o=-n.scrollLeft+Ie(o),n=-n.scrollTop,"rtl"===de(c||a).direction&&(o+=ae(a.clientWidth,c?c.clientWidth:0)-e),{width:e,height:t,x:o,y:n}));var n,r,o,i,a,c}function He(n,t,e){var r,o="clippingParents"===t?(i=Ne(he(o=n)),ne(r=0<=["absolute","fixed"].indexOf(de(o).position)&&s(o)?ye(o):o)?i.filter(function(t){return ne(t)&&fe(t,r)&&"body"!==ee(t)}):[]):[].concat(t),i=[].concat(o,[e]),t=i[0],e=i.reduce(function(t,e){e=Be(n,e);return t.top=ae(e.top,t.top),t.right=ce(e.right,t.right),t.bottom=ce(e.bottom,t.bottom),t.left=ae(e.left,t.left),t},Be(n,t));return e.width=e.right-e.left,e.height=e.bottom-e.top,e.x=e.left,e.y=e.top,e}function Fe(t){var e,n=t.reference,r=t.element,t=t.placement,o=t?ie(t):null,t=t?ke(t):null,i=n.x+n.width/2-r.width/2,a=n.y+n.height/2-r.height/2;switch(o){case E:e={x:i,y:n.y-r.height};break;case j:e={x:i,y:n.y+n.height};break;case T:e={x:n.x+n.width,y:a};break;case A:e={x:n.x-r.width,y:a};break;default:e={x:n.x,y:n.y}}var c=o?me(o):null;if(null!=c){var s="y"===c?"height":"width";switch(t){case Rt:e[c]=e[c]-(n[s]/2-r[s]/2);break;case Bt:e[c]=e[c]+(n[s]/2-r[s]/2)}}return e}function Ve(t,e){var r,e=e=void 0===e?{}:e,n=e.placement,n=void 0===n?t.placement:n,o=e.boundary,o=void 0===o?Ht:o,i=e.rootBoundary,i=void 0===i?Ft:i,a=e.elementContext,a=void 0===a?Vt:a,c=e.altBoundary,c=void 0!==c&&c,e=e.padding,e=void 0===e?0:e,e=_e("number"!=typeof e?e:we(e,Nt)),s=t.rects.popper,c=t.elements[c?a===Vt?Yt:Vt:a],c=He(ne(c)?c:c.contextElement||pe(t.elements.popper),o,i),o=ue(t.elements.reference),i=Fe({reference:o,element:s,strategy:"absolute",placement:n}),s=Re(Object.assign({},s,i)),i=a===Vt?s:o,u={top:c.top-i.top+e.top,bottom:i.bottom-c.bottom+e.bottom,left:c.left-i.left+e.left,right:i.right-c.right+e.right},s=t.modifiersData.offset;return a===Vt&&s&&(r=s[n],Object.keys(u).forEach(function(t){var e=0<=[T,j].indexOf(t)?1:-1,n=0<=[E,j].indexOf(t)?"y":"x";u[t]+=r[n]*e})),u}var Ye={name:"flip",enabled:!0,phase:"main",fn:function(t){var f=t.state,e=t.options,t=t.name;if(!f.modifiersData[t]._skip){for(var n=e.mainAxis,r=void 0===n||n,n=e.altAxis,o=void 0===n||n,n=e.fallbackPlacements,d=e.padding,p=e.boundary,h=e.rootBoundary,i=e.altBoundary,a=e.flipVariations,v=void 0===a||a,y=e.allowedAutoPlacements,a=f.options.placement,e=ie(a),n=n||(e===a||!v?[Ae(a)]:function(t){if(ie(t)===Lt)return[];var e=Ae(t);return[Pe(t),e,Pe(e)]}(a)),c=[a].concat(n).reduce(function(t,e){return t.concat(ie(e)===Lt?(n=f,r=(t=t=void 0===(t={placement:e,boundary:p,rootBoundary:h,padding:d,flipVariations:v,allowedAutoPlacements:y})?{}:t).placement,o=t.boundary,i=t.rootBoundary,a=t.padding,c=t.flipVariations,s=void 0===(t=t.allowedAutoPlacements)?zt:t,u=ke(r),t=u?c?Wt:Wt.filter(function(t){return ke(t)===u}):Nt,l=(r=0===(r=t.filter(function(t){return 0<=s.indexOf(t)})).length?t:r).reduce(function(t,e){return t[e]=Ve(n,{placement:e,boundary:o,rootBoundary:i,padding:a})[ie(e)],t},{}),Object.keys(l).sort(function(t,e){return l[t]-l[e]})):e);var n,r,o,i,a,c,s,u,l},[]),s=f.rects.reference,u=f.rects.popper,l=new Map,m=!0,g=c[0],b=0;b<c.length;b++){var _=c[b],w=ie(_),O=ke(_)===Rt,k=0<=[E,j].indexOf(w),C=k?"width":"height",S=Ve(f,{placement:_,boundary:p,rootBoundary:h,altBoundary:i,padding:d}),k=k?O?T:A:O?j:E,O=(s[C]>u[C]&&(k=Ae(k)),Ae(k)),C=[];if(r&&C.push(S[w]<=0),o&&C.push(S[k]<=0,S[O]<=0),C.every(function(t){return t})){g=_,m=!1;break}l.set(_,C)}if(m)for(var x=v?3:1;0<x;x--)if("break"===function(e){var t=c.find(function(t){t=l.get(t);if(t)return t.slice(0,e).every(function(t){return t})});if(t)return g=t,"break"}(x))break;f.placement!==g&&(f.modifiersData[t]._skip=!0,f.placement=g,f.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function We(t,e,n){return{top:t.top-e.height-(n=void 0===n?{x:0,y:0}:n).y,right:t.right-e.width+n.x,bottom:t.bottom-e.height+n.y,left:t.left-e.width-n.x}}function ze(e){return[E,T,j,A].some(function(t){return 0<=e[t]})}var Ue={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(t){var e=t.state,t=t.name,n=e.rects.reference,r=e.rects.popper,o=e.modifiersData.preventOverflow,i=Ve(e,{elementContext:"reference"}),a=Ve(e,{altBoundary:!0}),i=We(i,n),n=We(a,r,o),a=ze(i),r=ze(n);e.modifiersData[t]={referenceClippingOffsets:i,popperEscapeOffsets:n,isReferenceHidden:a,hasPopperEscaped:r},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":a,"data-popper-escaped":r})}};var qe={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(t){var a=t.state,e=t.options,t=t.name,c=void 0===(e=e.offset)?[0,0]:e,e=zt.reduce(function(t,e){var n,r,o,i;return t[e]=(e=e,n=a.rects,r=c,o=ie(e),i=0<=[A,E].indexOf(o)?-1:1,e=(n="function"==typeof r?r(Object.assign({},n,{placement:e})):r)[0]||0,r=(n[1]||0)*i,0<=[A,T].indexOf(o)?{x:r,y:e}:{x:e,y:r}),t},{}),n=(r=e[a.placement]).x,r=r.y;null!=a.modifiersData.popperOffsets&&(a.modifiersData.popperOffsets.x+=n,a.modifiersData.popperOffsets.y+=r),a.modifiersData[t]=e}};var Ke={name:"popperOffsets",enabled:!0,phase:"read",fn:function(t){var e=t.state,t=t.name;e.modifiersData[t]=Fe({reference:e.rects.reference,element:e.rects.popper,strategy:"absolute",placement:e.placement})},data:{}};var $e={name:"preventOverflow",enabled:!0,phase:"main",fn:function(t){var e,n,r,o,i,a,c,s,u,l=t.state,f=t.options,t=t.name,d=void 0===(d=f.mainAxis)||d,p=void 0!==(p=f.altAxis)&&p,h=f.boundary,v=f.rootBoundary,y=f.altBoundary,m=f.padding,g=void 0===(g=f.tether)||g,f=void 0===(f=f.tetherOffset)?0:f,h=Ve(l,{boundary:h,rootBoundary:v,padding:m,altBoundary:y}),v=ie(l.placement),y=!(m=ke(l.placement)),b=me(v),_="x"===b?"y":"x",w=l.modifiersData.popperOffsets,O=l.rects.reference,k=l.rects.popper,f="number"==typeof(f="function"==typeof f?f(Object.assign({},l.rects,{placement:l.placement})):f)?{mainAxis:f,altAxis:f}:Object.assign({mainAxis:0,altAxis:0},f),C=l.modifiersData.offset?l.modifiersData.offset[l.placement]:null,S={x:0,y:0};w&&(d&&(d="y"===b?"height":"width",a=(c=w[b])+h[n="y"===b?E:A],s=c-h[u="y"===b?j:T],e=g?-k[d]/2:0,o=(m===Rt?O:k)[d],m=m===Rt?-k[d]:-O[d],i=l.elements.arrow,i=g&&i?le(i):{width:0,height:0},n=(r=l.modifiersData["arrow#persistent"]?l.modifiersData["arrow#persistent"].padding:be())[n],r=r[u],u=ge(0,O[d],i[d]),i=y?O[d]/2-e-u-n-f.mainAxis:o-u-n-f.mainAxis,o=y?-O[d]/2+e+u+r+f.mainAxis:m+u+r+f.mainAxis,y=(n=l.elements.arrow&&ye(l.elements.arrow))?"y"===b?n.clientTop||0:n.clientLeft||0:0,m=c+o-(e=null!=(d=null==C?void 0:C[b])?d:0),u=ge(g?ce(a,c+i-e-y):a,c,g?ae(s,m):s),w[b]=u,S[b]=u-c),p&&(r="y"==_?"height":"width",o=(n=w[_])+h["x"===b?E:A],d=n-h["x"===b?j:T],i=-1!==[E,A].indexOf(v),y=null!=(e=null==C?void 0:C[_])?e:0,a=i?o:n-O[r]-k[r]-y+f.altAxis,m=i?n+O[r]+k[r]-y-f.altAxis:d,c=g&&i?(s=ge(s=a,n,u=m),u<s?u:s):ge(g?a:o,n,g?m:d),w[_]=c,S[_]=c-n),l.modifiersData[t]=S)},requiresIfExists:["offset"]};function Xe(t,e,n){void 0===n&&(n=!1);var r=s(e),o=s(e)&&(a=(o=e).getBoundingClientRect(),i=se(a.width)/o.offsetWidth||1,a=se(a.height)/o.offsetHeight||1,1!==i||1!==a),i=pe(e),a=ue(t,o),t={scrollLeft:0,scrollTop:0},c={x:0,y:0};return!r&&n||("body"===ee(e)&&!Le(i)||(t=(r=e)!==b(r)&&s(r)?{scrollLeft:r.scrollLeft,scrollTop:r.scrollTop}:Me(r)),s(e)?((c=ue(e,!0)).x+=e.clientLeft,c.y+=e.clientTop):i&&(c.x=Ie(i))),{x:a.left+t.scrollLeft-c.x,y:a.top+t.scrollTop-c.y,width:a.width,height:a.height}}function Ge(t){var n=new Map,r=new Set,o=[];return t.forEach(function(t){n.set(t.name,t)}),t.forEach(function(t){r.has(t.name)||!function e(t){r.add(t.name),[].concat(t.requires||[],t.requiresIfExists||[]).forEach(function(t){r.has(t)||(t=n.get(t))&&e(t)}),o.push(t)}(t)}),o}var Qe={placement:"bottom",modifiers:[],strategy:"absolute"};function Ze(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return!e.some(function(t){return!(t&&"function"==typeof t.getBoundingClientRect)})}function Je(t){var t=t=void 0===t?{}:t,e=t.defaultModifiers,f=void 0===e?[]:e,e=t.defaultOptions,d=void 0===e?Qe:e;return function(r,o,e){void 0===e&&(e=d);var n,i,a={placement:"bottom",orderedModifiers:[],options:Object.assign({},Qe,d),modifiersData:{},elements:{reference:r,popper:o},attributes:{},styles:{}},c=[],s=!1,u={state:a,setOptions:function(t){var n,e,t="function"==typeof t?t(a.options):t,t=(l(),a.options=Object.assign({},d,a.options,t),a.scrollParents={reference:ne(r)?Ne(r):r.contextElement?Ne(r.contextElement):[],popper:Ne(o)},t=[].concat(f,a.options.modifiers),e=t.reduce(function(t,e){var n=t[e.name];return t[e.name]=n?Object.assign({},n,e,{options:Object.assign({},n.options,e.options),data:Object.assign({},n.data,e.data)}):e,t},{}),t=Object.keys(e).map(function(t){return e[t]}),n=Ge(t),te.reduce(function(t,e){return t.concat(n.filter(function(t){return t.phase===e}))},[]));return a.orderedModifiers=t.filter(function(t){return t.enabled}),a.orderedModifiers.forEach(function(t){var e=t.name,n=t.options,t=t.effect;"function"==typeof t&&(t=t({state:a,name:e,instance:u,options:void 0===n?{}:n}),c.push(t||function(){}))}),u.update()},forceUpdate:function(){if(!s){var t=a.elements,e=t.reference,t=t.popper;if(Ze(e,t)){a.rects={reference:Xe(e,ye(t),"fixed"===a.options.strategy),popper:le(t)},a.reset=!1,a.placement=a.options.placement,a.orderedModifiers.forEach(function(t){return a.modifiersData[t.name]=Object.assign({},t.data)});for(var n,r,o,i=0;i<a.orderedModifiers.length;i++)!0===a.reset?(a.reset=!1,i=-1):(n=(o=a.orderedModifiers[i]).fn,r=o.options,o=o.name,"function"==typeof n&&(a=n({state:a,options:void 0===r?{}:r,name:o,instance:u})||a))}}},update:(n=function(){return new Promise(function(t){u.forceUpdate(),t(a)})},function(){return i=i||new Promise(function(t){Promise.resolve().then(function(){i=void 0,t(n())})})}),destroy:function(){l(),s=!0}};return Ze(r,o)&&u.setOptions(e).then(function(t){!s&&e.onFirstUpdate&&e.onFirstUpdate(t)}),u;function l(){c.forEach(function(t){return t()}),c=[]}}}var tn=Je(),en=Je({defaultModifiers:[je,Ke,xe,oe,qe,Ye,$e,Oe,Ue]}),nn=Je({defaultModifiers:[je,Ke,xe,oe]});function rn(t){return"true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function on(t){return t.replace(/[A-Z]/g,function(t){return"-".concat(t.toLowerCase())})}var f={setDataAttribute:function(t,e,n){t.setAttribute("data-bs-".concat(on(e)),n)},removeDataAttribute:function(t,e){t.removeAttribute("data-bs-".concat(on(e)))},getDataAttributes:function(n){if(!n)return{};var r={};return Object.keys(n.dataset).filter(function(t){return t.startsWith("bs")}).forEach(function(t){var e=(e=t.replace(/^bs/,"")).charAt(0).toLowerCase()+e.slice(1,e.length);r[e]=rn(n.dataset[t])}),r},getDataAttribute:function(t,e){return rn(t.getAttribute("data-bs-".concat(on(e))))},offset:function(t){t=t.getBoundingClientRect();return{top:t.top+window.pageYOffset,left:t.left+window.pageXOffset}},position:function(t){return{top:t.offsetTop,left:t.offsetLeft}}};t(95);function an(t){return function(t){if(Array.isArray(t))return cn(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return cn(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?cn(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function cn(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var p={find:function(t){var e,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document.documentElement;return(e=[]).concat.apply(e,an(Element.prototype.querySelectorAll.call(n,t)))},findOne:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document.documentElement;return Element.prototype.querySelector.call(e,t)},children:function(t,e){var n;return(n=[]).concat.apply(n,an(t.children)).filter(function(t){return t.matches(e)})},parents:function(t,e){for(var n=[],r=t.parentNode;r&&r.nodeType===Node.ELEMENT_NODE&&3!==r.nodeType;)r.matches(e)&&n.push(r),r=r.parentNode;return n},prev:function(t,e){for(var n=t.previousElementSibling;n;){if(n.matches(e))return[n];n=n.previousElementSibling}return[]},next:function(t,e){for(var n=t.nextElementSibling;n;){if(n.matches(e))return[n];n=n.nextElementSibling}return[]},focusableChildren:function(t){var e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(function(t){return"".concat(t,':not([tabindex^="-"])')}).join(", ");return this.find(e,t).filter(function(t){return!U(t)&&z(t)})}};function sn(t){return(sn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function un(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function ln(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?un(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):un(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function fn(t){return function(t){if(Array.isArray(t))return dn(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return dn(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?dn(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function dn(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function pn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function hn(){return(hn="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=mn(t)););return t}(t,e);if(r)return r=Object.getOwnPropertyDescriptor(r,e),r.get?r.get.call(arguments.length<3?t:n):r.value}).apply(this,arguments)}function vn(t,e){return(vn=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function yn(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=mn(n),e=(t=r?(t=mn(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===sn(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function mn(t){return(mn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var gn="dropdown",n=".".concat("bs.dropdown"),bn=".data-api",_n="Escape",wn="ArrowUp",On="ArrowDown",kn=new RegExp("".concat(wn,"|").concat(On,"|").concat(_n)),Cn="hide".concat(n),Sn="hidden".concat(n),xn="show".concat(n),En="shown".concat(n),jn="click".concat(n).concat(bn),r="keydown".concat(n).concat(bn),n="keyup".concat(n).concat(bn),Tn="show",An='[data-bs-toggle="dropdown"]',Dn=".dropdown-menu",Pn=a()?"top-end":"top-start",Mn=a()?"top-start":"top-end",In=a()?"bottom-end":"bottom-start",Ln=a()?"bottom-start":"bottom-end",Nn=a()?"left-start":"right-start",Rn=a()?"right-start":"left-start",Bn={offset:[0,2],boundary:"clippingParents",reference:"toggle",display:"dynamic",popperConfig:null,autoClose:!0},Hn={offset:"(array|string|function)",boundary:"(string|element)",reference:"(string|element|object)",display:"string",popperConfig:"(null|object|function)",autoClose:"(boolean|string)"},Fn=function(){var t=s,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&vn(t,e);var n,r=yn(s);function s(t,e){if(this instanceof s)return(t=r.call(this,t))._popper=null,t._config=t._getConfig(e),t._menu=t._getMenuElement(),t._inNavbar=t._detectNavbar(),t;throw new TypeError("Cannot call a class as a function")}return t=s,e=[{key:"Default",get:function(){return Bn}},{key:"DefaultType",get:function(){return Hn}},{key:"NAME",get:function(){return gn}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=s.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e]()}})}},{key:"clearMenus",value:function(t){if(!t||2!==t.button&&("keyup"!==t.type||"Tab"===t.key))for(var e=p.find(An),n=0,r=e.length;n<r;n++){var o=s.getInstance(e[n]);if(o&&!1!==o._config.autoClose&&o._isShown()){var i={relatedTarget:o._element};if(t){var a=t.composedPath(),c=a.includes(o._menu);if(a.includes(o._element)||"inside"===o._config.autoClose&&!c||"outside"===o._config.autoClose&&c)continue;if(o._menu.contains(t.target)&&("keyup"===t.type&&"Tab"===t.key||/input|select|option|textarea|form/i.test(t.target.tagName)))continue;"click"===t.type&&(i.clickEvent=t)}o._completeHide(i)}}}},{key:"getParentFromElement",value:function(t){return F(t)||t.parentNode}},{key:"dataApiKeydownHandler",value:function(t){if(/input|textarea/i.test(t.target.tagName)?!("Space"===t.key||t.key!==_n&&(t.key!==On&&t.key!==wn||t.target.closest(Dn))):kn.test(t.key)){var e=this.classList.contains(Tn);if((e||t.key!==_n)&&(t.preventDefault(),t.stopPropagation(),!U(this))){var n=this.matches(An)?this:p.prev(this,An)[0],n=s.getOrCreateInstance(n);if(t.key!==_n)return t.key===wn||t.key===On?(e||n.show(),void n._selectMenuItem(t)):void(e&&"Space"!==t.key||s.clearMenus());n.hide()}}}}],(n=[{key:"toggle",value:function(){return this._isShown()?this.hide():this.show()}},{key:"show",value:function(){var t,e;U(this._element)||this._isShown(this._menu)||(t={relatedTarget:this._element},d.trigger(this._element,xn,t).defaultPrevented||(e=s.getParentFromElement(this._element),this._inNavbar?f.setDataAttribute(this._menu,"popper","none"):this._createPopper(e),"ontouchstart"in document.documentElement&&!e.closest(".navbar-nav")&&(e=[]).concat.apply(e,fn(document.body.children)).forEach(function(t){return d.on(t,"mouseover",K)}),this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add(Tn),this._element.classList.add(Tn),d.trigger(this._element,En,t)))}},{key:"hide",value:function(){var t;!U(this._element)&&this._isShown(this._menu)&&(t={relatedTarget:this._element},this._completeHide(t))}},{key:"dispose",value:function(){this._popper&&this._popper.destroy(),hn(mn(s.prototype),"dispose",this).call(this)}},{key:"update",value:function(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}},{key:"_completeHide",value:function(t){var e;d.trigger(this._element,Cn,t).defaultPrevented||("ontouchstart"in document.documentElement&&(e=[]).concat.apply(e,fn(document.body.children)).forEach(function(t){return d.off(t,"mouseover",K)}),this._popper&&this._popper.destroy(),this._menu.classList.remove(Tn),this._element.classList.remove(Tn),this._element.setAttribute("aria-expanded","false"),f.removeDataAttribute(this._menu,"popper"),d.trigger(this._element,Sn,t))}},{key:"_getConfig",value:function(t){if(t=ln(ln(ln({},this.constructor.Default),f.getDataAttributes(this._element)),t),W(gn,t,this.constructor.DefaultType),"object"!==sn(t.reference)||nt(t.reference)||"function"==typeof t.reference.getBoundingClientRect)return t;throw new TypeError("".concat(gn.toUpperCase(),': Option "reference" provided type "object" without a required "getBoundingClientRect" method.'))}},{key:"_createPopper",value:function(t){if(void 0===i)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");var e=this._element,t=("parent"===this._config.reference?e=t:nt(this._config.reference)?e=Y(this._config.reference):"object"===sn(this._config.reference)&&(e=this._config.reference),this._getPopperConfig()),n=t.modifiers.find(function(t){return"applyStyles"===t.name&&!1===t.enabled});this._popper=en(e,this._menu,t),n&&f.setDataAttribute(this._menu,"popper","static")}},{key:"_isShown",value:function(){return(0<arguments.length&&void 0!==arguments[0]?arguments[0]:this._element).classList.contains(Tn)}},{key:"_getMenuElement",value:function(){return p.next(this._element,Dn)[0]}},{key:"_getPlacement",value:function(){var t=this._element.parentNode;if(t.classList.contains("dropend"))return Nn;if(t.classList.contains("dropstart"))return Rn;var e="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return t.classList.contains("dropup")?e?Mn:Pn:e?Ln:In}},{key:"_detectNavbar",value:function(){return null!==this._element.closest(".".concat("navbar"))}},{key:"_getOffset",value:function(){var e=this,n=this._config.offset;return"string"==typeof n?n.split(",").map(function(t){return Number.parseInt(t,10)}):"function"==typeof n?function(t){return n(t,e._element)}:n}},{key:"_getPopperConfig",value:function(){var t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return"static"===this._config.display&&(t.modifiers=[{name:"applyStyles",enabled:!1}]),ln(ln({},t),"function"==typeof this._config.popperConfig?this._config.popperConfig(t):this._config.popperConfig)}},{key:"_selectMenuItem",value:function(t){var e=t.key,t=t.target,n=p.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",this._menu).filter(z);n.length&&Z(n,t,e===On,!n.includes(t)).focus()}}])&&pn(t.prototype,n),e&&pn(t,e),Object.defineProperty(t,"prototype",{writable:!1}),s}(),bn=(d.on(document,r,An,Fn.dataApiKeydownHandler),d.on(document,r,Dn,Fn.dataApiKeydownHandler),d.on(document,jn,Fn.clearMenus),d.on(document,n,Fn.clearMenus),d.on(document,jn,An,function(t){t.preventDefault(),Fn.getOrCreateInstance(this).toggle()}),e(Fn),Fn);function Vn(t){return(Vn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Yn(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Wn(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Yn(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Yn(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function zn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Un(t,e){return(Un=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function qn(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Kn(n),e=(t=r?(t=Kn(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===Vn(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Kn(t){return(Kn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var $n="collapse",Xn="bs.collapse",r=".".concat(Xn),Gn={toggle:!0,parent:null},Qn={toggle:"boolean",parent:"(null|element)"},Zn="show".concat(r),Jn="shown".concat(r),tr="hide".concat(r),er="hidden".concat(r),n="click".concat(r).concat(".data-api"),nr="show",rr="collapse",or="collapsing",ir="collapsed",ar=":scope .".concat(rr," .").concat(rr),cr='[data-bs-toggle="collapse"]',sr=function(){var t=l,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Un(t,e);var n,u=qn(l);function l(t,e){var n;if(!(this instanceof l))throw new TypeError("Cannot call a class as a function");(n=u.call(this,t))._isTransitioning=!1,n._config=n._getConfig(e),n._triggerArray=[];for(var r=p.find(cr),o=0,i=r.length;o<i;o++){var a=r[o],c=H(a),s=p.find(c).filter(function(t){return t===n._element});null!==c&&s.length&&(n._selector=c,n._triggerArray.push(a))}return n._initializeChildren(),n._config.parent||n._addAriaAndCollapsedClass(n._triggerArray,n._isShown()),n._config.toggle&&n.toggle(),n}return t=l,e=[{key:"Default",get:function(){return Gn}},{key:"NAME",get:function(){return $n}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t={},t=("string"==typeof e&&/show|hide/.test(e)&&(t.toggle=!1),l.getOrCreateInstance(this,t));if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e]()}})}}],(n=[{key:"toggle",value:function(){this._isShown()?this.hide():this.show()}},{key:"show",value:function(){var t=this;if(!this._isTransitioning&&!this._isShown()){var e,n,r=[],o=(this._config.parent&&(e=p.find(ar,this._config.parent),r=p.find(".collapse.show, .collapse.collapsing",this._config.parent).filter(function(t){return!e.includes(t)})),p.findOne(this._selector));if(r.length){var i,a=r.find(function(t){return o!==t});if((i=a?l.getInstance(a):null)&&i._isTransitioning)return}d.trigger(this._element,Zn).defaultPrevented||(r.forEach(function(t){o!==t&&l.getOrCreateInstance(t,{toggle:!1}).hide(),i||kt(t,Xn,null)}),n=this._getDimension(),this._element.classList.remove(rr),this._element.classList.add(or),this._element.style[n]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0,a=n[0].toUpperCase()+n.slice(1),r="scroll".concat(a),this._queueCallback(function(){t._isTransitioning=!1,t._element.classList.remove(or),t._element.classList.add(rr,nr),t._element.style[n]="",d.trigger(t._element,Jn)},this._element,!0),this._element.style[n]="".concat(this._element[r],"px"))}}},{key:"hide",value:function(){var t=this;if(!this._isTransitioning&&this._isShown()){var e=d.trigger(this._element,tr);if(!e.defaultPrevented){for(var e=this._getDimension(),n=(this._element.style[e]="".concat(this._element.getBoundingClientRect()[e],"px"),$(this._element),this._element.classList.add(or),this._element.classList.remove(rr,nr),this._triggerArray.length),r=0;r<n;r++){var o=this._triggerArray[r],i=F(o);i&&!this._isShown(i)&&this._addAriaAndCollapsedClass([o],!1)}this._isTransitioning=!0;this._element.style[e]="",this._queueCallback(function(){t._isTransitioning=!1,t._element.classList.remove(or),t._element.classList.add(rr),d.trigger(t._element,er)},this._element,!0)}}}},{key:"_isShown",value:function(){return(0<arguments.length&&void 0!==arguments[0]?arguments[0]:this._element).classList.contains(nr)}},{key:"_getConfig",value:function(t){return(t=Wn(Wn(Wn({},Gn),f.getDataAttributes(this._element)),t)).toggle=Boolean(t.toggle),t.parent=Y(t.parent),W($n,t,Qn),t}},{key:"_getDimension",value:function(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}},{key:"_initializeChildren",value:function(){var e,n=this;this._config.parent&&(e=p.find(ar,this._config.parent),p.find(cr,this._config.parent).filter(function(t){return!e.includes(t)}).forEach(function(t){var e=F(t);e&&n._addAriaAndCollapsedClass([t],n._isShown(e))}))}},{key:"_addAriaAndCollapsedClass",value:function(t,e){t.length&&t.forEach(function(t){e?t.classList.remove(ir):t.classList.add(ir),t.setAttribute("aria-expanded",e)})}}])&&zn(t.prototype,n),e&&zn(t,e),Object.defineProperty(t,"prototype",{writable:!1}),l}(),jn=(d.on(document,n,cr,function(t){("A"===t.target.tagName||t.delegateTarget&&"A"===t.delegateTarget.tagName)&&t.preventDefault();t=H(this);p.find(t).forEach(function(t){sr.getOrCreateInstance(t,{toggle:!1}).toggle()})}),e(sr),sr);function ur(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var lr=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",fr=".sticky-top",dr=function(){function t(){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function");this._element=document.body}var e,n,r;return e=t,(n=[{key:"getWidth",value:function(){var t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}},{key:"hide",value:function(){var e=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,"paddingRight",function(t){return t+e}),this._setElementAttributes(lr,"paddingRight",function(t){return t+e}),this._setElementAttributes(fr,"marginRight",function(t){return t-e})}},{key:"_disableOverFlow",value:function(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}},{key:"_setElementAttributes",value:function(t,n,r){var o=this,i=this.getWidth();this._applyManipulationCallback(t,function(t){var e;t!==o._element&&window.innerWidth>t.clientWidth+i||(o._saveInitialAttribute(t,n),e=window.getComputedStyle(t)[n],t.style[n]="".concat(r(Number.parseFloat(e)),"px"))})}},{key:"reset",value:function(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,"paddingRight"),this._resetElementAttributes(lr,"paddingRight"),this._resetElementAttributes(fr,"marginRight")}},{key:"_saveInitialAttribute",value:function(t,e){var n=t.style[e];n&&f.setDataAttribute(t,e,n)}},{key:"_resetElementAttributes",value:function(t,n){this._applyManipulationCallback(t,function(t){var e=f.getDataAttribute(t,n);void 0===e?t.style.removeProperty(n):(f.removeDataAttribute(t,n),t.style[n]=e)})}},{key:"_applyManipulationCallback",value:function(t,e){nt(t)?e(t):p.find(t,this._element).forEach(e)}},{key:"isOverflowing",value:function(){return 0<this.getWidth()}}])&&ur(e.prototype,n),r&&ur(e,r),Object.defineProperty(e,"prototype",{writable:!1}),t}();function pr(t){return(pr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function hr(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function vr(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?hr(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):hr(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function yr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var mr={className:"modal-backdrop",isVisible:!0,isAnimated:!1,rootElement:"body",clickCallback:null},gr={className:"string",isVisible:"boolean",isAnimated:"boolean",rootElement:"(element|string)",clickCallback:"(function|null)"},br="backdrop",_r="mousedown.bs.".concat(br),wr=function(){function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function");this._config=this._getConfig(t),this._isAppended=!1,this._element=null}var t,n,r;return t=e,(n=[{key:"show",value:function(t){this._config.isVisible?(this._append(),this._config.isAnimated&&$(this._getElement()),this._getElement().classList.add("show"),this._emulateAnimation(function(){G(t)})):G(t)}},{key:"hide",value:function(t){var e=this;this._config.isVisible?(this._getElement().classList.remove("show"),this._emulateAnimation(function(){e.dispose(),G(t)})):G(t)}},{key:"_getElement",value:function(){var t;return this._element||((t=document.createElement("div")).className=this._config.className,this._config.isAnimated&&t.classList.add("fade"),this._element=t),this._element}},{key:"_getConfig",value:function(t){return(t=vr(vr({},mr),"object"===pr(t)?t:{})).rootElement=Y(t.rootElement),W(br,t,gr),t}},{key:"_append",value:function(){var t=this;this._isAppended||(this._config.rootElement.append(this._getElement()),d.on(this._getElement(),_r,function(){G(t._config.clickCallback)}),this._isAppended=!0)}},{key:"dispose",value:function(){this._isAppended&&(d.off(this._element,_r),this._element.remove(),this._isAppended=!1)}},{key:"_emulateAnimation",value:function(t){Q(t,this._getElement(),this._config.isAnimated)}}])&&yr(t.prototype,n),r&&yr(t,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function Or(t){return(Or="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function kr(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Cr(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?kr(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):kr(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Sr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function xr(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"hide",t="click.dismiss".concat(e.EVENT_KEY),r=e.NAME;d.on(document,t,'[data-bs-dismiss="'.concat(r,'"]'),function(t){["A","AREA"].includes(this.tagName)&&t.preventDefault(),U(this)||(t=F(this)||this.closest(".".concat(r)),e.getOrCreateInstance(t)[n]())})}var Er={trapElement:null,autofocus:!0},jr={trapElement:"element",autofocus:"boolean"},Tr=".".concat("bs.focustrap"),Ar="focusin".concat(Tr),Dr="keydown.tab".concat(Tr),Pr="backward",Mr=function(){function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function");this._config=this._getConfig(t),this._isActive=!1,this._lastTabNavDirection=null}var t,n,r;return t=e,(n=[{key:"activate",value:function(){var e=this,t=this._config,n=t.trapElement,t=t.autofocus;this._isActive||(t&&n.focus(),d.off(document,Tr),d.on(document,Ar,function(t){return e._handleFocusin(t)}),d.on(document,Dr,function(t){return e._handleKeydown(t)}),this._isActive=!0)}},{key:"deactivate",value:function(){this._isActive&&(this._isActive=!1,d.off(document,Tr))}},{key:"_handleFocusin",value:function(t){var t=t.target,e=this._config.trapElement;t===document||t===e||e.contains(t)||(0===(t=p.focusableChildren(e)).length?e:this._lastTabNavDirection===Pr?t[t.length-1]:t[0]).focus()}},{key:"_handleKeydown",value:function(t){"Tab"===t.key&&(this._lastTabNavDirection=t.shiftKey?Pr:"forward")}},{key:"_getConfig",value:function(t){return t=Cr(Cr({},Er),"object"===Or(t)?t:{}),W("focustrap",t,jr),t}}])&&Sr(t.prototype,n),r&&Sr(t,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function Ir(t){return(Ir="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Lr(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Nr(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Lr(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Lr(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Rr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Br(){return(Br="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=Vr(t)););return t}(t,e);if(r)return r=Object.getOwnPropertyDescriptor(r,e),r.get?r.get.call(arguments.length<3?t:n):r.value}).apply(this,arguments)}function Hr(t,e){return(Hr=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Fr(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Vr(n),e=(t=r?(t=Vr(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===Ir(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Vr(t){return(Vr=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var Yr="offcanvas",r=".".concat("bs.offcanvas"),n=".data-api",o="load".concat(r).concat(n),Wr={backdrop:!0,keyboard:!0,scroll:!1},zr={backdrop:"boolean",keyboard:"boolean",scroll:"boolean"},Ur=".offcanvas.show",qr="show".concat(r),Kr="shown".concat(r),$r="hide".concat(r),Xr="hidden".concat(r),n="click".concat(r).concat(n),Gr="keydown.dismiss".concat(r),Qr=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Hr(t,e);var n,r=Fr(o);function o(t,e){if(this instanceof o)return(t=r.call(this,t))._config=t._getConfig(e),t._isShown=!1,t._backdrop=t._initializeBackDrop(),t._focustrap=t._initializeFocusTrap(),t._addEventListeners(),t;throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"NAME",get:function(){return Yr}},{key:"Default",get:function(){return Wr}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e]||e.startsWith("_")||"constructor"===e)throw new TypeError('No method named "'.concat(e,'"'));t[e](this)}})}}],(n=[{key:"toggle",value:function(t){return this._isShown?this.hide():this.show(t)}},{key:"show",value:function(t){var e=this;this._isShown||d.trigger(this._element,qr,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._element.style.visibility="visible",this._backdrop.show(),this._config.scroll||(new dr).hide(),this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add("show"),this._queueCallback(function(){e._config.scroll||e._focustrap.activate(),d.trigger(e._element,Kr,{relatedTarget:t})},this._element,!0))}},{key:"hide",value:function(){var t=this;this._isShown&&!d.trigger(this._element,$r).defaultPrevented&&(this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.remove("show"),this._backdrop.hide(),this._queueCallback(function(){t._element.setAttribute("aria-hidden",!0),t._element.removeAttribute("aria-modal"),t._element.removeAttribute("role"),t._element.style.visibility="hidden",t._config.scroll||(new dr).reset(),d.trigger(t._element,Xr)},this._element,!0))}},{key:"dispose",value:function(){this._backdrop.dispose(),this._focustrap.deactivate(),Br(Vr(o.prototype),"dispose",this).call(this)}},{key:"_getConfig",value:function(t){return t=Nr(Nr(Nr({},Wr),f.getDataAttributes(this._element)),"object"===Ir(t)?t:{}),W(Yr,t,zr),t}},{key:"_initializeBackDrop",value:function(){var t=this;return new wr({className:"offcanvas-backdrop",isVisible:this._config.backdrop,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:function(){return t.hide()}})}},{key:"_initializeFocusTrap",value:function(){return new Mr({trapElement:this._element})}},{key:"_addEventListeners",value:function(){var e=this;d.on(this._element,Gr,function(t){e._config.keyboard&&"Escape"===t.key&&e.hide()})}}])&&Rr(t.prototype,n),e&&Rr(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),r=(d.on(document,n,'[data-bs-toggle="offcanvas"]',function(t){var e=this,n=F(this);["A","AREA"].includes(this.tagName)&&t.preventDefault(),U(this)||(d.one(n,Xr,function(){z(e)&&e.focus()}),(t=p.findOne(Ur))&&t!==n&&Qr.getInstance(t).hide(),Qr.getOrCreateInstance(n).toggle(this))}),d.on(window,o,function(){return p.find(Ur).forEach(function(t){return Qr.getOrCreateInstance(t).show()})}),xr(Qr),e(Qr),Qr);function Zr(t){return(Zr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Jr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function to(t,e){return(to=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function eo(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=no(n),e=(t=r?(t=no(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===Zr(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function no(t){return(no=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var n=".".concat("bs.alert"),ro="close".concat(n),oo="closed".concat(n),o=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&to(t,e);var n,r=eo(o);function o(){var t=this,e=o;if(t instanceof e)return r.apply(this,arguments);throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"NAME",get:function(){return"alert"}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this);if("string"==typeof e){if(void 0===t[e]||e.startsWith("_")||"constructor"===e)throw new TypeError('No method named "'.concat(e,'"'));t[e](this)}})}}],(n=[{key:"close",value:function(){var t,e=this;d.trigger(this._element,ro).defaultPrevented||(this._element.classList.remove("show"),t=this._element.classList.contains("fade"),this._queueCallback(function(){return e._destroyElement()},this._element,t))}},{key:"_destroyElement",value:function(){this._element.remove(),d.trigger(this._element,oo),this.dispose()}}])&&Jr(t.prototype,n),e&&Jr(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),n=(xr(o,"close"),e(o),o);function io(t){return(io="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ao(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function co(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ao(Object(n),!0).forEach(function(t){po(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ao(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function so(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function uo(t,e){return(uo=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function lo(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=fo(n),e=(t=r?(t=fo(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===io(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function fo(t){return(fo=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function po(t,e,n){e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n}var ho="carousel",o=".".concat("bs.carousel"),vo=".data-api",yo={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},mo={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},go="next",bo="prev",_o="left",wo="right",Oo=(po(Io={},"ArrowLeft",wo),po(Io,"ArrowRight",_o),Io),ko="slide".concat(o),Co="slid".concat(o),So="keydown".concat(o),xo="mouseenter".concat(o),Eo="mouseleave".concat(o),jo="touchstart".concat(o),To="touchmove".concat(o),Ao="touchend".concat(o),Do="pointerdown".concat(o),Po="pointerup".concat(o),Mo="dragstart".concat(o),Io="load".concat(o).concat(vo),o="click".concat(o).concat(vo),Lo="active",No=".active.carousel-item",Ro=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&uo(t,e);var n,r=lo(o);function o(t,e){if(this instanceof o)return(t=r.call(this,t))._items=null,t._interval=null,t._activeElement=null,t._isPaused=!1,t._isSliding=!1,t.touchTimeout=null,t.touchStartX=0,t.touchDeltaX=0,t._config=t._getConfig(e),t._indicatorsElement=p.findOne(".carousel-indicators",t._element),t._touchSupported="ontouchstart"in document.documentElement||0<navigator.maxTouchPoints,t._pointerEvent=Boolean(window.PointerEvent),t._addEventListeners(),t;throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"Default",get:function(){return yo}},{key:"NAME",get:function(){return ho}},{key:"carouselInterface",value:function(t,e){var t=o.getOrCreateInstance(t,e),n=t._config,r=("object"===io(e)&&(n=co(co({},n),e)),"string"==typeof e?e:n.slide);if("number"==typeof e)t.to(e);else if("string"==typeof r){if(void 0===t[r])throw new TypeError('No method named "'.concat(r,'"'));t[r]()}else n.interval&&n.ride&&(t.pause(),t.cycle())}},{key:"jQueryInterface",value:function(t){return this.each(function(){o.carouselInterface(this,t)})}},{key:"dataApiClickHandler",value:function(t){var e,n,r=F(this);r&&r.classList.contains("carousel")&&(e=co(co({},f.getDataAttributes(r)),f.getDataAttributes(this)),(n=this.getAttribute("data-bs-slide-to"))&&(e.interval=!1),o.carouselInterface(r,e),n&&o.getInstance(r).to(n),t.preventDefault())}}],(n=[{key:"next",value:function(){this._slide(go)}},{key:"nextWhenVisible",value:function(){!document.hidden&&z(this._element)&&this.next()}},{key:"prev",value:function(){this._slide(bo)}},{key:"pause",value:function(t){t||(this._isPaused=!0),p.findOne(".carousel-item-next, .carousel-item-prev",this._element)&&(V(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null}},{key:"cycle",value:function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config&&this._config.interval&&!this._isPaused&&(this._updateInterval(),this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))}},{key:"to",value:function(t){var e=this,n=(this._activeElement=p.findOne(No,this._element),this._getItemIndex(this._activeElement));if(!(t>this._items.length-1||t<0))if(this._isSliding)d.one(this._element,Co,function(){return e.to(t)});else{if(n===t)return this.pause(),void this.cycle();this._slide(n<t?go:bo,this._items[t])}}},{key:"_getConfig",value:function(t){return t=co(co(co({},yo),f.getDataAttributes(this._element)),"object"===io(t)?t:{}),W(ho,t,mo),t}},{key:"_handleSwipe",value:function(){var t=Math.abs(this.touchDeltaX);t<=40||(t=t/this.touchDeltaX,this.touchDeltaX=0,t&&this._slide(0<t?wo:_o))}},{key:"_addEventListeners",value:function(){var e=this;this._config.keyboard&&d.on(this._element,So,function(t){return e._keydown(t)}),"hover"===this._config.pause&&(d.on(this._element,xo,function(t){return e.pause(t)}),d.on(this._element,Eo,function(t){return e.cycle(t)})),this._config.touch&&this._touchSupported&&this._addTouchEventListeners()}},{key:"_addTouchEventListeners",value:function(){function t(t){r(t)?n.touchStartX=t.clientX:n._pointerEvent||(n.touchStartX=t.touches[0].clientX)}function e(t){r(t)&&(n.touchDeltaX=t.clientX-n.touchStartX),n._handleSwipe(),"hover"===n._config.pause&&(n.pause(),n.touchTimeout&&clearTimeout(n.touchTimeout),n.touchTimeout=setTimeout(function(t){return n.cycle(t)},500+n._config.interval))}var n=this,r=function(t){return n._pointerEvent&&("pen"===t.pointerType||"touch"===t.pointerType)};p.find(".carousel-item img",this._element).forEach(function(t){d.on(t,Mo,function(t){return t.preventDefault()})}),this._pointerEvent?(d.on(this._element,Do,t),d.on(this._element,Po,e),this._element.classList.add("pointer-event")):(d.on(this._element,jo,t),d.on(this._element,To,function(t){t=t,n.touchDeltaX=t.touches&&1<t.touches.length?0:t.touches[0].clientX-n.touchStartX}),d.on(this._element,Ao,e))}},{key:"_keydown",value:function(t){var e;/input|textarea/i.test(t.target.tagName)||(e=Oo[t.key])&&(t.preventDefault(),this._slide(e))}},{key:"_getItemIndex",value:function(t){return this._items=t&&t.parentNode?p.find(".carousel-item",t.parentNode):[],this._items.indexOf(t)}},{key:"_getItemByOrder",value:function(t,e){return Z(this._items,e,t===go,this._config.wrap)}},{key:"_triggerSlideEvent",value:function(t,e){var n=this._getItemIndex(t),r=this._getItemIndex(p.findOne(No,this._element));return d.trigger(this._element,ko,{relatedTarget:t,direction:e,from:r,to:n})}},{key:"_setActiveIndicatorElement",value:function(t){if(this._indicatorsElement)for(var e=p.findOne(".active",this._indicatorsElement),n=(e.classList.remove(Lo),e.removeAttribute("aria-current"),p.find("[data-bs-target]",this._indicatorsElement)),r=0;r<n.length;r++)if(Number.parseInt(n[r].getAttribute("data-bs-slide-to"),10)===this._getItemIndex(t)){n[r].classList.add(Lo),n[r].setAttribute("aria-current","true");break}}},{key:"_updateInterval",value:function(){var t=this._activeElement||p.findOne(No,this._element);t&&((t=Number.parseInt(t.getAttribute("data-bs-interval"),10))?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=t):this._config.interval=this._config.defaultInterval||this._config.interval)}},{key:"_slide",value:function(t,e){var n,r=this,t=this._directionToOrder(t),o=p.findOne(No,this._element),i=this._getItemIndex(o),a=e||this._getItemByOrder(t,o),c=this._getItemIndex(a),e=Boolean(this._interval),s=t===go,u=s?"carousel-item-start":"carousel-item-end",l=s?"carousel-item-next":"carousel-item-prev",f=this._orderToDirection(t);a&&a.classList.contains(Lo)?this._isSliding=!1:this._isSliding||this._triggerSlideEvent(a,f).defaultPrevented||o&&a&&(this._isSliding=!0,e&&this.pause(),this._setActiveIndicatorElement(a),this._activeElement=a,n=function(){d.trigger(r._element,Co,{relatedTarget:a,direction:f,from:i,to:c})},this._element.classList.contains("slide")?(a.classList.add(l),$(a),o.classList.add(u),a.classList.add(u),this._queueCallback(function(){a.classList.remove(u,l),a.classList.add(Lo),o.classList.remove(Lo,l,u),r._isSliding=!1,setTimeout(n,0)},o,!0)):(o.classList.remove(Lo),a.classList.add(Lo),this._isSliding=!1,n()),e&&this.cycle())}},{key:"_directionToOrder",value:function(t){return[wo,_o].includes(t)?a()?t===_o?bo:go:t===_o?go:bo:t}},{key:"_orderToDirection",value:function(t){return[go,bo].includes(t)?a()?t===bo?_o:wo:t===bo?wo:_o:t}}])&&so(t.prototype,n),e&&so(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),vo=(d.on(document,o,"[data-bs-slide], [data-bs-slide-to]",Ro.dataApiClickHandler),d.on(window,Io,function(){for(var t=p.find('[data-bs-ride="carousel"]'),e=0,n=t.length;e<n;e++)Ro.carouselInterface(t[e],Ro.getInstance(t[e]))}),e(Ro),Ro);function Bo(t){return(Bo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Ho(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Fo(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Ho(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Ho(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Vo(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Yo(){return(Yo="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=Uo(t)););return t}(t,e);if(r)return r=Object.getOwnPropertyDescriptor(r,e),r.get?r.get.call(arguments.length<3?t:n):r.value}).apply(this,arguments)}function Wo(t,e){return(Wo=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function zo(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Uo(n),e=(t=r?(t=Uo(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===Bo(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Uo(t){return(Uo=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=".".concat("bs.modal"),qo={backdrop:!0,keyboard:!0,focus:!0},Ko={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean"},$o="hide".concat(u),Xo="hidePrevented".concat(u),Go="hidden".concat(u),Qo="show".concat(u),Zo="shown".concat(u),Jo="resize".concat(u),ti="click.dismiss".concat(u),ei="keydown.dismiss".concat(u),ni="mouseup.dismiss".concat(u),ri="mousedown.dismiss".concat(u),o="click".concat(u).concat(".data-api"),oi="modal-open",ii="modal-static",ai=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Wo(t,e);var n,r=zo(o);function o(t,e){if(this instanceof o)return(t=r.call(this,t))._config=t._getConfig(e),t._dialog=p.findOne(".modal-dialog",t._element),t._backdrop=t._initializeBackDrop(),t._focustrap=t._initializeFocusTrap(),t._isShown=!1,t._ignoreBackdropClick=!1,t._isTransitioning=!1,t._scrollBar=new dr,t;throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"Default",get:function(){return qo}},{key:"NAME",get:function(){return"modal"}},{key:"jQueryInterface",value:function(e,n){return this.each(function(){var t=o.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e](n)}})}}],(n=[{key:"toggle",value:function(t){return this._isShown?this.hide():this.show(t)}},{key:"show",value:function(t){var e=this;this._isShown||this._isTransitioning||d.trigger(this._element,Qo,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._isAnimated()&&(this._isTransitioning=!0),this._scrollBar.hide(),document.body.classList.add(oi),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),d.on(this._dialog,ri,function(){d.one(e._element,ni,function(t){t.target===e._element&&(e._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return e._showElement(t)}))}},{key:"hide",value:function(){var t,e=this;!this._isShown||this._isTransitioning||d.trigger(this._element,$o).defaultPrevented||(this._isShown=!1,(t=this._isAnimated())&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),this._focustrap.deactivate(),this._element.classList.remove("show"),d.off(this._element,ti),d.off(this._dialog,ri),this._queueCallback(function(){return e._hideModal()},this._element,t))}},{key:"dispose",value:function(){[window,this._dialog].forEach(function(t){return d.off(t,u)}),this._backdrop.dispose(),this._focustrap.deactivate(),Yo(Uo(o.prototype),"dispose",this).call(this)}},{key:"handleUpdate",value:function(){this._adjustDialog()}},{key:"_initializeBackDrop",value:function(){return new wr({isVisible:Boolean(this._config.backdrop),isAnimated:this._isAnimated()})}},{key:"_initializeFocusTrap",value:function(){return new Mr({trapElement:this._element})}},{key:"_getConfig",value:function(t){return t=Fo(Fo(Fo({},qo),f.getDataAttributes(this._element)),"object"===Bo(t)?t:{}),W("modal",t,Ko),t}},{key:"_showElement",value:function(t){var e=this,n=this._isAnimated(),r=p.findOne(".modal-body",this._dialog);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0,r&&(r.scrollTop=0),n&&$(this._element),this._element.classList.add("show");this._queueCallback(function(){e._config.focus&&e._focustrap.activate(),e._isTransitioning=!1,d.trigger(e._element,Zo,{relatedTarget:t})},this._dialog,n)}},{key:"_setEscapeEvent",value:function(){var e=this;this._isShown?d.on(this._element,ei,function(t){e._config.keyboard&&"Escape"===t.key?(t.preventDefault(),e.hide()):e._config.keyboard||"Escape"!==t.key||e._triggerBackdropTransition()}):d.off(this._element,ei)}},{key:"_setResizeEvent",value:function(){var t=this;this._isShown?d.on(window,Jo,function(){return t._adjustDialog()}):d.off(window,Jo)}},{key:"_hideModal",value:function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide(function(){document.body.classList.remove(oi),t._resetAdjustments(),t._scrollBar.reset(),d.trigger(t._element,Go)})}},{key:"_showBackdrop",value:function(t){var e=this;d.on(this._element,ti,function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&(!0===e._config.backdrop?e.hide():"static"===e._config.backdrop&&e._triggerBackdropTransition())}),this._backdrop.show(t)}},{key:"_isAnimated",value:function(){return this._element.classList.contains("fade")}},{key:"_triggerBackdropTransition",value:function(){var t,e,n,r,o,i=this;d.trigger(this._element,Xo).defaultPrevented||(t=this._element,e=t.classList,n=t.scrollHeight,r=t.style,!(o=n>document.documentElement.clientHeight)&&"hidden"===r.overflowY||e.contains(ii)||(o||(r.overflowY="hidden"),e.add(ii),this._queueCallback(function(){e.remove(ii),o||i._queueCallback(function(){r.overflowY=""},i._dialog)},this._dialog),this._element.focus()))}},{key:"_adjustDialog",value:function(){var t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._scrollBar.getWidth(),n=0<e;(!n&&t&&!a()||n&&!t&&a())&&(this._element.style.paddingLeft="".concat(e,"px")),(n&&!t&&!a()||!n&&t&&a())&&(this._element.style.paddingRight="".concat(e,"px"))}},{key:"_resetAdjustments",value:function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}}])&&Vo(t.prototype,n),e&&Vo(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),Io=(d.on(document,o,'[data-bs-toggle="modal"]',function(t){var e=this,n=F(this),t=(["A","AREA"].includes(this.tagName)&&t.preventDefault(),d.one(n,Qo,function(t){t.defaultPrevented||d.one(n,Go,function(){z(e)&&e.focus()})}),p.findOne(".modal.show"));t&&ai.getInstance(t).hide(),ai.getOrCreateInstance(n).toggle(this)}),xr(ai),e(ai),ai);function ci(t){return function(t){if(Array.isArray(t))return si(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return si(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?si(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function si(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var ui=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),li=/^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i,fi=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,o={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]};function di(t,i,e){if(!t.length)return t;if(e&&"function"==typeof e)return e(t);for(var e=(new window.DOMParser).parseFromString(t,"text/html"),a=(t=[]).concat.apply(t,ci(e.body.querySelectorAll("*"))),n=function(t,e){var n=a[t],t=n.nodeName.toLowerCase();if(!Object.keys(i).includes(t))return n.remove(),"continue";var r=(r=[]).concat.apply(r,ci(n.attributes)),o=[].concat(i["*"]||[],i[t]||[]);r.forEach(function(t){!function(t,e){var n=t.nodeName.toLowerCase();if(e.includes(n))return!ui.has(n)||Boolean(li.test(t.nodeValue)||fi.test(t.nodeValue));for(var r=e.filter(function(t){return t instanceof RegExp}),o=0,i=r.length;o<i;o++)if(r[o].test(n))return!0;return!1}(t,o)&&n.removeAttribute(t.nodeName)})},r=0,o=a.length;r<o;r++)n(r);return e.body.innerHTML}function pi(t){return(pi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function hi(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function vi(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?hi(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):hi(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function yi(t){return function(t){if(Array.isArray(t))return mi(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return mi(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?mi(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function mi(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function gi(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function bi(){return(bi="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=Oi(t)););return t}(t,e);if(r)return r=Object.getOwnPropertyDescriptor(r,e),r.get?r.get.call(arguments.length<3?t:n):r.value}).apply(this,arguments)}function _i(t,e){return(_i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function wi(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Oi(n),e=(t=r?(t=Oi(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===pi(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Oi(t){return(Oi=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var ki="tooltip",l=".".concat("bs.tooltip"),Ci=new Set(["sanitize","allowList","sanitizeFn"]),Si={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(array|string|function)",container:"(string|element|boolean)",fallbackPlacements:"array",boundary:"(string|element)",customClass:"(string|function)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object|function)"},xi={AUTO:"auto",TOP:"top",RIGHT:a()?"left":"right",BOTTOM:"bottom",LEFT:a()?"right":"left"},Ei={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:[0,0],container:!1,fallbackPlacements:["top","right","bottom","left"],boundary:"clippingParents",customClass:"",sanitize:!0,sanitizeFn:null,allowList:o,popperConfig:null},ji={HIDE:"hide".concat(l),HIDDEN:"hidden".concat(l),SHOW:"show".concat(l),SHOWN:"shown".concat(l),INSERTED:"inserted".concat(l),CLICK:"click".concat(l),FOCUSIN:"focusin".concat(l),FOCUSOUT:"focusout".concat(l),MOUSEENTER:"mouseenter".concat(l),MOUSELEAVE:"mouseleave".concat(l)},Ti="fade",Ai="show",Di="show",Pi=".tooltip-inner",Mi=".".concat("modal"),Ii="hide.bs.modal",Li="hover",Ni="focus",o=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_i(t,e);var n,r=wi(o);function o(t,e){if(!(this instanceof o))throw new TypeError("Cannot call a class as a function");if(void 0===i)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");return(t=r.call(this,t))._isEnabled=!0,t._timeout=0,t._hoverState="",t._activeTrigger={},t._popper=null,t._config=t._getConfig(e),t.tip=null,t._setListeners(),t}return t=o,e=[{key:"Default",get:function(){return Ei}},{key:"NAME",get:function(){return ki}},{key:"Event",get:function(){return ji}},{key:"DefaultType",get:function(){return Si}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e]()}})}}],(n=[{key:"enable",value:function(){this._isEnabled=!0}},{key:"disable",value:function(){this._isEnabled=!1}},{key:"toggleEnabled",value:function(){this._isEnabled=!this._isEnabled}},{key:"toggle",value:function(t){this._isEnabled&&(t?((t=this._initializeOnDelegatedTarget(t))._activeTrigger.click=!t._activeTrigger.click,t._isWithActiveTrigger()?t._enter(null,t):t._leave(null,t)):this.getTipElement().classList.contains(Ai)?this._leave(null,this):this._enter(null,this))}},{key:"dispose",value:function(){clearTimeout(this._timeout),d.off(this._element.closest(Mi),Ii,this._hideModalHandler),this.tip&&this.tip.remove(),this._disposePopper(),bi(Oi(o.prototype),"dispose",this).call(this)}},{key:"show",value:function(){var t,e,n,r=this;if("none"===this._element.style.display)throw new Error("Please use show on visible elements");this.isWithContent()&&this._isEnabled&&(e=d.trigger(this._element,this.constructor.Event.SHOW),n=(null===(n=q(this._element))?this._element.ownerDocument.documentElement:n).contains(this._element),!e.defaultPrevented&&n&&("tooltip"===this.constructor.NAME&&this.tip&&this.getTitle()!==this.tip.querySelector(Pi).innerHTML&&(this._disposePopper(),this.tip.remove(),this.tip=null),e=this.getTipElement(),n=function(t){for(;t+=Math.floor(1e6*Math.random()),document.getElementById(t););return t}(this.constructor.NAME),e.setAttribute("id",n),this._element.setAttribute("aria-describedby",n),this._config.animation&&e.classList.add(Ti),n="function"==typeof this._config.placement?this._config.placement.call(this,e,this._element):this._config.placement,n=this._getAttachment(n),this._addAttachmentClass(n),t=this._config.container,kt(e,this.constructor.DATA_KEY,this),this._element.ownerDocument.documentElement.contains(this.tip)||(t.append(e),d.trigger(this._element,this.constructor.Event.INSERTED)),this._popper?this._popper.update():this._popper=en(this._element,e,this._getPopperConfig(n)),e.classList.add(Ai),(t=this._resolvePossibleFunction(this._config.customClass))&&(n=e.classList).add.apply(n,yi(t.split(" "))),"ontouchstart"in document.documentElement&&(e=[]).concat.apply(e,yi(document.body.children)).forEach(function(t){d.on(t,"mouseover",K)}),n=this.tip.classList.contains(Ti),this._queueCallback(function(){var t=r._hoverState;r._hoverState=null,d.trigger(r._element,r.constructor.Event.SHOWN),"out"===t&&r._leave(null,r)},this.tip,n)))}},{key:"hide",value:function(){var t,e,n=this;this._popper&&(t=this.getTipElement(),d.trigger(this._element,this.constructor.Event.HIDE).defaultPrevented||(t.classList.remove(Ai),"ontouchstart"in document.documentElement&&(e=[]).concat.apply(e,yi(document.body.children)).forEach(function(t){return d.off(t,"mouseover",K)}),this._activeTrigger.click=!1,this._activeTrigger[Ni]=!1,this._activeTrigger[Li]=!1,e=this.tip.classList.contains(Ti),this._queueCallback(function(){n._isWithActiveTrigger()||(n._hoverState!==Di&&t.remove(),n._cleanTipClass(),n._element.removeAttribute("aria-describedby"),d.trigger(n._element,n.constructor.Event.HIDDEN),n._disposePopper())},this.tip,e),this._hoverState=""))}},{key:"update",value:function(){null!==this._popper&&this._popper.update()}},{key:"isWithContent",value:function(){return Boolean(this.getTitle())}},{key:"getTipElement",value:function(){if(this.tip)return this.tip;var t=document.createElement("div"),t=(t.innerHTML=this._config.template,t.children[0]);return this.setContent(t),t.classList.remove(Ti,Ai),this.tip=t,this.tip}},{key:"setContent",value:function(t){this._sanitizeAndSetContent(t,this.getTitle(),Pi)}},{key:"_sanitizeAndSetContent",value:function(t,e,n){n=p.findOne(n,t);!e&&n?n.remove():this.setElementContent(n,e)}},{key:"setElementContent",value:function(t,e){if(null!==t)return nt(e)?(e=Y(e),void(this._config.html?e.parentNode!==t&&(t.innerHTML="",t.append(e)):t.textContent=e.textContent)):void(this._config.html?(this._config.sanitize&&(e=di(e,this._config.allowList,this._config.sanitizeFn)),t.innerHTML=e):t.textContent=e)}},{key:"getTitle",value:function(){var t=this._element.getAttribute("data-bs-original-title")||this._config.title;return this._resolvePossibleFunction(t)}},{key:"updateAttachment",value:function(t){return"right"===t?"end":"left"===t?"start":t}},{key:"_initializeOnDelegatedTarget",value:function(t,e){return e||this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}},{key:"_getOffset",value:function(){var e=this,n=this._config.offset;return"string"==typeof n?n.split(",").map(function(t){return Number.parseInt(t,10)}):"function"==typeof n?function(t){return n(t,e._element)}:n}},{key:"_resolvePossibleFunction",value:function(t){return"function"==typeof t?t.call(this._element):t}},{key:"_getPopperConfig",value:function(t){var e=this,t={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:".".concat(this.constructor.NAME,"-arrow")}},{name:"onChange",enabled:!0,phase:"afterWrite",fn:function(t){return e._handlePopperPlacementChange(t)}}],onFirstUpdate:function(t){t.options.placement!==t.placement&&e._handlePopperPlacementChange(t)}};return vi(vi({},t),"function"==typeof this._config.popperConfig?this._config.popperConfig(t):this._config.popperConfig)}},{key:"_addAttachmentClass",value:function(t){this.getTipElement().classList.add("".concat(this._getBasicClassPrefix(),"-").concat(this.updateAttachment(t)))}},{key:"_getAttachment",value:function(t){return xi[t.toUpperCase()]}},{key:"_setListeners",value:function(){var n=this;this._config.trigger.split(" ").forEach(function(t){var e;"click"===t?d.on(n._element,n.constructor.Event.CLICK,n._config.selector,function(t){return n.toggle(t)}):"manual"!==t&&(e=t===Li?n.constructor.Event.MOUSEENTER:n.constructor.Event.FOCUSIN,t=t===Li?n.constructor.Event.MOUSELEAVE:n.constructor.Event.FOCUSOUT,d.on(n._element,e,n._config.selector,function(t){return n._enter(t)}),d.on(n._element,t,n._config.selector,function(t){return n._leave(t)}))}),this._hideModalHandler=function(){n._element&&n.hide()},d.on(this._element.closest(Mi),Ii,this._hideModalHandler),this._config.selector?this._config=vi(vi({},this._config),{},{trigger:"manual",selector:""}):this._fixTitle()}},{key:"_fixTitle",value:function(){var t=this._element.getAttribute("title"),e=pi(this._element.getAttribute("data-bs-original-title"));!t&&"string"===e||(this._element.setAttribute("data-bs-original-title",t||""),!t||this._element.getAttribute("aria-label")||this._element.textContent||this._element.setAttribute("aria-label",t),this._element.setAttribute("title",""))}},{key:"_enter",value:function(t,e){e=this._initializeOnDelegatedTarget(t,e),t&&(e._activeTrigger["focusin"===t.type?Ni:Li]=!0),e.getTipElement().classList.contains(Ai)||e._hoverState===Di?e._hoverState=Di:(clearTimeout(e._timeout),e._hoverState=Di,e._config.delay&&e._config.delay.show?e._timeout=setTimeout(function(){e._hoverState===Di&&e.show()},e._config.delay.show):e.show())}},{key:"_leave",value:function(t,e){e=this._initializeOnDelegatedTarget(t,e),t&&(e._activeTrigger["focusout"===t.type?Ni:Li]=e._element.contains(t.relatedTarget)),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState="out",e._config.delay&&e._config.delay.hide?e._timeout=setTimeout(function(){"out"===e._hoverState&&e.hide()},e._config.delay.hide):e.hide())}},{key:"_isWithActiveTrigger",value:function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1}},{key:"_getConfig",value:function(t){var e=f.getDataAttributes(this._element);return Object.keys(e).forEach(function(t){Ci.has(t)&&delete e[t]}),(t=vi(vi(vi({},this.constructor.Default),e),"object"===pi(t)&&t?t:{})).container=!1===t.container?document.body:Y(t.container),"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),W(ki,t,this.constructor.DefaultType),t.sanitize&&(t.template=di(t.template,t.allowList,t.sanitizeFn)),t}},{key:"_getDelegateConfig",value:function(){var t,e={};for(t in this._config)this.constructor.Default[t]!==this._config[t]&&(e[t]=this._config[t]);return e}},{key:"_cleanTipClass",value:function(){var e=this.getTipElement(),t=new RegExp("(^|\\s)".concat(this._getBasicClassPrefix(),"\\S+"),"g"),t=e.getAttribute("class").match(t);null!==t&&0<t.length&&t.map(function(t){return t.trim()}).forEach(function(t){return e.classList.remove(t)})}},{key:"_getBasicClassPrefix",value:function(){return"bs-tooltip"}},{key:"_handlePopperPlacementChange",value:function(t){t=t.state;t&&(this.tip=t.elements.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(t.placement)))}},{key:"_disposePopper",value:function(){this._popper&&(this._popper.destroy(),this._popper=null)}}])&&gi(t.prototype,n),e&&gi(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),Ri=(e(o),o);function Bi(t){return(Bi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Hi(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Fi(t,e){return(Fi=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Vi(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Yi(n),e=(t=r?(t=Yi(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===Bi(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Yi(t){return(Yi=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Wi(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function zi(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Wi(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Wi(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}var l=".".concat("bs.popover"),Ui=zi(zi({},Ri.Default),{},{placement:"right",offset:[0,8],trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),qi=zi(zi({},Ri.DefaultType),{},{content:"(string|element|function)"}),Ki={HIDE:"hide".concat(l),HIDDEN:"hidden".concat(l),SHOW:"show".concat(l),SHOWN:"shown".concat(l),INSERTED:"inserted".concat(l),CLICK:"click".concat(l),FOCUSIN:"focusin".concat(l),FOCUSOUT:"focusout".concat(l),MOUSEENTER:"mouseenter".concat(l),MOUSELEAVE:"mouseleave".concat(l)},o=function(){var t=o,e=Ri;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Fi(t,e);var n,r=Vi(o);function o(){var t=this,e=o;if(t instanceof e)return r.apply(this,arguments);throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"Default",get:function(){return Ui}},{key:"NAME",get:function(){return"popover"}},{key:"Event",get:function(){return Ki}},{key:"DefaultType",get:function(){return qi}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e]()}})}}],(n=[{key:"isWithContent",value:function(){return this.getTitle()||this._getContent()}},{key:"setContent",value:function(t){this._sanitizeAndSetContent(t,this.getTitle(),".popover-header"),this._sanitizeAndSetContent(t,this._getContent(),".popover-body")}},{key:"_getContent",value:function(){return this._resolvePossibleFunction(this._config.content)}},{key:"_getBasicClassPrefix",value:function(){return"bs-popover"}}])&&Hi(t.prototype,n),e&&Hi(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),l=(e(o),o);t(180);function $i(t){return($i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Xi(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Gi(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Xi(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Xi(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Qi(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Zi(){return(Zi="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=ea(t)););return t}(t,e);if(r)return r=Object.getOwnPropertyDescriptor(r,e),r.get?r.get.call(arguments.length<3?t:n):r.value}).apply(this,arguments)}function Ji(t,e){return(Ji=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function ta(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=ea(n),e=(t=r?(t=ea(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===$i(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function ea(t){return(ea=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var na="scrollspy",ra=".".concat("bs.scrollspy"),oa={offset:10,method:"auto",target:""},ia={offset:"number",method:"string",target:"(string|element)"},aa="activate".concat(ra),ca="scroll".concat(ra),o="load".concat(ra).concat(".data-api"),sa="dropdown-item",ua="active",la=".nav-link",fa=".list-group-item",da="".concat(la,", ").concat(fa,", .").concat(sa),pa="position",ha=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Ji(t,e);var n,r=ta(o);function o(t,e){var n;if(this instanceof o)return(n=r.call(this,t))._scrollElement="BODY"===n._element.tagName?window:n._element,n._config=n._getConfig(e),n._offsets=[],n._targets=[],n._activeTarget=null,n._scrollHeight=0,d.on(n._scrollElement,ca,function(){return n._process()}),n.refresh(),n._process(),n;throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"Default",get:function(){return oa}},{key:"NAME",get:function(){return na}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e]()}})}}],(n=[{key:"refresh",value:function(){var e=this,t=this._scrollElement===this._scrollElement.window?"offset":pa,r="auto"===this._config.method?t:this._config.method,o=r===pa?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),p.find(da,this._config.target).map(function(t){var t=H(t),e=t?p.findOne(t):null;if(e){var n=e.getBoundingClientRect();if(n.width||n.height)return[f[r](e).top+o,t]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})}},{key:"dispose",value:function(){d.off(this._scrollElement,ra),Zi(ea(o.prototype),"dispose",this).call(this)}},{key:"_getConfig",value:function(t){return(t=Gi(Gi(Gi({},oa),f.getDataAttributes(this._element)),"object"===$i(t)&&t?t:{})).target=Y(t.target)||document.documentElement,W(na,t,ia),t}},{key:"_getScrollTop",value:function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop}},{key:"_getScrollHeight",value:function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}},{key:"_getOffsetHeight",value:function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height}},{key:"_process",value:function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),n<=t)return e=this._targets[this._targets.length-1],void(this._activeTarget!==e&&this._activate(e));if(this._activeTarget&&t<this._offsets[0]&&0<this._offsets[0])return this._activeTarget=null,void this._clear();for(var r=this._offsets.length;r--;)this._activeTarget!==this._targets[r]&&t>=this._offsets[r]&&(void 0===this._offsets[r+1]||t<this._offsets[r+1])&&this._activate(this._targets[r])}},{key:"_activate",value:function(e){this._activeTarget=e,this._clear();var t=da.split(",").map(function(t){return"".concat(t,'[data-bs-target="').concat(e,'"],').concat(t,'[href="').concat(e,'"]')}),t=p.findOne(t.join(","),this._config.target);t.classList.add(ua),t.classList.contains(sa)?p.findOne(".dropdown-toggle",t.closest(".dropdown")).classList.add(ua):p.parents(t,".nav, .list-group").forEach(function(t){p.prev(t,"".concat(la,", ").concat(fa)).forEach(function(t){return t.classList.add(ua)}),p.prev(t,".nav-item").forEach(function(t){p.children(t,la).forEach(function(t){return t.classList.add(ua)})})}),d.trigger(this._scrollElement,aa,{relatedTarget:e})}},{key:"_clear",value:function(){p.find(da,this._config.target).filter(function(t){return t.classList.contains(ua)}).forEach(function(t){return t.classList.remove(ua)})}}])&&Qi(t.prototype,n),e&&Qi(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),o=(d.on(window,o,function(){p.find('[data-bs-spy="scroll"]').forEach(function(t){return new ha(t)})}),e(ha),ha);function va(t){return(va="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ya(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function ma(t,e){return(ma=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function ga(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=ba(n),e=(t=r?(t=ba(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===va(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function ba(t){return(ba=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var _a=".".concat("bs.tab"),wa="hide".concat(_a),Oa="hidden".concat(_a),ka="show".concat(_a),Ca="shown".concat(_a),_a="click".concat(_a).concat(".data-api"),Sa="active",xa=".active",Ea=":scope > li > .active",ja=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&ma(t,e);var n,r=ga(o);function o(){var t=this,e=o;if(t instanceof e)return r.apply(this,arguments);throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"NAME",get:function(){return"tab"}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e]()}})}}],(n=[{key:"show",value:function(){var t,e,n,r,o=this;this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&this._element.classList.contains(Sa)||(t=F(this._element),(e=this._element.closest(".nav, .list-group"))&&(r="UL"===e.nodeName||"OL"===e.nodeName?Ea:xa,n=(n=p.find(r,e))[n.length-1]),r=n?d.trigger(n,wa,{relatedTarget:this._element}):null,d.trigger(this._element,ka,{relatedTarget:n}).defaultPrevented||null!==r&&r.defaultPrevented||(this._activate(this._element,e),r=function(){d.trigger(n,Oa,{relatedTarget:o._element}),d.trigger(o._element,Ca,{relatedTarget:n})},t?this._activate(t,t.parentNode,r):r()))}},{key:"_activate",value:function(t,e,n){function r(){return o._transitionComplete(t,i,n)}var o=this,i=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?p.children(e,xa):p.find(Ea,e))[0],e=n&&i&&i.classList.contains("fade");i&&e?(i.classList.remove("show"),this._queueCallback(r,t,!0)):r()}},{key:"_transitionComplete",value:function(t,e,n){e&&(e.classList.remove(Sa),(r=p.findOne(":scope > .dropdown-menu .active",e.parentNode))&&r.classList.remove(Sa),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)),t.classList.add(Sa),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),$(t),t.classList.contains("fade")&&t.classList.add("show");var r=t.parentNode;(r=r&&"LI"===r.nodeName?r.parentNode:r)&&r.classList.contains("dropdown-menu")&&((e=t.closest(".dropdown"))&&p.find(".dropdown-toggle",e).forEach(function(t){return t.classList.add(Sa)}),t.setAttribute("aria-expanded",!0)),n&&n()}}])&&ya(t.prototype,n),e&&ya(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),_a=(d.on(document,_a,'[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',function(t){["A","AREA"].includes(this.tagName)&&t.preventDefault(),U(this)||ja.getOrCreateInstance(this).show()}),e(ja),ja);function Ta(t){return(Ta="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Aa(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Da(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Aa(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Aa(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Pa(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Ma(){return(Ma="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=Na(t)););return t}(t,e);if(r)return r=Object.getOwnPropertyDescriptor(r,e),r.get?r.get.call(arguments.length<3?t:n):r.value}).apply(this,arguments)}function Ia(t,e){return(Ia=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function La(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=Na(n),e=(t=r?(t=Na(this).constructor,Reflect.construct(e,arguments,t)):e.apply(this,arguments),this);if(t&&("object"===Ta(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}}function Na(t){return(Na=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ra(t){for(;t+=Math.floor(Math.random()*nc),document.getElementById(t););return t}function Ba(o,i,a){Object.keys(a).forEach(function(t){var e,n=a[t],r=i[t],r=r&&((e=r)[0]||e).nodeType?"element":null==(e=r)?"".concat(e):{}.toString.call(e).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(n).test(r))throw new Error("".concat(o.toUpperCase(),": ")+'Option "'.concat(t,'" provided type "').concat(r,'" ')+'but expected type "'.concat(n,'".'))})}function Ha(){var t=window.jQuery;return t&&!document.body.hasAttribute("data-mdb-no-jquery")?t:null}function Fa(t){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t()}function Va(t){return document.createElement(t)}var Ya,Wa,h=".".concat("bs.toast"),za="mouseover".concat(h),Ua="mouseout".concat(h),qa="focusin".concat(h),Ka="focusout".concat(h),$a="hide".concat(h),Xa="hidden".concat(h),Ga="show".concat(h),Qa="shown".concat(h),Za="show",Ja="showing",tc={animation:"boolean",autohide:"boolean",delay:"number"},ec={animation:!0,autohide:!0,delay:5e3},h=function(){var t=o,e=c;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Ia(t,e);var n,r=La(o);function o(t,e){if(this instanceof o)return(t=r.call(this,t))._config=t._getConfig(e),t._timeout=null,t._hasMouseInteraction=!1,t._hasKeyboardInteraction=!1,t._setListeners(),t;throw new TypeError("Cannot call a class as a function")}return t=o,e=[{key:"DefaultType",get:function(){return tc}},{key:"Default",get:function(){return ec}},{key:"NAME",get:function(){return"toast"}},{key:"jQueryInterface",value:function(e){return this.each(function(){var t=o.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError('No method named "'.concat(e,'"'));t[e](this)}})}}],(n=[{key:"show",value:function(){var t=this;d.trigger(this._element,Ga).defaultPrevented||(this._clearTimeout(),this._config.animation&&this._element.classList.add("fade"),this._element.classList.remove("hide"),$(this._element),this._element.classList.add(Za),this._element.classList.add(Ja),this._queueCallback(function(){t._element.classList.remove(Ja),d.trigger(t._element,Qa),t._maybeScheduleHide()},this._element,this._config.animation))}},{key:"hide",value:function(){var t=this;this._element.classList.contains(Za)&&!d.trigger(this._element,$a).defaultPrevented&&(this._element.classList.add(Ja),this._queueCallback(function(){t._element.classList.add("hide"),t._element.classList.remove(Ja),t._element.classList.remove(Za),d.trigger(t._element,Xa)},this._element,this._config.animation))}},{key:"dispose",value:function(){this._clearTimeout(),this._element.classList.contains(Za)&&this._element.classList.remove(Za),Ma(Na(o.prototype),"dispose",this).call(this)}},{key:"_getConfig",value:function(t){return t=Da(Da(Da({},ec),f.getDataAttributes(this._element)),"object"===Ta(t)&&t?t:{}),W("toast",t,this.constructor.DefaultType),t}},{key:"_maybeScheduleHide",value:function(){var t=this;!this._config.autohide||this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout(function(){t.hide()},this._config.delay))}},{key:"_onInteraction",value:function(t,e){switch(t.type){case"mouseover":case"mouseout":this._hasMouseInteraction=e;break;case"focusin":case"focusout":this._hasKeyboardInteraction=e}e?this._clearTimeout():(t=t.relatedTarget,this._element===t||this._element.contains(t)||this._maybeScheduleHide())}},{key:"_setListeners",value:function(){var e=this;d.on(this._element,za,function(t){return e._onInteraction(t,!0)}),d.on(this._element,Ua,function(t){return e._onInteraction(t,!1)}),d.on(this._element,qa,function(t){return e._onInteraction(t,!0)}),d.on(this._element,Ka,function(t){return e._onInteraction(t,!1)})}},{key:"_clearTimeout",value:function(){clearTimeout(this._timeout),this._timeout=null}}])&&Pa(t.prototype,n),e&&Pa(t,e),Object.defineProperty(t,"prototype",{writable:!1}),o}(),nc=(xr(h),e(h),1e6),rc=(document.documentElement.dir,Ya={},Wa=1,{set:function(t,e,n){void 0===t[e]&&(t[e]={key:e,id:Wa},Wa++),Ya[t[e].id]=n},get:function(t,e){if(!t||void 0===t[e])return null;t=t[e];return t.key===e?Ya[t.id]:null},delete:function(t,e){var n;void 0!==t[e]&&(n=t[e]).key===e&&(delete Ya[n.id],delete t[e])}}),v={setData:function(t,e,n){rc.set(t,e,n)},getData:function(t,e){return rc.get(t,e)},removeData:function(t,e){rc.delete(t,e)}};function oc(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i=[],a=!0,c=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){c=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(c)throw o}}return i}}(t,e)||function(t,e){if(t){if("string"==typeof t)return ic(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ic(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ic(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var ac=Ha(),cc=/[^.]*(?=\..*)\.|.*/,sc=/\..*/,uc=/::\d+$/,lc={},fc=1,dc={mouseenter:"mouseover",mouseleave:"mouseout"},pc=["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"];function hc(t,e){return e&&"".concat(e,"::").concat(fc++)||t.uidEvent||fc++}function vc(t){var e=hc(t);return t.uidEvent=e,lc[e]=lc[e]||{},lc[e]}function yc(t,e,n){for(var r=2<arguments.length&&void 0!==n?n:null,o=Object.keys(t),i=0,a=o.length;i<a;i++){var c=t[o[i]];if(c.originalHandler===e&&c.delegationSelector===r)return c}return null}function mc(t,e,n){var r="string"==typeof e,n=r?n:e,e=t.replace(sc,""),o=dc[e];return[r,n,e=-1<pc.indexOf(e=o?o:e)?e:t]}function gc(t,e,n,r,o){var i,a,c,s,u,l,f,d,p,h;"string"==typeof e&&t&&(n||(n=r,r=null),i=(c=oc(mc(e,n,r),3))[0],a=c[1],c=c[2],(u=yc(s=(s=vc(t))[c]||(s[c]={}),a,i?n:null))?u.oneOff=u.oneOff&&o:(u=hc(a,e.replace(cc,"")),(e=i?(d=t,p=n,h=r,function t(e){for(var n=d.querySelectorAll(p),r=e.target;r&&r!==this;r=r.parentNode)for(var o=n.length;o--;)if(n[o]===r)return e.delegateTarget=r,t.oneOff&&_c.off(d,e.type,h),h.apply(r,[e]);return null}):(l=t,f=n,function t(e){return e.delegateTarget=l,t.oneOff&&_c.off(l,e.type,f),f.apply(l,[e])})).delegationSelector=i?n:null,e.originalHandler=a,e.oneOff=o,s[e.uidEvent=u]=e,t.addEventListener(c,e,i)))}function bc(t,e,n,r,o){r=yc(e[n],r,o);r&&(t.removeEventListener(n,r,Boolean(o)),delete e[n][r.uidEvent])}var _c={on:function(t,e,n,r){gc(t,e,n,r,!1)},one:function(t,e,n,r){gc(t,e,n,r,!0)},off:function(a,c,t,e){if("string"==typeof c&&a){var e=oc(mc(c,t,e),3),n=e[0],r=e[1],o=e[2],i=o!==c,s=vc(a),e="."===c.charAt(0);if(void 0!==r)return s&&s[o]?void bc(a,s,o,r,n?t:null):void 0;e&&Object.keys(s).forEach(function(t){var e,n,r,o,i;e=a,n=s,r=t,o=c.slice(1),i=n[r]||{},Object.keys(i).forEach(function(t){-1<t.indexOf(o)&&(t=i[t],bc(e,n,r,t.originalHandler,t.delegationSelector))})});var u=s[o]||{};Object.keys(u).forEach(function(t){var e=t.replace(uc,"");(!i||-1<c.indexOf(e))&&(e=u[t],bc(a,s,o,e.originalHandler,e.delegationSelector))})}},trigger:function(t,e,n){if("string"!=typeof e||!t)return null;var r,o=e.replace(sc,""),i=e!==o,a=-1<pc.indexOf(o),c=!0,s=!0,u=!1,l=null;return i&&ac&&(r=ac.Event(e,n),ac(t).trigger(r),c=!r.isPropagationStopped(),s=!r.isImmediatePropagationStopped(),u=r.isDefaultPrevented()),a?(l=document.createEvent("HTMLEvents")).initEvent(o,c,!0):l=new CustomEvent(e,{bubbles:c,cancelable:!0}),void 0!==n&&Object.keys(n).forEach(function(t){Object.defineProperty(l,t,{get:function(){return n[t]}})}),u&&l.preventDefault(),s&&t.dispatchEvent(l),l.defaultPrevented&&void 0!==r&&r.preventDefault(),l}},wc=function(t,e,n,r){for(var o=e.split(" "),i=0;i<o.length;i++)_c.on(t,o[i],n,r)},Oc=function(t,e,n,r){for(var o=e.split(" "),i=0;i<o.length;i++)_c.off(t,o[i],n,r)},_=_c;t(185);function kc(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Cc(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?kc(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):kc(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Sc(t){return"true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function xc(t){return t.replace(/[A-Z]/g,function(t){return"-".concat(t.toLowerCase())})}var S={setDataAttribute:function(t,e,n){t.setAttribute("data-mdb-".concat(xc(e)),n)},removeDataAttribute:function(t,e){t.removeAttribute("data-mdb-".concat(xc(e)))},getDataAttributes:function(t){if(!t)return{};var n=Cc({},t.dataset);return Object.keys(n).filter(function(t){return t.startsWith("mdb")}).forEach(function(t){var e=(e=t.replace(/^mdb/,"")).charAt(0).toLowerCase()+e.slice(1,e.length);n[e]=Sc(n[t])}),n},getDataAttribute:function(t,e){return Sc(t.getAttribute("data-mdb-".concat(xc(e))))},offset:function(t){t=t.getBoundingClientRect();return{top:t.top+document.body.scrollTop,left:t.left+document.body.scrollLeft}},position:function(t){return{top:t.offsetTop,left:t.offsetLeft}},style:function(t,e){Object.assign(t.style,e)},toggleClass:function(t,e){t&&(t.classList.contains(e)?t.classList.remove(e):t.classList.add(e))},addClass:function(t,e){t.classList.contains(e)||t.classList.add(e)},addStyle:function(e,n){Object.keys(n).forEach(function(t){e.style[t]=n[t]})},removeClass:function(t,e){t.classList.contains(e)&&t.classList.remove(e)},hasClass:function(t,e){return t.classList.contains(e)}};function Ec(t){return function(t){if(Array.isArray(t))return jc(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return jc(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?jc(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function jc(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var x={closest:function(t,e){return t.closest(e)},matches:function(t,e){return t.matches(e)},find:function(t){var e,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document.documentElement;return(e=[]).concat.apply(e,Ec(Element.prototype.querySelectorAll.call(n,t)))},findOne:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document.documentElement;return Element.prototype.querySelector.call(e,t)},children:function(t,e){var n;return(n=[]).concat.apply(n,Ec(t.children)).filter(function(t){return t.matches(e)})},parents:function(t,e){for(var n=[],r=t.parentNode;r&&r.nodeType===Node.ELEMENT_NODE&&3!==r.nodeType;)this.matches(r,e)&&n.push(r),r=r.parentNode;return n},prev:function(t,e){for(var n=t.previousElementSibling;n;){if(n.matches(e))return[n];n=n.previousElementSibling}return[]},next:function(t,e){for(var n=t.nextElementSibling;n;){if(this.matches(n,e))return[n];n=n.nextElementSibling}return[]}};function Tc(t){return(Tc="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Ac(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Dc(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Ac(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):Ac(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function Pc(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var Mc="ripple",Ic="mdb.ripple",Lc="ripple-surface",Nc="ripple-wave",Rc=["[data-mdb-ripple]"],Bc="ripple-surface-unbound",Hc=[0,0,0],Fc=["primary","secondary","success","danger","warning","info","light","dark"],Vc={rippleCentered:!1,rippleColor:"",rippleDuration:"500ms",rippleRadius:0,rippleUnbound:!1},Yc={rippleCentered:"boolean",rippleColor:"string",rippleDuration:"string",rippleRadius:"number",rippleUnbound:"boolean"},Wc=function(){function n(t,e){if(!(this instanceof n))throw new TypeError("Cannot call a class as a function");this._element=t,this._options=this._getConfig(e),this._element&&(v.setData(t,Ic,this),S.addClass(this._element,Lc)),this._clickHandler=this._createRipple.bind(this),this._rippleTimer=null,this._isMinWidthSet=!1,this.init()}var t,e,r;return t=n,r=[{key:"NAME",get:function(){return Mc}},{key:"autoInitial",value:function(e){return function(t){e._autoInit(t)}}},{key:"jQueryInterface",value:function(t){return this.each(function(){return v.getData(this,Ic)?null:new n(this,t)})}},{key:"getInstance",value:function(t){return v.getData(t,Ic)}},{key:"getOrCreateInstance",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return this.getInstance(t)||new this(t,"object"===Tc(e)?e:null)}}],(e=[{key:"init",value:function(){this._addClickEvent(this._element)}},{key:"dispose",value:function(){v.removeData(this._element,Ic),_.off(this._element,"click",this._clickHandler),this._element=null,this._options=null}},{key:"_autoInit",value:function(e){var n=this;Rc.forEach(function(t){x.closest(e.target,t)&&(n._element=x.closest(e.target,t))}),this._element.style.minWidth||(S.style(this._element,{"min-width":"".concat(this._element.offsetWidth,"px")}),this._isMinWidthSet=!0),S.addClass(this._element,Lc),this._options=this._getConfig(),this._createRipple(e)}},{key:"_addClickEvent",value:function(t){_.on(t,"mousedown",this._clickHandler)}},{key:"_createRipple",value:function(t){S.hasClass(this._element,Lc)||S.addClass(this._element,Lc);var e=t.layerX,t=t.layerY,n=this._element.offsetHeight,r=this._element.offsetWidth,o=this._durationToMsNumber(this._options.rippleDuration),i={offsetX:this._options.rippleCentered?n/2:e,offsetY:this._options.rippleCentered?r/2:t,height:n,width:r},i=this._getDiameter(i),a=this._options.rippleRadius||i/2,c={delay:.5*o,duration:o-.5*o},r={left:this._options.rippleCentered?"".concat(r/2-a,"px"):"".concat(e-a,"px"),top:this._options.rippleCentered?"".concat(n/2-a,"px"):"".concat(t-a,"px"),height:"".concat(2*this._options.rippleRadius||i,"px"),width:"".concat(2*this._options.rippleRadius||i,"px"),transitionDelay:"0s, ".concat(c.delay,"ms"),transitionDuration:"".concat(o,"ms, ").concat(c.duration,"ms")},e=Va("div");this._createHTMLRipple({wrapper:this._element,ripple:e,styles:r}),this._removeHTMLRipple({ripple:e,duration:o})}},{key:"_createHTMLRipple",value:function(t){var e=t.wrapper,n=t.ripple,r=t.styles;Object.keys(r).forEach(function(t){return n.style[t]=r[t]}),n.classList.add(Nc),""!==this._options.rippleColor&&(this._removeOldColorClasses(e),this._addColor(n,e)),this._toggleUnbound(e),this._appendRipple(n,e)}},{key:"_removeHTMLRipple",value:function(t){var e=this,n=t.ripple,t=t.duration;this._rippleTimer&&(clearTimeout(this._rippleTimer),this._rippleTimer=null),this._rippleTimer=setTimeout(function(){n&&(n.remove(),e._element&&(x.find(".".concat(Nc),e._element).forEach(function(t){t.remove()}),e._isMinWidthSet&&(S.style(e._element,{"min-width":""}),e._isMinWidthSet=!1),S.removeClass(e._element,Lc)))},t)}},{key:"_durationToMsNumber",value:function(t){return Number(t.replace("ms","").replace("s","000"))}},{key:"_getConfig",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=S.getDataAttributes(this._element),t=Dc(Dc(Dc({},Vc),e),t);return Ba(Mc,t,Yc),t}},{key:"_getDiameter",value:function(t){function e(t,e){return Math.sqrt(Math.pow(t,2)+Math.pow(e,2))}var n=t.offsetX,r=t.offsetY,o=t.height,t=t.width,i=r<=o/2,a=n<=t/2,c=r===o/2&&n===t/2,s=!0==i&&!1==a,u=!0==i&&!0==a,l=!1==i&&!0==a,i=!1==i&&!1==a,a={topLeft:e(n,r),topRight:e(t-n,r),bottomLeft:e(n,o-r),bottomRight:e(t-n,o-r)},t=0;return c||i?t=a.topLeft:l?t=a.topRight:u?t=a.bottomRight:s&&(t=a.bottomLeft),2*t}},{key:"_appendRipple",value:function(t,e){e.appendChild(t),setTimeout(function(){S.addClass(t,"active")},50)}},{key:"_toggleUnbound",value:function(t){!0===this._options.rippleUnbound?S.addClass(t,Bc):t.classList.remove(Bc)}},{key:"_addColor",value:function(t,e){var n=this;Fc.find(function(t){return t===n._options.rippleColor.toLowerCase()})?S.addClass(e,"".concat(Lc,"-").concat(this._options.rippleColor.toLowerCase())):(e=this._colorToRGB(this._options.rippleColor).join(","),e="rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%".split("{{color}}").join("".concat(e)),t.style.backgroundImage="radial-gradient(circle, ".concat(e,")"))}},{key:"_removeOldColorClasses",value:function(e){var t=new RegExp("".concat(Lc,"-[a-z]+"),"gi");(e.classList.value.match(t)||[]).forEach(function(t){e.classList.remove(t)})}},{key:"_colorToRGB",value:function(t){return"transparent"===t.toLowerCase()?Hc:"#"===t[0]?((e=t).length<7&&(e="#".concat(e[1]).concat(e[1]).concat(e[2]).concat(e[2]).concat(e[3]).concat(e[3])),[parseInt(e.substr(1,2),16),parseInt(e.substr(3,2),16),parseInt(e.substr(5,2),16)]):(-1===t.indexOf("rgb")&&(e=t,n=document.body.appendChild(document.createElement("fictum")),r="rgb(1, 2, 3)",n.style.color=r,t=n.style.color!==r?Hc:(n.style.color=e,n.style.color===r||""===n.style.color?Hc:(e=getComputedStyle(n).color,document.body.removeChild(n),e))),0===t.indexOf("rgb")?((r=(r=t).match(/[.\d]+/g).map(function(t){return+Number(t)})).length=3,r):Hc);var e,n,r}}])&&Pc(t.prototype,e),r&&Pc(t,r),Object.defineProperty(t,"prototype",{writable:!1}),n}(),zc=(Rc.forEach(function(t){_.one(document,"mousedown",t,Wc.autoInitial(new Wc))}),Fa(function(){var t,e=Ha();e&&(t=e.fn[Mc],e.fn[Mc]=Wc.jQueryInterface,e.fn[Mc].Constructor=Wc,e.fn[Mc].noConflict=function(){return e.fn[Mc]=t,Wc.jQueryInterface})}),Wc);t(187);function Uc(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var qc=function(){function a(t){var e=this,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},r=2<arguments.length?arguments[2]:void 0,o=this,i=a;if(!(o instanceof i))throw new TypeError("Cannot call a class as a function");this._element=t,this._toggler=r,this._event=n.event||"blur",this._condition=n.condition||function(){return!0},this._selector=n.selector||'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',this._onlyVisible=n.onlyVisible||!1,this._focusableElements=[],this._firstElement=null,this._lastElement=null,this.handler=function(t){e._condition(t)&&t.target===e._lastElement&&(t.preventDefault(),e._firstElement.focus())}}var t,e,n;return t=a,(e=[{key:"trap",value:function(){this._setElements(),this._init(),this._setFocusTrap()}},{key:"disable",value:function(){var e=this;this._focusableElements.forEach(function(t){t.removeEventListener(e._event,e.handler)}),this._toggler&&this._toggler.focus()}},{key:"update",value:function(){this._setElements(),this._setFocusTrap()}},{key:"_init",value:function(){var n=this;window.addEventListener("keydown",function t(e){n._firstElement&&"Tab"===e.key&&!n._focusableElements.includes(e.target)&&(e.preventDefault(),n._firstElement.focus(),window.removeEventListener("keydown",t))})}},{key:"_filterVisible",value:function(t){return t.filter(function(t){if(!(e=t)||(!(e.style&&e.parentNode&&e.parentNode.style)||(n=getComputedStyle(e),e=getComputedStyle(e.parentNode),"none"===n.display||"none"===e.display||"hidden"===n.visibility)))return!1;for(var e,n,r=x.parents(t,"*"),o=0;o<r.length;o++){var i=window.getComputedStyle(r[o]);if(i&&("none"===i.display||"hidden"===i.visibility))return!1}return!0})}},{key:"_setElements",value:function(){this._focusableElements=x.find(this._selector,this._element),this._onlyVisible&&(this._focusableElements=this._filterVisible(this._focusableElements)),this._firstElement=this._focusableElements[0],this._lastElement=this._focusableElements[this._focusableElements.length-1]}},{key:"_setFocusTrap",value:function(){var n=this;this._focusableElements.forEach(function(t,e){e===n._focusableElements.length-1?t.addEventListener(n._event,n.handler):t.removeEventListener(n._event,n.handler)})}}])&&Uc(t.prototype,e),n&&Uc(t,n),Object.defineProperty(t,"prototype",{writable:!1}),a}();t(188);function O(t){return t.getDate()}function Kc(t){return t.getDay()}function k(t){return t.getMonth()}function C(t){return t.getFullYear()}function $c(t){return Qc((t=t).getFullYear(),t.getMonth()+1,0).getDate()}function Xc(){return new Date}function y(t,e){return D(t,12*e)}function D(t,e){e=Qc(t.getFullYear(),t.getMonth()+e,t.getDate());return O(t)!==O(e)&&e.setDate(0),e}function Gc(t,e){return Qc(t.getFullYear(),t.getMonth(),t.getDate()+e)}function Qc(t,e,n){e=new Date(t,e,n);return 0<=t&&t<100&&e.setFullYear(e.getFullYear()-1900),e}function Zc(t){t=t.split("-");return Qc(t[0],t[1],t[2])}function Jc(t,e){return t.setHours(0,0,0,0),e.setHours(0,0,0,0),t.getTime()===e.getTime()}function ts(t,e){return((C(t)-function(t,e,n){var r=0;n?(n=C(n),r=n-t+1):e&&(r=C(e));return r}())%e+e)%e}function es(t,e,n,r,o){return"days"===n?C(t)===C(e)&&k(t)===k(e):"months"===n?C(t)===C(e):"years"===n&&(C(e)>=o&&C(e)<=r)}function ns(t,e,n,r,o,i,a,c,s){var u,l,f=k(t),d=C(t),p=O(t),h=Kc(t),v=Va("div"),a="\n      ".concat((p=p,h=h,u=f,'\n      <div class="datepicker-header">\n        <div class="datepicker-title">\n          <span class="datepicker-title-text">'.concat((l=o).title,'</span>\n        </div>\n        <div class="datepicker-date">\n          <span class="datepicker-date-text">').concat(l.weekdaysShort[h],", ").concat(l.monthsShort[u]," ").concat(p,"</span>\n        </div>\n      </div>\n    ")),"\n      ").concat((h=t,l=e,u=n,p=r,t=i,e=a,n=c,'\n    <div class="datepicker-main">\n      '.concat(function(t,e,n){return'\n    <div class="datepicker-date-controls">\n      <button class="datepicker-view-change-button" aria-label="'.concat(n.switchToMultiYearViewLabel,'">\n        ').concat(n.monthsFull[t]," ").concat(e,'\n      </button>\n      <div class="datepicker-arrow-controls">\n        <button class="datepicker-previous-button" aria-label="').concat(n.prevMonthLabel,'"></button>\n        <button class="datepicker-next-button" aria-label="').concat(n.nextMonthLabel,'"></button>\n      </div>\n    </div>\n    ')}(f,r=d,i=o),'\n      <div class="datepicker-view" tabindex="0">\n        ').concat(function(t,e,n,r,o,i,a,c,s){n="days"===i.view?rs(t,n,i):"months"===i.view?os(e,r,o,i,a):is(t,r,0,c,s);return n}(h,r,l,u,p,i,t,e,n),"\n      </div>\n      ").concat(function(t){return'\n        <div class="datepicker-footer">\n          <button class="datepicker-footer-btn datepicker-clear-btn" aria-label="'.concat(t.clearBtnLabel,'">').concat(t.clearBtnText,'</button>\n          <button class="datepicker-footer-btn datepicker-cancel-btn" aria-label="').concat(t.cancelBtnLabel,'">').concat(t.cancelBtnText,'</button>\n          <button class="datepicker-footer-btn datepicker-ok-btn" aria-label="').concat(t.okBtnLabel,'">').concat(t.okBtnText,"</button>\n        </div>\n      ")}(i),"\n    </div>\n  ")),"\n    ");return S.addClass(v,"datepicker-modal-container"),S.addClass(v,"datepicker-modal-container-".concat(s)),v.innerHTML=a,v}function rs(t,e,n){t=function(t,e,n){for(var r=[],o=k(t),i=k(D(t,-1)),a=k(D(t,1)),c=C(t),s=function(t,e,n){return n=0<(n=n.startDay)?7-n:0,7<=(t=new Date(t,e).getDay()+n)?t-7:t}(c,o,n),u=$c(t),l=$c(D(t,-1)),f=1,d=!1,p=1;p<7;p++){var h=[];if(1===p){for(var v=l-s+1;v<=l;v++){var y=Qc(c,i,v);h.push({date:y,currentMonth:d,isSelected:e&&Jc(y,e),isToday:Jc(y,Xc()),dayNumber:O(y)})}d=!0;for(var m=7-h.length,g=0;g<m;g++){var b=Qc(c,o,f);h.push({date:b,currentMonth:d,isSelected:e&&Jc(b,e),isToday:Jc(b,Xc()),dayNumber:O(b)}),f++}}else for(var _=1;_<8;_++){u<f&&(d=!(f=1));var w=Qc(c,d?o:a,f);h.push({date:w,currentMonth:d,isSelected:e&&Jc(w,e),isToday:Jc(w,Xc()),dayNumber:O(w)}),f++}r.push(h)}return r}(t,e,n),e=n.weekdaysNarrow,e="\n      <tr>\n        ".concat(e.map(function(t,e){return'<th class="datepicker-day-heading" scope="col" aria-label="'.concat(n.weekdaysFull[e],'">').concat(t,"</th>")}).join(""),"\n      </tr>\n    "),t=t.map(function(t){return"\n        <tr>\n          ".concat(t.map(function(t){return'\n              <td\n              class="datepicker-cell datepicker-small-cell datepicker-day-cell\n              '.concat(t.currentMonth?"":"disabled"," ").concat(t.disabled?"disabled":"","\n              ").concat(t.isToday&&"current"," ").concat(t.isSelected&&"selected",'"\n              data-mdb-date="').concat(C(t.date),"-").concat(k(t.date),"-").concat(O(t.date),'"\n              aria-label="').concat(t.date,'"\n              aria-selected="').concat(t.isSelected,'">\n                <div\n                  class="datepicker-cell-content datepicker-small-cell-content"\n                  style="').concat(t.currentMonth?"display: block":"display: none",'">\n                  ').concat(t.dayNumber,"\n                  </div>\n              </td>\n            ")}).join(""),"\n        </tr>\n      ")}).join("");return'\n      <table class="datepicker-table">\n        <thead>\n          '.concat(e,'\n        </thead>\n        <tbody class="datepicker-table-body">\n         ').concat(t,"\n        </tbody>\n      </table>\n    ")}function os(n,r,o,i,t){var t=function(t,e){for(var n=[],r=[],o=0;o<t.monthsShort.length;o++){var i;r.push(t.monthsShort[o]),r.length===e&&(i=r,n.push(i),r=[])}return n}(i,t),a=k(Xc()),t="\n      ".concat(t.map(function(t){return"\n          <tr>\n            ".concat(t.map(function(t){var e=i.monthsShort.indexOf(t);return'\n                <td class="datepicker-cell datepicker-large-cell datepicker-month-cell '.concat(e===o&&n===r?"selected":""," ").concat(e===a?"current":"",'" data-mdb-month="').concat(e,'" data-mdb-year="').concat(n,'" aria-label="').concat(t,", ").concat(n,'">\n                  <div class="datepicker-cell-content datepicker-large-cell-content">').concat(t,"</div>\n                </td>\n              ")}).join(""),"\n          </tr>\n        ")}).join(""),"\n    ");return'\n      <table class="datepicker-table">\n        <tbody class="datepicker-table-body">\n         '.concat(t,"\n        </tbody>\n      </table>\n    ")}function is(t,e,n,r,o){var t=function(t,e,n){for(var r=[],o=C(t),t=ts(t,e),i=o-t,a=[],c=0;c<e;c++){var s;a.push(i+c),a.length===n&&(s=a,r.push(s),a=[])}return r}(t,r,o),i=C(Xc()),r="\n    ".concat(t.map(function(t){return"\n        <tr>\n          ".concat(t.map(function(t){return'\n              <td class="datepicker-cell datepicker-large-cell datepicker-year-cell '.concat(t===e?"selected":""," ").concat(t===i?"current":"",'" aria-label="').concat(t,'" data-mdb-year="').concat(t,'">\n                <div class="datepicker-cell-content datepicker-large-cell-content">').concat(t,"</div>\n              </td>\n            ")}).join(""),"\n        </tr>\n      ")}).join(""),"\n  ");return'\n      <table class="datepicker-table">\n        <tbody class="datepicker-table-body">\n        '.concat(r,"\n        </tbody>\n      </table>\n    ")}function as(t){return(as="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function cs(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function ss(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?cs(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):cs(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function us(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var ls="datepicker",fs="mdb.datepicker",ds=".".concat(fs),ps="close".concat(ds),hs="open".concat(ds),vs="dateChange".concat(ds),ys="click".concat(ds).concat(".data-api"),ms={title:"Select date",monthsFull:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],weekdaysFull:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],weekdaysNarrow:["S","M","T","W","T","F","S"],okBtnText:"Ok",clearBtnText:"Clear",cancelBtnText:"Cancel",okBtnLabel:"Confirm selection",clearBtnLabel:"Clear selection",cancelBtnLabel:"Cancel selection",nextMonthLabel:"Next month",prevMonthLabel:"Previous month",nextYearLabel:"Next year",prevYearLabel:"Previous year",nextMultiYearLabel:"Next 24 years",prevMultiYearLabel:"Previous 24 years",switchToMultiYearViewLabel:"Choose year and month",switchToMonthViewLabel:"Choose date",switchToDayViewLabel:"Choose date",startDate:null,startDay:0,format:"dd/mm/yyyy",view:"days",toggleButton:!0,disableToggleButton:!1,disableInput:!1},gs={title:"string",monthsFull:"array",monthsShort:"array",weekdaysFull:"array",weekdaysShort:"array",weekdaysNarrow:"array",okBtnText:"string",clearBtnText:"string",cancelBtnText:"string",okBtnLabel:"string",clearBtnLabel:"string",cancelBtnLabel:"string",nextMonthLabel:"string",prevMonthLabel:"string",nextYearLabel:"string",prevYearLabel:"string",nextMultiYearLabel:"string",prevMultiYearLabel:"string",switchToMultiYearViewLabel:"string",switchToMonthViewLabel:"string",switchToDayViewLabel:"string",startDate:"(null|string|date)",startDay:"number",format:"string",view:"string",toggleButton:"boolean",disableToggleButton:"boolean",disableInput:"boolean"},bs=function(){function n(t,e){if(!(this instanceof n))throw new TypeError("Cannot call a class as a function");this._element=t,this._input=x.findOne("input",this._element),this._options=this._getConfig(e),this._activeDate=new Date,this._selectedDate=null,this._selectedYear=null,this._selectedMonth=null,this._view=this._options.view,this._popper=null,this._focusTrap=null,this._isOpen=!1,this._toggleButtonId=Ra("datepicker-toggle-"),this._element&&v.setData(t,fs,this),this._init(),this.toggleButton&&this._options.disableToggle&&(this.toggleButton.disabled="true"),this._options.disableInput&&(this._input.disabled="true")}var t,e,r;return t=n,r=[{key:"NAME",get:function(){return ls}},{key:"getInstance",value:function(t){return v.getData(t,fs)}},{key:"getOrCreateInstance",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return this.getInstance(t)||new this(t,"object"===as(e)?e:null)}}],(e=[{key:"container",get:function(){return x.findOne(".datepicker-modal-container".concat("-",this._toggleButtonId))||x.findOne(".datepicker-dropdown-container".concat("-",this._toggleButtonId))}},{key:"options",get:function(){return this._options}},{key:"activeCell",get:function(){var t;return"days"===this._view&&(t=this._getActiveDayCell()),"months"===this._view&&(t=this._getActiveMonthCell()),t="years"===this._view?this._getActiveYearCell():t}},{key:"activeDay",get:function(){return O(this._activeDate)}},{key:"activeMonth",get:function(){return k(this._activeDate)}},{key:"activeYear",get:function(){return C(this._activeDate)}},{key:"firstYearInView",get:function(){return this.activeYear-ts(this._activeDate,24)}},{key:"lastYearInView",get:function(){return this.firstYearInView+24-1}},{key:"viewChangeButton",get:function(){return x.findOne(".datepicker-view-change-button",this.container)}},{key:"previousButton",get:function(){return x.findOne(".datepicker-previous-button",this.container)}},{key:"nextButton",get:function(){return x.findOne(".datepicker-next-button",this.container)}},{key:"okButton",get:function(){return x.findOne(".datepicker-ok-btn",this.container)}},{key:"cancelButton",get:function(){return x.findOne(".datepicker-cancel-btn",this.container)}},{key:"clearButton",get:function(){return x.findOne(".datepicker-clear-btn",this.container)}},{key:"datesContainer",get:function(){return x.findOne(".datepicker-view",this.container)}},{key:"toggleButton",get:function(){return x.findOne(".datepicker-toggle-button",this._element)}},{key:"_getConfig",value:function(t){var e=S.getDataAttributes(this._element);return t=ss(ss(ss({},ms),e),t),Ba(ls,t,gs),t.startDay&&0!==t.startDay&&(e=this._getNewDaysOrderArray(t),t.weekdaysNarrow=e),t}},{key:"_getNewDaysOrderArray",value:function(t){var e=t.startDay,t=t.weekdaysNarrow;return t.slice(e).concat(t.slice(0,e))}},{key:"_init",value:function(){!this.toggleButton&&this._options.toggleButton&&(this._appendToggleButton(),(this._input.readOnly||this._input.disabled)&&(this.toggleButton.style.pointerEvents="none")),this._listenToUserInput(),this._listenToToggleClick(),this._listenToToggleKeydown()}},{key:"_appendToggleButton",value:function(){var t='\n    <button id="'.concat(this._toggleButtonId,'" type="button" class="datepicker-toggle-button" data-mdb-toggle="datepicker">\n      <i class="far fa-calendar datepicker-toggle-icon"></i>\n    </button>\n  ');this._element.insertAdjacentHTML("beforeend",t),S.addClass(this._input,"form-icon-trailing")}},{key:"open",value:function(){var t,e,n=this;this._input.readOnly||this._input.disabled||(t=_.trigger(this._element,hs),this._isOpen||t.defaultPrevented||(this._setInitialDate(),t=Va("div"),S.addClass(t,"datepicker-backdrop"),t=t,e=ns(this._activeDate,this._selectedDate,this._selectedYear,this._selectedMonth,this._options,4,24,24,this._toggleButtonId),this._openModal(t,e),S.addClass(this.container,"animation"),S.addClass(this.container,"fade-in"),this.container.style.animationDuration="300ms",S.addClass(t,"animation"),S.addClass(t,"fade-in"),t.style.animationDuration="150ms",this._setFocusTrap(this.container),this._listenToDateSelection(),this._addControlsListeners(),this._listenToEscapeClick(),this._listenToKeyboardNavigation(),this._listenToDatesContainerFocus(),this._listenToDatesContainerBlur(),this._asyncFocusDatesContainer(),this._updateViewControlsAndAttributes(this._view),this._isOpen=!0,setTimeout(function(){n._listenToOutsideClick()},0)))}},{key:"_openDropdown",value:function(t){this._popper=en(this._input,t,{placement:"bottom-start"}),document.body.appendChild(t)}},{key:"_openModal",value:function(t,e){document.body.appendChild(t),document.body.appendChild(e);window.innerWidth>document.documentElement.clientWidth&&(document.body.style.overflow="hidden",document.body.style.paddingRight="15px")}},{key:"_setFocusTrap",value:function(t){this._focusTrap=new qc(t,{event:"keydown",condition:function(t){return"Tab"===t.key}}),this._focusTrap.trap()}},{key:"_listenToUserInput",value:function(){var e=this;_.on(this._input,"input",function(t){e._handleUserInput(t.target.value)})}},{key:"_listenToToggleClick",value:function(){var e=this;_.on(this._element,ys,'[data-mdb-toggle="datepicker"]',function(t){t.preventDefault(),e.open()})}},{key:"_listenToToggleKeydown",value:function(){var e=this;_.on(this._element,"keydown",'[data-mdb-toggle="datepicker"]',function(t){13!==t.keyCode||e._isOpen||e.open()})}},{key:"_listenToDateSelection",value:function(){var r=this;_.on(this.datesContainer,"click",function(t){var e,n=("DIV"===t.target.nodeName?t.target.parentNode:t.target).dataset,t="DIV"===t.target.nodeName?t.target.parentNode:t.target;n.mdbDate&&r._pickDay(n.mdbDate,t),n.mdbMonth&&n.mdbYear&&(t=parseInt(n.mdbMonth,10),e=parseInt(n.mdbYear,10),r._pickMonth(t,e)),n.mdbYear&&!n.mdbMonth&&(t=parseInt(n.mdbYear,10),r._pickYear(t)),r._updateHeaderDate(r._activeDate,r._options.monthsShort,r._options.weekdaysShort)})}},{key:"_updateHeaderDate",value:function(t,e,n){var r=x.findOne(".datepicker-date-text",this.container),o=k(t),i=O(t),t=Kc(t);r.innerHTML="".concat(n[t],", ").concat(e[o]," ").concat(i)}},{key:"_addControlsListeners",value:function(){var t=this;_.on(this.nextButton,"click",function(){"days"===t._view?t.nextMonth():"years"===t._view?t.nextYears():t.nextYear()}),_.on(this.previousButton,"click",function(){"days"===t._view?t.previousMonth():"years"===t._view?t.previousYears():t.previousYear()}),_.on(this.viewChangeButton,"click",function(){"days"===t._view?t._changeView("years"):"years"!==t._view&&"months"!==t._view||t._changeView("days")}),this._listenToFooterButtonsClick()}},{key:"_listenToFooterButtonsClick",value:function(){var t=this;_.on(this.okButton,"click",function(){return t.handleOk()}),_.on(this.cancelButton,"click",function(){return t.handleCancel()}),_.on(this.clearButton,"click",function(){return t.handleClear()})}},{key:"_listenToOutsideClick",value:function(){var n=this;_.on(document,ys,function(t){var e=t.target===n.container,t=n.container&&n.container.contains(t.target);e||t||n.close()})}},{key:"_listenToEscapeClick",value:function(){var e=this;_.on(document,"keydown",function(t){27===t.keyCode&&e._isOpen&&e.close()})}},{key:"_listenToKeyboardNavigation",value:function(){var e=this;_.on(this.datesContainer,"keydown",function(t){e._handleKeydown(t)})}},{key:"_listenToDatesContainerFocus",value:function(){var t=this;_.on(this.datesContainer,"focus",function(){t._focusActiveCell(t.activeCell)})}},{key:"_listenToDatesContainerBlur",value:function(){var t=this;_.on(this.datesContainer,"blur",function(){t._removeCurrentFocusStyles()})}},{key:"_handleKeydown",value:function(t){"days"===this._view&&this._handleDaysViewKeydown(t),"months"===this._view&&this._handleMonthsViewKeydown(t),"years"===this._view&&this._handleYearsViewKeydown(t)}},{key:"_handleDaysViewKeydown",value:function(t){var e=this._activeDate,n=this.activeCell;switch(t.keyCode){case 37:this._activeDate=Gc(this._activeDate,-1);break;case 39:this._activeDate=Gc(this._activeDate,1);break;case 38:this._activeDate=Gc(this._activeDate,-7);break;case 40:this._activeDate=Gc(this._activeDate,7);break;case 36:this._activeDate=Gc(this._activeDate,1-O(this._activeDate));break;case 35:this._activeDate=Gc(this._activeDate,$c(this._activeDate)-O(this._activeDate));break;case 33:this._activeDate=D(this._activeDate,-1);break;case 34:this._activeDate=D(this._activeDate,1);break;case 13:case 32:return this._selectDate(this._activeDate),void t.preventDefault();default:return}es(e,this._activeDate,this._view,24,0)||this._changeView("days"),this._removeHighlightFromCell(n),this._focusActiveCell(this.activeCell),t.preventDefault()}},{key:"_asyncFocusDatesContainer",value:function(){var t=this;setTimeout(function(){t.datesContainer.focus()},0)}},{key:"_focusActiveCell",value:function(t){t&&S.addClass(t,"focused")}},{key:"_removeHighlightFromCell",value:function(t){t&&t.classList.remove("focused")}},{key:"_getActiveDayCell",value:function(){var e=this,t=x.find("td",this.datesContainer);return Array.from(t).find(function(t){return Jc(Zc(t.dataset.mdbDate),e._activeDate)})}},{key:"_handleMonthsViewKeydown",value:function(t){var e=this._activeDate,n=this.activeCell;switch(t.keyCode){case 37:this._activeDate=D(this._activeDate,-1);break;case 39:this._activeDate=D(this._activeDate,1);break;case 38:this._activeDate=D(this._activeDate,-4);break;case 40:this._activeDate=D(this._activeDate,4);break;case 36:this._activeDate=D(this._activeDate,-this.activeMonth);break;case 35:this._activeDate=D(this._activeDate,11-this.activeMonth);break;case 33:this._activeDate=y(this._activeDate,-1);break;case 34:this._activeDate=y(this._activeDate,1);break;case 13:case 32:return void this._selectMonth(this.activeMonth);default:return}es(e,this._activeDate,this._view,24,0)||this._changeView("months"),this._removeHighlightFromCell(n),this._focusActiveCell(this.activeCell),t.preventDefault()}},{key:"_getActiveMonthCell",value:function(){var n=this,t=x.find("td",this.datesContainer);return Array.from(t).find(function(t){var e=parseInt(t.dataset.mdbYear,10),t=parseInt(t.dataset.mdbMonth,10);return e===n.activeYear&&t===n.activeMonth})}},{key:"_handleYearsViewKeydown",value:function(t){var e=this._activeDate,n=this.activeCell;switch(t.keyCode){case 37:this._activeDate=y(this._activeDate,-1);break;case 39:this._activeDate=y(this._activeDate,1);break;case 38:this._activeDate=y(this._activeDate,-4);break;case 40:this._activeDate=y(this._activeDate,4);break;case 36:this._activeDate=y(this._activeDate,-ts(this._activeDate,24));break;case 35:this._activeDate=y(this._activeDate,24-ts(this._activeDate,24)-1);break;case 33:this._activeDate=y(this._activeDate,-24);break;case 34:this._activeDate=y(this._activeDate,24);break;case 13:case 32:return void this._selectYear(this.activeYear);default:return}es(e,this._activeDate,this._view,24,0)||this._changeView("years"),this._removeHighlightFromCell(n),this._focusActiveCell(this.activeCell),t.preventDefault()}},{key:"_getActiveYearCell",value:function(){var e=this,t=x.find("td",this.datesContainer);return Array.from(t).find(function(t){return parseInt(t.dataset.mdbYear,10)===e.activeYear})}},{key:"_setInitialDate",value:function(){this._input.value?this._handleUserInput(this._input.value):this._options.startDate?this._activeDate=new Date(this._options.startDate):this._activeDate=new Date}},{key:"close",value:function(){var t=_.trigger(this._element,ps);this._isOpen&&!t.defaultPrevented&&(this._removeDatepickerListeners(),S.addClass(this.container,"animation"),S.addClass(this.container,"fade-out"),this._closeModal(),this._isOpen=!1,this._view=this._options.view,(this.toggleButton||this._input).focus())}},{key:"_closeDropdown",value:function(){var t=this,e=x.findOne(".datepicker-dropdown-container");e.addEventListener("animationend",function(){e&&document.body.removeChild(e),t._popper&&t._popper.destroy()}),this._removeFocusTrap()}},{key:"_closeModal",value:function(){var t=x.findOne(".datepicker-backdrop"),e=x.findOne(".datepicker-modal-container");S.addClass(t,"animation"),S.addClass(t,"fade-out"),e&&t&&t.addEventListener("animationend",function(){document.body.removeChild(t),document.body.removeChild(e),document.body.style.overflow="",document.body.style.paddingRight=""})}},{key:"_removeFocusTrap",value:function(){this._focusTrap&&(this._focusTrap.disable(),this._focusTrap=null)}},{key:"_removeDatepickerListeners",value:function(){_.off(this.nextButton,"click"),_.off(this.previousButton,"click"),_.off(this.viewChangeButton,"click"),_.off(this.okButton,"click"),_.off(this.cancelButton,"click"),_.off(this.clearButton,"click"),_.off(this.datesContainer,"click"),_.off(this.datesContainer,"keydown"),_.off(this.datesContainer,"focus"),_.off(this.datesContainer,"blur"),_.off(document,ys)}},{key:"dispose",value:function(){this._isOpen&&this.close(),this._removeInputAndToggleListeners();var t=x.findOne("#".concat(this._toggleButtonId));t&&this._element.removeChild(t),v.removeData(this._element,fs),this._element=null,this._input=null,this._options=null,this._activeDate=null,this._selectedDate=null,this._selectedYear=null,this._selectedMonth=null,this._view=null,this._popper=null,this._focusTrap=null}},{key:"_removeInputAndToggleListeners",value:function(){_.off(this._input,"input"),_.off(this._element,ys,'[data-mdb-toggle="datepicker"]'),_.off(this._element,"keydown",'[data-mdb-toggle="datepicker"]')}},{key:"handleOk",value:function(){this._confirmSelection(this._selectedDate),this.close()}},{key:"_selectDate",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.activeCell;this._removeCurrentSelectionStyles(),this._removeCurrentFocusStyles(),this._addSelectedStyles(e),this._selectedDate=t}},{key:"_selectYear",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.activeCell;this._removeCurrentSelectionStyles(),this._removeCurrentFocusStyles(),this._addSelectedStyles(e),this._selectedYear=t,this._asyncChangeView("months")}},{key:"_selectMonth",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.activeCell;this._removeCurrentSelectionStyles(),this._removeCurrentFocusStyles(),this._addSelectedStyles(e),this._selectedMonth=t,this._asyncChangeView("days")}},{key:"_removeSelectedStyles",value:function(t){t&&t.classList.remove("selected")}},{key:"_addSelectedStyles",value:function(t){t&&S.addClass(t,"selected")}},{key:"_confirmSelection",value:function(t){var e;t&&(e=this.formatDate(t),this._input.value=e,S.addClass(this._input,"active"),_.trigger(this._element,vs,{date:t}))}},{key:"handleCancel",value:function(){this._selectedDate=null,this._selectedYear=null,this._selectedMonth=null,this.close()}},{key:"handleClear",value:function(){this._selectedDate=null,this._selectedMonth=null,this._selectedYear=null,this._removeCurrentSelectionStyles(),this._input.value="",this._input.classList.remove("active"),this._setInitialDate(),this._changeView("days")}},{key:"_removeCurrentSelectionStyles",value:function(){var t=x.findOne(".selected",this.container);t&&t.classList.remove("selected")}},{key:"_removeCurrentFocusStyles",value:function(){var t=x.findOne(".focused",this.container);t&&t.classList.remove("focused")}},{key:"formatDate",value:function(t){var e=O(t),n=this._addLeadingZero(O(t)),r=this._options.weekdaysShort[Kc(t)],o=this._options.weekdaysFull[Kc(t)],i=k(t)+1,a=this._addLeadingZero(k(t)+1),c=this._options.monthsShort[k(t)],s=this._options.monthsFull[k(t)],u=2===C(t).toString().length?C(t):C(t).toString().slice(2,4),l=C(t),t=this._options.format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g),f="";return t.forEach(function(t){switch(t){case"dddd":t=t.replace(t,o);break;case"ddd":t=t.replace(t,r);break;case"dd":t=t.replace(t,n);break;case"d":t=t.replace(t,e);break;case"mmmm":t=t.replace(t,s);break;case"mmm":t=t.replace(t,c);break;case"mm":t=t.replace(t,a);break;case"m":t=t.replace(t,i);break;case"yyyy":t=t.replace(t,l);break;case"yy":t=t.replace(t,u)}f+=t}),f}},{key:"_addLeadingZero",value:function(t){return parseInt(t,10)<10?"0".concat(t):t}},{key:"_pickDay",value:function(t,e){t=Zc(t);this._activeDate=t,this._selectDate(t,e)}},{key:"_pickYear",value:function(t){var e=Qc(t,this.activeMonth,this.activeDay);this._activeDate=e,this._selectedDate=e,this._selectYear(t)}},{key:"_pickMonth",value:function(t,e){e=Qc(e,t,this.activeDay);this._activeDate=e,this._selectMonth(t)}},{key:"nextMonth",value:function(){var t,e=rs(t=D(this._activeDate,1),this._selectedDate,this._options);this._activeDate=t,this.viewChangeButton.textContent="".concat(this._options.monthsFull[this.activeMonth]," ").concat(this.activeYear),this.datesContainer.innerHTML=e}},{key:"previousMonth",value:function(){var t=D(this._activeDate,-1),t=rs(this._activeDate=t,this._selectedDate,this._options);this.viewChangeButton.textContent="".concat(this._options.monthsFull[this.activeMonth]," ").concat(this.activeYear),this.datesContainer.innerHTML=t}},{key:"nextYear",value:function(){var t=y(this._activeDate,1),t=(this._activeDate=t,this.viewChangeButton.textContent="".concat(this.activeYear),os(this.activeYear,this._selectedYear,this._selectedMonth,this._options,4));this.datesContainer.innerHTML=t}},{key:"previousYear",value:function(){var t=y(this._activeDate,-1),t=(this._activeDate=t,this.viewChangeButton.textContent="".concat(this.activeYear),os(this.activeYear,this._selectedYear,this._selectedMonth,this._options,4));this.datesContainer.innerHTML=t}},{key:"nextYears",value:function(){var t=y(this._activeDate,24),t=is(this._activeDate=t,this._selectedYear,this._options,24,4);this.viewChangeButton.textContent="".concat(this.firstYearInView," - ").concat(this.lastYearInView),this.datesContainer.innerHTML=t}},{key:"previousYears",value:function(){var t=y(this._activeDate,-24),t=is(this._activeDate=t,this._selectedYear,this._options,24,4);this.viewChangeButton.textContent="".concat(this.firstYearInView," - ").concat(this.lastYearInView),this.datesContainer.innerHTML=t}},{key:"_asyncChangeView",value:function(t){var e=this;setTimeout(function(){e._changeView(t)},0)}},{key:"_changeView",value:function(t){this._view=t,this.datesContainer.blur(),"days"===t&&(this.datesContainer.innerHTML=rs(this._activeDate,this._selectedDate,this._options)),"months"===t&&(this.datesContainer.innerHTML=os(this.activeYear,this._selectedYear,this._selectedMonth,this._options,4)),"years"===t&&(this.datesContainer.innerHTML=is(this._activeDate,this._selectedYear,this._options,24,4)),this.datesContainer.focus(),this._updateViewControlsAndAttributes(t)}},{key:"_updateViewControlsAndAttributes",value:function(t){"days"===t&&(this.viewChangeButton.textContent="".concat(this._options.monthsFull[this.activeMonth]," ").concat(this.activeYear),this.viewChangeButton.setAttribute("aria-label",this._options.switchToMultiYearViewLabel),this.previousButton.setAttribute("aria-label",this._options.prevMonthLabel),this.nextButton.setAttribute("aria-label",this._options.nextMonthLabel)),"months"===t&&(this.viewChangeButton.textContent="".concat(this.activeYear),this.viewChangeButton.setAttribute("aria-label",this._options.switchToDayViewLabel),this.previousButton.setAttribute("aria-label",this._options.prevYearLabel),this.nextButton.setAttribute("aria-label",this._options.nextYearLabel)),"years"===t&&(this.viewChangeButton.textContent="".concat(this.firstYearInView," - ").concat(this.lastYearInView),this.viewChangeButton.setAttribute("aria-label",this._options.switchToMonthViewLabel),this.previousButton.setAttribute("aria-label",this._options.prevMultiYearLabel),this.nextButton.setAttribute("aria-label",this._options.nextMultiYearLabel))}},{key:"_handleUserInput",value:function(t){var e=this._getDelimeters(this._options.format),t=this._parseDate(t,this._options.format,e);Number.isNaN(t.getTime())?(this._activeDate=new Date,this._selectedDate=null,this._selectedMonth=null,this._selectedYear=null):(this._activeDate=t,this._selectedDate=t)}},{key:"_getDelimeters",value:function(t){return t.match(/[^(dmy)]{1,}/g)}},{key:"_parseDate",value:function(t,e,n){for(var n=n[0]!==n[1]?n[0]+n[1]:n[0],n=new RegExp("[".concat(n,"]")),r=t.split(n),o=e.split(n),t=-1!==e.indexOf("mmm"),i=[],a=0;a<o.length;a++)-1!==o[a].indexOf("yy")&&(i[0]={value:r[a],format:o[a]}),-1!==o[a].indexOf("m")&&(i[1]={value:r[a],format:o[a]}),-1!==o[a].indexOf("d")&&o[a].length<=2&&(i[2]={value:r[a],format:o[a]});n=-1!==e.indexOf("mmmm")?this._options.monthsFull:this._options.monthsShort;return Qc(Number(i[0].value),t?this.getMonthNumberByMonthName(i[1].value,n):Number(i[1].value)-1,Number(i[2].value))}},{key:"getMonthNumberByMonthName",value:function(e,t){return t.findIndex(function(t){return t===e})}}])&&us(t.prototype,e),r&&us(t,r),Object.defineProperty(t,"prototype",{writable:!1}),n}(),ds=bs;x.find(".datepicker").forEach(function(t){var e=bs.getInstance(t);e||new bs(t)}),t(189),t(191);function _s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i=[],a=!0,c=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){c=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(c)throw o}}return i}}(t,e)||function(t,e){if(t){if("string"==typeof t)return ws(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ws(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ws(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Os(t,e){var n=t.clientX,r=t.clientY,t=t.touches,o=2<arguments.length&&void 0!==arguments[2]&&arguments[2],e=e.getBoundingClientRect(),i=e.left,e=e.top,a={};return o&&t?o&&0<Object.keys(t).length&&(a={x:t[0].clientX-i,y:t[0].clientY-e}):a={x:n-i,y:r-e},a}function ks(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}var Cs=function(t){return t&&"[object Date]"===Object.prototype.toString.call(t)&&!isNaN(t)},P=function(t){t=(!(1<arguments.length&&void 0!==arguments[1])||arguments[1]?t.value:t).replace(/:/gi," ");return t.split(" ")};function Ss(t){return(Ss="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function xs(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function Es(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?xs(Object(n),!0).forEach(function(t){Ms(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):xs(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function js(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i=[],a=!0,c=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){c=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(c)throw o}}return i}}(t,e)||As(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Ts(t){return function(t){if(Array.isArray(t))return Ds(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||As(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function As(t,e){if(t){if("string"==typeof t)return Ds(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ds(t,e):void 0}}function Ds(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Ps(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Ms(t,e,n){e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n}var m="timepicker",Is="mdb.".concat(m),M="active",Ls="".concat(m,"-am"),Ns="".concat(m,"-cancel"),Rs="".concat(m,"-clear"),Bs="".concat(m,"-submit"),Hs="".concat(m,"-circle"),Fs="".concat(m,"-clock-animation"),Vs="".concat(m,"-clock"),Ys="".concat(m,"-clock-inner"),Ws="".concat(m,"-clock-wrapper"),zs=".".concat(m,"-current"),Us="".concat(m,"-current-inline"),qs="".concat(m,"-hand-pointer"),Ks="".concat(m,"-hour"),$s="".concat(m,"-hour-mode"),Xs="".concat(m,"-icon-down"),Gs="".concat(m,"-icon-inline-hour"),Qs="".concat(m,"-icon-inline-minute"),Zs="".concat(m,"-icon-up"),Js="".concat(m,"-inline-hour-icons"),tu="".concat(m,"-middle-dot"),eu="".concat(m,"-minute"),nu="".concat(m,"-modal"),ru="".concat(m,"-pm"),ou="".concat(m,"-tips-element"),iu="".concat(m,"-time-tips-hours"),au="".concat(m,"-tips-inner-element"),cu="".concat(m,"-time-tips-inner"),I="".concat(m,"-time-tips-minutes"),su="".concat(m,"-transform"),uu="".concat(m,"-wrapper"),lu="".concat(m,"-input"),fu={appendValidationInfo:!0,bodyID:"",cancelLabel:"Cancel",clearLabel:"Clear",closeModalOnBackdropClick:!0,closeModalOnMinutesClick:!1,defaultTime:"",disabled:!1,focusInputAfterApprove:!1,footerID:"",format12:!0,headID:"",increment:!1,invalidLabel:"Invalid Time Format",maxHour:"",minHour:"",maxTime:"",minTime:"",modalID:"",okLabel:"Ok",overflowHidden:!0,pickerID:"",readOnly:!1,showClearBtn:!0,switchHoursToMinutesOnClick:!0,iconClass:"far fa-clock fa-sm timepicker-icon",withIcon:!0,pmLabel:"PM",amLabel:"AM"},du={appendValidationInfo:"boolean",bodyID:"string",cancelLabel:"string",clearLabel:"string",closeModalOnBackdropClick:"boolean",closeModalOnMinutesClick:"boolean",disabled:"boolean",footerID:"string",format12:"boolean",headID:"string",increment:"boolean",invalidLabel:"string",maxHour:"(string|number)",minHour:"(string|number)",modalID:"string",okLabel:"string",overflowHidden:"boolean",pickerID:"string",readOnly:"boolean",showClearBtn:"boolean",switchHoursToMinutesOnClick:"boolean",defaultTime:"(string|date|number)",iconClass:"string",withIcon:"boolean",pmLabel:"string",amLabel:"string"},pu=function(){function o(t){var C=this,e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},n=this,r=o;if(!(n instanceof r))throw new TypeError("Cannot call a class as a function");Ms(this,"_toggleBackgroundColorCircle",function(t){null!==C._modal.querySelector(".".concat(t,".").concat(M))?S.addStyle(C._circle,{backgroundColor:"#1976d2"}):S.addStyle(C._circle,{backgroundColor:"transparent"})}),Ms(this,"_toggleClassActive",function(t,e,n){var r=e.textContent,o=Ts(t).find(function(t){return Number(t)===Number(r)});return n.forEach(function(t){S.hasClass(t,"disabled")||(t.textContent===o?S.addClass(t,M):S.removeClass(t,M))})}),Ms(this,"_makeMinutesDegrees",function(t,e){var n=C._options.increment;return t=t<0?(e=Math.round(360+t/6)%60,360+6*Math.round(t/6)):(e=Math.round(t/6)%60,6*Math.round(t/6)),n&&(t=30*Math.round(t/30),60===(e=6*Math.round(t/6)/6)&&(e="00")),{degrees:t=360<=t?0:t,minute:e,addDegrees:n?30:6}}),Ms(this,"_makeHourDegrees",function(t,e,n){var r=C._options,o=r.maxHour,r=r.minHour;if(t&&(S.hasClass(t,Ys)||S.hasClass(t,cu)||S.hasClass(t,au)?e<0?(n=Math.round(360+e/30)%24,e=360+e):12===(n=Math.round(e/30)+12)&&(n="00"):e<0?(n=Math.round(360+e/30)%12,e=360+e):(0===(n=Math.round(e/30)%12)||12<n)&&(n=12),360<=e&&(e=0),!(""!==o&&n>Number(o)||""!==r&&n<Number(r))))return{degrees:e,hour:n,addDegrees:30}}),Ms(this,"_makeInnerHoursDegrees",function(t,e){return t<0?(e=Math.round(360+t/30)%24,t=360+t):12===(e=Math.round(t/30)+12)&&(e="00"),{degrees:t,hour:e,addDegrees:30}}),Ms(this,"_getAppendClock",function(){var a,c,s,u=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:".".concat(Vs),l=2<arguments.length?arguments[2]:void 0,e=C._options,f=e.maxHour,d=e.minHour,p=e.minTime,h=e.maxTime,n=e.inline,e=e.format12,r=js(P(h,!1),3),v=r[0],y=r[1],m=r[2],r=js(P(p,!1),3),g=r[0],b=r[1],_=r[2],w=(n||e&&C._isInvalidTimeFormat&&!S.hasClass(C._AM,"active")&&S.addClass(C._PM,"active"),x.findOne(".".concat($s,".").concat(M))),O=x.findOne(t),k=360/u.length;null!==O&&(a=(O.offsetWidth-32)/2,c=(O.offsetHeight-32)/2,s=a-4,Ts(u).forEach(function(t,e){var e=e*k*(Math.PI/180),n=Va("span"),r=Va("span"),o=(r.innerHTML=t,S.addClass(n,l),n.offsetWidth),i=n.offsetHeight;return S.addStyle(n,{left:"".concat(a+Math.sin(e)*s-o,"px"),bottom:"".concat(c+Math.cos(e)*s-i,"px")}),u.includes("05")&&S.addClass(n,"".concat(I)),u.includes("13")?r.classList.add(au):r.classList.add(ou),S.hasClass(n,"".concat(I))?S.hasClass(n,"".concat(I))&&(""!==h&&Number(t)>Number(y)&&Number(C._hour.textContent)>=Number(v)&&S.addClass(n,"disabled"),""!==p&&Number(t)<Number(b)&&Number(C._hour.textContent)<=Number(g)&&S.addClass(n,"disabled"),""!==h&&void 0!==m&&("PM"===m&&"PM"===w.textContent?Number(t)>Number(y)&&Number(C._hour.textContent)>=Number(v)&&S.addClass(n,"disabled"):"PM"===m&&"AM"===w.textContent&&S.removeClass(n,"disabled"),("AM"===m&&"PM"===w.textContent||"AM"===m&&"AM"===w.textContent&&Number(C._hour.textContent)>=Number(v)&&Number(t)>Number(y))&&S.addClass(n,"disabled")),""!==p&&void 0!==_&&("PM"===_&&"PM"===w.textContent?(Number(t)<Number(b)&&Number(C._hour.textContent)===Number(g)||Number(C._hour.textContent)<Number(g))&&S.addClass(n,"disabled"):"PM"===_&&"AM"===w.textContent&&S.addClass(n,"disabled"),"AM"===_&&"PM"===w.textContent?S.removeClass(n,"disabled"):"AM"===_&&"AM"===w.textContent&&(Number(C._hour.textContent)===Number(g)&&Number(t)<Number(b)||Number(C._hour.textContent)<Number(g))&&S.addClass(n,"disabled"))):(""!==f&&Number(t)>Number(f)&&S.addClass(n,"disabled"),""!==d&&Number(t)<Number(d)&&S.addClass(n,"disabled"),""!==h&&(void 0!==m?("PM"===m&&"PM"===w.textContent&&(C._isAmEnabled=!1,C._isPmEnabled=!0,Number(t)>Number(v)&&S.addClass(n,"disabled")),"AM"===m&&"PM"===w.textContent?(C._isAmEnabled=!1,C._isPmEnabled=!0,S.addClass(n,"disabled")):"AM"===m&&"AM"===w.textContent&&(C._isAmEnabled=!0,C._isPmEnabled=!1,Number(t)>Number(v)&&S.addClass(n,"disabled"))):Number(t)>Number(v)&&S.addClass(n,"disabled")),""!==p&&Number(t)<Number(g)&&S.addClass(n,"disabled"),""!==p&&void 0!==_&&("PM"===_&&"PM"===w.textContent?(C._isAmEnabled=!1,C._isPmEnabled=!0,Number(t)<Number(g)&&S.addClass(n,"disabled")):"PM"===_&&"AM"===w.textContent&&(C._isAmEnabled=!0,C._isPmEnabled=!1,S.addClass(n,"disabled")),"AM"===_&&"PM"===w.textContent?(C._isAmEnabled=!1,C._isPmEnabled=!0,S.removeClass(n,"disabled")):"AM"===_&&"AM"===w.textContent&&(C._isAmEnabled=!0,C._isPmEnabled=!1,Number(t)<Number(g)&&S.addClass(n,"disabled")))),n.appendChild(r),O.appendChild(n)}))}),this._element=t,this._element&&v.setData(t,Is,this),this._document=document,this._options=this._getConfig(e),this._currentTime=null,this._toggleButtonId=Ra("timepicker-toggle-"),this.hoursArray=["12","1","2","3","4","5","6","7","8","9","10","11"],this.innerHours=["00","13","14","15","16","17","18","19","20","21","22","23"],this.minutesArray=["00","05","10","15","20","25","30","35","40","45","50","55"],this.input=x.findOne("input",this._element),this.dataWithIcon=t.dataset.withIcon,this.dataToggle=t.dataset.toggle,this.customIcon=x.findOne(".timepicker-toggle-button",this._element),this._checkToggleButton(),this.inputFormatShow=x.findOne("[data-mdb-timepicker-format24]",this._element),this.inputFormat=null===this.inputFormatShow?"":Object.values(this.inputFormatShow.dataset)[0],this.elementToggle=x.findOne("[data-mdb-toggle]",this._element),this.toggleElement=Object.values(t.querySelector("[data-mdb-toggle]").dataset)[0],this._hour=null,this._minutes=null,this._AM=null,this._PM=null,this._wrapper=null,this._modal=null,this._hand=null,this._circle=null,this._focusTrap=null,this._popper=null,this._interval=null,this._inputValue=""!==this._options.defaultTime?this._options.defaultTime:this.input.value,this._options.format12&&(this._currentTime=function(t){var e,n,r;if(""!==t)return Cs(t)?(e=t.getHours(),0===(e%=12)&&(r="AM"),e=e||12,void 0===r&&(r=12<=e?"PM":"AM"),n=(n=t.getMinutes())<10?"0".concat(n):n):(e=(t=_s(P(t,!1),3))[0],n=t[1],r=t[2],0===(e%=12)&&(r="AM"),e=e||12,void 0===r&&(r=12<=e?"PM":"AM")),{hours:e,minutes:n,amOrPm:r}}(this._inputValue)),this._options.readOnly&&this.input.setAttribute("readonly",!0),this.init(),this._isHours=!0,this._isMinutes=!1,this._isInvalidTimeFormat=!1,this._isMouseMove=!1,this._isInner=!1,this._isAmEnabled=!1,this._isPmEnabled=!1,this._objWithDataOnChange={degrees:null}}var t,e,n;return t=o,n=[{key:"NAME",get:function(){return m}},{key:"getInstance",value:function(t){return v.getData(t,Is)}},{key:"getOrCreateInstance",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return this.getInstance(t)||new this(t,"object"===Ss(e)?e:null)}}],(e=[{key:"init",value:function(){var t,e,n,r;S.addClass(this.input,lu),void 0!==this._currentTime?(n=(t=this._currentTime).hours,r=t.minutes,t=t.amOrPm,e=Number(n)<10?0:"",n="".concat(e).concat(Number(n),":").concat(r),r=t,this.input.value="".concat(n," ").concat(r)):this.input.value=r=n=e="",0<this.input.value.length&&""!==this.input.value&&S.addClass(this.input,"active"),null===this._options&&null===this._element||(this._handleOpen(),this._listenToToggleKeydown())}},{key:"dispose",value:function(){this._removeModal(),null!==this._element&&v.removeData(this._element,Is),this._element=null,this._options=null,this.input=null,this._focusTrap=null,_.off(this._document,"click","[data-mdb-toggle='".concat(this.toggleElement,"']")),_.off(this._element,"keydown","[data-mdb-toggle='".concat(this.toggleElement,"']"))}},{key:"_checkToggleButton",value:function(){null===this.customIcon&&(void 0!==this.dataWithIcon&&(this._options.withIcon=null,"true"===this.dataWithIcon&&this._appendToggleButton(this._options)),this._options.withIcon&&this._appendToggleButton(this._options))}},{key:"_appendToggleButton",value:function(){var t=function(t,e){t=t.iconClass;return'\n  <button id="'.concat(e,'" tabindex="0" type="button" class="timepicker-toggle-button" data-mdb-toggle="timepicker"  >\n    <i class="').concat(t,'"></i>\n  </button>\n')}(this._options,this._toggleButtonId);this.input.insertAdjacentHTML("afterend",t)}},{key:"_getDomElements",value:function(){this._hour=x.findOne(".".concat(Ks)),this._minutes=x.findOne(".".concat(eu)),this._AM=x.findOne(".".concat(Ls)),this._PM=x.findOne(".".concat(ru)),this._wrapper=x.findOne(".".concat(uu)),this._modal=x.findOne(".".concat(nu)),this._hand=x.findOne(".".concat(qs)),this._circle=x.findOne(".".concat(Hs)),this._clock=x.findOne(".".concat(Vs)),this._clockInner=x.findOne(".".concat(Ys))}},{key:"_handlerMaxMinHoursOptions",value:function(t,e,n,r,o,i){var a=""!==n?30*n:"",c=""!==r?30*r:"";if(""!==n&&""!==r){if((t=t<=0?360+t:t)<=a&&c<=t)return e()}else if(""!==r){if(t<=0&&(t=360+t),(c=12<Number(r)?30*r-c:c)<=t&&void 0===i)return e();if(void 0!==i){if("PM"===i&&this._isAmEnabled)return;if("PM"===i&&this._isPmEnabled&&c<=t)return e();if("AM"===i&&this._isPmEnabled)return e();if("AM"===i&&this._isAmEnabled&&c<=t)return e()}}else{if(""===n)return e();if((t=t<=0?360+t:t)<=a&&void 0===o)return e();if(void 0!==o){if("AM"===o&&this._isPmEnabled)return;if("AM"===o&&this._isAmEnabled&&t<=a)return e();if("PM"===o&&this._isPmEnabled){if(t<=a)return e()}else if("PM"===o&&this._isAmEnabled)return e()}}return e}},{key:"_handleKeyboard",value:function(){var b=this;_.on(this._document,"keydown","",function(t){var e,n=b._options,r=n.maxHour,o=n.minHour,n=n.increment,i=null!==x.findOne(".".concat(I)),a=null!==x.findOne(".".concat(cu)),c=Number(b._hand.style.transform.replace(/[^\d-]/g,"")),s=x.find(".".concat(I),b._modal),u=x.find(".".concat(iu),b._modal),l=x.find(".".concat(cu),b._modal),f=""!==r?Number(r):"",d=""!==o?Number(o):"",p=b._makeHourDegrees(t.target,c,void 0).hour,h=b._makeHourDegrees(t.target,c,void 0),v=h.degrees,y=h.addDegrees,h=b._makeMinutesDegrees(c,void 0),m=h.minute,h=h.degrees,g=b._makeMinutesDegrees(c,void 0).addDegrees,c=b._makeInnerHoursDegrees(c,void 0).hour;27===t.keyCode&&(e=x.findOne(".".concat(Ns),b._modal),_.trigger(e,"click")),i?(38===t.keyCode&&(S.addStyle(b._hand,{transform:"rotateZ(".concat(h+=g,"deg)")}),m+=1,n&&"0014"===(m+=4)&&(m=5),b._minutes.textContent=b._setHourOrMinute(59<m?0:m),b._toggleClassActive(b.minutesArray,b._minutes,s),b._toggleBackgroundColorCircle("".concat(I))),40===t.keyCode&&(S.addStyle(b._hand,{transform:"rotateZ(".concat(h-=g,"deg)")}),n?m-=5:--m,-1===m?m=59:-5===m&&(m=55),b._minutes.textContent=b._setHourOrMinute(m),b._toggleClassActive(b.minutesArray,b._minutes,s),b._toggleBackgroundColorCircle("".concat(I)))):(a&&(39===t.keyCode&&(b._isInner=!1,S.addStyle(b._hand,{height:"calc(40% + 1px)"}),b._hour.textContent=b._setHourOrMinute(12<p?1:p),b._toggleClassActive(b.hoursArray,b._hour,u),b._toggleClassActive(b.innerHours,b._hour,l)),37===t.keyCode&&(b._isInner=!0,S.addStyle(b._hand,{height:"21.5%"}),b._hour.textContent=b._setHourOrMinute(24<=c||"00"===c?0:c),b._toggleClassActive(b.innerHours,b._hour,l),b._toggleClassActive(b.hoursArray,b._hour-1,u))),38===t.keyCode&&(b._handlerMaxMinHoursOptions(v+30,function(){return S.addStyle(b._hand,{transform:"rotateZ(".concat(v+y,"deg)")})},r,o),b._isInner?(24===(c+=1)?c=0:25!==c&&"001"!==c||(c=13),b._hour.textContent=b._setHourOrMinute(c),b._toggleClassActive(b.innerHours,b._hour,l)):(p+=1,""!==r&&""!==o?r<p?p=f:p<o&&(p=d):""!==r&&""===o?r<p&&(p=f):""===r&&""!==o&&12<=p&&(p=12),b._hour.textContent=b._setHourOrMinute(12<p?1:p),b._toggleClassActive(b.hoursArray,b._hour,u))),40===t.keyCode&&(b._handlerMaxMinHoursOptions(v-30,function(){return S.addStyle(b._hand,{transform:"rotateZ(".concat(v-y,"deg)")})},r,o),b._isInner?(12===--c?c=0:-1===c&&(c=23),b._hour.textContent=b._setHourOrMinute(c),b._toggleClassActive(b.innerHours,b._hour,l)):(--p,""!==r&&""!==o?f<p?p=f:p<d&&(p=d):""===r&&""!==o?p<=d&&(p=d):""!==r&&""===o&&p<=1&&(p=1),b._hour.textContent=b._setHourOrMinute(0===p?12:p),b._toggleClassActive(b.hoursArray,b._hour,u))))})}},{key:"_setActiveClassToTipsOnOpen",value:function(t){var e=this;if(!this._isInvalidTimeFormat){for(var n=arguments.length,r=new Array(1<n?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];[].concat(r).filter(function(t){return"PM"===t?S.addClass(e._PM,M):"AM"===t?S.addClass(e._AM,M):(S.removeClass(e._AM,M),S.removeClass(e._PM,M)),t});var i=x.find(".".concat(iu),this._modal);this._addActiveClassToTip(i,t)}}},{key:"_setTipsAndTimesDependOnInputValue",value:function(t,e){var n=this._options,r=n.inline,n=n.format12;this._isInvalidTimeFormat?(this._hour.textContent="12",this._minutes.textContent="00",r||S.addStyle(this._hand,{transform:"rotateZ(0deg)"}),n&&S.addClass(this._PM,M)):(n=12<t?30*t-360:30*t,this._hour.textContent=t,this._minutes.textContent=e,r||(S.addStyle(this._hand,{transform:"rotateZ(".concat(n,"deg)")}),S.addStyle(this._circle,{backgroundColor:"#1976d2"}),(12<Number(t)||"00"===t)&&S.addStyle(this._hand,{height:"21.5%"})))}},{key:"_listenToToggleKeydown",value:function(){var e=this;_.on(this._element,"keydown","[data-mdb-toggle='".concat(this.toggleElement,"']"),function(t){13===t.keyCode&&(t.preventDefault(),_.trigger(e.elementToggle,"click"))})}},{key:"_handleOpen",value:function(){var b=this;wc(this._element,"click","[data-mdb-toggle='".concat(this.toggleElement,"']"),function(g){var t;null!==b._options&&(t=null!==S.getDataAttribute(b.input,"toggle")?200:0,setTimeout(function(){S.addStyle(b.elementToggle,{pointerEvents:"none"}),b.elementToggle.blur(),h=""===P(b.input)[0]?["12","00","PM"]:P(b.input);var t,e,n,r,o,i,a,c,s,u,l=b._options,f=l.modalID,d=l.inline,p=l.format12,l=l.overflowHidden,h=js(h,3),v=h[0],y=h[1],h=h[2],m=Va("div");(12<Number(v)||"00"===v)&&(b._isInner=!0),b.input.blur(),g.target.blur(),m.innerHTML=(t=b._options,e=t.okLabel,n=t.cancelLabel,u=t.headID,r=t.footerID,o=t.bodyID,s=t.pickerID,i=t.clearLabel,a=t.showClearBtn,c=t.amLabel,t=t.pmLabel,"<div id='".concat(s,"' class='timepicker-wrapper h-full flex items-center justify-center flex-col fixed'>\n      <div class=\"flex items-center justify-center flex-col timepicker-container\">\n        <div class=\"flex flex-col timepicker-elements justify-around\">\n        <div id='").concat(u,"' class='timepicker-head flex flex-row items-center justify-center'>\n        <div class='timepicker-head-content flex w-100 justify-evenly'>\n            <div class=\"timepicker-current-wrapper\">\n              <span class=\"relative h-100\">\n                <button type='button' class='timepicker-current timepicker-hour active ripple' tabindex=\"0\">21</button>\n              </span>\n              <button type='button' class='timepicker-dot' disabled>:</button>\n            <span class=\"relative h-100\">\n              <button type='button' class='timepicker-current timepicker-minute ripple' tabindex=\"0\">21</button>\n            </span>\n            </div>\n            <div class=\"flex flex-col justify-center timepicker-mode-wrapper\">\n              <button type='button' class=\"timepicker-hour-mode timepicker-am ripple\" tabindex=\"0\">").concat(c,'</button>\n              <button class="timepicker-hour-mode timepicker-pm ripple" tabindex="0">').concat(t,"</button>\n            </div>\n        </div>\n      </div>\n      <div id='").concat(o,"' class='timepicker-clock-wrapper flex justify-center flex-col items-center'>\n        <div class='timepicker-clock'>\n          <span class='timepicker-middle-dot absolute'></span>\n          <div class='timepicker-hand-pointer absolute'>\n            <div class='timepicker-circle absolute'></div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div id='").concat(r,"' class='timepicker-footer'>\n      <div class=\"w-full flex justify-between\">\n        ").concat(a?"<button type='button' class='timepicker-button timepicker-clear ripple' tabindex=\"0\">".concat(i,"</button>"):"","\n        <button type='button' class='timepicker-button timepicker-cancel ripple' tabindex=\"0\">").concat(n,"</button>\n        <button type='button' class='timepicker-button timepicker-submit ripple' tabindex=\"0\">").concat(e,"</button>\n      </div>\n    </div>\n  </div>\n</div>")),S.addClass(m,nu),m.setAttribute("role","dialog"),m.setAttribute("tabIndex","-1"),m.setAttribute("id",f),d&&(b._popper=en(b.input,m,{placement:"bottom-start"})),b._document.body.appendChild(m),b._getDomElements(),b._toggleBackdropAnimation(),b._setActiveClassToTipsOnOpen(v,y,h),b._appendTimes(),b._setActiveClassToTipsOnOpen(v,y,h),b._setTipsAndTimesDependOnInputValue(v,y),""===b.input.value&&(s=x.find(".".concat(iu),b._modal),p&&S.addClass(b._PM,M),b._hour.textContent="12",b._minutes.textContent="00",b._addActiveClassToTip(s,Number(b._hour.textContent))),b._handleSwitchTimeMode(),b._handleOkButton(),b._handleClose(),d?(b._handleHoverInlineBtn(),b._handleDocumentClickInline(),b._handleInlineClicks()):(b._handleSwitchHourMinute(),b._handleClockClick(),b._handleKeyboard(),S.addStyle(b._hour,{pointerEvents:"none"}),S.addStyle(b._minutes,{pointerEvents:""})),l&&(u=window.innerWidth>document.documentElement.clientWidth,S.addStyle(b._document.body,{overflow:"hidden"}),!ks()&&u&&S.addStyle(b._document.body,{paddingRight:"15px"})),b._focusTrap=new qc(b._wrapper,{event:"keydown",condition:function(t){return"Tab"===t.key}}),b._focusTrap.trap()},t))})}},{key:"_handleInlineClicks",value:function(){var d=this;wc(this._modal,"click mousedown mouseup touchstart touchend contextmenu",".".concat(Zs,", .").concat(Xs),function(t){function e(t){t=f(t),d._hour.textContent=d._setHourOrMinute(t)}function n(t){t=l(t),d._minutes.textContent=d._setHourOrMinute(t)}function r(){e(s+=1)}function o(){n(u+=1)}function i(){e(--s)}function a(){n(--u)}var c=t.target,t=t.type,s=Number(d._hour.textContent),u=Number(d._minutes.textContent),l=function(t){return 59<t?t=0:t<0&&(t=59),t},f=function(t){return 12<t?t=1:t<1&&(t=12),t=12<t?1:t};S.hasClass(c,Zs)?S.hasClass(c.parentNode,Js)?"mousedown"===t||"touchstart"===t?(clearInterval(d._interval),d._interval=setInterval(r,100)):"mouseup"===t||"touchend"===t||"contextmenu"===t?clearInterval(d._interval):r():"mousedown"===t||"touchstart"===t?(clearInterval(d._interval),d._interval=setInterval(o,100)):"mouseup"===t||"touchend"===t||"contextmenu"===t?clearInterval(d._interval):o():S.hasClass(c,Xs)&&(S.hasClass(c.parentNode,Js)?"mousedown"===t||"touchstart"===t?(clearInterval(d._interval),d._interval=setInterval(i,100)):"mouseup"===t||"touchend"===t?clearInterval(d._interval):i():"mousedown"===t||"touchstart"===t?(clearInterval(d._interval),d._interval=setInterval(a,100)):"mouseup"===t||"touchend"===t?clearInterval(d._interval):a())})}},{key:"_handleClose",value:function(){var a=this;_.on(this._modal,"click",".".concat(uu,", .").concat(Ns,", .").concat(Rs),function(t){function e(){S.addStyle(a.elementToggle,{pointerEvents:"auto"}),a._toggleBackdropAnimation(!0),a._removeModal(),a._focusTrap.disable(),a._focusTrap=null,a.elementToggle?a.elementToggle.focus():a.input&&a.input.focus()}var n,r,o,t=t.target,i=a._options.closeModalOnBackdropClick;S.hasClass(t,Rs)?(a.input.value="",S.removeClass(a.input,"active"),o=""===P(a.input)[0]?["12","00","PM"]:P(a.input),n=(o=js(o,3))[0],r=o[1],o=o[2],a._setTipsAndTimesDependOnInputValue("12","00"),a._setActiveClassToTipsOnOpen(n,r,o),a._hour.click()):(S.hasClass(t,Ns)||S.hasClass(t,uu)&&i)&&e()})}},{key:"showValueInput",value:function(){return this.input.value}},{key:"_handleOkButton",value:function(){var o=this;wc(this._modal,"click",".".concat(Bs),function(){var t=o._options,e=t.readOnly,t=t.focusInputAfterApprove,n=o._document.querySelector(".".concat($s,".").concat(M)),r="".concat(o._hour.textContent,":").concat(o._minutes.textContent);S.addClass(o.input,"active"),S.addStyle(o.elementToggle,{pointerEvents:"auto"}),o._isInvalidTimeFormat&&S.removeClass(o.input,"is-invalid"),!e&&t&&o.input.focus(),S.addStyle(o.elementToggle,{pointerEvents:"auto"}),o.input.value=null===n?"".concat(r," PM"):"".concat(r," ").concat(n.textContent),o._toggleBackdropAnimation(!0),o._removeModal(),_.trigger(o.input,"input.mdb.timepicker")})}},{key:"_handleHoverInlineBtn",value:function(){var o=this;wc(this._modal,"mouseover mouseleave",".".concat(Us),function(t){var e=t.type,t=t.target,n=x.find(".".concat(Gs),o._modal),r=x.find(".".concat(Qs),o._modal);"mouseover"===e?S.hasClass(t,Ks)?n.forEach(function(t){return S.addClass(t,M)}):r.forEach(function(t){return S.addClass(t,M)}):S.hasClass(t,Ks)?n.forEach(function(t){return S.removeClass(t,M)}):r.forEach(function(t){return S.removeClass(t,M)})})}},{key:"_handleDocumentClickInline",value:function(){var e=this;_.on(document,"click",function(t){t=t.target;!e._modal||e._modal.contains(t)||S.hasClass(t,"timepicker-icon")||(clearInterval(e._interval),S.addStyle(e.elementToggle,{pointerEvents:"auto"}),e._removeModal())})}},{key:"_handleSwitchHourMinute",value:function(){var t,e,c=this;t="click",e=zs,_.on(document,t,e,function(t){t=t.target;S.hasClass(t,"active")||(document.querySelectorAll(e).forEach(function(t){S.hasClass(t,"active")&&S.removeClass(t,"active")}),S.addClass(t,"active"))}),_.on(this._modal,"click",zs,function(){function e(t,e){r.forEach(function(t){return t.remove()}),n.forEach(function(t){return t.remove()}),S.addClass(c._hand,su),setTimeout(function(){S.removeClass(c._hand,su)},401),c._getAppendClock(t,".".concat(Vs),e),setTimeout(function(){var t,e;t=x.find(".".concat(iu),c._modal),e=x.find(".".concat(I),c._modal),c._addActiveClassToTip(t,i),c._addActiveClassToTip(e,a)},401)}var t=x.find(zs,c._modal),n=x.find(".".concat(I),c._modal),r=x.find(".".concat(iu),c._modal),o=x.find(".".concat(cu),c._modal),i=Number(c._hour.textContent),a=Number(c._minutes.textContent);t.forEach(function(t){S.hasClass(t,M)&&(S.hasClass(t,eu)?(S.addClass(c._hand,su),S.addStyle(c._hand,{transform:"rotateZ(".concat(6*c._minutes.textContent,"deg)"),height:"calc(40% + 1px)"}),0<o.length&&o.forEach(function(t){return t.remove()}),e(c.minutesArray,"".concat(I)),c._hour.style.pointerEvents="",c._minutes.style.pointerEvents="none"):S.hasClass(t,Ks)&&(S.addStyle(c._hand,{transform:"rotateZ(".concat(30*c._hour.textContent,"deg)")}),12<Number(c._hour.textContent)?(S.addStyle(c._hand,{transform:"rotateZ(".concat(30*c._hour.textContent-360,"deg)"),height:"21.5%"}),12<Number(c._hour.textContent)&&S.addStyle(c._hand,{height:"21.5%"})):S.addStyle(c._hand,{height:"calc(40% + 1px)"}),0<o.length&&o.forEach(function(t){return t.remove()}),e(c.hoursArray,"".concat(iu)),S.addStyle(c._hour,{pointerEvents:"none"}),S.addStyle(c._minutes,{pointerEvents:""})))})})}},{key:"_handleSwitchTimeMode",value:function(){_.on(document,"click",".".concat($s),function(t){t=t.target;S.hasClass(t,M)||(x.find(".".concat($s)).forEach(function(t){S.hasClass(t,M)&&S.removeClass(t,M)}),S.addClass(t,M))})}},{key:"_handleClockClick",value:function(){var y=this,m=x.findOne(".".concat(Ws));wc(document,"mousedown mouseup mousemove mouseleave mouseover touchstart touchmove touchend","",function(t){ks()||t.preventDefault();var e=y._options,n=e.maxHour,e=e.minHour,r=t.type,o=t.target,i=y._options,a=i.closeModalOnMinutesClick,i=i.switchHoursToMinutesOnClick,c=null!==x.findOne(".".concat(I),y._modal),s=null!==x.findOne(".".concat(iu),y._modal),u=null!==x.findOne(".".concat(cu),y._modal),l=x.find(".".concat(I),y._modal),f=Os(t,m),d=m.offsetWidth/2,f=Math.atan2(f.y-d,f.x-d),p=(ks()&&(h=Os(t,m,!0),f=Math.atan2(h.y-d,h.x-d)),null);if("mousedown"===r||"mousemove"===r||"touchmove"===r||"touchstart"===r?"mousedown"!==r&&"touchstart"!==r&&"touchmove"!==r||(S.hasClass(o,Ws)||S.hasClass(o,Vs)||S.hasClass(o,I)||S.hasClass(o,Ys)||S.hasClass(o,cu)||S.hasClass(o,iu)||S.hasClass(o,Hs)||S.hasClass(o,qs)||S.hasClass(o,tu)||S.hasClass(o,ou)||S.hasClass(o,au))&&(y._isMouseMove=!0,ks()&&t.touches&&(h=t.touches[0].clientX,d=t.touches[0].clientY,p=document.elementFromPoint(h,d))):"mouseup"!==r&&"touchend"!==r||(y._isMouseMove=!1,(S.hasClass(o,Vs)||S.hasClass(o,Ys)||S.hasClass(o,cu)||S.hasClass(o,iu)||S.hasClass(o,Hs)||S.hasClass(o,qs)||S.hasClass(o,tu)||S.hasClass(o,ou)||S.hasClass(o,au))&&(s||u)&&i&&_.trigger(y._minutes,"click"),c&&a&&(h=x.findOne(".".concat(Bs),y._modal),_.trigger(h,"click"))),c){d=Math.trunc(180*f/Math.PI)+90,r=y._makeMinutesDegrees(d,void 0),i=r.degrees,a=r.minute;if(void 0===y._handlerMaxMinMinutesOptions(i,a))return;var h=y._handlerMaxMinMinutesOptions(i,a),c=h.degrees,d=h.minute;if(y._isMouseMove){if(S.addStyle(y._hand,{transform:"rotateZ(".concat(c,"deg)")}),void 0===d)return;y._minutes.textContent=10<=d||"00"===d?d:"0".concat(d),y._toggleClassActive(y.minutesArray,y._minutes,l),y._toggleBackgroundColorCircle("".concat(I)),y._objWithDataOnChange.degreesMinutes=c,y._objWithDataOnChange.minutes=d}}if(s||u){var v=Math.trunc(180*f/Math.PI)+90,v=30*Math.round(v/30);if(S.addStyle(y._circle,{backgroundColor:"#1976d2"}),void 0===y._makeHourDegrees(o,v,void 0))return;y._objWithDataOnChange.degreesHours=v,y._handlerMaxMinHoursOptions(v,function(){var t,e;return ks()&&v?(t=(e=y._makeHourDegrees(p,v,void 0)).degrees,e=e.hour,y._handleMoveHand(p,e,t)):(t=(e=y._makeHourDegrees(o,v,void 0)).degrees,e=e.hour,y._handleMoveHand(o,e,t))},n,e)}t.stopPropagation()})}},{key:"_handleMoveHand",value:function(t,e,n){var r=x.find(".".concat(iu),this._modal),o=x.find(".".concat(cu),this._modal);this._isMouseMove&&(S.hasClass(t,Ys)||S.hasClass(t,cu)||S.hasClass(t,au)?S.addStyle(this._hand,{height:"21.5%"}):S.addStyle(this._hand,{height:"calc(40% + 1px)"}),S.addStyle(this._hand,{transform:"rotateZ(".concat(n,"deg)")}),this._hour.textContent=10<=e||"00"===e?e:"0".concat(e),this._toggleClassActive(this.hoursArray,this._hour,r),this._toggleClassActive(this.innerHours,this._hour,o),this._objWithDataOnChange.hour=10<=e||"00"===e?e:"0".concat(e))}},{key:"_handlerMaxMinMinutesOptions",value:function(t,e){var n=this._options,r=n.increment,o=n.maxTime,n=n.minTime,i=P(o,!1)[1],a=P(n,!1)[1],c=P(o,!1)[0],s=P(n,!1)[0],u=P(o,!1)[2],l=P(n,!1)[2],i=""!==i?6*i:"",a=""!==a?6*a:"";if(void 0===u&&void 0===l){if(""!==o&&""!==n){if(t<=i&&a<=t)return t}else if(""!==n&&Number(this._hour.textContent)<=Number(s)){if(t<=a-6)return t}else if(""!==o&&Number(this._hour.textContent)>=Number(c)&&i+6<=t)return t}else if(""!==n){if("PM"===l&&this._isAmEnabled)return;if("PM"===l&&this._isPmEnabled){if(Number(this._hour.textContent)<Number(s))return;if(Number(this._hour.textContent)<=Number(s)&&t<=a-6)return t}else if("AM"===l&&this._isAmEnabled){if(Number(this._hour.textContent)<Number(s))return;if(Number(this._hour.textContent)<=Number(s)&&t<=a-6)return t}}else if(""!==o){if("AM"===u&&this._isPmEnabled)return;if("PM"===u&&this._isPmEnabled){if(Number(this._hour.textContent)>=Number(c)&&i+6<=t)return t}else if("AM"===u&&this._isAmEnabled&&Number(this._hour.textContent)>=Number(c)&&i+6<=t)return t}return(t=r?30*Math.round(t/30):t)<=0?t=360+t:360<=t&&(t=0),{degrees:t,minute:e}}},{key:"_removeModal",value:function(){var t=this;setTimeout(function(){t._modal.remove(),S.addStyle(t._document.body,{overflow:""}),ks()||S.addStyle(t._document.body,{paddingRight:""})},300),Oc(this._document,"click keydown mousedown mouseup mousemove mouseleave mouseover touchmove touchend")}},{key:"_toggleBackdropAnimation",value:function(){0<arguments.length&&void 0!==arguments[0]&&arguments[0]?(S.addClass(this._wrapper,"animation"),S.addClass(this._wrapper,"fade-out"),this._wrapper.style.animationDuration="300ms"):(S.addClass(this._wrapper,"animation"),S.addClass(this._wrapper,"fade-in"),this._wrapper.style.animationDuration="300ms",this._options.inline||S.addClass(this._clock,Fs))}},{key:"_addActiveClassToTip",value:function(t,e){t.forEach(function(t){Number(t.textContent)===Number(e)&&S.addClass(t,M)})}},{key:"_setHourOrMinute",value:function(t){return t<10?"0".concat(t):t}},{key:"_appendTimes",value:function(){this._getAppendClock(this.hoursArray,".".concat(Vs),"".concat(iu))}},{key:"_getConfig",value:function(t){var e=S.getDataAttributes(this._element);return t=Es(Es(Es({},fu),e),t),Ba(m,t,du),t}}])&&Ps(t.prototype,e),n&&Ps(t,n),Object.defineProperty(t,"prototype",{writable:!1}),o}(),t=pu;function hu(t){return(hu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function vu(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function yu(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?vu(Object(o),!0).forEach(function(t){var e,n;e=r,n=o[t=t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):vu(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function mu(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}_.on(window,"DOMContentLoaded",function(){x.find(".".concat(m)).forEach(function(t){var e=pu.getInstance(t);e||new pu(t)})});var g="stepper",gu="mdb.stepper",bu=".".concat(gu),_u="horizontal",wu="vertical",Ou={stepperType:"string",stepperLinear:"boolean",stepperNoEditable:"boolean",stepperActive:"string",stepperCompleted:"string",stepperInvalid:"string",stepperDisabled:"string",stepperVerticalBreakpoint:"number",stepperMobileBreakpoint:"number",stepperMobileBarBreakpoint:"number"},ku={stepperType:_u,stepperLinear:!1,stepperNoEditable:!1,stepperActive:"",stepperCompleted:"",stepperInvalid:"",stepperDisabled:"",stepperVerticalBreakpoint:0,stepperMobileBreakpoint:0,stepperMobileBarBreakpoint:4},Cu="mousedown".concat(bu),Su="keydown".concat(bu),xu="keyup".concat(bu),Eu="resize".concat(bu),ju="animationend",Tu="".concat(g,"-step"),w="".concat(g,"-head"),L="".concat(g,"-content"),Au="".concat(g,"-active"),Du="".concat(g,"-completed"),Pu="".concat(g,"-invalid"),Mu="".concat(g,"-disabled"),Iu="".concat(g,"-").concat(wu),Lu="".concat(g,"-content-hide"),Nu="".concat(g,"-").concat(_u),Ru=function(){function n(t,e){if(!(this instanceof n))throw new TypeError("Cannot call a class as a function");this._element=t,this._options=this._getConfig(e),this._elementHeight=0,this._steps=x.find(".".concat(Tu),this._element),this._currentView="",this._activeStepIndex=0,this._verticalStepperStyles=[],this._element&&(v.setData(t,gu,this),this._init())}var t,e,r;return t=n,r=[{key:"NAME",get:function(){return g}},{key:"getInstance",value:function(t){return v.getData(t,gu)}},{key:"getOrCreateInstance",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return this.getInstance(t)||new this(t,"object"===hu(e)?e:null)}}],(e=[{key:"activeStep",get:function(){return this._steps[this._activeStepIndex]}},{key:"activeStepIndex",get:function(){return this._activeStepIndex}},{key:"dispose",value:function(){this._steps.forEach(function(t){_.off(t,Cu),_.off(t,Su)}),_.off(window,Eu),v.removeData(this._element,gu),this._element=null}},{key:"changeStep",value:function(t){this._toggleStep(t)}},{key:"nextStep",value:function(){this._toggleStep(this._activeStepIndex+1)}},{key:"previousStep",value:function(){this._toggleStep(this._activeStepIndex-1)}},{key:"_init",value:function(){var t=x.findOne(".".concat(Au),this._element);t?this._activeStepIndex=this._steps.indexOf(t):this._toggleStepClass(this._activeStepIndex,"add",Au),this._toggleStepClass(this._activeStepIndex,"add",this._options.stepperActive),this._bindMouseDown(),this._bindKeysNavigation(),this._options.stepperType===wu?this._toggleVertical():this._toggleHorizontal(),(this._options.stepperVerticalBreakpoint||this._options.stepperMobileBreakpoint)&&this._toggleStepperView(),this._bindResize()}},{key:"_getConfig",value:function(t){var e=S.getDataAttributes(this._element);return t=yu(yu(yu({},ku),e),t),Ba(g,t,Ou),t}},{key:"_bindMouseDown",value:function(){var n=this;this._steps.forEach(function(t){t=x.findOne(".".concat(w),t);_.on(t,Cu,function(t){var e=x.parents(t.target,".".concat(Tu))[0],e=n._steps.indexOf(e);t.preventDefault(),n._toggleStep(e)})})}},{key:"_bindResize",value:function(){var t=this;_.on(window,Eu,function(){t._currentView===wu&&t._setSingleStepHeight(t.activeStep),t._currentView===_u&&t._setHeight(t.activeStep),(t._options.stepperVerticalBreakpoint||t._options.stepperMobileBreakpoint)&&t._toggleStepperView()})}},{key:"_toggleStepperView",value:function(){var e=this,t=this._options.stepperVerticalBreakpoint<window.innerWidth,n=this._options.stepperVerticalBreakpoint>window.innerWidth,r=this._options.stepperMobileBreakpoint>window.innerWidth;t&&this._currentView!==_u&&this._toggleHorizontal(),n&&!r&&this._currentView!==wu&&(this._steps.forEach(function(t){t=x.findOne(".".concat(L),t);e._resetStepperHeight(),e._showElement(t)}),this._toggleVertical())}},{key:"_toggleStep",value:function(t){this._activeStepIndex!==t&&(this._options.stepperNoEditable&&this._toggleDisabled(),this._showElement(x.findOne(".".concat(L),this._steps[t])),this._toggleActive(t),t>this._activeStepIndex&&this._toggleCompleted(this._activeStepIndex),this._currentView===_u?this._animateHorizontalStep(t):(this._animateVerticalStep(t),this._setSingleStepHeight(this._steps[t])),this._toggleStepTabIndex(x.findOne(".".concat(w),this.activeStep),x.findOne(".".concat(w),this._steps[t])),this._activeStepIndex=t)}},{key:"_resetStepperHeight",value:function(){this._element.style.height=""}},{key:"_setStepsHeight",value:function(){var n=this;this._steps.forEach(function(t){var t=x.findOne(".".concat(L),t),e=window.getComputedStyle(t),e=(n._verticalStepperStyles.push({paddingTop:parseFloat(e.paddingTop),paddingBottom:parseFloat(e.paddingBottom)}),t.scrollHeight);t.style.height="".concat(e,"px")})}},{key:"_setSingleStepHeight",value:function(t){var e=x.findOne(".".concat(L),t),n=this.activeStep===t,t=this._steps.indexOf(t),n=n?(e.style.height="",e.scrollHeight):e.scrollHeight+this._verticalStepperStyles[t].paddingTop+this._verticalStepperStyles[t].paddingBottom;e.style.height="".concat(n,"px")}},{key:"_toggleVertical",value:function(){this._currentView=wu,this._toggleStepperClass(Iu),this._setStepsHeight(),this._hideInactiveSteps()}},{key:"_toggleHorizontal",value:function(){this._currentView=_u,this._toggleStepperClass(Nu),this._setHeight(this.activeStep),this._hideInactiveSteps()}},{key:"_toggleStepperClass",value:function(t){this._element.classList.remove(Nu,Iu),this._element.classList.add(t),t!==Iu&&this._steps.forEach(function(t){x.findOne(".".concat(L),t).classList.remove(Lu)})}},{key:"_toggleStepClass",value:function(t,e,n){n&&this._steps[t].classList[e](n)}},{key:"_bindKeysNavigation",value:function(){var s=this;this._toggleStepTabIndex(!1,x.findOne(".".concat(w),this.activeStep)),this._steps.forEach(function(t){t=x.findOne(".".concat(w),t);_.on(t,Su,function(t){var e=x.parents(t.currentTarget,".".concat(Tu))[0],n=x.next(e,".".concat(Tu))[0],r=x.prev(e,".".concat(Tu))[0],o=x.findOne(".".concat(w),e),i=x.findOne(".".concat(w),s.activeStep),a=null,c=null;n&&(a=x.findOne(".".concat(w),n)),r&&(c=x.findOne(".".concat(w),r)),37===t.keyCode&&s._currentView!==wu&&(c?(s._toggleStepTabIndex(o,c),s._toggleOutlineStyles(o,c),c.focus()):a&&(s._toggleStepTabIndex(o,a),s._toggleOutlineStyles(o,a),a.focus())),39===t.keyCode&&s._currentView!==wu&&(a?(s._toggleStepTabIndex(o,a),s._toggleOutlineStyles(o,a),a.focus()):c&&(s._toggleStepTabIndex(o,c),s._toggleOutlineStyles(o,c),c.focus())),40===t.keyCode&&s._currentView===wu&&(t.preventDefault(),a&&(s._toggleStepTabIndex(o,a),s._toggleOutlineStyles(o,a),a.focus())),38===t.keyCode&&s._currentView===wu&&(t.preventDefault(),c&&(s._toggleStepTabIndex(o,c),s._toggleOutlineStyles(o,c),c.focus())),36===t.keyCode&&(n=x.findOne(".".concat(w),s._steps[0]),s._toggleStepTabIndex(o,n),s._toggleOutlineStyles(o,n),n.focus()),35===t.keyCode&&(r=s._steps[s._steps.length-1],a=x.findOne(".".concat(w),r),s._toggleStepTabIndex(o,a),s._toggleOutlineStyles(o,a),a.focus()),13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),s.changeStep(s._steps.indexOf(e))),9===t.keyCode&&(s._toggleStepTabIndex(o,i),s._toggleOutlineStyles(o,!1),i.focus())}),_.on(t,xu,function(t){var e=x.parents(t.currentTarget,".".concat(Tu))[0],e=x.findOne(".".concat(w),e),n=x.findOne(".".concat(w),s.activeStep);9===t.keyCode&&(s._toggleStepTabIndex(e,n),s._toggleOutlineStyles(!1,n),n.focus())})})}},{key:"_toggleStepTabIndex",value:function(t,e){t&&t.setAttribute("tabIndex",-1),e&&e.setAttribute("tabIndex",0)}},{key:"_toggleOutlineStyles",value:function(t,e){t&&(t.style.outline=""),e&&(e.style.outline="revert")}},{key:"_toggleDisabled",value:function(){this._toggleStepClass(this._activeStepIndex,"add",Mu),this._toggleStepClass(this._activeStepIndex,"add",this._options.stepperDisabled)}},{key:"_toggleActive",value:function(t){this._toggleStepClass(t,"add",Au),this._toggleStepClass(this._activeStepIndex,"remove",Au),this._toggleStepClass(t,"add",this._options.stepperActive),this._toggleStepClass(this._activeStepIndex,"remove",this._options.stepperActive)}},{key:"_toggleCompleted",value:function(t){this._toggleStepClass(t,"add",Du),this._toggleStepClass(t,"remove",Pu),this._toggleStepClass(t,"add",this._options.stepperCompleted),this._toggleStepClass(t,"remove",this._options.stepperInvalid)}},{key:"_hideInactiveSteps",value:function(){var e=this;this._steps.forEach(function(t){t.classList.contains(Au)||e._hideElement(x.findOne(".".concat(L),t))})}},{key:"_setHeight",value:function(t){var e=x.findOne(".".concat(L),t),n=getComputedStyle(e),t=x.findOne(".".concat(w),t),r=getComputedStyle(t),e=e.offsetHeight+parseFloat(n.marginTop)+parseFloat(n.marginBottom),n=t.offsetHeight+parseFloat(r.marginTop)+parseFloat(r.marginBottom);this._element.style.height="".concat(n+e,"px")}},{key:"_hideElement",value:function(t){x.parents(t,".".concat(Tu))[0].classList.contains(Au)||this._currentView===wu?t.classList.add(Lu):t.style.display="none"}},{key:"_showElement",value:function(t){this._currentView===wu?t.classList.remove(Lu):t.style.display="block"}},{key:"_animateHorizontalStep",value:function(n){var t,r=this,e=n>this._activeStepIndex,o=x.findOne(".".concat(L),this._steps[n]),i=x.findOne(".".concat(L),this.activeStep);this._steps.forEach(function(t,e){t=x.findOne(".".concat(L),t);r._clearStepAnimation(t),e!==n&&e!==r._activeStepIndex&&r._hideElement(t)}),e=e?(t="slide-out-left","slide-in-right"):(t="slide-out-right","slide-in-left"),i.classList.add(t,"animation","fast"),o.classList.add(e,"animation","fast"),this._setHeight(this._steps[n]),_.one(i,ju,function(t){r._clearStepAnimation(t.target),r._hideElement(t.target)}),_.one(o,ju,function(t){r._clearStepAnimation(t.target)})}},{key:"_animateVerticalStep",value:function(t){var t=x.findOne(".".concat(L),this._steps[t]),e=x.findOne(".".concat(L),this.activeStep);this._hideElement(e),this._showElement(t)}},{key:"_clearStepAnimation",value:function(t){t.classList.remove("slide-out-left","slide-in-right","slide-out-right","slide-in-left","animation","fast")}}])&&mu(t.prototype,e),r&&mu(t,r),Object.defineProperty(t,"prototype",{writable:!1}),n}(),bu=(x.find('[data-mdb-stepper="stepper"]').forEach(function(t){return Ru.getInstance(t)||new Ru(t)}),Ru);window.Alert=n,window.Button=R,window.Dropdown=bn,window.Carousel=vo,window.Collapse=jn,window.Offcanvas=r,window.Modal=Io,window.Popover=l,window.ScrollSpy=o,window.Tab=_a,window.Toast=h,window.Tooltip=Ri,window.Ripple=zc,window.Datepicker=ds,window.Timepicker=t,window.Stepper=bu}]);
//# sourceMappingURL=index.min.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/tw-elements/dist/js/index.min.js
var index_min = __webpack_require__(619);
// EXTERNAL MODULE: ./node_modules/slider-pro/dist/js/jquery.sliderPro.js
var jquery_sliderPro = __webpack_require__(253);
;// CONCATENATED MODULE: ./node_modules/ssr-window/ssr-window.esm.js
/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject(src[key]) &&
            isObject(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend(target[key], src[key]);
        }
    });
}

const ssrDocument = {
    body: {},
    addEventListener() { },
    removeEventListener() { },
    activeElement: {
        blur() { },
        nodeName: '',
    },
    querySelector() {
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById() {
        return null;
    },
    createEvent() {
        return {
            initEvent() { },
        };
    },
    createElement() {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() { },
            getElementsByTagName() {
                return [];
            },
        };
    },
    createElementNS() {
        return {};
    },
    importNode() {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend(doc, ssrDocument);
    return doc;
}

const ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState() { },
        pushState() { },
        go() { },
        back() { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener() { },
    removeEventListener() { },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            },
        };
    },
    Image() { },
    Date() { },
    screen: {},
    setTimeout() { },
    clearTimeout() { },
    matchMedia() {
        return {};
    },
    requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function ssr_window_esm_getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend(win, ssrWindow);
    return win;
}



;// CONCATENATED MODULE: ./node_modules/dom7/dom7.esm.js
/**
 * Dom7 4.0.4
 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
 * https://framework7.io/docs/dom7.html
 *
 * Copyright 2022, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: January 11, 2022
 */


/* eslint-disable no-proto */
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, '__proto__', {
    get() {
      return proto;
    },

    set(value) {
      proto.__proto__ = value;
    }

  });
}

class Dom7 extends Array {
  constructor(items) {
    if (typeof items === 'number') {
      super(items);
    } else {
      super(...(items || []));
      makeReactive(this);
    }
  }

}

function arrayFlat(arr = []) {
  const res = [];
  arr.forEach(el => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
  }

  return uniqueArray;
}
function toCamelCase(string) {
  return string.toLowerCase().replace(/-(.)/g, (match, group) => group.toUpperCase());
}

// eslint-disable-next-line

function qsa(selector, context) {
  if (typeof selector !== 'string') {
    return [selector];
  }

  const a = [];
  const res = context.querySelectorAll(selector);

  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }

  return a;
}

function dom7_esm_$(selector, context) {
  const window = ssr_window_esm_getWindow();
  const document = getDocument();
  let arr = [];

  if (!context && selector instanceof Dom7) {
    return selector;
  }

  if (!selector) {
    return new Dom7(arr);
  }

  if (typeof selector === 'string') {
    const html = selector.trim();

    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
      let toCreate = 'div';
      if (html.indexOf('<li') === 0) toCreate = 'ul';
      if (html.indexOf('<tr') === 0) toCreate = 'tbody';
      if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
      if (html.indexOf('<tbody') === 0) toCreate = 'table';
      if (html.indexOf('<option') === 0) toCreate = 'select';
      const tempParent = document.createElement(toCreate);
      tempParent.innerHTML = html;

      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document);
    } // arr = qsa(selector, document);

  } else if (selector.nodeType || selector === window || selector === document) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7) return selector;
    arr = selector;
  }

  return new Dom7(arrayUnique(arr));
}

dom7_esm_$.fn = Dom7.prototype;

// eslint-disable-next-line

function addClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.add(...classNames);
  });
  return this;
}

function removeClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.remove(...classNames);
  });
  return this;
}

function toggleClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    classNames.forEach(className => {
      el.classList.toggle(className);
    });
  });
}

function hasClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  return arrayFilter(this, el => {
    return classNames.filter(className => el.classList.contains(className)).length > 0;
  }).length > 0;
}

function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === 'string') {
    // Get attr
    if (this[0]) return this[0].getAttribute(attrs);
    return undefined;
  } // Set attrs


  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      // String
      this[i].setAttribute(attrs, value);
    } else {
      // Object
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }

  return this;
}

function removeAttr(attr) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr);
  }

  return this;
}

function prop(props, value) {
  if (arguments.length === 1 && typeof props === 'string') {
    // Get prop
    if (this[0]) return this[0][props];
  } else {
    // Set props
    for (let i = 0; i < this.length; i += 1) {
      if (arguments.length === 2) {
        // String
        this[i][props] = value;
      } else {
        // Object
        for (const propName in props) {
          this[i][propName] = props[propName];
        }
      }
    }

    return this;
  }

  return this;
}

function data(key, value) {
  let el;

  if (typeof value === 'undefined') {
    el = this[0];
    if (!el) return undefined; // Get value

    if (el.dom7ElementDataStorage && key in el.dom7ElementDataStorage) {
      return el.dom7ElementDataStorage[key];
    }

    const dataKey = el.getAttribute(`data-${key}`);

    if (dataKey) {
      return dataKey;
    }

    return undefined;
  } // Set value


  for (let i = 0; i < this.length; i += 1) {
    el = this[i];
    if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
    el.dom7ElementDataStorage[key] = value;
  }

  return this;
}

function removeData(key) {
  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
      el.dom7ElementDataStorage[key] = null;
      delete el.dom7ElementDataStorage[key];
    }
  }
}

function dataset() {
  const el = this[0];
  if (!el) return undefined;
  const dataset = {}; // eslint-disable-line

  if (el.dataset) {
    for (const dataKey in el.dataset) {
      dataset[dataKey] = el.dataset[dataKey];
    }
  } else {
    for (let i = 0; i < el.attributes.length; i += 1) {
      const attr = el.attributes[i];

      if (attr.name.indexOf('data-') >= 0) {
        dataset[toCamelCase(attr.name.split('data-')[1])] = attr.value;
      }
    }
  }

  for (const key in dataset) {
    if (dataset[key] === 'false') dataset[key] = false;else if (dataset[key] === 'true') dataset[key] = true;else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] *= 1;
  }

  return dataset;
}

function val(value) {
  if (typeof value === 'undefined') {
    // get value
    const el = this[0];
    if (!el) return undefined;

    if (el.multiple && el.nodeName.toLowerCase() === 'select') {
      const values = [];

      for (let i = 0; i < el.selectedOptions.length; i += 1) {
        values.push(el.selectedOptions[i].value);
      }

      return values;
    }

    return el.value;
  } // set value


  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (Array.isArray(value) && el.multiple && el.nodeName.toLowerCase() === 'select') {
      for (let j = 0; j < el.options.length; j += 1) {
        el.options[j].selected = value.indexOf(el.options[j].value) >= 0;
      }
    } else {
      el.value = value;
    }
  }

  return this;
}

function value(value) {
  return this.val(value);
}

function transform(transform) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform;
  }

  return this;
}

function transition(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
  }

  return this;
}

function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;

  function handleLiveEvent(e) {
    const target = e.target;
    if (!target) return;
    const eventData = e.target.dom7EventData || [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData);else {
      const parents = dom7_esm_$(target).parents(); // eslint-disable-line

      for (let k = 0; k < parents.length; k += 1) {
        if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
      }
    }
  }

  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    listener.apply(this, eventData);
  }

  const events = eventType.split(' ');
  let j;

  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (!targetSelector) {
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7Listeners) el.dom7Listeners = {};
        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      // Live events
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }

  return this;
}

function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;
  const events = eventType.split(' ');

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;

      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }

      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];

          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }

  return this;
}

function once(...args) {
  const dom = this;
  let [eventName, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventName, listener, capture] = args;
    targetSelector = undefined;
  }

  function onceHandler(...eventArgs) {
    listener.apply(this, eventArgs);
    dom.off(eventName, targetSelector, onceHandler, capture);

    if (onceHandler.dom7proxy) {
      delete onceHandler.dom7proxy;
    }
  }

  onceHandler.dom7proxy = listener;
  return dom.on(eventName, targetSelector, onceHandler, capture);
}

function trigger(...args) {
  const window = ssr_window_esm_getWindow();
  const events = args[0].split(' ');
  const eventData = args[1];

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];

      if (window.CustomEvent) {
        const evt = new window.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }

  return this;
}

function transitionEnd(callback) {
  const dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('transitionend', fireCallBack);
  }

  if (callback) {
    dom.on('transitionend', fireCallBack);
  }

  return this;
}

function animationEnd(callback) {
  const dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('animationend', fireCallBack);
  }

  if (callback) {
    dom.on('animationend', fireCallBack);
  }

  return this;
}

function width() {
  const window = getWindow();

  if (this[0] === window) {
    return window.innerWidth;
  }

  if (this.length > 0) {
    return parseFloat(this.css('width'));
  }

  return null;
}

function dom7_esm_outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
    }

    return this[0].offsetWidth;
  }

  return null;
}

function height() {
  const window = getWindow();

  if (this[0] === window) {
    return window.innerHeight;
  }

  if (this.length > 0) {
    return parseFloat(this.css('height'));
  }

  return null;
}

function dom7_esm_outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
    }

    return this[0].offsetHeight;
  }

  return null;
}

function offset() {
  if (this.length > 0) {
    const window = ssr_window_esm_getWindow();
    const document = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window ? window.scrollY : el.scrollTop;
    const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  return null;
}

function hide() {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.display = 'none';
  }

  return this;
}

function show() {
  const window = getWindow();

  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (el.style.display === 'none') {
      el.style.display = '';
    }

    if (window.getComputedStyle(el, null).getPropertyValue('display') === 'none') {
      // Still not visible
      el.style.display = 'block';
    }
  }

  return this;
}

function styles() {
  const window = ssr_window_esm_getWindow();
  if (this[0]) return window.getComputedStyle(this[0], null);
  return {};
}

function css(props, value) {
  const window = ssr_window_esm_getWindow();
  let i;

  if (arguments.length === 1) {
    if (typeof props === 'string') {
      // .css('width')
      if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      // .css({ width: '100px' })
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }

      return this;
    }
  }

  if (arguments.length === 2 && typeof props === 'string') {
    // .css('width', '100px')
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }

    return this;
  }

  return this;
}

function each(callback) {
  if (!callback) return this;
  this.forEach((el, index) => {
    callback.apply(el, [el, index]);
  });
  return this;
}

function filter(callback) {
  const result = arrayFilter(this, callback);
  return dom7_esm_$(result);
}

function html(html) {
  if (typeof html === 'undefined') {
    return this[0] ? this[0].innerHTML : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html;
  }

  return this;
}

function dom7_esm_text(text) {
  if (typeof text === 'undefined') {
    return this[0] ? this[0].textContent.trim() : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text;
  }

  return this;
}

function is(selector) {
  const window = ssr_window_esm_getWindow();
  const document = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector === 'undefined') return false;

  if (typeof selector === 'string') {
    if (el.matches) return el.matches(selector);
    if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector) return el.msMatchesSelector(selector);
    compareWith = dom7_esm_$(selector);

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  if (selector === document) {
    return el === document;
  }

  if (selector === window) {
    return el === window;
  }

  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  return false;
}

function index() {
  let child = this[0];
  let i;

  if (child) {
    i = 0; // eslint-disable-next-line

    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }

    return i;
  }

  return undefined;
}

function eq(index) {
  if (typeof index === 'undefined') return this;
  const length = this.length;

  if (index > length - 1) {
    return dom7_esm_$([]);
  }

  if (index < 0) {
    const returnIndex = length + index;
    if (returnIndex < 0) return dom7_esm_$([]);
    return dom7_esm_$([this[returnIndex]]);
  }

  return dom7_esm_$([this[index]]);
}

function append(...els) {
  let newChild;
  const document = getDocument();

  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];

    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;

        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }

  return this;
}

function appendTo(parent) {
  dom7_esm_$(parent).append(this);
  return this;
}

function prepend(newChild) {
  const document = getDocument();
  let i;
  let j;

  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;

      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }

  return this;
}

function prependTo(parent) {
  dom7_esm_$(parent).prepend(this);
  return this;
}

function insertBefore(selector) {
  const before = dom7_esm_$(selector);

  for (let i = 0; i < this.length; i += 1) {
    if (before.length === 1) {
      before[0].parentNode.insertBefore(this[i], before[0]);
    } else if (before.length > 1) {
      for (let j = 0; j < before.length; j += 1) {
        before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
      }
    }
  }
}

function insertAfter(selector) {
  const after = dom7_esm_$(selector);

  for (let i = 0; i < this.length; i += 1) {
    if (after.length === 1) {
      after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
    } else if (after.length > 1) {
      for (let j = 0; j < after.length; j += 1) {
        after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
      }
    }
  }
}

function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) {
        return dom7_esm_$([this[0].nextElementSibling]);
      }

      return dom7_esm_$([]);
    }

    if (this[0].nextElementSibling) return dom7_esm_$([this[0].nextElementSibling]);
    return dom7_esm_$([]);
  }

  return dom7_esm_$([]);
}

function nextAll(selector) {
  const nextEls = [];
  let el = this[0];
  if (!el) return dom7_esm_$([]);

  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line

    if (selector) {
      if (dom7_esm_$(next).is(selector)) nextEls.push(next);
    } else nextEls.push(next);

    el = next;
  }

  return dom7_esm_$(nextEls);
}

function prev(selector) {
  if (this.length > 0) {
    const el = this[0];

    if (selector) {
      if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) {
        return dom7_esm_$([el.previousElementSibling]);
      }

      return dom7_esm_$([]);
    }

    if (el.previousElementSibling) return dom7_esm_$([el.previousElementSibling]);
    return dom7_esm_$([]);
  }

  return dom7_esm_$([]);
}

function prevAll(selector) {
  const prevEls = [];
  let el = this[0];
  if (!el) return dom7_esm_$([]);

  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line

    if (selector) {
      if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
    } else prevEls.push(prev);

    el = prev;
  }

  return dom7_esm_$(prevEls);
}

function siblings(selector) {
  return this.nextAll(selector).add(this.prevAll(selector));
}

function dom7_esm_parent(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
      } else {
        parents.push(this[i].parentNode);
      }
    }
  }

  return dom7_esm_$(parents);
}

function parents(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    let parent = this[i].parentNode; // eslint-disable-line

    while (parent) {
      if (selector) {
        if (dom7_esm_$(parent).is(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }

      parent = parent.parentNode;
    }
  }

  return dom7_esm_$(parents);
}

function closest(selector) {
  let closest = this; // eslint-disable-line

  if (typeof selector === 'undefined') {
    return dom7_esm_$([]);
  }

  if (!closest.is(selector)) {
    closest = closest.parents(selector).eq(0);
  }

  return closest;
}

function find(selector) {
  const foundElements = [];

  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector);

    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }

  return dom7_esm_$(foundElements);
}

function children(selector) {
  const children = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;

    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector || dom7_esm_$(childNodes[j]).is(selector)) {
        children.push(childNodes[j]);
      }
    }
  }

  return dom7_esm_$(children);
}

function remove() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
  }

  return this;
}

function detach() {
  return this.remove();
}

function add(...els) {
  const dom = this;
  let i;
  let j;

  for (i = 0; i < els.length; i += 1) {
    const toAdd = dom7_esm_$(els[i]);

    for (j = 0; j < toAdd.length; j += 1) {
      dom.push(toAdd[j]);
    }
  }

  return dom;
}

function empty() {
  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (el.nodeType === 1) {
      for (let j = 0; j < el.childNodes.length; j += 1) {
        if (el.childNodes[j].parentNode) {
          el.childNodes[j].parentNode.removeChild(el.childNodes[j]);
        }
      }

      el.textContent = '';
    }
  }

  return this;
}

// eslint-disable-next-line

function scrollTo(...args) {
  const window = getWindow();
  let [left, top, duration, easing, callback] = args;

  if (args.length === 4 && typeof easing === 'function') {
    callback = easing;
    [left, top, duration, callback, easing] = args;
  }

  if (typeof easing === 'undefined') easing = 'swing';
  return this.each(function animate() {
    const el = this;
    let currentTop;
    let currentLeft;
    let maxTop;
    let maxLeft;
    let newTop;
    let newLeft;
    let scrollTop; // eslint-disable-line

    let scrollLeft; // eslint-disable-line

    let animateTop = top > 0 || top === 0;
    let animateLeft = left > 0 || left === 0;

    if (typeof easing === 'undefined') {
      easing = 'swing';
    }

    if (animateTop) {
      currentTop = el.scrollTop;

      if (!duration) {
        el.scrollTop = top;
      }
    }

    if (animateLeft) {
      currentLeft = el.scrollLeft;

      if (!duration) {
        el.scrollLeft = left;
      }
    }

    if (!duration) return;

    if (animateTop) {
      maxTop = el.scrollHeight - el.offsetHeight;
      newTop = Math.max(Math.min(top, maxTop), 0);
    }

    if (animateLeft) {
      maxLeft = el.scrollWidth - el.offsetWidth;
      newLeft = Math.max(Math.min(left, maxLeft), 0);
    }

    let startTime = null;
    if (animateTop && newTop === currentTop) animateTop = false;
    if (animateLeft && newLeft === currentLeft) animateLeft = false;

    function render(time = new Date().getTime()) {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = easing === 'linear' ? progress : 0.5 - Math.cos(progress * Math.PI) / 2;
      let done;
      if (animateTop) scrollTop = currentTop + easeProgress * (newTop - currentTop);
      if (animateLeft) scrollLeft = currentLeft + easeProgress * (newLeft - currentLeft);

      if (animateTop && newTop > currentTop && scrollTop >= newTop) {
        el.scrollTop = newTop;
        done = true;
      }

      if (animateTop && newTop < currentTop && scrollTop <= newTop) {
        el.scrollTop = newTop;
        done = true;
      }

      if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft) {
        el.scrollLeft = newLeft;
        done = true;
      }

      if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft) {
        el.scrollLeft = newLeft;
        done = true;
      }

      if (done) {
        if (callback) callback();
        return;
      }

      if (animateTop) el.scrollTop = scrollTop;
      if (animateLeft) el.scrollLeft = scrollLeft;
      window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
  });
} // scrollTop(top, duration, easing, callback) {


function scrollTop(...args) {
  let [top, duration, easing, callback] = args;

  if (args.length === 3 && typeof easing === 'function') {
    [top, duration, callback, easing] = args;
  }

  const dom = this;

  if (typeof top === 'undefined') {
    if (dom.length > 0) return dom[0].scrollTop;
    return null;
  }

  return dom.scrollTo(undefined, top, duration, easing, callback);
}

function scrollLeft(...args) {
  let [left, duration, easing, callback] = args;

  if (args.length === 3 && typeof easing === 'function') {
    [left, duration, callback, easing] = args;
  }

  const dom = this;

  if (typeof left === 'undefined') {
    if (dom.length > 0) return dom[0].scrollLeft;
    return null;
  }

  return dom.scrollTo(left, undefined, duration, easing, callback);
}

// eslint-disable-next-line

function animate(initialProps, initialParams) {
  const window = getWindow();
  const els = this;
  const a = {
    props: Object.assign({}, initialProps),
    params: Object.assign({
      duration: 300,
      easing: 'swing' // or 'linear'

      /* Callbacks
      begin(elements)
      complete(elements)
      progress(elements, complete, remaining, start, tweenValue)
      */

    }, initialParams),
    elements: els,
    animating: false,
    que: [],

    easingProgress(easing, progress) {
      if (easing === 'swing') {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      }

      if (typeof easing === 'function') {
        return easing(progress);
      }

      return progress;
    },

    stop() {
      if (a.frameId) {
        window.cancelAnimationFrame(a.frameId);
      }

      a.animating = false;
      a.elements.each(el => {
        const element = el;
        delete element.dom7AnimateInstance;
      });
      a.que = [];
    },

    done(complete) {
      a.animating = false;
      a.elements.each(el => {
        const element = el;
        delete element.dom7AnimateInstance;
      });
      if (complete) complete(els);

      if (a.que.length > 0) {
        const que = a.que.shift();
        a.animate(que[0], que[1]);
      }
    },

    animate(props, params) {
      if (a.animating) {
        a.que.push([props, params]);
        return a;
      }

      const elements = []; // Define & Cache Initials & Units

      a.elements.each((el, index) => {
        let initialFullValue;
        let initialValue;
        let unit;
        let finalValue;
        let finalFullValue;
        if (!el.dom7AnimateInstance) a.elements[index].dom7AnimateInstance = a;
        elements[index] = {
          container: el
        };
        Object.keys(props).forEach(prop => {
          initialFullValue = window.getComputedStyle(el, null).getPropertyValue(prop).replace(',', '.');
          initialValue = parseFloat(initialFullValue);
          unit = initialFullValue.replace(initialValue, '');
          finalValue = parseFloat(props[prop]);
          finalFullValue = props[prop] + unit;
          elements[index][prop] = {
            initialFullValue,
            initialValue,
            unit,
            finalValue,
            finalFullValue,
            currentValue: initialValue
          };
        });
      });
      let startTime = null;
      let time;
      let elementsDone = 0;
      let propsDone = 0;
      let done;
      let began = false;
      a.animating = true;

      function render() {
        time = new Date().getTime();
        let progress;
        let easeProgress; // let el;

        if (!began) {
          began = true;
          if (params.begin) params.begin(els);
        }

        if (startTime === null) {
          startTime = time;
        }

        if (params.progress) {
          // eslint-disable-next-line
          params.progress(els, Math.max(Math.min((time - startTime) / params.duration, 1), 0), startTime + params.duration - time < 0 ? 0 : startTime + params.duration - time, startTime);
        }

        elements.forEach(element => {
          const el = element;
          if (done || el.done) return;
          Object.keys(props).forEach(prop => {
            if (done || el.done) return;
            progress = Math.max(Math.min((time - startTime) / params.duration, 1), 0);
            easeProgress = a.easingProgress(params.easing, progress);
            const {
              initialValue,
              finalValue,
              unit
            } = el[prop];
            el[prop].currentValue = initialValue + easeProgress * (finalValue - initialValue);
            const currentValue = el[prop].currentValue;

            if (finalValue > initialValue && currentValue >= finalValue || finalValue < initialValue && currentValue <= finalValue) {
              el.container.style[prop] = finalValue + unit;
              propsDone += 1;

              if (propsDone === Object.keys(props).length) {
                el.done = true;
                elementsDone += 1;
              }

              if (elementsDone === elements.length) {
                done = true;
              }
            }

            if (done) {
              a.done(params.complete);
              return;
            }

            el.container.style[prop] = currentValue + unit;
          });
        });
        if (done) return; // Then call

        a.frameId = window.requestAnimationFrame(render);
      }

      a.frameId = window.requestAnimationFrame(render);
      return a;
    }

  };

  if (a.elements.length === 0) {
    return els;
  }

  let animateInstance;

  for (let i = 0; i < a.elements.length; i += 1) {
    if (a.elements[i].dom7AnimateInstance) {
      animateInstance = a.elements[i].dom7AnimateInstance;
    } else a.elements[i].dom7AnimateInstance = a;
  }

  if (!animateInstance) {
    animateInstance = a;
  }

  if (initialProps === 'stop') {
    animateInstance.stop();
  } else {
    animateInstance.animate(a.props, a.params);
  }

  return els;
}

function stop() {
  const els = this;

  for (let i = 0; i < els.length; i += 1) {
    if (els[i].dom7AnimateInstance) {
      els[i].dom7AnimateInstance.stop();
    }
  }
}

const noTrigger = 'resize scroll'.split(' ');

function shortcut(name) {
  function eventHandler(...args) {
    if (typeof args[0] === 'undefined') {
      for (let i = 0; i < this.length; i += 1) {
        if (noTrigger.indexOf(name) < 0) {
          if (name in this[i]) this[i][name]();else {
            dom7_esm_$(this[i]).trigger(name);
          }
        }
      }

      return this;
    }

    return this.on(name, ...args);
  }

  return eventHandler;
}

const click = shortcut('click');
const dom7_esm_blur = shortcut('blur');
const dom7_esm_focus = shortcut('focus');
const focusin = shortcut('focusin');
const focusout = shortcut('focusout');
const keyup = shortcut('keyup');
const keydown = shortcut('keydown');
const keypress = shortcut('keypress');
const dom7_esm_submit = shortcut('submit');
const change = shortcut('change');
const mousedown = shortcut('mousedown');
const mousemove = shortcut('mousemove');
const mouseup = shortcut('mouseup');
const mouseenter = shortcut('mouseenter');
const mouseleave = shortcut('mouseleave');
const mouseout = shortcut('mouseout');
const mouseover = shortcut('mouseover');
const touchstart = shortcut('touchstart');
const touchend = shortcut('touchend');
const touchmove = shortcut('touchmove');
const resize = shortcut('resize');
const dom7_esm_scroll = shortcut('scroll');

/* harmony default export */ const dom7_esm = ((/* unused pure expression or super */ null && (dom7_esm_$)));


;// CONCATENATED MODULE: ./node_modules/swiper/shared/dom.js

const Methods = {
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  toggleClass: toggleClass,
  attr: attr,
  removeAttr: removeAttr,
  transform: transform,
  transition: transition,
  on: on,
  off: off,
  trigger: trigger,
  transitionEnd: transitionEnd,
  outerWidth: dom7_esm_outerWidth,
  outerHeight: dom7_esm_outerHeight,
  styles: styles,
  offset: offset,
  css: css,
  each: each,
  html: html,
  text: dom7_esm_text,
  is: is,
  index: index,
  eq: eq,
  append: append,
  prepend: prepend,
  next: next,
  nextAll: nextAll,
  prev: prev,
  prevAll: prevAll,
  parent: dom7_esm_parent,
  parents: parents,
  closest: closest,
  find: find,
  children: children,
  filter: filter,
  remove: remove
};
Object.keys(Methods).forEach(methodName => {
  Object.defineProperty(dom7_esm_$.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
/* harmony default export */ const dom = (dom7_esm_$);
;// CONCATENATED MODULE: ./node_modules/swiper/shared/utils.js


function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach(key => {
    try {
      object[key] = null;
    } catch (e) {// no getter for object
    }

    try {
      delete object[key];
    } catch (e) {// something got wrong
    }
  });
}

function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}

function now() {
  return Date.now();
}

function utils_getComputedStyle(el) {
  const window = ssr_window_esm_getWindow();
  let style;

  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }

  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }

  if (!style) {
    style = el.style;
  }

  return style;
}

function getTranslate(el, axis = 'x') {
  const window = ssr_window_esm_getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = utils_getComputedStyle(el, null);

  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;

    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    } // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case


    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }

  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }

  return curTransform || 0;
}

function utils_isObject(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}

function isNode(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement;
  }

  return node && (node.nodeType === 1 || node.nodeType === 11);
}

function utils_extend(...args) {
  const to = Object(args[0]);
  const noExtend = ['__proto__', 'constructor', 'prototype'];

  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];

    if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

        if (desc !== undefined && desc.enumerable) {
          if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              utils_extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
            to[nextKey] = {};

            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              utils_extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }

  return to;
}

function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}

function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window = ssr_window_esm_getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = 'none';
  window.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? 'next' : 'prev';

  const isOutOfBound = (current, target) => {
    return dir === 'next' && current >= target || dir === 'prev' && current <= target;
  };

  const animate = () => {
    time = new Date().getTime();

    if (startTime === null) {
      startTime = time;
    }

    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }

    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });

    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.scrollSnapType = '';
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }

    swiper.cssModeFrameID = window.requestAnimationFrame(animate);
  };

  animate();
}


;// CONCATENATED MODULE: ./node_modules/swiper/shared/get-support.js

let support;

function calcSupport() {
  const window = ssr_window_esm_getWindow();
  const document = getDocument();
  return {
    smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;

      try {
        const opts = Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line
          get() {
            supportsPassive = true;
          }

        });
        window.addEventListener('testPassiveListener', null, opts);
      } catch (e) {// No support
      }

      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return 'ongesturestart' in window;
    }()
  };
}

function getSupport() {
  if (!support) {
    support = calcSupport();
  }

  return support;
}


;// CONCATENATED MODULE: ./node_modules/swiper/shared/get-device.js


let deviceCached;

function calcDevice({
  userAgent
} = {}) {
  const support = getSupport();
  const window = ssr_window_esm_getWindow();
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === 'Win32';
  let macos = platform === 'MacIntel'; // iPadOs 13 fix

  const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

  if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  } // Android


  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }

  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  } // Export object


  return device;
}

function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }

  return deviceCached;
}


;// CONCATENATED MODULE: ./node_modules/swiper/shared/get-browser.js

let browser;

function calcBrowser() {
  const window = ssr_window_esm_getWindow();

  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }

  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
  };
}

function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }

  return browser;
}


;// CONCATENATED MODULE: ./node_modules/swiper/core/modules/resize/resize.js

function Resize({
  swiper,
  on,
  emit
}) {
  const window = ssr_window_esm_getWindow();
  let observer = null;
  let animationFrame = null;

  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('beforeResize');
    emit('resize');
  };

  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver(entries => {
      animationFrame = window.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });

        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };

  const removeObserver = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }

    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };

  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('orientationchange');
  };

  on('init', () => {
    if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });
  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/modules/observer/observer.js

function Observer({
  swiper,
  extendParams,
  on,
  emit
}) {
  const observers = [];
  const window = ssr_window_esm_getWindow();

  const attach = (target, options = {}) => {
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    const observer = new ObserverFunc(mutations => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0]);
        return;
      }

      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0]);
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    observers.push(observer);
  };

  const init = () => {
    if (!swiper.params.observer) return;

    if (swiper.params.observeParents) {
      const containerParents = swiper.$el.parents();

      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    } // Observe container


    attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    }); // Observe wrapper

    attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  };

  const destroy = () => {
    observers.forEach(observer => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };

  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on('init', init);
  on('destroy', destroy);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events-emitter.js
/* eslint-disable no-underscore-dangle */
/* harmony default export */ const events_emitter = ({
  on(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },

  once(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;

    function onceHandler(...args) {
      self.off(events, onceHandler);

      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }

      handler.apply(self, args);
    }

    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },

  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';

    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }

    return self;
  },

  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);

    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }

    return self;
  },

  off(events, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(event => {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },

  emit(...args) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events;
    let data;
    let context;

    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }

    data.unshift(context);
    const eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(event => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(eventHandler => {
          eventHandler.apply(context, [event, ...data]);
        });
      }

      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(eventHandler => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }

});
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateSize.js
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const $el = swiper.$el;

  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }

  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }

  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  } // Subtract paddings


  width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
  height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateSlides.js

function updateSlides() {
  const swiper = this;

  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    } // prettier-ignore


    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  }

  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }

  const params = swiper.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;

  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }

  let offsetAfter = params.slidesOffsetAfter;

  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }

  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;

  if (typeof swiperSize === 'undefined') {
    return;
  }

  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  }

  swiper.virtualSize = -spaceBetween; // reset margins

  if (rtl) slides.css({
    marginLeft: '',
    marginBottom: '',
    marginTop: ''
  });else slides.css({
    marginRight: '',
    marginBottom: '',
    marginTop: ''
  }); // reset cssMode offsets

  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
  }

  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  } // Calc slides


  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
    return typeof params.breakpoints[key].slidesPerView !== 'undefined';
  }).length > 0;

  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide = slides.eq(i);

    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
    }

    if (slide.css('display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel('width')] = ``;
      }

      const slideStyles = getComputedStyle(slide[0]);
      const currentTransform = slide[0].style.transform;
      const currentWebKitTransform = slide[0].style.webkitTransform;

      if (currentTransform) {
        slide[0].style.transform = 'none';
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = 'none';
      }

      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
      } else {
        // eslint-disable-next-line
        const width = getDirectionPropertyValue(slideStyles, 'width');
        const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        const boxSizing = slideStyles.getPropertyValue('box-sizing');

        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }

      if (currentTransform) {
        slide[0].style.transform = currentTransform;
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = currentWebKitTransform;
      }

      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);

      if (slides[i]) {
        slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
      }
    }

    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }

    slidesSizesGrid.push(slideSize);

    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }

    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }

  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    $wrapperEl.css({
      width: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }

  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }

  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  } // Remove last grid elements depending on width


  if (!params.centeredSlides) {
    const newSlidesGrid = [];

    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }

    snapGrid = newSlidesGrid;

    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }

  if (snapGrid.length === 0) snapGrid = [0];

  if (params.spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
    slides.filter((_, slideIndex) => {
      if (!params.cssMode) return true;

      if (slideIndex === slides.length - 1) {
        return false;
      }

      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }

  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map(snap => {
      if (snap < 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }

  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;

    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }

  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });

  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
  }

  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }

  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }

  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }

  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }

  if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);

    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.$el.removeClass(backFaceHiddenClass);
    }
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateAutoHeight.js

function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;

  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }

  const getSlideByIndex = index => {
    if (isVirtual) {
      return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
    }

    return swiper.slides.eq(index)[0];
  }; // Find slides currently in view


  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || dom([])).each(slide => {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  } // Find new height from highest slide in view


  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  } // Update Height


  if (newHeight || newHeight === 0) swiper.$wrapperEl.css('height', `${newHeight}px`);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateSlidesOffset.js
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;

  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateSlidesProgress.js

function updateSlidesProgress(translate = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  let offsetCenter = -translate;
  if (rtl) offsetCenter = translate; // Visible Slides

  slides.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];

  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    let slideOffset = slide.swiperSlideOffset;

    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }

    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

    if (isVisible) {
      swiper.visibleSlides.push(slide);
      swiper.visibleSlidesIndexes.push(i);
      slides.eq(i).addClass(params.slideVisibleClass);
    }

    slide.progress = rtl ? -slideProgress : slideProgress;
    slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }

  swiper.visibleSlides = dom(swiper.visibleSlides);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateProgress.js
function updateProgress(translate) {
  const swiper = this;

  if (typeof translate === 'undefined') {
    const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }

  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;

  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }

  Object.assign(swiper, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }

  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }

  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }

  swiper.emit('progress', progress);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateSlidesClasses.js
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;

  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides.eq(activeIndex);
  } // Active classes


  activeSlide.addClass(params.slideActiveClass);

  if (params.loop) {
    // Duplicate to all looped slides
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  } // Next Slide


  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  } // Prev Slide


  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }

  if (params.loop) {
    // Duplicate to all looped slides
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
    }

    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }

  swiper.emitSlidesClasses();
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateActiveIndex.js
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;

  if (typeof activeIndex === 'undefined') {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate >= slidesGrid[i]) {
        activeIndex = i;
      }
    } // Normalize slideIndex


    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
    }
  }

  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }

  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }

    return;
  } // Get real index


  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
  Object.assign(swiper, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');

  if (previousRealIndex !== realIndex) {
    swiper.emit('realIndexChange');
  }

  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit('slideChange');
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/updateClickedSlide.js

function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide = dom(e).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;

  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }

  if (slide && slideFound) {
    swiper.clickedSlide = slide;

    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(dom(slide).attr('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }

  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/update/index.js









/* harmony default export */ const update = ({
  updateSize: updateSize,
  updateSlides: updateSlides,
  updateAutoHeight: updateAutoHeight,
  updateSlidesOffset: updateSlidesOffset,
  updateSlidesProgress: updateSlidesProgress,
  updateProgress: updateProgress,
  updateSlidesClasses: updateSlidesClasses,
  updateActiveIndex: updateActiveIndex,
  updateClickedSlide: updateClickedSlide
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/translate/getTranslate.js

function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate,
    $wrapperEl
  } = swiper;

  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }

  if (params.cssMode) {
    return translate;
  }

  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/translate/setTranslate.js
function setTranslate(translate, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;

  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }

  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }

  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
  }

  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }

  swiper.emit('setTranslate', swiper.translate, byController);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/translate/minTranslate.js
function minTranslate() {
  return -this.snapGrid[0];
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/translate/maxTranslate.js
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/translate/translateTo.js

function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }

  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

  swiper.updateProgress(newTranslate);

  if (params.cssMode) {
    const isH = swiper.isHorizontal();

    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? 'left' : 'top'
        });
        return true;
      }

      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: -newTranslate,
        behavior: 'smooth'
      });
    }

    return true;
  }

  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }

    if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;

          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
    }
  }

  return true;
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/translate/index.js





/* harmony default export */ const translate = ({
  getTranslate: getSwiperTranslate,
  setTranslate: setTranslate,
  minTranslate: minTranslate,
  maxTranslate: maxTranslate,
  translateTo: translateTo
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/transition/setTransition.js
function setTransition(duration, byController) {
  const swiper = this;

  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }

  swiper.emit('setTransition', duration, byController);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/transition/transitionEmit.js
function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;

  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit(`transition${step}`);

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }

    swiper.emit(`slideChangeTransition${step}`);

    if (dir === 'next') {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/transition/transitionStart.js

function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;

  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }

  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'Start'
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/transition/transitionEnd.js

function transitionEnd_transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'End'
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/transition/index.js



/* harmony default export */ const core_transition = ({
  setTransition: setTransition,
  transitionStart: transitionStart,
  transitionEnd: transitionEnd_transitionEnd
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slideTo.js

function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index !== 'number' && typeof index !== 'string') {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
  }

  if (typeof index === 'string') {
    /**
     * The `index` argument converted from `string` to `number`.
     * @type {number}
     */
    const indexAsNumber = parseInt(index, 10);
    /**
     * Determines whether the `index` argument is a valid `number`
     * after being converted from the `string` type.
     * @type {boolean}
     */

    const isValidNumber = isFinite(indexAsNumber);

    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
    } // Knowing that the converted `index` is a valid number,
    // we can update the original argument's value.


    index = indexAsNumber;
  }

  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;

  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }

  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate = -snapGrid[snapIndex]; // Normalize slideIndex

  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  } // Directions locks


  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
      return false;
    }

    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) return false;
    }
  }

  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  } // Update progress


  swiper.updateProgress(translate);
  let direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex); // Update Height

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    swiper.updateSlidesClasses();

    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }

    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }

    return false;
  }

  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate : -translate;

    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = 'none';
        swiper._immediateVirtual = true;
      }

      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = '';
          swiper._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? 'left' : 'top'
        });
        return true;
      }

      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: t,
        behavior: 'smooth'
      });
    }

    return true;
  }

  swiper.setTransition(speed);
  swiper.setTranslate(translate);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit('beforeTransitionStart', speed, internal);
  swiper.transitionStart(runCallbacks, direction);

  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;

    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
        if (!swiper || swiper.destroyed) return;
        if (e.target !== this) return;
        swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }

    swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
    swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
  }

  return true;
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slideToLoop.js
function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
  if (typeof index === 'string') {
    /**
     * The `index` argument converted from `string` to `number`.
     * @type {number}
     */
    const indexAsNumber = parseInt(index, 10);
    /**
     * Determines whether the `index` argument is a valid `number`
     * after being converted from the `string` type.
     * @type {boolean}
     */

    const isValidNumber = isFinite(indexAsNumber);

    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
    } // Knowing that the converted `index` is a valid number,
    // we can update the original argument's value.


    index = indexAsNumber;
  }

  const swiper = this;
  let newIndex = index;

  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }

  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slideNext.js
/* eslint no-unused-vars: "off" */
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    animating,
    enabled,
    params
  } = swiper;
  if (!enabled) return swiper;
  let perGroup = params.slidesPerGroup;

  if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
  }

  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }

  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slidePrev.js
/* eslint no-unused-vars: "off" */
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return swiper;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  const translate = rtlTranslate ? swiper.translate : -swiper.translate;

  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }

  const normalizedTranslate = normalize(translate);
  const normalizedSnapGrid = snapGrid.map(val => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

  if (typeof prevSnap === 'undefined' && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        // prevSnap = snap;
        prevSnapIndex = snapIndex;
      }
    });

    if (typeof prevSnapIndex !== 'undefined') {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }

  let prevIndex = 0;

  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }

  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }

  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slideReset.js
/* eslint no-unused-vars: "off" */
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slideToClosest.js
/* eslint no-unused-vars: "off" */
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];

    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];

    if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }

  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/slideToClickedSlide.js


function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    $wrapperEl
  } = swiper;
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;

  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(dom(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/slide/index.js







/* harmony default export */ const slide = ({
  slideTo: slideTo,
  slideToLoop: slideToLoop,
  slideNext: slideNext,
  slidePrev: slidePrev,
  slideReset: slideReset,
  slideToClosest: slideToClosest,
  slideToClickedSlide: slideToClickedSlide
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/loop/loopCreate.js


function loopCreate() {
  const swiper = this;
  const document = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper; // Remove duplicated slides

  const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides = $selector.children(`.${params.slideClass}`);

  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = dom(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }

      slides = $selector.children(`.${params.slideClass}`);
    }
  }

  if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;

  if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) {
    swiper.loopedSlides = slides.length;
  }

  const prependSlides = [];
  const appendSlides = [];
  slides.each((el, index) => {
    const slide = dom(el);
    slide.attr('data-swiper-slide-index', index);
  });

  for (let i = 0; i < swiper.loopedSlides; i += 1) {
    const index = i - Math.floor(i / slides.length) * slides.length;
    appendSlides.push(slides.eq(index)[0]);
    prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
  }

  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }

  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/loop/loopFix.js
function loopFix() {
  const swiper = this;
  swiper.emit('beforeLoopFix');
  const {
    activeIndex,
    slides,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper;
  let newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    // Fix For Positive Oversliding
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }

  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit('loopFix');
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/loop/loopDestroy.js
function loopDestroy() {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    slides
  } = swiper;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides.removeAttr('data-swiper-slide-index');
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/loop/index.js



/* harmony default export */ const loop = ({
  loopCreate: loopCreate,
  loopFix: loopFix,
  loopDestroy: loopDestroy
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/grab-cursor/setGrabCursor.js
function setGrabCursor(moving) {
  const swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
  el.style.cursor = 'move';
  el.style.cursor = moving ? 'grabbing' : 'grab';
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/grab-cursor/unsetGrabCursor.js
function unsetGrabCursor() {
  const swiper = this;

  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }

  swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/grab-cursor/index.js


/* harmony default export */ const grab_cursor = ({
  setGrabCursor: setGrabCursor,
  unsetGrabCursor: unsetGrabCursor
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/onTouchStart.js


 // Modified from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd

function closestElement(selector, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === ssr_window_esm_getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);

    if (!found && !el.getRootNode) {
      return null;
    }

    return found || __closestFrom(el.getRootNode().host);
  }

  return __closestFrom(base);
}

function onTouchStart(event) {
  const swiper = this;
  const document = getDocument();
  const window = ssr_window_esm_getWindow();
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }

  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }

  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  let $targetEl = dom(e.target);

  if (params.touchEventsTarget === 'wrapper') {
    if (!$targetEl.closest(swiper.wrapperEl).length) return;
  }

  data.isTouchEvent = e.type === 'touchstart';
  if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
  if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return; // change target el for shadow root component

  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== ''; // eslint-disable-next-line

  const eventPath = event.composedPath ? event.composedPath() : event.path;

  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    $targetEl = dom(eventPath[0]);
  }

  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper.allowClick = true;
    return;
  }

  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0]) return;
  }

  touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
    } else {
      return;
    }
  }

  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;

  if (e.type !== 'touchstart') {
    let preventDefault = true;

    if ($targetEl.is(data.focusableElements)) {
      preventDefault = false;

      if ($targetEl[0].nodeName === 'SELECT') {
        data.isTouched = false;
      }
    }

    if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
      document.activeElement.blur();
    }

    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }

  if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }

  swiper.emit('touchStart', e);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/onTouchMove.js



function onTouchMove(event) {
  const document = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }

    return;
  }

  if (data.isTouchEvent && e.type !== 'touchmove') return;
  const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
  const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }

  if (!swiper.allowTouchMove) {
    if (!dom(e.target).is(data.focusableElements)) {
      swiper.allowClick = false;
    }

    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }

    return;
  }

  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }

  if (data.isTouchEvent && document.activeElement) {
    if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }

  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }

  if (e.targetTouches && e.targetTouches.length > 1) return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

  if (typeof data.isScrolling === 'undefined') {
    let touchAngle;

    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }

  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }

  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }

  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }

  if (!data.startMoving) {
    return;
  }

  swiper.allowClick = false;

  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }

  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }

  if (!data.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper.loopFix();
    }

    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);

    if (swiper.animating) {
      swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
    }

    data.allowMomentumBounce = false; // Grab Cursor

    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }

    swiper.emit('sliderFirstMove', e);
  }

  swiper.emit('sliderMove', e);
  data.isMoved = true;
  let diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) diff = -diff;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;

  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }

  if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
  }

  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  } // Directions locks


  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  } // Threshold


  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }

  if (!params.followFinger || params.cssMode) return; // Update active index in free mode

  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  } // Update progress


  swiper.updateProgress(data.currentTranslate); // Update translate

  swiper.setTranslate(data.currentTranslate);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/onTouchEnd.js

function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }

  data.allowTouchCallbacks = false;

  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }

    data.isMoved = false;
    data.startMoving = false;
    return;
  } // Return Grab Cursor


  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  } // Time diff


  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper.emit('tap click', e);

    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }

  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });

  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }

  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;

  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }

  if (params.cssMode) {
    return;
  }

  if (swiper.params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  } // Find current slide


  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];

  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

    if (typeof slidesGrid[i + increment] !== 'undefined') {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }

  let rewindFirstIndex = null;
  let rewindLastIndex = null;

  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  } // Find current slide size


  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
    }

    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }

      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/onResize.js
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return; // Breakpoints

  if (params.breakpoints) {
    swiper.setBreakpoint();
  } // Save locks


  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper; // Disable locks on resize

  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();

  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }

  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  } // Return locks after resize


  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;

  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/onClick.js
function onClick(e) {
  const swiper = this;
  if (!swiper.enabled) return;

  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();

    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/onScroll.js
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;

  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  } // eslint-disable-next-line


  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }

  swiper.emit('setTranslate', swiper.translate, false);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/events/index.js







let dummyEventAttached = false;

function dummyEventListener() {}

const events = (swiper, method) => {
  const document = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const swiperMethod = method; // Touch Events

  if (!support.touch) {
    el[domMethod](touchEvents.start, swiper.onTouchStart, false);
    document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
    document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    }
  } // Prevent Links Clicks


  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]('click', swiper.onClick, true);
  }

  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  } // Resize handler


  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }
};

function attachEvents() {
  const swiper = this;
  const document = getDocument();
  const {
    params,
    support
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);

  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }

  swiper.onClick = onClick.bind(swiper);

  if (support.touch && !dummyEventAttached) {
    document.addEventListener('touchstart', dummyEventListener);
    dummyEventAttached = true;
  }

  events(swiper, 'on');
}

function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}

/* harmony default export */ const core_events = ({
  attachEvents,
  detachEvents
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/breakpoints/setBreakpoint.js


const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};

function setBreakpoint() {
  const swiper = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper;
  const breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

  const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;

  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);

    if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }

    swiper.emitContainerClasses();
  } // Toggle navigation, pagination, scrollbar


  ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;

    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }

    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

  if (directionChanged && initialized) {
    swiper.changeDirection();
  }

  utils_extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });

  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }

  swiper.currentBreakpoint = breakpoint;
  swiper.emit('_beforeBreakpoint', breakpointParams);

  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();
    swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
  }

  swiper.emit('breakpoint', breakpointParams);
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/breakpoints/getBreakpoint.js

function getBreakpoint(breakpoints, base = 'window', containerEl) {
  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  let breakpoint = false;
  const window = ssr_window_esm_getWindow();
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints).map(point => {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }

    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];

    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }

  return breakpoint || 'max';
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/breakpoints/index.js


/* harmony default export */ const breakpoints = ({
  setBreakpoint: setBreakpoint,
  getBreakpoint: getBreakpoint
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/classes/addClasses.js
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(classNames => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}

function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support
  } = swiper; // prettier-ignore

  const suffixes = prepareClasses(['initialized', params.direction, {
    'pointer-events': !support.touch
  }, {
    'free-mode': swiper.params.freeMode && params.freeMode.enabled
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'grid': params.grid && params.grid.rows > 1
  }, {
    'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }, {
    'centered': params.cssMode && params.centeredSlides
  }, {
    'watch-progress': params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(' '));
  swiper.emitContainerClasses();
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/classes/removeClasses.js
function removeClasses() {
  const swiper = this;
  const {
    $el,
    classNames
  } = swiper;
  $el.removeClass(classNames.join(' '));
  swiper.emitContainerClasses();
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/classes/index.js


/* harmony default export */ const classes = ({
  addClasses: addClasses,
  removeClasses: removeClasses
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/images/loadImage.js


function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window = ssr_window_esm_getWindow();
  let image;

  function onReady() {
    if (callback) callback();
  }

  const isPicture = dom(imageEl).parent('picture')[0];

  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window.Image();
      image.onload = onReady;
      image.onerror = onReady;

      if (sizes) {
        image.sizes = sizes;
      }

      if (srcset) {
        image.srcset = srcset;
      }

      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    // image already loaded...
    onReady();
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/images/preloadImages.js
function preloadImages() {
  const swiper = this;
  swiper.imagesToLoad = swiper.$el.find('img');

  function onReady() {
    if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
    if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady) swiper.update();
      swiper.emit('imagesReady');
    }
  }

  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
    const imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/images/index.js


/* harmony default export */ const core_images = ({
  loadImage: loadImage,
  preloadImages: preloadImages
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/check-overflow/index.js
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;

  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }

  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }

  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }

  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }

  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}

/* harmony default export */ const check_overflow = ({
  checkOverflow
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/defaults.js
/* harmony default export */ const defaults = ({
  init: true,
  direction: 'horizontal',
  touchEventsTarget: 'wrapper',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: 'input, select, option, textarea, button, video, label',
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // Images
  preloadImages: true,
  updateOnImagesReady: true,
  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopedSlidesLimit: true,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: 'swiper-',
  // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-invisible-blank',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
});
;// CONCATENATED MODULE: ./node_modules/swiper/core/moduleExtendParams.js

function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];

    if (typeof moduleParams !== 'object' || moduleParams === null) {
      utils_extend(allModulesParams, obj);
      return;
    }

    if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }

    if (!(moduleParamName in params && 'enabled' in moduleParams)) {
      utils_extend(allModulesParams, obj);
      return;
    }

    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }

    if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }

    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    utils_extend(allModulesParams, obj);
  };
}
;// CONCATENATED MODULE: ./node_modules/swiper/core/core.js
/* eslint no-param-reassign: "off" */






















const prototypes = {
  eventsEmitter: events_emitter,
  update: update,
  translate: translate,
  transition: core_transition,
  slide: slide,
  loop: loop,
  grabCursor: grab_cursor,
  events: core_events,
  breakpoints: breakpoints,
  checkOverflow: check_overflow,
  classes: classes,
  images: core_images
};
const extendedDefaults = {};

class Swiper {
  constructor(...args) {
    let el;
    let params;

    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      [el, params] = args;
    }

    if (!params) params = {};
    params = utils_extend({}, params);
    if (el && !params.el) params.el = el;

    if (params.el && dom(params.el).length > 1) {
      const swipers = [];
      dom(params.el).each(containerEl => {
        const newParams = utils_extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      }); // eslint-disable-next-line no-constructor-return

      return swipers;
    } // Swiper Instance


    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];

    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }

    const allModulesParams = {};
    swiper.modules.forEach(mod => {
      mod({
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    }); // Extend defaults with modules params

    const swiperParams = utils_extend({}, defaults, allModulesParams); // Extend defaults with passed params

    swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = utils_extend({}, swiper.params);
    swiper.passedParams = utils_extend({}, params); // add event listeners

    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(eventName => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }

    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    } // Save Dom lib


    swiper.$ = dom; // Extend Swiper

    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: dom(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],

      // isDirection
      isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },

      isVertical() {
        return swiper.params.direction === 'vertical';
      },

      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEvents: function touchEvents() {
        const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        const desktop = ['pointerdown', 'pointermove', 'pointerup'];
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: now(),
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        isTouchEvent: undefined,
        startMoving: undefined
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit('_swiper'); // Init

    if (swiper.params.init) {
      swiper.init();
    } // Return app instance
    // eslint-disable-next-line no-constructor-return


    return swiper;
  }

  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;

    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }

    swiper.emit('enable');
  }

  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;

    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }

    swiper.emit('disable');
  }

  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(' ').filter(className => {
      return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', cls.join(' '));
  }

  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return '';
    return slideEl.className.split(' ').filter(className => {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  }

  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.each(slideEl => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  }

  slidesPerViewDynamic(view = 'current', exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;

    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].swiperSlideSize;
      let breakLoop;

      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }

      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

          if (slideInView) {
            spv += 1;
          }
        }
      }
    }

    return spv;
  }

  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper; // Breakpoints

    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();

    function setTranslate() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    let translated;

    if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
      setTranslate();

      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (!translated) {
        setTranslate();
      }
    }

    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }

    swiper.emit('update');
  }

  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;

    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }

    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }

    swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each(slideEl => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  }

  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
    swiper.rtl = direction === 'rtl';
    swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;

    if (swiper.rtl) {
      swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'rtl';
    } else {
      swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'ltr';
    }

    swiper.update();
  }

  mount(el) {
    const swiper = this;
    if (swiper.mounted) return true; // Find el

    const $el = dom(el || swiper.params.el);
    el = $el[0];

    if (!el) {
      return false;
    }

    el.swiper = swiper;

    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };

    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = dom(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

        res.children = options => $el.children(options);

        return res;
      }

      if (!$el.children) {
        return dom($el).children(getWrapperSelector());
      }

      return $el.children(getWrapperSelector());
    }; // Find Wrapper


    let $wrapperEl = getWrapper();

    if ($wrapperEl.length === 0 && swiper.params.createElements) {
      const document = getDocument();
      const wrapper = document.createElement('div');
      $wrapperEl = dom(wrapper);
      wrapper.className = swiper.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
        $wrapperEl.append(slideEl);
      });
    }

    Object.assign(swiper, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
      wrongRTL: $wrapperEl.css('display') === '-webkit-box'
    });
    return true;
  }

  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit'); // Set breakpoint

    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    } // Add Classes


    swiper.addClasses(); // Create loop

    if (swiper.params.loop) {
      swiper.loopCreate();
    } // Update size


    swiper.updateSize(); // Update slides

    swiper.updateSlides();

    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    } // Set Grab Cursor


    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }

    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    } // Slide To Initial Slide


    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    } // Attach events


    swiper.attachEvents(); // Init Flag

    swiper.initialized = true; // Emit

    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  }

  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides
    } = swiper;

    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }

    swiper.emit('beforeDestroy'); // Init Flag

    swiper.initialized = false; // Detach events

    swiper.detachEvents(); // Destroy loop

    if (params.loop) {
      swiper.loopDestroy();
    } // Cleanup styles


    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr('style');
      $wrapperEl.removeAttr('style');

      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
      }
    }

    swiper.emit('destroy'); // Detach emitter events

    Object.keys(swiper.eventsListeners).forEach(eventName => {
      swiper.off(eventName);
    });

    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      deleteProps(swiper);
    }

    swiper.destroyed = true;
    return null;
  }

  static extendDefaults(newDefaults) {
    utils_extend(extendedDefaults, newDefaults);
  }

  static get extendedDefaults() {
    return extendedDefaults;
  }

  static get defaults() {
    return defaults;
  }

  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;

    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }

  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => Swiper.installModule(m));
      return Swiper;
    }

    Swiper.installModule(module);
    return Swiper;
  }

}

Object.keys(prototypes).forEach(prototypeGroup => {
  Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
/* harmony default export */ const core = (Swiper);
;// CONCATENATED MODULE: ./node_modules/swiper/modules/virtual/virtual.js


function Virtual({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      renderSlide: null,
      renderExternal: null,
      renderExternalUpdate: true,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  });
  let cssModeTimeout;
  swiper.virtual = {
    cache: {},
    from: undefined,
    to: undefined,
    slides: [],
    offset: 0,
    slidesGrid: []
  };

  function renderSlide(slide, index) {
    const params = swiper.params.virtual;

    if (params.cache && swiper.virtual.cache[index]) {
      return swiper.virtual.cache[index];
    }

    const $slideEl = params.renderSlide ? dom(params.renderSlide.call(swiper, slide, index)) : dom(`<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`);
    if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
    if (params.cache) swiper.virtual.cache[index] = $slideEl;
    return $slideEl;
  }

  function update(force) {
    const {
      slidesPerView,
      slidesPerGroup,
      centeredSlides
    } = swiper.params;
    const {
      addSlidesBefore,
      addSlidesAfter
    } = swiper.params.virtual;
    const {
      from: previousFrom,
      to: previousTo,
      slides,
      slidesGrid: previousSlidesGrid,
      offset: previousOffset
    } = swiper.virtual;

    if (!swiper.params.cssMode) {
      swiper.updateActiveIndex();
    }

    const activeIndex = swiper.activeIndex || 0;
    let offsetProp;
    if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
    let slidesAfter;
    let slidesBefore;

    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
      slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
    } else {
      slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
      slidesBefore = slidesPerGroup + addSlidesBefore;
    }

    const from = Math.max((activeIndex || 0) - slidesBefore, 0);
    const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
    const offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
    Object.assign(swiper.virtual, {
      from,
      to,
      offset,
      slidesGrid: swiper.slidesGrid
    });

    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      if (swiper.lazy && swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }

      emit('virtualUpdate');
    }

    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
        swiper.slides.css(offsetProp, `${offset}px`);
      }

      swiper.updateProgress();
      emit('virtualUpdate');
      return;
    }

    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset,
        from,
        to,
        slides: function getSlides() {
          const slidesToRender = [];

          for (let i = from; i <= to; i += 1) {
            slidesToRender.push(slides[i]);
          }

          return slidesToRender;
        }()
      });

      if (swiper.params.virtual.renderExternalUpdate) {
        onRendered();
      } else {
        emit('virtualUpdate');
      }

      return;
    }

    const prependIndexes = [];
    const appendIndexes = [];

    if (force) {
      swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
    } else {
      for (let i = previousFrom; i <= previousTo; i += 1) {
        if (i < from || i > to) {
          swiper.$wrapperEl.find(`.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`).remove();
        }
      }
    }

    for (let i = 0; i < slides.length; i += 1) {
      if (i >= from && i <= to) {
        if (typeof previousTo === 'undefined' || force) {
          appendIndexes.push(i);
        } else {
          if (i > previousTo) appendIndexes.push(i);
          if (i < previousFrom) prependIndexes.push(i);
        }
      }
    }

    appendIndexes.forEach(index => {
      swiper.$wrapperEl.append(renderSlide(slides[index], index));
    });
    prependIndexes.sort((a, b) => b - a).forEach(index => {
      swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
    });
    swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, `${offset}px`);
    onRendered();
  }

  function appendSlide(slides) {
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.push(slides[i]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }

    update(true);
  }

  function prependSlide(slides) {
    const activeIndex = swiper.activeIndex;
    let newActiveIndex = activeIndex + 1;
    let numberOfNewSlides = 1;

    if (Array.isArray(slides)) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
      }

      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }

    if (swiper.params.virtual.cache) {
      const cache = swiper.virtual.cache;
      const newCache = {};
      Object.keys(cache).forEach(cachedIndex => {
        const $cachedEl = cache[cachedIndex];
        const cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

        if (cachedElIndex) {
          $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
        }

        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
      });
      swiper.virtual.cache = newCache;
    }

    update(true);
    swiper.slideTo(newActiveIndex, 0);
  }

  function removeSlide(slidesIndexes) {
    if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
    let activeIndex = swiper.activeIndex;

    if (Array.isArray(slidesIndexes)) {
      for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
        swiper.virtual.slides.splice(slidesIndexes[i], 1);

        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i]];
        }

        if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      swiper.virtual.slides.splice(slidesIndexes, 1);

      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
      }

      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }

    update(true);
    swiper.slideTo(activeIndex, 0);
  }

  function removeAllSlides() {
    swiper.virtual.slides = [];

    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }

    update(true);
    swiper.slideTo(0, 0);
  }

  on('beforeInit', () => {
    if (!swiper.params.virtual.enabled) return;
    swiper.virtual.slides = swiper.params.virtual.slides;
    swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;

    if (!swiper.params.initialSlide) {
      update();
    }
  });
  on('setTranslate', () => {
    if (!swiper.params.virtual.enabled) return;

    if (swiper.params.cssMode && !swiper._immediateVirtual) {
      clearTimeout(cssModeTimeout);
      cssModeTimeout = setTimeout(() => {
        update();
      }, 100);
    } else {
      update();
    }
  });
  on('init update resize', () => {
    if (!swiper.params.virtual.enabled) return;

    if (swiper.params.cssMode) {
      setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
    }
  });
  Object.assign(swiper.virtual, {
    appendSlide,
    prependSlide,
    removeSlide,
    removeAllSlides,
    update
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/keyboard/keyboard.js
/* eslint-disable consistent-return */


function Keyboard({
  swiper,
  extendParams,
  on,
  emit
}) {
  const document = getDocument();
  const window = ssr_window_esm_getWindow();
  swiper.keyboard = {
    enabled: false
  };
  extendParams({
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  });

  function handle(event) {
    if (!swiper.enabled) return;
    const {
      rtlTranslate: rtl
    } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent; // jquery fix

    const kc = e.keyCode || e.charCode;
    const pageUpDown = swiper.params.keyboard.pageUpDown;
    const isPageUp = pageUpDown && kc === 33;
    const isPageDown = pageUpDown && kc === 34;
    const isArrowLeft = kc === 37;
    const isArrowRight = kc === 39;
    const isArrowUp = kc === 38;
    const isArrowDown = kc === 40; // Directions locks

    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }

    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }

    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return undefined;
    }

    if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
      return undefined;
    }

    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      let inView = false; // Check that swiper should be inside of visible area of window

      if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
        return undefined;
      }

      const $el = swiper.$el;
      const swiperWidth = $el[0].clientWidth;
      const swiperHeight = $el[0].clientHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const swiperOffset = swiper.$el.offset();
      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

      for (let i = 0; i < swiperCoord.length; i += 1) {
        const point = swiperCoord[i];

        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

          inView = true;
        }
      }

      if (!inView) return undefined;
    }

    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }

      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }

      if (isPageDown || isArrowDown) swiper.slideNext();
      if (isPageUp || isArrowUp) swiper.slidePrev();
    }

    emit('keyPress', kc);
    return undefined;
  }

  function enable() {
    if (swiper.keyboard.enabled) return;
    dom(document).on('keydown', handle);
    swiper.keyboard.enabled = true;
  }

  function disable() {
    if (!swiper.keyboard.enabled) return;
    dom(document).off('keydown', handle);
    swiper.keyboard.enabled = false;
  }

  on('init', () => {
    if (swiper.params.keyboard.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    if (swiper.keyboard.enabled) {
      disable();
    }
  });
  Object.assign(swiper.keyboard, {
    enable,
    disable
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/mousewheel/mousewheel.js
/* eslint-disable consistent-return */



function Mousewheel({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window = ssr_window_esm_getWindow();
  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null
    }
  });
  swiper.mousewheel = {
    enabled: false
  };
  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];

  function normalize(e) {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0; // spinX, spinY

    let pX = 0;
    let pY = 0; // pixelX, pixelY
    // Legacy

    if ('detail' in e) {
      sY = e.detail;
    }

    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }

    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }

    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    } // side scrolling on FF with DOMMouseScroll


    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in e) {
      pY = e.deltaY;
    }

    if ('deltaX' in e) {
      pX = e.deltaX;
    }

    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }

    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    } // Fall-back if spin cannot be determined


    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }

    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }

  function handleMouseEnter() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = true;
  }

  function handleMouseLeave() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = false;
  }

  function animateSlider(newEvent) {
    if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }

    if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    } // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).


    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      // Return false as a default
      return true;
    } // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.


    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        emit('scroll', newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      emit('scroll', newEvent.raw);
    } // If you got here is because an animation has been triggered so store the current time


    lastScrollTime = new window.Date().getTime(); // Return false as a default

    return false;
  }

  function releaseScroll(newEvent) {
    const params = swiper.params.mousewheel;

    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }

    return false;
  }

  function handle(event) {
    let e = event;
    let disableParentSwiper = true;
    if (!swiper.enabled) return;
    const params = swiper.params.mousewheel;

    if (swiper.params.cssMode) {
      e.preventDefault();
    }

    let target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = dom(swiper.params.mousewheel.eventsTarget);
    }

    if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
    if (e.originalEvent) e = e.originalEvent; // jquery fix

    let delta = 0;
    const rtlFactor = swiper.rtlTranslate ? -1 : 1;
    const data = normalize(e);

    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }

    if (delta === 0) return true;
    if (params.invert) delta = -delta; // Get the scroll positions

    let positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
    //     the disableParentSwiper will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentSwiper will be true.
    //     if the scroll on edge positions,
    //     then the disableParentSwiper will be false.

    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

    if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
      // Register the new event in a variable which stores the relevant data
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event
      }; // Keep the most recent events

      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }

      const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
      recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.

      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      } // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.


      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:
      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = undefined;

        if (swiper.params.loop) {
          swiper.loopFix();
        }

        let position = swiper.getTranslate() + delta * params.sensitivity;
        const wasBeginning = swiper.isBeginning;
        const wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();

        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }

        if (swiper.params.freeMode.sticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(timeout);
          timeout = undefined;

          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);

          if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            recentWheelEvents.splice(0);
          } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }

          if (!timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            timeout = nextTick(() => {
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        } // Emit event


        if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

        if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

        if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
      }
    }

    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  }

  function events(method) {
    let target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = dom(swiper.params.mousewheel.eventsTarget);
    }

    target[method]('mouseenter', handleMouseEnter);
    target[method]('mouseleave', handleMouseLeave);
    target[method]('wheel', handle);
  }

  function enable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener('wheel', handle);
      return true;
    }

    if (swiper.mousewheel.enabled) return false;
    events('on');
    swiper.mousewheel.enabled = true;
    return true;
  }

  function disable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, handle);
      return true;
    }

    if (!swiper.mousewheel.enabled) return false;
    events('off');
    swiper.mousewheel.enabled = false;
    return true;
  }

  on('init', () => {
    if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
      disable();
    }

    if (swiper.params.mousewheel.enabled) enable();
  });
  on('destroy', () => {
    if (swiper.params.cssMode) {
      enable();
    }

    if (swiper.mousewheel.enabled) disable();
  });
  Object.assign(swiper.mousewheel, {
    enable,
    disable
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/shared/create-element-if-not-defined.js

function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document = getDocument();

  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];

        if (!element) {
          element = document.createElement('div');
          element.className = checkProps[key];
          swiper.$el.append(element);
        }

        params[key] = element;
        originalParams[key] = element;
      }
    });
  }

  return params;
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/navigation/navigation.js


function Navigation({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock',
      navigationDisabledClass: 'swiper-navigation-disabled'
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };

  function getEl(el) {
    let $el;

    if (el) {
      $el = dom(el);

      if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }

    return $el;
  }

  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;

    if ($el && $el.length > 0) {
      $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
      if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
      }
    }
  }

  function update() {
    // Update Navigation Buttons
    if (swiper.params.loop) return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
  }

  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit('navigationPrev');
  }

  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit('navigationNext');
  }

  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', onNextClick);
    }

    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', onPrevClick);
    }

    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });

    if (!swiper.enabled) {
      if ($nextEl) $nextEl.addClass(params.lockClass);
      if ($prevEl) $prevEl.addClass(params.lockClass);
    }
  }

  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl && $nextEl.length) {
      $nextEl.off('click', onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }

    if ($prevEl && $prevEl.length) {
      $prevEl.off('click', onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }

  on('init', () => {
    if (swiper.params.navigation.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      update();
    }
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl) {
      $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }

    if ($prevEl) {
      $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }
  });
  on('click', (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;

    if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;

      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }

      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }

      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }

      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });

  const enable = () => {
    swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
    init();
    update();
  };

  const disable = () => {
    swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
    destroy();
  };

  Object.assign(swiper.navigation, {
    enable,
    disable,
    update,
    init,
    destroy
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/shared/classes-to-selector.js
function classesToSelector(classes = '') {
  return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/pagination/pagination.js



function Pagination({
  swiper,
  extendParams,
  on,
  emit
}) {
  const pfx = 'swiper-pagination';
  extendParams({
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets',
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: number => number,
      formatFractionTotal: number => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    $el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;

  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
  }

  function setSideBullets($bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
  }

  function update() {
    // Render || Update Pagination bullets/items
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el; // Current/Total

    let current;
    const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

    if (swiper.params.loop) {
      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

      if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
        current -= slidesLength - swiper.loopedSlides * 2;
      }

      if (current > total - 1) current -= total;
      if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
    } else {
      current = swiper.activeIndex || 0;
    } // Types


    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;

      if (params.dynamicBullets) {
        bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
        $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
          dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);

          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }

        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }

      bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

      if ($el.length > 1) {
        bullets.each(bullet => {
          const $bullet = dom(bullet);
          const bulletIndex = $bullet.index();

          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }

          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(`${params.bulletActiveClass}-main`);
            }

            if (bulletIndex === firstIndex) {
              setSideBullets($bullet, 'prev');
            }

            if (bulletIndex === lastIndex) {
              setSideBullets($bullet, 'next');
            }
          }
        });
      } else {
        const $bullet = bullets.eq(current);
        const bulletIndex = $bullet.index();
        $bullet.addClass(params.bulletActiveClass);

        if (params.dynamicBullets) {
          const $firstDisplayedBullet = bullets.eq(firstIndex);
          const $lastDisplayedBullet = bullets.eq(lastIndex);

          for (let i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
          }

          if (swiper.params.loop) {
            if (bulletIndex >= bullets.length) {
              for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
              }

              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
            } else {
              setSideBullets($firstDisplayedBullet, 'prev');
              setSideBullets($lastDisplayedBullet, 'next');
            }
          } else {
            setSideBullets($firstDisplayedBullet, 'prev');
            setSideBullets($lastDisplayedBullet, 'next');
          }
        }
      }

      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? 'right' : 'left';
        bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
      }
    }

    if (params.type === 'fraction') {
      $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
      $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
    }

    if (params.type === 'progressbar') {
      let progressbarDirection;

      if (params.progressbarOpposite) {
        progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
      } else {
        progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
      }

      const scale = (current + 1) / total;
      let scaleX = 1;
      let scaleY = 1;

      if (progressbarDirection === 'horizontal') {
        scaleX = scale;
      } else {
        scaleY = scale;
      }

      $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
    }

    if (params.type === 'custom' && params.renderCustom) {
      $el.html(params.renderCustom(swiper, current + 1, total));
      emit('paginationRender', $el[0]);
    } else {
      emit('paginationUpdate', $el[0]);
    }

    if (swiper.params.watchOverflow && swiper.enabled) {
      $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }
  }

  function render() {
    // Render Container
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el;
    let paginationHTML = '';

    if (params.type === 'bullets') {
      let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

      if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }

      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }

      $el.html(paginationHTML);
      swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
    }

    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
      }

      $el.html(paginationHTML);
    }

    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }

      $el.html(paginationHTML);
    }

    if (params.type !== 'custom') {
      emit('paginationRender', swiper.pagination.$el[0]);
    }
  }

  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: 'swiper-pagination'
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let $el = dom(params.el);
    if ($el.length === 0) return;

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
      $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

      if ($el.length > 1) {
        $el = $el.filter(el => {
          if (dom(el).parents('.swiper')[0] !== swiper.el) return false;
          return true;
        });
      }
    }

    if (params.type === 'bullets' && params.clickable) {
      $el.addClass(params.clickableClass);
    }

    $el.addClass(params.modifierClass + params.type);
    $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);

    if (params.type === 'bullets' && params.dynamicBullets) {
      $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
      dynamicBulletIndex = 0;

      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }

    if (params.type === 'progressbar' && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }

    if (params.clickable) {
      $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
        e.preventDefault();
        let index = dom(this).index() * swiper.params.slidesPerGroup;
        if (swiper.params.loop) index += swiper.loopedSlides;
        swiper.slideTo(index);
      });
    }

    Object.assign(swiper.pagination, {
      $el,
      el: $el[0]
    });

    if (!swiper.enabled) {
      $el.addClass(params.lockClass);
    }
  }

  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const $el = swiper.pagination.$el;
    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

    if (params.clickable) {
      $el.off('click', classesToSelector(params.bulletClass));
    }
  }

  on('init', () => {
    if (swiper.params.pagination.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      render();
      update();
    }
  });
  on('activeIndexChange', () => {
    if (swiper.params.loop) {
      update();
    } else if (typeof swiper.snapIndex === 'undefined') {
      update();
    }
  });
  on('snapIndexChange', () => {
    if (!swiper.params.loop) {
      update();
    }
  });
  on('slidesLengthChange', () => {
    if (swiper.params.loop) {
      render();
      update();
    }
  });
  on('snapGridLengthChange', () => {
    if (!swiper.params.loop) {
      render();
      update();
    }
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $el
    } = swiper.pagination;

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
    }
  });
  on('lock unlock', () => {
    update();
  });
  on('click', (_s, e) => {
    const targetEl = e.target;
    const {
      $el
    } = swiper.pagination;

    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

      if (isHidden === true) {
        emit('paginationShow');
      } else {
        emit('paginationHide');
      }

      $el.toggleClass(swiper.params.pagination.hiddenClass);
    }
  });

  const enable = () => {
    swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);

    if (swiper.pagination.$el) {
      swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
    }

    init();
    render();
    update();
  };

  const disable = () => {
    swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);

    if (swiper.pagination.$el) {
      swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
    }

    destroy();
  };

  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update,
    init,
    destroy
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/scrollbar/scrollbar.js




function Scrollbar({
  swiper,
  extendParams,
  on,
  emit
}) {
  const document = getDocument();
  let isTouched = false;
  let timeout = null;
  let dragTimeout = null;
  let dragStartPos;
  let dragSize;
  let trackSize;
  let divider;
  extendParams({
    scrollbar: {
      el: null,
      dragSize: 'auto',
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: 'swiper-scrollbar-lock',
      dragClass: 'swiper-scrollbar-drag',
      scrollbarDisabledClass: 'swiper-scrollbar-disabled',
      horizontalClass: `swiper-scrollbar-horizontal`,
      verticalClass: `swiper-scrollbar-vertical`
    }
  });
  swiper.scrollbar = {
    el: null,
    dragEl: null,
    $el: null,
    $dragEl: null
  };

  function setTranslate() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar,
      rtlTranslate: rtl,
      progress
    } = swiper;
    const {
      $dragEl,
      $el
    } = scrollbar;
    const params = swiper.params.scrollbar;
    let newSize = dragSize;
    let newPos = (trackSize - dragSize) * progress;

    if (rtl) {
      newPos = -newPos;

      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }

    if (swiper.isHorizontal()) {
      $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
      $dragEl[0].style.width = `${newSize}px`;
    } else {
      $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
      $dragEl[0].style.height = `${newSize}px`;
    }

    if (params.hide) {
      clearTimeout(timeout);
      $el[0].style.opacity = 1;
      timeout = setTimeout(() => {
        $el[0].style.opacity = 0;
        $el.transition(400);
      }, 1000);
    }
  }

  function setTransition(duration) {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.$dragEl.transition(duration);
  }

  function updateSize() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar
    } = swiper;
    const {
      $dragEl,
      $el
    } = scrollbar;
    $dragEl[0].style.width = '';
    $dragEl[0].style.height = '';
    trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
    divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

    if (swiper.params.scrollbar.dragSize === 'auto') {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }

    if (swiper.isHorizontal()) {
      $dragEl[0].style.width = `${dragSize}px`;
    } else {
      $dragEl[0].style.height = `${dragSize}px`;
    }

    if (divider >= 1) {
      $el[0].style.display = 'none';
    } else {
      $el[0].style.display = '';
    }

    if (swiper.params.scrollbar.hide) {
      $el[0].style.opacity = 0;
    }

    if (swiper.params.watchOverflow && swiper.enabled) {
      scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
    }
  }

  function getPointerPosition(e) {
    if (swiper.isHorizontal()) {
      return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
    }

    return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
  }

  function setDragPosition(e) {
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      $el
    } = scrollbar;
    let positionRatio;
    positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);

    if (rtl) {
      positionRatio = 1 - positionRatio;
    }

    const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  function onDragStart(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      $wrapperEl
    } = swiper;
    const {
      $el,
      $dragEl
    } = scrollbar;
    isTouched = true;
    dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
    e.preventDefault();
    e.stopPropagation();
    $wrapperEl.transition(100);
    $dragEl.transition(100);
    setDragPosition(e);
    clearTimeout(dragTimeout);
    $el.transition(0);

    if (params.hide) {
      $el.css('opacity', 1);
    }

    if (swiper.params.cssMode) {
      swiper.$wrapperEl.css('scroll-snap-type', 'none');
    }

    emit('scrollbarDragStart', e);
  }

  function onDragMove(e) {
    const {
      scrollbar,
      $wrapperEl
    } = swiper;
    const {
      $el,
      $dragEl
    } = scrollbar;
    if (!isTouched) return;
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    setDragPosition(e);
    $wrapperEl.transition(0);
    $el.transition(0);
    $dragEl.transition(0);
    emit('scrollbarDragMove', e);
  }

  function onDragEnd(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      $wrapperEl
    } = swiper;
    const {
      $el
    } = scrollbar;
    if (!isTouched) return;
    isTouched = false;

    if (swiper.params.cssMode) {
      swiper.$wrapperEl.css('scroll-snap-type', '');
      $wrapperEl.transition('');
    }

    if (params.hide) {
      clearTimeout(dragTimeout);
      dragTimeout = nextTick(() => {
        $el.css('opacity', 0);
        $el.transition(400);
      }, 1000);
    }

    emit('scrollbarDragEnd', e);

    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  }

  function events(method) {
    const {
      scrollbar,
      touchEventsTouch,
      touchEventsDesktop,
      params,
      support
    } = swiper;
    const $el = scrollbar.$el;
    if (!$el) return;
    const target = $el[0];
    const activeListener = support.passiveListener && params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    const passiveListener = support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;
    const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

    if (!support.touch) {
      target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
      document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
      document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
    } else {
      target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
      target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
      target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
    }
  }

  function enableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('on');
  }

  function disableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('off');
  }

  function init() {
    const {
      scrollbar,
      $el: $swiperEl
    } = swiper;
    swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
      el: 'swiper-scrollbar'
    });
    const params = swiper.params.scrollbar;
    if (!params.el) return;
    let $el = dom(params.el);

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
      $el = $swiperEl.find(params.el);
    }

    $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

    if ($dragEl.length === 0) {
      $dragEl = dom(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
      $el.append($dragEl);
    }

    Object.assign(scrollbar, {
      $el,
      el: $el[0],
      $dragEl,
      dragEl: $dragEl[0]
    });

    if (params.draggable) {
      enableDraggable();
    }

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
    }
  }

  function destroy() {
    const params = swiper.params.scrollbar;
    const $el = swiper.scrollbar.$el;

    if ($el) {
      $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    }

    disableDraggable();
  }

  on('init', () => {
    if (swiper.params.scrollbar.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      updateSize();
      setTranslate();
    }
  });
  on('update resize observerUpdate lock unlock', () => {
    updateSize();
  });
  on('setTranslate', () => {
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    setTransition(duration);
  });
  on('enable disable', () => {
    const {
      $el
    } = swiper.scrollbar;

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
    }
  });
  on('destroy', () => {
    destroy();
  });

  const enable = () => {
    swiper.$el.removeClass(swiper.params.scrollbar.scrollbarDisabledClass);

    if (swiper.scrollbar.$el) {
      swiper.scrollbar.$el.removeClass(swiper.params.scrollbar.scrollbarDisabledClass);
    }

    init();
    updateSize();
    setTranslate();
  };

  const disable = () => {
    swiper.$el.addClass(swiper.params.scrollbar.scrollbarDisabledClass);

    if (swiper.scrollbar.$el) {
      swiper.scrollbar.$el.addClass(swiper.params.scrollbar.scrollbarDisabledClass);
    }

    destroy();
  };

  Object.assign(swiper.scrollbar, {
    enable,
    disable,
    updateSize,
    setTranslate,
    init,
    destroy
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/parallax/parallax.js

function Parallax({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    parallax: {
      enabled: false
    }
  });

  const setTransform = (el, progress) => {
    const {
      rtl
    } = swiper;
    const $el = dom(el);
    const rtlFactor = rtl ? -1 : 1;
    const p = $el.attr('data-swiper-parallax') || '0';
    let x = $el.attr('data-swiper-parallax-x');
    let y = $el.attr('data-swiper-parallax-y');
    const scale = $el.attr('data-swiper-parallax-scale');
    const opacity = $el.attr('data-swiper-parallax-opacity');

    if (x || y) {
      x = x || '0';
      y = y || '0';
    } else if (swiper.isHorizontal()) {
      x = p;
      y = '0';
    } else {
      y = p;
      x = '0';
    }

    if (x.indexOf('%') >= 0) {
      x = `${parseInt(x, 10) * progress * rtlFactor}%`;
    } else {
      x = `${x * progress * rtlFactor}px`;
    }

    if (y.indexOf('%') >= 0) {
      y = `${parseInt(y, 10) * progress}%`;
    } else {
      y = `${y * progress}px`;
    }

    if (typeof opacity !== 'undefined' && opacity !== null) {
      const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      $el[0].style.opacity = currentOpacity;
    }

    if (typeof scale === 'undefined' || scale === null) {
      $el.transform(`translate3d(${x}, ${y}, 0px)`);
    } else {
      const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
    }
  };

  const setTranslate = () => {
    const {
      $el,
      slides,
      progress,
      snapGrid
    } = swiper;
    $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
      setTransform(el, progress);
    });
    slides.each((slideEl, slideIndex) => {
      let slideProgress = slideEl.progress;

      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }

      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      dom(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
        setTransform(el, slideProgress);
      });
    });
  };

  const setTransition = (duration = swiper.params.speed) => {
    const {
      $el
    } = swiper;
    $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
      const $parallaxEl = dom(parallaxEl);
      let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      $parallaxEl.transition(parallaxDuration);
    });
  };

  on('beforeInit', () => {
    if (!swiper.params.parallax.enabled) return;
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
  });
  on('init', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTranslate', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTransition', (_swiper, duration) => {
    if (!swiper.params.parallax.enabled) return;
    setTransition(duration);
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/zoom/zoom.js



function Zoom({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window = ssr_window_esm_getWindow();
  extendParams({
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: 'swiper-zoom-container',
      zoomedSlideClass: 'swiper-slide-zoomed'
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let gesturesEnabled;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const gesture = {
    $slideEl: undefined,
    slideWidth: undefined,
    slideHeight: undefined,
    $imageEl: undefined,
    $imageWrapEl: undefined,
    maxRatio: 3
  };
  const image = {
    isTouched: undefined,
    isMoved: undefined,
    currentX: undefined,
    currentY: undefined,
    minX: undefined,
    minY: undefined,
    maxX: undefined,
    maxY: undefined,
    width: undefined,
    height: undefined,
    startX: undefined,
    startY: undefined,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: undefined,
    y: undefined,
    prevPositionX: undefined,
    prevPositionY: undefined,
    prevTime: undefined
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, 'scale', {
    get() {
      return scale;
    },

    set(value) {
      if (scale !== value) {
        const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
        const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
        emit('zoomChange', value, imageEl, slideEl);
      }

      scale = value;
    }

  });

  function getDistanceBetweenTouches(e) {
    if (e.targetTouches.length < 2) return 1;
    const x1 = e.targetTouches[0].pageX;
    const y1 = e.targetTouches[0].pageY;
    const x2 = e.targetTouches[1].pageX;
    const y2 = e.targetTouches[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  } // Events


  function onGestureStart(e) {
    const support = swiper.support;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;

    if (!support.gestures) {
      if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
        return;
      }

      fakeGestureTouched = true;
      gesture.scaleStart = getDistanceBetweenTouches(e);
    }

    if (!gesture.$slideEl || !gesture.$slideEl.length) {
      gesture.$slideEl = dom(e.target).closest(`.${swiper.params.slideClass}`);
      if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
      gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

      if (gesture.$imageWrapEl.length === 0) {
        gesture.$imageEl = undefined;
        return;
      }
    }

    if (gesture.$imageEl) {
      gesture.$imageEl.transition(0);
    }

    isScaling = true;
  }

  function onGestureChange(e) {
    const support = swiper.support;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;

    if (!support.gestures) {
      if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
        return;
      }

      fakeGestureMoved = true;
      gesture.scaleMove = getDistanceBetweenTouches(e);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
      if (e.type === 'gesturechange') onGestureStart(e);
      return;
    }

    if (support.gestures) {
      zoom.scale = e.scale * currentScale;
    } else {
      zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    }

    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }

    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }

    gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
  }

  function onGestureEnd(e) {
    const device = swiper.device;
    const support = swiper.support;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;

    if (!support.gestures) {
      if (!fakeGestureTouched || !fakeGestureMoved) {
        return;
      }

      if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
        return;
      }

      fakeGestureTouched = false;
      fakeGestureMoved = false;
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale === 1) gesture.$slideEl = undefined;
  }

  function onTouchStart(e) {
    const device = swiper.device;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    if (image.isTouched) return;
    if (device.android && e.cancelable) e.preventDefault();
    image.isTouched = true;
    image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  }

  function onTouchMove(e) {
    const zoom = swiper.zoom;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    swiper.allowClick = false;
    if (!image.isTouched || !gesture.$slideEl) return;

    if (!image.isMoved) {
      image.width = gesture.$imageEl[0].offsetWidth;
      image.height = gesture.$imageEl[0].offsetHeight;
      image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
      image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
      gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
      gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
      gesture.$imageWrapEl.transition(0);
    } // Define if we need image drag


    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }

      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    e.stopPropagation();
    image.isMoved = true;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }

    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }

    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }

    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    } // Velocity


    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
  }

  function onTouchEnd() {
    const zoom = swiper.zoom;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }

    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY; // Fix duration

    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY; // Define if we need image drag

    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
  }

  function onTransitionEnd() {
    const zoom = swiper.zoom;

    if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
      if (gesture.$imageEl) {
        gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
      }

      if (gesture.$imageWrapEl) {
        gesture.$imageWrapEl.transform('translate3d(0,0,0)');
      }

      zoom.scale = 1;
      currentScale = 1;
      gesture.$slideEl = undefined;
      gesture.$imageEl = undefined;
      gesture.$imageWrapEl = undefined;
    }
  }

  function zoomIn(e) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;

    if (!gesture.$slideEl) {
      if (e && e.target) {
        gesture.$slideEl = dom(e.target).closest(`.${swiper.params.slideClass}`);
      }

      if (!gesture.$slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
        } else {
          gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
        }
      }

      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.touchAction = 'none';
    }

    gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;

    if (typeof image.touchesStart.x === 'undefined' && e) {
      touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
      touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }

    zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
    currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

    if (e) {
      slideWidth = gesture.$slideEl[0].offsetWidth;
      slideHeight = gesture.$slideEl[0].offsetHeight;
      offsetX = gesture.$slideEl.offset().left + window.scrollX;
      offsetY = gesture.$slideEl.offset().top + window.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.$imageEl[0].offsetWidth;
      imageHeight = gesture.$imageEl[0].offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;

      if (translateX < translateMinX) {
        translateX = translateMinX;
      }

      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }

      if (translateY < translateMinY) {
        translateY = translateMinY;
      }

      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }

    gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
    gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
  }

  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;

    if (!gesture.$slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
      } else {
        gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      }

      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = '';
      swiper.wrapperEl.style.touchAction = '';
    }

    zoom.scale = 1;
    currentScale = 1;
    gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
    gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
    gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
    gesture.$slideEl = undefined;
  } // Toggle Zoom


  function zoomToggle(e) {
    const zoom = swiper.zoom;

    if (zoom.scale && zoom.scale !== 1) {
      // Zoom Out
      zoomOut();
    } else {
      // Zoom In
      zoomIn(e);
    }
  }

  function getListeners() {
    const support = swiper.support;
    const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = support.passiveListener ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }

  function getSlideSelector() {
    return `.${swiper.params.slideClass}`;
  }

  function toggleGestures(method) {
    const {
      passiveListener
    } = getListeners();
    const slideSelector = getSlideSelector();
    swiper.$wrapperEl[method]('gesturestart', slideSelector, onGestureStart, passiveListener);
    swiper.$wrapperEl[method]('gesturechange', slideSelector, onGestureChange, passiveListener);
    swiper.$wrapperEl[method]('gestureend', slideSelector, onGestureEnd, passiveListener);
  }

  function enableGestures() {
    if (gesturesEnabled) return;
    gesturesEnabled = true;
    toggleGestures('on');
  }

  function disableGestures() {
    if (!gesturesEnabled) return;
    gesturesEnabled = false;
    toggleGestures('off');
  } // Attach/Detach Events


  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;
    const support = swiper.support;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    const slideSelector = getSlideSelector(); // Scale image

    if (support.gestures) {
      swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
      }
    } // Move image


    swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
  }

  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled) return;
    const support = swiper.support;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    const slideSelector = getSlideSelector(); // Scale image

    if (support.gestures) {
      swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
      }
    } // Move image


    swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
  }

  on('init', () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    disable();
  });
  on('touchStart', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchStart(e);
  });
  on('touchEnd', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchEnd(e);
  });
  on('doubleTap', (_s, e) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e);
    }
  });
  on('transitionEnd', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on('slideChange', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/lazy/lazy.js


function Lazy({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    lazy: {
      checkInView: false,
      enabled: false,
      loadPrevNext: false,
      loadPrevNextAmount: 1,
      loadOnTransitionStart: false,
      scrollingElement: '',
      elementClass: 'swiper-lazy',
      loadingClass: 'swiper-lazy-loading',
      loadedClass: 'swiper-lazy-loaded',
      preloaderClass: 'swiper-lazy-preloader'
    }
  });
  swiper.lazy = {};
  let scrollHandlerAttached = false;
  let initialImageLoaded = false;

  function loadInSlide(index, loadInDuplicate = true) {
    const params = swiper.params.lazy;
    if (typeof index === 'undefined') return;
    if (swiper.slides.length === 0) return;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const $slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`) : swiper.slides.eq(index);
    const $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

    if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
      $images.push($slideEl[0]);
    }

    if ($images.length === 0) return;
    $images.each(imageEl => {
      const $imageEl = dom(imageEl);
      $imageEl.addClass(params.loadingClass);
      const background = $imageEl.attr('data-background');
      const src = $imageEl.attr('data-src');
      const srcset = $imageEl.attr('data-srcset');
      const sizes = $imageEl.attr('data-sizes');
      const $pictureEl = $imageEl.parent('picture');
      swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

        if (background) {
          $imageEl.css('background-image', `url("${background}")`);
          $imageEl.removeAttr('data-background');
        } else {
          if (srcset) {
            $imageEl.attr('srcset', srcset);
            $imageEl.removeAttr('data-srcset');
          }

          if (sizes) {
            $imageEl.attr('sizes', sizes);
            $imageEl.removeAttr('data-sizes');
          }

          if ($pictureEl.length) {
            $pictureEl.children('source').each(sourceEl => {
              const $source = dom(sourceEl);

              if ($source.attr('data-srcset')) {
                $source.attr('srcset', $source.attr('data-srcset'));
                $source.removeAttr('data-srcset');
              }
            });
          }

          if (src) {
            $imageEl.attr('src', src);
            $imageEl.removeAttr('data-src');
          }
        }

        $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
        $slideEl.find(`.${params.preloaderClass}`).remove();

        if (swiper.params.loop && loadInDuplicate) {
          const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

          if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
            const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
            loadInSlide(originalSlide.index(), false);
          } else {
            const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
            loadInSlide(duplicatedSlide.index(), false);
          }
        }

        emit('lazyImageReady', $slideEl[0], $imageEl[0]);

        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      });
      emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
    });
  }

  function load() {
    const {
      $wrapperEl,
      params: swiperParams,
      slides,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
    const params = swiperParams.lazy;
    let slidesPerView = swiperParams.slidesPerView;

    if (slidesPerView === 'auto') {
      slidesPerView = 0;
    }

    function slideExist(index) {
      if (isVirtual) {
        if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
          return true;
        }
      } else if (slides[index]) return true;

      return false;
    }

    function slideIndex(slideEl) {
      if (isVirtual) {
        return dom(slideEl).attr('data-swiper-slide-index');
      }

      return dom(slideEl).index();
    }

    if (!initialImageLoaded) initialImageLoaded = true;

    if (swiper.params.watchSlidesProgress) {
      $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each(slideEl => {
        const index = isVirtual ? dom(slideEl).attr('data-swiper-slide-index') : dom(slideEl).index();
        loadInSlide(index);
      });
    } else if (slidesPerView > 1) {
      for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
        if (slideExist(i)) loadInSlide(i);
      }
    } else {
      loadInSlide(activeIndex);
    }

    if (params.loadPrevNext) {
      if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
        const amount = params.loadPrevNextAmount;
        const spv = Math.ceil(slidesPerView);
        const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
        const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

        for (let i = activeIndex + spv; i < maxIndex; i += 1) {
          if (slideExist(i)) loadInSlide(i);
        } // Prev Slides


        for (let i = minIndex; i < activeIndex; i += 1) {
          if (slideExist(i)) loadInSlide(i);
        }
      } else {
        const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
        if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
        const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
        if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
      }
    }
  }

  function checkInViewOnLoad() {
    const window = ssr_window_esm_getWindow();
    if (!swiper || swiper.destroyed) return;
    const $scrollElement = swiper.params.lazy.scrollingElement ? dom(swiper.params.lazy.scrollingElement) : dom(window);
    const isWindow = $scrollElement[0] === window;
    const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
    const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
    const swiperOffset = swiper.$el.offset();
    const {
      rtlTranslate: rtl
    } = swiper;
    let inView = false;
    if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
    const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

    for (let i = 0; i < swiperCoord.length; i += 1) {
      const point = swiperCoord[i];

      if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
        if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

        inView = true;
      }
    }

    const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;

    if (inView) {
      load();
      $scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
    } else if (!scrollHandlerAttached) {
      scrollHandlerAttached = true;
      $scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
    }
  }

  on('beforeInit', () => {
    if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
      swiper.params.preloadImages = false;
    }
  });
  on('init', () => {
    if (swiper.params.lazy.enabled) {
      if (swiper.params.lazy.checkInView) {
        checkInViewOnLoad();
      } else {
        load();
      }
    }
  });
  on('scroll', () => {
    if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
      load();
    }
  });
  on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
    if (swiper.params.lazy.enabled) {
      if (swiper.params.lazy.checkInView) {
        checkInViewOnLoad();
      } else {
        load();
      }
    }
  });
  on('transitionStart', () => {
    if (swiper.params.lazy.enabled) {
      if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    }
  });
  on('transitionEnd', () => {
    if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
      if (swiper.params.lazy.checkInView) {
        checkInViewOnLoad();
      } else {
        load();
      }
    }
  });
  on('slideChange', () => {
    const {
      lazy,
      cssMode,
      watchSlidesProgress,
      touchReleaseOnEdges,
      resistanceRatio
    } = swiper.params;

    if (lazy.enabled && (cssMode || watchSlidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
      load();
    }
  });
  on('destroy', () => {
    if (!swiper.$el) return;
    swiper.$el.find(`.${swiper.params.lazy.loadingClass}`).removeClass(swiper.params.lazy.loadingClass);
  });
  Object.assign(swiper.lazy, {
    load,
    loadInSlide
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/controller/controller.js
/* eslint no-bitwise: ["error", { "allow": [">>"] }] */

function Controller({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    controller: {
      control: undefined,
      inverse: false,
      by: 'slide' // or 'container'

    }
  });
  swiper.controller = {
    control: undefined
  };

  function LinearSpline(x, y) {
    const binarySearch = function search() {
      let maxIndex;
      let minIndex;
      let guess;
      return (array, val) => {
        minIndex = -1;
        maxIndex = array.length;

        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;

          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }

        return maxIndex;
      };
    }();

    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.

    let i1;
    let i3;

    this.interpolate = function interpolate(x2) {
      if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };

    return this;
  } // xxx: for now i will just save one spline function to to


  function getInterpolateFunction(c) {
    if (!swiper.controller.spline) {
      swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
    }
  }

  function setTranslate(_t, byController) {
    const controlled = swiper.controller.control;
    let multiplier;
    let controlledTranslate;
    const Swiper = swiper.constructor;

    function setControlledTranslate(c) {
      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

      if (swiper.params.controller.by === 'slide') {
        getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out

        controlledTranslate = -swiper.controller.spline.interpolate(-translate);
      }

      if (!controlledTranslate || swiper.params.controller.by === 'container') {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
      }

      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }

      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }

    if (Array.isArray(controlled)) {
      for (let i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  }

  function setTransition(duration, byController) {
    const Swiper = swiper.constructor;
    const controlled = swiper.controller.control;
    let i;

    function setControlledTransition(c) {
      c.setTransition(duration, swiper);

      if (duration !== 0) {
        c.transitionStart();

        if (c.params.autoHeight) {
          nextTick(() => {
            c.updateAutoHeight();
          });
        }

        c.$wrapperEl.transitionEnd(() => {
          if (!controlled) return;

          if (c.params.loop && swiper.params.controller.by === 'slide') {
            c.loopFix();
          }

          c.transitionEnd();
        });
      }
    }

    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }

  function removeSpline() {
    if (!swiper.controller.control) return;

    if (swiper.controller.spline) {
      swiper.controller.spline = undefined;
      delete swiper.controller.spline;
    }
  }

  on('beforeInit', () => {
    swiper.controller.control = swiper.params.controller.control;
  });
  on('update', () => {
    removeSpline();
  });
  on('resize', () => {
    removeSpline();
  });
  on('observerUpdate', () => {
    removeSpline();
  });
  on('setTranslate', (_s, translate, byController) => {
    if (!swiper.controller.control) return;
    swiper.controller.setTranslate(translate, byController);
  });
  on('setTransition', (_s, duration, byController) => {
    if (!swiper.controller.control) return;
    swiper.controller.setTransition(duration, byController);
  });
  Object.assign(swiper.controller, {
    setTranslate,
    setTransition
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/a11y/a11y.js


function A11y({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: 'swiper-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      slideLabelMessage: '{{index}} / {{slidesLength}}',
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: 'group',
      id: null
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;

  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0) return;
    notification.html('');
    notification.html(message);
  }

  function getRandomNumber(size = 16) {
    const randomChar = () => Math.round(16 * Math.random()).toString(16);

    return 'x'.repeat(size).replace(/x/g, randomChar);
  }

  function makeElFocusable($el) {
    $el.attr('tabIndex', '0');
  }

  function makeElNotFocusable($el) {
    $el.attr('tabIndex', '-1');
  }

  function addElRole($el, role) {
    $el.attr('role', role);
  }

  function addElRoleDescription($el, description) {
    $el.attr('aria-roledescription', description);
  }

  function addElControls($el, controls) {
    $el.attr('aria-controls', controls);
  }

  function addElLabel($el, label) {
    $el.attr('aria-label', label);
  }

  function addElId($el, id) {
    $el.attr('id', id);
  }

  function addElLive($el, live) {
    $el.attr('aria-live', live);
  }

  function disableEl($el) {
    $el.attr('aria-disabled', true);
  }

  function enableEl($el) {
    $el.attr('aria-disabled', false);
  }

  function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) return;
    const params = swiper.params.a11y;
    const $targetEl = dom(e.target);

    if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }

      if (swiper.isEnd) {
        notify(params.lastSlideMessage);
      } else {
        notify(params.nextSlideMessage);
      }
    }

    if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }

      if (swiper.isBeginning) {
        notify(params.firstSlideMessage);
      } else {
        notify(params.prevSlideMessage);
      }
    }

    if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
      $targetEl[0].click();
    }
  }

  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        disableEl($prevEl);
        makeElNotFocusable($prevEl);
      } else {
        enableEl($prevEl);
        makeElFocusable($prevEl);
      }
    }

    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        disableEl($nextEl);
        makeElNotFocusable($nextEl);
      } else {
        enableEl($nextEl);
        makeElFocusable($nextEl);
      }
    }
  }

  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }

  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }

  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination()) return;
    swiper.pagination.bullets.each(bulletEl => {
      const $bulletEl = dom(bulletEl);

      if (swiper.params.pagination.clickable) {
        makeElFocusable($bulletEl);

        if (!swiper.params.pagination.renderBullet) {
          addElRole($bulletEl, 'button');
          addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
        }
      }

      if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
        $bulletEl.attr('aria-current', 'true');
      } else {
        $bulletEl.removeAttr('aria-current');
      }
    });
  }

  const initNavEl = ($el, wrapperId, message) => {
    makeElFocusable($el);

    if ($el[0].tagName !== 'BUTTON') {
      addElRole($el, 'button');
      $el.on('keydown', onEnterOrSpaceKey);
    }

    addElLabel($el, message);
    addElControls($el, wrapperId);
  };

  const handlePointerDown = () => {
    swiper.a11y.clicked = true;
  };

  const handlePointerUp = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };

  const handleFocus = e => {
    if (swiper.a11y.clicked) return;
    const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
    if (!slideEl || !swiper.slides.includes(slideEl)) return;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible) return;
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;

    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }

    swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
  };

  const initSlides = () => {
    const params = swiper.params.a11y;

    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription(dom(swiper.slides), params.itemRoleDescriptionMessage);
    }

    if (params.slideRole) {
      addElRole(dom(swiper.slides), params.slideRole);
    }

    const slidesLength = swiper.params.loop ? swiper.slides.filter(el => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;

    if (params.slideLabelMessage) {
      swiper.slides.each((slideEl, index) => {
        const $slideEl = dom(slideEl);
        const slideIndex = swiper.params.loop ? parseInt($slideEl.attr('data-swiper-slide-index'), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel($slideEl, ariaLabelMessage);
      });
    }
  };

  const init = () => {
    const params = swiper.params.a11y;
    swiper.$el.append(liveRegion); // Container

    const $containerEl = swiper.$el;

    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
    }

    if (params.containerMessage) {
      addElLabel($containerEl, params.containerMessage);
    } // Wrapper


    const $wrapperEl = swiper.$wrapperEl;
    const wrapperId = params.id || $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
    const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
    addElId($wrapperEl, wrapperId);
    addElLive($wrapperEl, live); // Slide

    initSlides(); // Navigation

    let $nextEl;
    let $prevEl;

    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }

    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }

    if ($nextEl && $nextEl.length) {
      initNavEl($nextEl, wrapperId, params.nextSlideMessage);
    }

    if ($prevEl && $prevEl.length) {
      initNavEl($prevEl, wrapperId, params.prevSlideMessage);
    } // Pagination


    if (hasClickablePagination()) {
      swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
    } // Tab focus


    swiper.$el.on('focus', handleFocus, true);
    swiper.$el.on('pointerdown', handlePointerDown, true);
    swiper.$el.on('pointerup', handlePointerUp, true);
  };

  function destroy() {
    if (liveRegion && liveRegion.length > 0) liveRegion.remove();
    let $nextEl;
    let $prevEl;

    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }

    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }

    if ($nextEl) {
      $nextEl.off('keydown', onEnterOrSpaceKey);
    }

    if ($prevEl) {
      $prevEl.off('keydown', onEnterOrSpaceKey);
    } // Pagination


    if (hasClickablePagination()) {
      swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
    } // Tab focus


    swiper.$el.off('focus', handleFocus, true);
    swiper.$el.off('pointerdown', handlePointerDown, true);
    swiper.$el.off('pointerup', handlePointerUp, true);
  }

  on('beforeInit', () => {
    liveRegion = dom(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
  });
  on('afterInit', () => {
    if (!swiper.params.a11y.enabled) return;
    init();
  });
  on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
    if (!swiper.params.a11y.enabled) return;
    initSlides();
  });
  on('fromEdge toEdge afterInit lock unlock', () => {
    if (!swiper.params.a11y.enabled) return;
    updateNavigation();
  });
  on('paginationUpdate', () => {
    if (!swiper.params.a11y.enabled) return;
    updatePagination();
  });
  on('destroy', () => {
    if (!swiper.params.a11y.enabled) return;
    destroy();
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/history/history.js

function History({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    history: {
      enabled: false,
      root: '',
      replaceState: false,
      key: 'slides',
      keepQuery: false
    }
  });
  let initialized = false;
  let paths = {};

  const slugify = text => {
    return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  const getPathValues = urlOverride => {
    const window = ssr_window_esm_getWindow();
    let location;

    if (urlOverride) {
      location = new URL(urlOverride);
    } else {
      location = window.location;
    }

    const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
    const total = pathArray.length;
    const key = pathArray[total - 2];
    const value = pathArray[total - 1];
    return {
      key,
      value
    };
  };

  const setHistory = (key, index) => {
    const window = ssr_window_esm_getWindow();
    if (!initialized || !swiper.params.history.enabled) return;
    let location;

    if (swiper.params.url) {
      location = new URL(swiper.params.url);
    } else {
      location = window.location;
    }

    const slide = swiper.slides.eq(index);
    let value = slugify(slide.attr('data-history'));

    if (swiper.params.history.root.length > 0) {
      let root = swiper.params.history.root;
      if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
      value = `${root}/${key}/${value}`;
    } else if (!location.pathname.includes(key)) {
      value = `${key}/${value}`;
    }

    if (swiper.params.history.keepQuery) {
      value += location.search;
    }

    const currentState = window.history.state;

    if (currentState && currentState.value === value) {
      return;
    }

    if (swiper.params.history.replaceState) {
      window.history.replaceState({
        value
      }, null, value);
    } else {
      window.history.pushState({
        value
      }, null, value);
    }
  };

  const scrollToSlide = (speed, value, runCallbacks) => {
    if (value) {
      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides.eq(i);
        const slideHistory = slugify(slide.attr('data-history'));

        if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
          const index = slide.index();
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  };

  const setHistoryPopState = () => {
    paths = getPathValues(swiper.params.url);
    scrollToSlide(swiper.params.speed, paths.value, false);
  };

  const init = () => {
    const window = ssr_window_esm_getWindow();
    if (!swiper.params.history) return;

    if (!window.history || !window.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }

    initialized = true;
    paths = getPathValues(swiper.params.url);
    if (!paths.key && !paths.value) return;
    scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

    if (!swiper.params.history.replaceState) {
      window.addEventListener('popstate', setHistoryPopState);
    }
  };

  const destroy = () => {
    const window = ssr_window_esm_getWindow();

    if (!swiper.params.history.replaceState) {
      window.removeEventListener('popstate', setHistoryPopState);
    }
  };

  on('init', () => {
    if (swiper.params.history.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.history.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/hash-navigation/hash-navigation.js


function HashNavigation({
  swiper,
  extendParams,
  emit,
  on
}) {
  let initialized = false;
  const document = getDocument();
  const window = ssr_window_esm_getWindow();
  extendParams({
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false
    }
  });

  const onHashChange = () => {
    emit('hashChange');
    const newHash = document.location.hash.replace('#', '');
    const activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

    if (newHash !== activeSlideHash) {
      const newIndex = swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`).index();
      if (typeof newIndex === 'undefined') return;
      swiper.slideTo(newIndex);
    }
  };

  const setHash = () => {
    if (!initialized || !swiper.params.hashNavigation.enabled) return;

    if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${swiper.slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
      emit('hashSet');
    } else {
      const slide = swiper.slides.eq(swiper.activeIndex);
      const hash = slide.attr('data-hash') || slide.attr('data-history');
      document.location.hash = hash || '';
      emit('hashSet');
    }
  };

  const init = () => {
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    initialized = true;
    const hash = document.location.hash.replace('#', '');

    if (hash) {
      const speed = 0;

      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides.eq(i);
        const slideHash = slide.attr('data-hash') || slide.attr('data-history');

        if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
          const index = slide.index();
          swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
        }
      }
    }

    if (swiper.params.hashNavigation.watchState) {
      dom(window).on('hashchange', onHashChange);
    }
  };

  const destroy = () => {
    if (swiper.params.hashNavigation.watchState) {
      dom(window).off('hashchange', onHashChange);
    }
  };

  on('init', () => {
    if (swiper.params.hashNavigation.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.hashNavigation.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHash();
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHash();
    }
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/autoplay/autoplay.js
/* eslint no-underscore-dangle: "off" */

/* eslint no-use-before-define: "off" */


function Autoplay({
  swiper,
  extendParams,
  on,
  emit
}) {
  let timeout;
  swiper.autoplay = {
    running: false,
    paused: false
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });

  function run() {
    if (!swiper.size) {
      swiper.autoplay.running = false;
      swiper.autoplay.paused = false;
      return;
    }

    const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
    let delay = swiper.params.autoplay.delay;

    if ($activeSlideEl.attr('data-swiper-autoplay')) {
      delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
    }

    clearTimeout(timeout);
    timeout = nextTick(() => {
      let autoplayResult;

      if (swiper.params.autoplay.reverseDirection) {
        if (swiper.params.loop) {
          swiper.loopFix();
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.isBeginning) {
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
          emit('autoplay');
        } else {
          stop();
        }
      } else if (swiper.params.loop) {
        swiper.loopFix();
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        emit('autoplay');
      } else if (!swiper.isEnd) {
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        emit('autoplay');
      } else if (!swiper.params.autoplay.stopOnLastSlide) {
        autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
        emit('autoplay');
      } else {
        stop();
      }

      if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
        run();
      }
    }, delay);
  }

  function start() {
    if (typeof timeout !== 'undefined') return false;
    if (swiper.autoplay.running) return false;
    swiper.autoplay.running = true;
    emit('autoplayStart');
    run();
    return true;
  }

  function stop() {
    if (!swiper.autoplay.running) return false;
    if (typeof timeout === 'undefined') return false;

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    swiper.autoplay.running = false;
    emit('autoplayStop');
    return true;
  }

  function pause(speed) {
    if (!swiper.autoplay.running) return;
    if (swiper.autoplay.paused) return;
    if (timeout) clearTimeout(timeout);
    swiper.autoplay.paused = true;

    if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
      swiper.autoplay.paused = false;
      run();
    } else {
      ['transitionend', 'webkitTransitionEnd'].forEach(event => {
        swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
      });
    }
  }

  function onVisibilityChange() {
    const document = getDocument();

    if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
      pause();
    }

    if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
      run();
      swiper.autoplay.paused = false;
    }
  }

  function onTransitionEnd(e) {
    if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
    if (e.target !== swiper.$wrapperEl[0]) return;
    ['transitionend', 'webkitTransitionEnd'].forEach(event => {
      swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
    swiper.autoplay.paused = false;

    if (!swiper.autoplay.running) {
      stop();
    } else {
      run();
    }
  }

  function onMouseEnter() {
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
    } else {
      emit('autoplayPause');
      pause();
    }

    ['transitionend', 'webkitTransitionEnd'].forEach(event => {
      swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
  }

  function onMouseLeave() {
    if (swiper.params.autoplay.disableOnInteraction) {
      return;
    }

    swiper.autoplay.paused = false;
    emit('autoplayResume');
    run();
  }

  function attachMouseEvents() {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.$el.on('mouseenter', onMouseEnter);
      swiper.$el.on('mouseleave', onMouseLeave);
    }
  }

  function detachMouseEvents() {
    swiper.$el.off('mouseenter', onMouseEnter);
    swiper.$el.off('mouseleave', onMouseLeave);
  }

  on('init', () => {
    if (swiper.params.autoplay.enabled) {
      start();
      const document = getDocument();
      document.addEventListener('visibilitychange', onVisibilityChange);
      attachMouseEvents();
    }
  });
  on('beforeTransitionStart', (_s, speed, internal) => {
    if (swiper.autoplay.running) {
      if (internal || !swiper.params.autoplay.disableOnInteraction) {
        swiper.autoplay.pause(speed);
      } else {
        stop();
      }
    }
  });
  on('sliderFirstMove', () => {
    if (swiper.autoplay.running) {
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
      } else {
        pause();
      }
    }
  });
  on('touchEnd', () => {
    if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
      run();
    }
  });
  on('destroy', () => {
    detachMouseEvents();

    if (swiper.autoplay.running) {
      stop();
    }

    const document = getDocument();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });
  Object.assign(swiper.autoplay, {
    pause,
    run,
    start,
    stop
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/thumbs/thumbs.js


function Thumb({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: 'swiper-slide-thumb-active',
      thumbsContainerClass: 'swiper-thumbs'
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };

  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && dom(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
    let slideToIndex;

    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(dom(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
    } else {
      slideToIndex = clickedIndex;
    }

    if (swiper.params.loop) {
      let currentIndex = swiper.activeIndex;

      if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        currentIndex = swiper.activeIndex;
      }

      const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
      const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
      if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
    }

    swiper.slideTo(slideToIndex);
  }

  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;

    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
    } else if (utils_isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }

    swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on('tap', onThumbClick);
    return true;
  }

  function update(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView; // Activate thumbs

    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }

    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }

    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.removeClass(thumbActiveClass);

    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
      }
    } else {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
      }
    }

    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      let currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;

      if (thumbsSwiper.params.loop) {
        if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
          thumbsSwiper.loopFix(); // eslint-disable-next-line

          thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
          currentThumbsIndex = thumbsSwiper.activeIndex;
        } // Find actual thumbs index to slide to


        const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
        const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();

        if (typeof prevThumbsIndex === 'undefined') {
          newThumbsIndex = nextThumbsIndex;
        } else if (typeof nextThumbsIndex === 'undefined') {
          newThumbsIndex = prevThumbsIndex;
        } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
          newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
        } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
          newThumbsIndex = nextThumbsIndex;
        } else {
          newThumbsIndex = prevThumbsIndex;
        }

        direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
      }

      if (useOffset) {
        newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
      }

      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) {// newThumbsIndex = newThumbsIndex - slidesPerView + 1;
        }

        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
      }
    }
  }

  on('beforeInit', () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    init();
    update(true);
  });
  on('slideChange update resize observerUpdate', () => {
    update();
  });
  on('setTransition', (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on('beforeDestroy', () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;

    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/free-mode/free-mode.js

function freeMode({
  swiper,
  extendParams,
  emit,
  once
}) {
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });

  function onTouchStart() {
    const translate = swiper.getTranslate();
    swiper.setTranslate(translate);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }

  function onTouchMove() {
    const {
      touchEventsData: data,
      touches
    } = swiper; // Velocity

    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data.touchStartTime
      });
    }

    data.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: now()
    });
  }

  function onTouchEnd({
    currentPos
  }) {
    const {
      params,
      $wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper; // Time diff

    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;

    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }

      return;
    }

    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;

        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        } // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.


        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }

      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1000 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;

      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }

          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }

        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }

          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }

        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;

        for (let j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }

        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }

        newPosition = -newPosition;
      }

      if (needsLoopFix) {
        once('transitionEnd', () => {
          swiper.loopFix();
        });
      } // Fix duration


      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }

        if (params.freeMode.sticky) {
          // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
          // It's easy to see this when simulating touch with mouse events. To fix this,
          // limit single-slide swipes to the default slide duration. This also has the
          // nice side effect of matching slide speed if the user stopped moving before
          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
          // For faster swipes, also apply limits (albeit higher ones).
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }

      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        $wrapperEl.transitionEnd(() => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit('momentumBounce');
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit('_freeModeNoMomentumRelease');
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);

        if (!swiper.animating) {
          swiper.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }

      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit('_freeModeNoMomentumRelease');
    }

    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }

  Object.assign(swiper, {
    freeMode: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/grid/grid.js
function Grid({
  swiper,
  extendParams
}) {
  extendParams({
    grid: {
      rows: 1,
      fill: 'column'
    }
  });
  let slidesNumberEvenToRows;
  let slidesPerRow;
  let numFullColumns;

  const initSlides = slidesLength => {
    const {
      slidesPerView
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid;
    slidesPerRow = slidesNumberEvenToRows / rows;
    numFullColumns = Math.floor(slidesLength / rows);

    if (Math.floor(slidesLength / rows) === slidesLength / rows) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
    }

    if (slidesPerView !== 'auto' && fill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
    }
  };

  const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
    const {
      slidesPerGroup,
      spaceBetween
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid; // Set slides order

    let newSlideOrderIndex;
    let column;
    let row;

    if (fill === 'row' && slidesPerGroup > 1) {
      const groupIndex = Math.floor(i / (slidesPerGroup * rows));
      const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
      const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
      row = Math.floor(slideIndexInGroup / columnsInGroup);
      column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
      newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
      slide.css({
        '-webkit-order': newSlideOrderIndex,
        order: newSlideOrderIndex
      });
    } else if (fill === 'column') {
      column = Math.floor(i / rows);
      row = i - column * rows;

      if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
        row += 1;

        if (row >= rows) {
          row = 0;
          column += 1;
        }
      }
    } else {
      row = Math.floor(i / slidesPerRow);
      column = i - row * slidesPerRow;
    }

    slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
  };

  const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
    const {
      spaceBetween,
      centeredSlides,
      roundLengths
    } = swiper.params;
    const {
      rows
    } = swiper.params.grid;
    swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
    swiper.$wrapperEl.css({
      [getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
    });

    if (centeredSlides) {
      snapGrid.splice(0, snapGrid.length);
      const newSlidesGrid = [];

      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }

      snapGrid.push(...newSlidesGrid);
    }
  };

  swiper.grid = {
    initSlides,
    updateSlide,
    updateWrapperSize
  };
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation/methods/appendSlide.js
function appendSlide(slides) {
  const swiper = this;
  const {
    $wrapperEl,
    params
  } = swiper;

  if (params.loop) {
    swiper.loopDestroy();
  }

  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.append(slides[i]);
    }
  } else {
    $wrapperEl.append(slides);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation/methods/prependSlide.js
function prependSlide(slides) {
  const swiper = this;
  const {
    params,
    $wrapperEl,
    activeIndex
  } = swiper;

  if (params.loop) {
    swiper.loopDestroy();
  }

  let newActiveIndex = activeIndex + 1;

  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.prepend(slides[i]);
    }

    newActiveIndex = activeIndex + slides.length;
  } else {
    $wrapperEl.prepend(slides);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }

  swiper.slideTo(newActiveIndex, 0, false);
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation/methods/addSlide.js
function addSlide(index, slides) {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    activeIndex
  } = swiper;
  let activeIndexBuffer = activeIndex;

  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
  }

  const baseLength = swiper.slides.length;

  if (index <= 0) {
    swiper.prependSlide(slides);
    return;
  }

  if (index >= baseLength) {
    swiper.appendSlide(slides);
    return;
  }

  let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
  const slidesBuffer = [];

  for (let i = baseLength - 1; i >= index; i -= 1) {
    const currentSlide = swiper.slides.eq(i);
    currentSlide.remove();
    slidesBuffer.unshift(currentSlide);
  }

  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.append(slides[i]);
    }

    newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
  } else {
    $wrapperEl.append(slides);
  }

  for (let i = 0; i < slidesBuffer.length; i += 1) {
    $wrapperEl.append(slidesBuffer[i]);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }

  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation/methods/removeSlide.js
function removeSlide(slidesIndexes) {
  const swiper = this;
  const {
    params,
    $wrapperEl,
    activeIndex
  } = swiper;
  let activeIndexBuffer = activeIndex;

  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
  }

  let newActiveIndex = activeIndexBuffer;
  let indexToRemove;

  if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
    for (let i = 0; i < slidesIndexes.length; i += 1) {
      indexToRemove = slidesIndexes[i];
      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    }

    newActiveIndex = Math.max(newActiveIndex, 0);
  } else {
    indexToRemove = slidesIndexes;
    if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }

  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation/methods/removeAllSlides.js
function removeAllSlides() {
  const swiper = this;
  const slidesIndexes = [];

  for (let i = 0; i < swiper.slides.length; i += 1) {
    slidesIndexes.push(i);
  }

  swiper.removeSlide(slidesIndexes);
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/manipulation/manipulation.js





function Manipulation({
  swiper
}) {
  Object.assign(swiper, {
    appendSlide: appendSlide.bind(swiper),
    prependSlide: prependSlide.bind(swiper),
    addSlide: addSlide.bind(swiper),
    removeSlide: removeSlide.bind(swiper),
    removeAllSlides: removeAllSlides.bind(swiper)
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-init.js
function effectInit(params) {
  const {
    effect,
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams
  } = params;
  on('beforeInit', () => {
    if (swiper.params.effect !== effect) return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

    if (perspective && perspective()) {
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    }

    const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper.params, overwriteParamsResult);
    Object.assign(swiper.originalParams, overwriteParamsResult);
  });
  on('setTranslate', () => {
    if (swiper.params.effect !== effect) return;
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    if (swiper.params.effect !== effect) return;
    setTransition(duration);
  });
  on('transitionEnd', () => {
    if (swiper.params.effect !== effect) return;

    if (recreateShadows) {
      if (!getEffectParams || !getEffectParams().slideShadows) return; // remove shadows

      swiper.slides.each(slideEl => {
        const $slideEl = swiper.$(slideEl);
        $slideEl.find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').remove();
      }); // create new one

      recreateShadows();
    }
  });
  let requireUpdateOnVirtual;
  on('virtualUpdate', () => {
    if (swiper.params.effect !== effect) return;

    if (!swiper.slides.length) {
      requireUpdateOnVirtual = true;
    }

    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
        setTranslate();
        requireUpdateOnVirtual = false;
      }
    });
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-target.js
function effectTarget(effectParams, $slideEl) {
  if (effectParams.transformEl) {
    return $slideEl.find(effectParams.transformEl).css({
      'backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden'
    });
  }

  return $slideEl;
}
;// CONCATENATED MODULE: ./node_modules/swiper/shared/effect-virtual-transition-end.js
function effectVirtualTransitionEnd({
  swiper,
  duration,
  transformEl,
  allSlides
}) {
  const {
    slides,
    activeIndex,
    $wrapperEl
  } = swiper;

  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let $transitionEndTarget;

    if (allSlides) {
      $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
    } else {
      $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
    }

    $transitionEndTarget.transitionEnd(() => {
      if (eventTriggered) return;
      if (!swiper || swiper.destroyed) return;
      eventTriggered = true;
      swiper.animating = false;
      const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

      for (let i = 0; i < triggerEvents.length; i += 1) {
        $wrapperEl.trigger(triggerEvents[i]);
      }
    });
  }
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-fade/effect-fade.js



function EffectFade({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    fadeEffect: {
      crossFade: false,
      transformEl: null
    }
  });

  const setTranslate = () => {
    const {
      slides
    } = swiper;
    const params = swiper.params.fadeEffect;

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = swiper.slides.eq(i);
      const offset = $slideEl[0].swiperSlideOffset;
      let tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      let ty = 0;

      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }

      const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.css({
        opacity: slideOpacity
      }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.fadeEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl,
      allSlides: true
    });
  };

  effectInit({
    effect: 'fade',
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-cube/effect-cube.js


function EffectCube({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  });

  const createSlideShadows = ($slideEl, progress, isHorizontal) => {
    let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
    let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

    if (shadowBefore.length === 0) {
      shadowBefore = dom(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
      $slideEl.append(shadowBefore);
    }

    if (shadowAfter.length === 0) {
      shadowAfter = dom(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
      $slideEl.append(shadowAfter);
    }

    if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
    if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
  };

  const recreateShadows = () => {
    // create new ones
    const isHorizontal = swiper.isHorizontal();
    swiper.slides.each(slideEl => {
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      createSlideShadows(dom(slideEl), progress, isHorizontal);
    });
  };

  const setTranslate = () => {
    const {
      $el,
      $wrapperEl,
      slides,
      width: swiperWidth,
      height: swiperHeight,
      rtlTranslate: rtl,
      size: swiperSize,
      browser
    } = swiper;
    const params = swiper.params.cubeEffect;
    const isHorizontal = swiper.isHorizontal();
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let wrapperRotate = 0;
    let $cubeShadowEl;

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = dom('<div class="swiper-cube-shadow"></div>');
          $wrapperEl.append($cubeShadowEl);
        }

        $cubeShadowEl.css({
          height: `${swiperWidth}px`
        });
      } else {
        $cubeShadowEl = $el.find('.swiper-cube-shadow');

        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = dom('<div class="swiper-cube-shadow"></div>');
          $el.append($cubeShadowEl);
        }
      }
    }

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      let slideIndex = i;

      if (isVirtual) {
        slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
      }

      let slideAngle = slideIndex * 90;
      let round = Math.floor(slideAngle / 360);

      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }

      const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      let tx = 0;
      let ty = 0;
      let tz = 0;

      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }

      if (rtl) {
        tx = -tx;
      }

      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }

      const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
      }

      $slideEl.transform(transform);

      if (params.slideShadows) {
        createSlideShadows($slideEl, progress, isHorizontal);
      }
    }

    $wrapperEl.css({
      '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
      'transform-origin': `50% 50% -${swiperSize / 2}px`
    });

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
      } else {
        const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        const scale1 = params.shadowScale;
        const scale2 = params.shadowScale / multiplier;
        const offset = params.shadowOffset;
        $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
      }
    }

    const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
    $wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
    $wrapperEl[0].style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
  };

  const setTransition = duration => {
    const {
      $el,
      slides
    } = swiper;
    slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      $el.find('.swiper-cube-shadow').transition(duration);
    }
  };

  effectInit({
    effect: 'cube',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.cubeEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      resistanceRatio: 0,
      spaceBetween: 0,
      centeredSlides: false,
      virtualTranslate: true
    })
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/shared/create-shadow.js

function createShadow(params, $slideEl, side) {
  const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
  const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
  let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

  if (!$shadowEl.length) {
    $shadowEl = dom(`<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>`);
    $shadowContainer.append($shadowEl);
  }

  return $shadowEl;
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-flip/effect-flip.js





function EffectFlip({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    flipEffect: {
      slideShadows: true,
      limitRotation: true,
      transformEl: null
    }
  });

  const createSlideShadows = ($slideEl, progress, params) => {
    let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
    let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

    if (shadowBefore.length === 0) {
      shadowBefore = createShadow(params, $slideEl, swiper.isHorizontal() ? 'left' : 'top');
    }

    if (shadowAfter.length === 0) {
      shadowAfter = createShadow(params, $slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
    }

    if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
    if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
  };

  const recreateShadows = () => {
    // Set shadows
    const params = swiper.params.flipEffect;
    swiper.slides.each(slideEl => {
      const $slideEl = dom(slideEl);
      let progress = $slideEl[0].progress;

      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }

      createSlideShadows($slideEl, progress, params);
    });
  };

  const setTranslate = () => {
    const {
      slides,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.flipEffect;

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      let progress = $slideEl[0].progress;

      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      }

      const offset = $slideEl[0].swiperSlideOffset;
      const rotate = -180 * progress;
      let rotateY = rotate;
      let rotateX = 0;
      let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let ty = 0;

      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }

      $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

      if (params.slideShadows) {
        createSlideShadows($slideEl, progress, params);
      }

      const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(transform);
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.flipEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl
    });
  };

  effectInit({
    effect: 'flip',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.flipEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-coverflow/effect-coverflow.js



function EffectCoverflow({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      scale: 1,
      modifier: 1,
      slideShadows: true,
      transformEl: null
    }
  });

  const setTranslate = () => {
    const {
      width: swiperWidth,
      height: swiperHeight,
      slides,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.coverflowEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
    const rotate = isHorizontal ? params.rotate : -params.rotate;
    const translate = params.depth; // Each slide offset from center

    for (let i = 0, length = slides.length; i < length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideSize = slidesSizesGrid[i];
      const slideOffset = $slideEl[0].swiperSlideOffset;
      const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
      const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
      let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

      let translateZ = -translate * Math.abs(offsetMultiplier);
      let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

      if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
        stretch = parseFloat(params.stretch) / 100 * slideSize;
      }

      let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
      let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
      let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;
      if (Math.abs(scale) < 0.001) scale = 0;
      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(slideTransform);
      $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

      if (params.slideShadows) {
        // Set shadows
        let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if ($shadowBeforeEl.length === 0) {
          $shadowBeforeEl = createShadow(params, $slideEl, isHorizontal ? 'left' : 'top');
        }

        if ($shadowAfterEl.length === 0) {
          $shadowAfterEl = createShadow(params, $slideEl, isHorizontal ? 'right' : 'bottom');
        }

        if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.coverflowEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
  };

  effectInit({
    effect: 'coverflow',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true
    })
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-creative/effect-creative.js




function EffectCreative({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    creativeEffect: {
      transformEl: null,
      limitProgress: 1,
      shadowPerProgress: false,
      progressMultiplier: 1,
      perspective: true,
      prev: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      },
      next: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      }
    }
  });

  const getTranslateValue = value => {
    if (typeof value === 'string') return value;
    return `${value}px`;
  };

  const setTranslate = () => {
    const {
      slides,
      $wrapperEl,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.creativeEffect;
    const {
      progressMultiplier: multiplier
    } = params;
    const isCenteredSlides = swiper.params.centeredSlides;

    if (isCenteredSlides) {
      const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
      $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
    }

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideProgress = $slideEl[0].progress;
      const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
      let originalProgress = progress;

      if (!isCenteredSlides) {
        originalProgress = Math.min(Math.max($slideEl[0].originalProgress, -params.limitProgress), params.limitProgress);
      }

      const offset = $slideEl[0].swiperSlideOffset;
      const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
      const r = [0, 0, 0];
      let custom = false;

      if (!swiper.isHorizontal()) {
        t[1] = t[0];
        t[0] = 0;
      }

      let data = {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        scale: 1,
        opacity: 1
      };

      if (progress < 0) {
        data = params.next;
        custom = true;
      } else if (progress > 0) {
        data = params.prev;
        custom = true;
      } // set translate


      t.forEach((value, index) => {
        t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
      }); // set rotates

      r.forEach((value, index) => {
        r[index] = data.rotate[index] * Math.abs(progress * multiplier);
      });
      $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const translateString = t.join(', ');
      const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
      const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
      const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
      const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

      if (custom && data.shadow || !custom) {
        let $shadowEl = $slideEl.children('.swiper-slide-shadow');

        if ($shadowEl.length === 0 && data.shadow) {
          $shadowEl = createShadow(params, $slideEl);
        }

        if ($shadowEl.length) {
          const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
          $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
        }
      }

      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(transform).css({
        opacity: opacityString
      });

      if (data.origin) {
        $targetEl.css('transform-origin', data.origin);
      }
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.creativeEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl,
      allSlides: true
    });
  };

  effectInit({
    effect: 'creative',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => swiper.params.creativeEffect.perspective,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/modules/effect-cards/effect-cards.js




function EffectCards({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    cardsEffect: {
      slideShadows: true,
      transformEl: null,
      rotate: true,
      perSlideRotate: 2,
      perSlideOffset: 8
    }
  });

  const setTranslate = () => {
    const {
      slides,
      activeIndex
    } = swiper;
    const params = swiper.params.cardsEffect;
    const {
      startTranslate,
      isTouched
    } = swiper.touchEventsData;
    const currentTranslate = swiper.translate;

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideProgress = $slideEl[0].progress;
      const progress = Math.min(Math.max(slideProgress, -4), 4);
      let offset = $slideEl[0].swiperSlideOffset;

      if (swiper.params.centeredSlides && !swiper.params.cssMode) {
        swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
      }

      if (swiper.params.centeredSlides && swiper.params.cssMode) {
        offset -= slides[0].swiperSlideOffset;
      }

      let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let tY = 0;
      const tZ = -100 * Math.abs(progress);
      let scale = 1;
      let rotate = -params.perSlideRotate * progress;
      let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
      const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
      const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
      const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

      if (isSwipeToNext || isSwipeToPrev) {
        const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
        rotate += -28 * progress * subProgress;
        scale += -0.5 * subProgress;
        tXAdd += 96 * subProgress;
        tY = `${-25 * subProgress * Math.abs(progress)}%`;
      }

      if (progress < 0) {
        // next
        tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
      } else if (progress > 0) {
        // prev
        tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
      } else {
        tX = `${tX}px`;
      }

      if (!swiper.isHorizontal()) {
        const prevY = tY;
        tY = tX;
        tX = prevY;
      }

      const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
      const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rotate : 0}deg)
        scale(${scaleString})
      `;

      if (params.slideShadows) {
        // Set shadows
        let $shadowEl = $slideEl.find('.swiper-slide-shadow');

        if ($shadowEl.length === 0) {
          $shadowEl = createShadow(params, $slideEl);
        }

        if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
      }

      $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(transform);
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.cardsEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl
    });
  };

  effectInit({
    effect: 'cards',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
;// CONCATENATED MODULE: ./node_modules/swiper/swiper-bundle.esm.js
/**
 * Swiper 8.4.5
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: November 21, 2022
 */




























// Swiper Class
const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
core.use(modules);

;// CONCATENATED MODULE: external "jQuery"
const external_jQuery_namespaceObject = jQuery;
;// CONCATENATED MODULE: ./src/js/index.js





// import Swiper bundle with all modules installed


// import styles bundle



// JQUERY START
$(document).ready(function () {
  $(window).scroll(function (e) {
    //navbar shrink
    var siteHeader = $("#siteHeader");
    $(window).scroll(function () {
      if ($(document).scrollTop() > 50) {
        siteHeader.addClass("site-header--shrinked");
      } else {
        siteHeader.removeClass("site-header--shrinked");
      }

      // Scroll Top fade in out
      if ($(document).scrollTop() > 300) {
        $(".btn--scroll-top").addClass("btn--scroll-top-visible");
      } else {
        $(".btn--scroll-top").removeClass("btn--scroll-top-visible");
      }
    });
  });
  $(".btn--scroll-top").on("click", function () {
    scrollToTop(0, 500);
  });
  function scrollToTop(offset, duration) {
    $("html, body").animate({
      scrollTop: offset
    }, duration);
    return false;
  }

  // Hero Swiper
  var swiperHero = new core(".hero-swiper", {
    // Optional parameters
    direction: "horizontal",
    loop: false,
    autoplay: false,
    pauseOnMouseEnter: true,
    slidesPerView: 1,
    speed: 1000,
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderCustom: function renderCustom(swiper, current, total) {
        var names = [];
        $(".swiper-wrapper .swiper-slide").each(function (i) {
          names.push($(this).data("name"));
        });
        var text = "<ul>";
        for (var i = 1; i <= total; i++) {
          if (current == i) {
            text += "<li class=\"swiper-pagination-bullet active\">".concat(names[i], "</li>");
          } else {
            text += "<li class=\"swiper-pagination-bullet\">".concat(names[i], "</li>");
          }
        }
        text += "</ul>";
        return text;
      }
    },
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });

  // Product Card Swiper

  // Top Products Swiper
  var swiperProducts = new core(".products-swiper", {
    // Optional parameters
    direction: "horizontal",
    loop: false,
    speed: 1000,
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 12
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 18
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 8
      },
      1700: {
        slidesPerView: 3,
        spaceBetween: 18
      }
    },
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderCustom: function renderCustom(swiper, current, total) {
        var names = [];
        $(".swiper-wrapper .swiper-slide").each(function (i) {
          names.push($(this).data("name"));
        });
        var text = "<ul>";
        for (var i = 1; i <= total; i++) {
          if (current == i) {
            text += "<li class=\"swiper-pagination-bullet active\">".concat(names[i], "</li>");
          } else {
            text += "<li class=\"swiper-pagination-bullet\">".concat(names[i], "</li>");
          }
        }
        text += "</ul>";
        return text;
      }
    },
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next--top-products",
      prevEl: ".swiper-button-prev--top-products"
    }
  });

  // Main Products Slider
  var swiperProductsMain = new core(".products-swiper-main", {
    // Optional parameters
    direction: "horizontal",
    loop: false,
    speed: 1000,
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 12
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 24
      }
    },
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderCustom: function renderCustom(swiper, current, total) {
        var names = [];
        $(".swiper-wrapper .swiper-slide").each(function (i) {
          names.push($(this).data("name"));
        });
        var text = "<ul>";
        for (var i = 1; i <= total; i++) {
          if (current == i) {
            text += "<li class=\"swiper-pagination-bullet active\">".concat(names[i], "</li>");
          } else {
            text += "<li class=\"swiper-pagination-bullet\">".concat(names[i], "</li>");
          }
        }
        text += "</ul>";
        return text;
      }
    }

    // Navigation arrows
    // navigation: {
    //   nextEl: ".swiper-button-next--top-products",
    //   prevEl: ".swiper-button-prev--top-products",
    // },
  });

  // Testimonial Swiper
  var swiperTestimonial = new core(".testimonial-swiper", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true
    },
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 12
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 16
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 16
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 16
      },
      1400: {
        slidesPerView: 5,
        spaceBetween: 28
      }
    },
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderCustom: function renderCustom(swiper, current, total) {
        var names = [];
        $(".swiper-wrapper .swiper-slide").each(function (i) {
          names.push($(this).data("name"));
        });
        var text = "<ul>";
        for (var i = 1; i <= total; i++) {
          if (current == i) {
            text += "<li class=\"swiper-pagination-bullet active\">".concat(names[i], "</li>");
          } else {
            text += "<li class=\"swiper-pagination-bullet\">".concat(names[i], "</li>");
          }
        }
        text += "</ul>";
        return text;
      }
    },
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next--custom",
      prevEl: ".swiper-button-prev--custom"
    }
  });
  $('input[type="checkbox"]').each(function () {
    $(this).on("change", function () {
      if ($(this).attr("checked")) {
        $(this).attr("checked", false);
        //  console.log('unchecked');
      } else {
        $(this).attr("checked", true);
        // console.log('checked');
      }
    });
  });

  // Header Mobile Nav Dropdown Menu
  var navLinks = $(".site-header__mobile-nav > ul li a");
  navLinks.each(function () {
    $(this).next().first().slideUp(0);
  });
  navLinks.each(function () {
    $(this).on("click", function (e) {
      if ($(this).hasClass("has-dropdown")) {
        e.preventDefault();
        $(this).parent().siblings().find("ul").slideUp(300);
        $(this).parent().siblings().find("svg").removeClass("fa-minus").addClass("fa-plus");
        $(this).next().first().slideToggle(300);
        if ($(this).find("svg").hasClass("fa-plus")) {
          $(this).find("svg").removeClass("fa-plus").addClass("fa-minus");
        } else {
          $(this).find("svg").removeClass("fa-minus").addClass("fa-plus");
        }
      }
    });
  });

  // Accordion
  $(".set > a").on("click", function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".content").slideUp(200);
      $(".set > a svg").removeClass("fa-minus").addClass("fa-plus");
    } else {
      $(".set > a svg").removeClass("fa-minus").addClass("fa-plus");
      $(this).find("svg").removeClass("fa-plus").addClass("fa-minus");
      $(".set > a").removeClass("active");
      $(this).addClass("active");
      $(".content").slideUp(200);
      $(this).siblings(".content").slideDown(200);
    }
  });

  // show password button function
  var showPasswordButtons = $(".form .button--show-password");
  var showPassFlag = false;
  showPasswordButtons.each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      if (!showPassFlag) {
        $(this).siblings("input").attr("type", "text");
        $(this).find("i").removeClass("bi-eye").addClass("bi-eye-slash");
        showPassFlag = true;
      } else {
        $(this).siblings("input").attr("type", "password");
        $(this).find("i").removeClass("bi-eye-slash").addClass("bi-eye");
        showPassFlag = false;
      }
    });
  });

  // FILTER ON PRODUCTS ARCHIVE PAGE
  $(".filter__btn--control").each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      $(this).closest(".filter-block").find(".filter-block__body").slideToggle(300);
    });
  });

  // FAQS FUNCTION
  var faqBtns = $(".faq-item .faq-item__header button");
  faqBtns.each(function () {
    $(this).on("click", function () {
      // GETTING TARGET ID
      var getTargetID = $(this).closest(".faq-item").attr("data-target");
      if (window.innerWidth > 1023) {
        $(".faq-item__icon").text("+");
        $(this).closest(".faq-item").find(".faq-item__icon").text("-");
      }

      // FOR LARGE SCREEN SHOWING LG FAQ CONTENT AS PER DATA ID
      $(".faq-item-detail-block").each(function () {
        if ($(this).attr("data-id") === getTargetID) {
          $(this).removeClass("hidden");
        } else {
          $(this).addClass("hidden");
        }
      });
    });
  });

  // PRODUCT SINGLE THUMBNAIL GALLERY
  $("#productSingleSlider").sliderPro({
    // Width of the slide
    width: 500,
    // Height of the slide
    height: 500,
    // Indicates if the slider is responsive
    responsive: true,
    // The aspect ratio of the slider (width/height)
    aspectRatio: -1,
    // The scale mode for images (cover, contain, exact and none)
    imageScaleMode: "cover",
    // Indicates if the image will be centered
    centerImage: true,
    // Indicates if the image can be scaled up more than its original size
    allowScaleUp: true,
    // Indicates if height of the slider will be adjusted to the
    // height of the selected slide
    autoHeight: false,
    // Will maintain all the slides at the same height, but will allow the width of the slides to be variable if the orientation of the slides is horizontal and vice-versa if the orientation is vertical.
    autoSlideSize: false,
    // Indicates the initially selected slide
    startSlide: 0,
    // Indicates if the slides will be shuffled
    shuffle: false,
    // Indicates whether the slides will be arranged horizontally
    // or vertically. Can be set to 'horizontal' or 'vertical'.
    orientation: "horizontal",
    // Indicates if the size of the slider will be forced to 'fullWidth' or 'fullWindow'
    forceSize: "none",
    // Indicates if the slider will be loopable
    loop: true,
    // The distance between slides
    slideDistance: 0,
    // The duration of the height animation
    heightAnimationDuration: 700,
    // Sets the size of the visible area, allowing the increase of it in order
    // to make more slides visible.
    // By default, only the selected slide will be visible.
    visibleSize: "auto",
    // Breakpoints for allowing the slider's options to be changed
    // based on the size of the window.
    breakpoints: {
      1199: {
        thumbnailsPosition: "bottom",
        width: 400,
        height: 400
      }
    },
    // Indicates whether the selected slide will be in the center of the slider, when there are more slides visible at a time.
    // If set to false, the selected slide will be in the left side of the slider.
    centerSelectedSlide: true,
    // Indicates if the direction of the slider will be from right to left, instead of the default left to right.
    rightToLeft: false,
    // Indicates if fade will be used.
    fade: "true",
    // Indicates if the previous slide will be faded out (in addition to the next slide being faded in).
    fadeOutPreviousSlide: true,
    // Sets the duration of the fade effect.
    fadeDuration: 500,
    // Indicates whether or not autoplay will be enabled.
    autoplay: true,
    // Sets the delay/interval (in milliseconds) at which the autoplay will run.
    autoplayDelay: 5000,
    // Indicates whether autoplay will navigate to the next slide or previous slide.
    // 'normal' and 'backwards'
    autoplayDirection: "normal",
    // Indicates if the autoplay will be paused or stopped when the slider is hovered.
    // 'pause', 'stop' and 'none'
    autoplayOnHover: "pause",
    // Indicates whether the arrow buttons will be created.
    arrows: true,
    // Indicates whether the arrows will fade in only on hover.
    fadeArrows: true,
    // Indicates whether the buttons will be created.
    buttons: false,
    // Indicates whether keyboard navigation will be enabled.
    keyboard: true,
    // Indicates whether the slider will respond to keyboard input only when the slider is in focus.
    keyboardOnlyOnFocus: false,
    // Indicates whether the touch swipe will be enabled for slides.
    touchSwipe: true,
    // Sets the minimum amount that the slides should move.
    touchSwipeThreshold: 50,
    // Indicates whether or not the captions will be faded.
    fadeCaption: true,
    // Sets the duration of the fade animation.
    captionFadeDuration: 500,
    // Indicates whether the full-screen button is enabled.
    fullScreen: false,
    // Indicates whether the button will fade in only on hover.
    fadeFullScreen: true,
    // Indicates whether the slider will wait for the layers to disappear before going to a new slide.
    waitForLayers: false,
    // Indicates whether the layers will be scaled automatically.
    autoScaleLayers: true,
    // Sets a reference width which will be compared to the current slider width in order to determine how much the layers need to scale down.
    // By default, the reference width will be equal to the slide width.
    // However, if the slide width is set to a percentage value, then it's necessary to set a specific value for 'autoScaleReference'.
    autoScaleReference: -1,
    // If the slider size is below this size, the small version of the images will be used.
    smallSize: 480,
    // If the slider size is below this size, the medium version of the images will be used.
    mediumSize: 768,
    // If the slider size is below this size, the large version of the images will be used.
    largeSize: 1024,
    // Indicates whether the hash will be up<a href="https://www.jqueryscript.net/time-clock/">date</a>d when a new slide is selected.
    updateHash: false,
    // Sets the action that the video will perform when its slide container is selected.
    // 'playVideo' and 'none'
    reachVideoAction: "none",
    // Sets the action that the video will perform when another slide is selected.
    // 'stopVideo', 'pauseVideo', 'removeVideo' and 'none'
    leaveVideoAction: "pauseVideo",
    // Sets the action that the slider will perform when the video starts playing
    // 'stopAutoplay' and 'none'
    playVideoAction: "stopAutoplay",
    // Sets the width of the thumbnail.
    thumbnailWidth: 100,
    // Sets the height of the thumbnail.
    thumbnailHeight: 100,
    // 'top', 'bottom', 'right' and 'left'
    thumbnailsPosition: "bottom",
    // Indicates if a pointer will be displayed for the selected thumbnail
    thumbnailPointer: false,
    // Indicates whether the thumbnail arrows will be enabled
    thumbnailArrows: true,
    // Indicates whether the touch swipe will be enabled for thumbnails
    thumbnailTouchSwipe: true
  });

  // VIDEO PLAY BUTTON FUNCTION
  var videoPlayBtns = $(".video__btn--play");
  videoPlayBtns.each(function () {
    $(this).on("click", function (e) {
      var getVideoEl = $(this).closest(".video-container").find("video");
      $(this).closest(".video-container").find(".video__thumbnail").hide();
      $(this).css("visibility", "hidden");
      // console.log(getVideoEl[0].paused);

      if (getVideoEl[0].paused) {
        getVideoEl[0].play();
      } else {
        getVideoEl[0].pause();
      }
    });
  });
  videoPlayBtns.each(function () {
    var el = $(this);
    var getVideoEl = $(this).closest(".video-container").find("video");
    getVideoEl.on("playing", function () {
      el.css("visibility", "hidden");
    });
    getVideoEl.on("pause", function () {
      el.css("visibility", "visible");
    });
  });

  // TEST OVERFLOWING ELEMENT
  // var docWidth = document.documentElement.offsetWidth;

  // [].forEach.call(
  //   document.querySelectorAll('*'),
  //   function(el) {
  //     if (el.offsetWidth > docWidth) {
  //       console.log(el);
  //     }
  //   }
  // );

  // function loadJS(FILE_URL) {
  //   let scriptEle = document.createElement("script");

  //   scriptEle.setAttribute("src", FILE_URL);
  //   scriptEle.setAttribute("type", "text/javascript");
  //   // scriptEle.setAttribute("async", async);

  //   document.body.appendChild(scriptEle);
  // }
  // loadJS("js/backend-script.js");
});
})();

/******/ })()
;