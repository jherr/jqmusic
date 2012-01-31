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

var g_clef_imgTreble = null;
var g_clef_imgSharp = null;
var g_clef_imgBass = null;
var g_clef_imgNote = null;
var g_clef_imageLoaded = 0;

(function($) {
    var methods = {
        init: function( options ) {
            var $this = $(this);
            
            var settings = $.extend( {
              imageDirectory: 'images/',
              notes: [],
              lineHeight: 10,
              octaves: 6
            }, options);
            
            var loadFunc = function() { g_clef_imageLoaded++; $this.data('g').draw(); };

            g_clef_imgSharp = new Image();
            g_clef_imgSharp.src =  settings.imageDirectory + 'sharp.png';
            $(g_clef_imgSharp).load( loadFunc );

            g_clef_imgBass = new Image();
            g_clef_imgBass.src =  settings.imageDirectory + 'bass.png';
            $(g_clef_imgBass).load( loadFunc );

            g_clef_imgTreble = new Image();
            g_clef_imgTreble.src =  settings.imageDirectory + 'treble.png';
            $(g_clef_imgTreble).load( loadFunc );

            g_clef_imgNote = new Image();
            g_clef_imgNote.src =  settings.imageDirectory + 'note-whole.png';
            $(g_clef_imgNote).load( loadFunc );

            $this.data('notes', settings.notes);
            $this.data('lineHeight', settings.lineHeight);
            $this.data('inset', 5);
            $this.data('chordWidth', 4);
            $this.data('padding', 2);
            $this.data('octaves', settings.octaves);

            var width = ( $this.data('inset') * $this.data('lineHeight') ) +
                        ( $this.data('notes').length * ( $this.data('chordWidth') * $this.data('lineHeight') ) ) +
                        ( $this.data('padding') * $this.data('lineHeight') );
            var height = ( $this.data('octaves') * 7 * ( $this.data('lineHeight') / 2 ) );

            var g = $g().place($this);

            g.size( width, height );

            $this.data('width', width);
            $this.data('height', height);

            g.add( 'clef', { 
                clef: this,
                draw: function( ctx ) { 
                    var $this = this;
                    if ( g_clef_imageLoaded != 4 )
                        return;

                    // Treble clef 
                    
                    var w = $this.clef.data( 'width' );
                    var lh = $this.clef.data( 'lineHeight' );
                    var middle = $this.clef.data( 'height' ) / 2;
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    for( var l = 0; l < 5; l++ ) {
                        ctx.beginPath();
                        ctx.moveTo( 0, middle - ( ( l + 1 ) * lh ) );
                        ctx.lineTo( w, middle - ( ( l + 1 ) * lh ) );
                        ctx.closePath();
                        ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.moveTo( 0, middle - ( 1 * lh ) );
                    ctx.lineTo( 0, middle - ( 5 * lh ) );
                    ctx.closePath();
                    ctx.stroke();

                    ctx.lineWidth = 3;

                    ctx.beginPath();
                    ctx.moveTo( w - 1, middle - ( 1 * lh ) );
                    ctx.lineTo( w - 1, middle - ( 5 * lh ) );
                    ctx.closePath();
                    ctx.stroke();

                    var clefHeight = 5.3 * lh;
                    ctx.drawImage( g_clef_imgTreble, lh * 0.8, middle - ( 5.5 * lh ),
                        ( g_clef_imgTreble.width / g_clef_imgTreble.height ) * clefHeight,
                        clefHeight );

                    // Bass clef

                    var w = $this.clef.data( 'width' );
                    var lh = $this.clef.data( 'lineHeight' );
                    var middle = $this.clef.data( 'height' ) / 2;
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    for( var l = 0; l < 5; l++ ) {
                        ctx.beginPath();
                        ctx.moveTo( 0, middle + ( ( l + 1 ) * lh ) );
                        ctx.lineTo( w, middle + ( ( l + 1 ) * lh ) );
                        ctx.closePath();
                        ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.moveTo( 0, middle + ( 1 * lh ) );
                    ctx.lineTo( 0, middle + ( 5 * lh ) );
                    ctx.closePath();
                    ctx.stroke();

                    ctx.lineWidth = 3;

                    ctx.beginPath();
                    ctx.moveTo( w - 1, middle + ( 1 * lh ) );
                    ctx.lineTo( w - 1, middle + ( 5 * lh ) );
                    ctx.closePath();
                    ctx.stroke();

                    var clefHeight = 2.5 * lh;
                    ctx.drawImage( g_clef_imgBass, lh * 0.8, middle + ( 1.2 * lh ),
                        ( g_clef_imgBass.width / g_clef_imgBass.height ) * clefHeight,
                        clefHeight );
            } } );
            
            g.add( 'notes', { 
                clef: this,
                draw: function( ctx ) { 
                    var $this = this;
                    if ( g_clef_imageLoaded != 4 )
                        return;
                    
                    var lh = $this.clef.data( 'lineHeight' );
                    var middle = $this.clef.data( 'height' ) / 2;
                    
                    var notelocs = [ 0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6 ];
                    var sharps   = [ 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0 ];
                    
                    clef_floor = middle + ( 35 * ( lh / 2 ) );
                    var noteHeight = lh;
                    var sharpHeight = lh * 1.3;
                    var sharpWidth = ( g_clef_imgSharp.width / g_clef_imgSharp.height ) * sharpHeight;
                    var noteWidth = ( g_clef_imgNote.width / g_clef_imgNote.height ) * noteHeight;
                    
                    var x = lh * $this.clef.data('inset');
                    $($this.clef.data('notes')).each( function() {
                        var chord = $(this.sort());
                        
                        chord.each( function( ) {
                            var note = this;
                            var octave = Math.floor( note / 12 );
                            var offset = ( octave * 7 ) * ( lh / 2 );
                            offset += notelocs[ note % 12 ] * ( lh / 2 );
                            
                            var odd = ( ( octave * 7 ) + notelocs[ note % 12 ] ) % 2 == 1;
                            
                            var note_middle = clef_floor - offset;
                            
                            var xoffset = odd ? 0 : lh * 1.0;
                            
                            ctx.drawImage( g_clef_imgNote,
                                x + xoffset + sharpWidth, note_middle - ( noteHeight / 2 ),
                                noteWidth,
                                noteHeight );

                            if ( sharps[ note % 12 ] == 1 ) {
                                var loc = odd ? x : x + noteWidth + ( lh * 1.8 );
                                ctx.drawImage( g_clef_imgSharp, loc, note_middle - ( sharpHeight / 2 ),
                                    sharpWidth,
                                    sharpHeight );
                            }
                        });
                        
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 1;
                        
                        if ( chord[0] <= 43 ) {
                            for( n = chord[0]; n < 43; n++ ) {
                                if ( sharps[ n % 12 ] == 0 && ( notelocs[ n % 12 ] % 2 ) == 0 ) {
                                    var octave = Math.floor( n / 12 );
                                    var offset = ( octave * 7 ) * ( lh / 2 );
                                    offset += notelocs[ n % 12 ] * ( lh / 2 );
                                    
                                    ctx.beginPath();
                                    ctx.moveTo( x, clef_floor - offset );
                                    ctx.lineTo( x + lh * $this.clef.data('chordWidth'), clef_floor - offset );
                                    ctx.closePath();
                                    ctx.stroke();
                                }
                            }
                        }
                        if ( chord[chord.length-1] > 79 ) {
                            for( n = 79; n <= chord[chord.length-1]; n++ ) {
                                var octave = Math.floor( n / 12 );
                                var odd = ( ( octave * 7 ) + notelocs[ n % 12 ] ) % 2 == 1;
                
                                if ( sharps[ n % 12 ] == 0 && !odd ) {
                                    var offset = ( octave * 7 ) * ( lh / 2 );
                                    offset += notelocs[ n % 12 ] * ( lh / 2 );
                                    
                                    ctx.beginPath();
                                    ctx.moveTo( x, ( clef_floor - offset ) - ( lh / 2 ) );
                                    ctx.lineTo( x + lh * $this.clef.data('chordWidth'), ( clef_floor - offset ) - ( lh / 2 ) );
                                    ctx.closePath();
                                    ctx.stroke();
                                }
                            }
                        }
                        
                        x += lh * $this.clef.data('chordWidth');
                    });
                }
            } );
            
            g.draw();
            
            $this.data( 'g', g );
        },
        set: function( notes ) {
            $(this).data( 'notes', notes );
            $(this).data( 'g' ).draw();
        }
    };
    
    $.fn.mClef = function( method ) {
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.mFretboard' );
        }    
    };
})(jQuery);
