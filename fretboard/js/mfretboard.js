/*
Copyright (C) 2012, Jack Herrington

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function($) {
    var methods = {
        init: function( options ) {
            var $this = $(this);
            
            var settings = $.extend( {
              stringSizes: [ 5, 5, 3, 3, 2, 2 ],
              tuning: [ 40, 45, 50, 55, 59, 64 ],
              firstFretSize: 40,
              minFretSize: 10,
              fretCount: 25,
              stringWidth: 25,
              topGutter: 20,
              backgroundImage: 'images/fretboard_dark.jpg',
              gutter: 10,
              bubbleSize: 7,
              bubbleStyle: '#888',
              drawFrets: null,
              drawBubble: null,
              drawStrings: null,
              drawNames: null,
              drawNote: null
            }, options);

            $this.data('tuning', settings.tuning);
            $this.data('fretCount', settings.fretCount);
            $this.data('gutter', settings.gutter);
            $this.data('stringWidth', settings.stringWidth);
            $this.data('selectedNotes', [] );
            
            var scale = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
            var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            var bubbles = [ 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0 ];
            
            var width = ( ( settings.stringSizes.length - 1 ) * settings.stringWidth ) + ( settings.gutter * 2 );
            
            var fretLocations = [];
            var fs = settings.firstFretSize;
            var fl = settings.topGutter;
            for( var f = 0; f < settings.fretCount; f++ ) {
                fretLocations.push( fl );
                fl += fs;
                fs -= 1;
                if ( fs < settings.minFretSize )
                    fs = settings.minFretSize;
            }
            
            $this.data('fretLocations', fretLocations);
            
            var height = fl;
            
            var host = $('<div>');
            host.css( { overflow:'hidden',
                       width: width + 'px',
                       height: height + 'px',
                       'background-image': "url("+settings.backgroundImage+")",
                       'background-repeat': 'repeat-y' } );
            
            $this.append( host );

            var g = $g().place(host);            

            g.size(width,height);

            g.add( 'frets', { 
                width: width,
                fretLocations: fretLocations,
                draw: settings.drawFrets ? settings.drawFrets : function( ctx ) { 
                    var $this = this;
                    
                    $(fretLocations).each( function() {
                        ctx.fillStyle = '#333333';
                        ctx.fillRect( 0, this, $this.width, 2 );
                    } );
            } } );
            
            g.add( 'bubbles', { 
                width: width,
                fretLocations: fretLocations,
                bubbles: bubbles,
                bubbleSize: settings.bubbleSize,
                bubbleStyle: settings.bubbleStyle,
                draw: settings.drawBubbles ? settings.drawBubbles : function( ctx ) { 
                    var $this = this;
                    
                    var last = 0;
                    $(bubbles).each( function( f ) {
                        if ( this > 0 ) {
                            var middle = ( fretLocations[ f ] + last ) / 2;
                            if ( this == 1 ) {
                                ctx.fillStyle = $this.bubbleStyle;
                                ctx.beginPath();
                                ctx.arc(($this.width/2)+2, middle, $this.bubbleSize, 0, Math.PI*2, true); 
                                ctx.closePath();
                                ctx.fill();
                            } else {
                                ctx.fillStyle = $this.bubbleStyle;
                                ctx.beginPath();
                                ctx.arc(($this.width*0.33)+2, middle, $this.bubbleSize, 0, Math.PI*2, true); 
                                ctx.closePath();
                                ctx.fill();
                                
                                ctx.fillStyle = $this.bubbleStyle;
                                ctx.beginPath();
                                ctx.arc(($this.width*0.66)+2, middle, $this.bubbleSize, 0, Math.PI*2, true); 
                                ctx.closePath();
                                ctx.fill();
                            }
                        }
                        last = fretLocations[ f ];
                    } );
            } } );
             
            g.add( 'strings', { 
                width: width,
                height: height,
                stringSizes: settings.stringSizes,
                gutter: settings.gutter,
                stringWidth: settings.stringWidth,
                topGutter: settings.topGutter,
                draw: settings.drawStrings ? settings.drawStrings : function( ctx ) { 
                    var $this = this;
                    
                    $(this.stringSizes).each( function( i ) {
                        ctx.fillStyle = 'black';
                        ctx.fillRect( $this.gutter + ( i * $this.stringWidth ), $this.topGutter - 2, $this.stringSizes[i], $this.height );
                    } );
            } } );
            
            g.add( 'names', { 
                width: width,
                topGutter: settings.topGutter,
                notes: notes,
                gutter: settings.gutter,
                stringWidth: settings.stringWidth,
                tuning: settings.tuning,
                draw: settings.drawNames ? settings.drawNames : function( ctx ) { 
                    var $this = this;

                    ctx.fillStyle = 'white';
                    
                    $(this.tuning).each( function( i ) {
                        var note = $this.notes[ $this.tuning[ i ] % 12 ];
                        var dim = ctx.measureText(note);
                        ctx.fillText( note,
                            $this.gutter + ( i * $this.stringWidth ) - ( dim.width / 2 ) + 2,
                            $this.topGutter - 5 );
                    } );
            } } );
            
            if ( settings.drawNote == null ) {
                settings.drawNote = function( ctx, rect, note ) {
                    ctx.fillStyle = note.fillStyle;
                    ctx.beginPath();
                    ctx.arc( rect.left + ( rect.width / 2 ),
                        rect.top + rect.height - ( rect.width / 2),
                        rect.width * 0.4, 0, Math.PI*2, true); 
                    ctx.closePath();
                    ctx.fill();
                };
            }
            
            g.add( 'notes', { 
                width: width,
                topGutter: settings.topGutter,
                fretboard: $this,
                fretLocations: fretLocations,
                gutter: settings.gutter,
                stringWidth: settings.stringWidth,
                topGutter: settings.topGutter,
                drawNote: settings.drawNote,
                draw: settings.drawNames ? settings.drawNames : function( ctx ) { 
                    var $this = this;
                    $(this.fretboard.data('selectedNotes')).each( function() {
                        var rect = { };
                                                
                        rect.left = ( ( $this.stringWidth * this.string ) + $this.gutter ) - ( $this.stringWidth / 2 );
                        rect.width = $this.stringWidth;
                        
                        if ( this.fret > 0 ) {
                            rect.top = $this.fretLocations[ this.fret - 1 ] + 2;
                            rect.height = $this.fretLocations[ this.fret ] - $this.fretLocations[ this.fret - 1 ];
                        } else {
                            rect.top = $this.topGutter - 5;
                            rect.height = 10;
                        }

                        $this.drawNote( ctx, rect, this );
                    });
            } } );

            g.draw();
            
            $(host).click( function( e ) {
                e.preventDefault();
                e.stopPropagation();

                var x = e.pageX - $this.offset().left;
                var y = e.pageY - $this.offset().top; 
                var string = Math.floor( x / $this.data('stringWidth') );

                if ( string < 0 ) string = 0;
                if ( string >= $this.data('tuning').length ) string = $this.data('tuning').length - 1;
                
                var fret = 0;
                var last = $this.data('fretLocations')[0] + 10;
                if ( y > last ) {
                    $($this.data('fretLocations')).each( function( i ) {
                        if ( i > 0 ) {
                            if ( y >= last && y <= this + 1 ) {
                                fret = i;
                            }
                        }
                        last = this + 1;
                    });
                }

                $this.trigger( 'click', { string: string, fret: fret, note: 
                    $this.data('tuning')[string] + fret } );
            } );
            
            $this.data( 'g', g );
        },
        set: function( selectedNotes ) {
            $(this).data( 'selectedNotes', selectedNotes );
            $(this).data( 'g' ).draw();
        }
    };
    
    $.fn.mFretboard = function( method ) {
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.mFretboard' );
        }    
    };
})(jQuery);
