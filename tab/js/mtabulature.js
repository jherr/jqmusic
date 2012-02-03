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
              notes: [],
              tuning: [ 40, 45, 50, 55, 59, 64 ],
              lineHeight: 20
            }, options);

            $this.data('tuning', settings.tuning);
            $this.data('notes', settings.notes);
            $this.data('lineHeight', settings.lineHeight);

            var width = $this.data('notes').length * ( $this.data('lineHeight') * 2 );
            var height = ( ( $this.data('tuning').length + 2 ) * $this.data('lineHeight') );

            var g = $g().place($this);

            g.size( width, height );

            $this.data('width', width);
            $this.data('height', height);

            g.add( 'tab', { 
                clef: this,
                draw: function( ctx ) { 
                    var $this = this;
                    
                    var lh = $this.clef.data('lineHeight');
                    var yoffset = lh / 2;
                    var w = $this.clef.data('width');

                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    
                    $($this.clef.data('tuning')).each( function( i ) {
                        ctx.beginPath();
                        ctx.moveTo( 0, yoffset + ( i * lh ) );
                        ctx.lineTo( w, yoffset + ( i * lh ) );
                        ctx.closePath();
                        ctx.stroke();
                    } );
                    
                    var strings = $this.clef.data('tuning').length;

                    ctx.font = lh+'px sans-serif';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    
                    var x = lh * 2;
                    var padding = lh * 0.1;
                    $($this.clef.data('notes')).each( function( i ) {
                        var $chord = this;
                        $($chord).each( function( n ) {
                            if ( this != -1 ) {
                                var middle = ( ( ( strings - 1 ) - n ) * lh ) + yoffset;
                                var dim = ctx.measureText( this.toString() );
                                var height =  lh;
                                
                                ctx.fillStyle = 'white';
                                ctx.fillRect( x - dim.width - ( padding * 4 ),
                                    middle - ( ( height + ( padding * 4 ) ) / 2 ),
                                    dim.width + ( padding * 2 ),
                                    height + ( padding * 4 ) );
                            }
                        });
                        $($chord).each( function( n ) {
                            if ( this != -1 ) {
                                var middle = ( ( ( strings - 1 ) - n ) * lh ) + yoffset;
                                var dim = ctx.measureText( this.toString() );
                                var height =  lh;
                                
                                ctx.fillStyle = 'black';
                                ctx.fillText( this.toString(),
                                    x - dim.width - ( padding * 2 ),
                                    middle );
                            }
                        });
                        x += lh * 2;
                    } );

                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.moveTo( 0, yoffset );
                    ctx.lineTo( 0, yoffset + ( ( strings - 1 ) * lh ) );
                    ctx.closePath();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo( w, yoffset );
                    ctx.lineTo( w, yoffset + ( ( strings - 1 ) * lh ) );
                    ctx.closePath();
                    ctx.stroke();
            } } );
            
            g.draw();
            
            $this.data( 'g', g );
        },
        set: function( notes ) {
            $(this).data( 'notes', notes );
            $(this).data( 'g' ).draw();
        }
    };
    
    $.fn.mTabulature = function( method ) {
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.mTabulature' );
        }    
    };
})(jQuery);
