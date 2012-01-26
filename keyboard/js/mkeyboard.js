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

function mKeyboard_createClickHandler(note, keyboard) {
    return function(e) {
        e.preventDefault();
        e.stopPropagation();
        keyboard.trigger('click', note);
    };
};

(function($) {
    var methods = {
        init: function( options ) {
            var $this = $(this);
            
            var settings = $.extend( {
              keyCount: 88,
              startNote: 21,
              keyWidth: 12
            }, options);
            
            $this.data('keyCount', settings.keyCount);
            $this.data('startNote', settings.startNote);
            $this.data('keyWidth', settings.keyWidth);
            
            var scale = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];

            var keyHeight = $this.data('keyWidth') * 4;
            var blackKeyHeight = keyHeight * 0.4;

            var g = $g().place($this);

            var x = 0;
            var sn = $this.data('startNote');
            var kc = $this.data('keyCount');
            var kw = $this.data('keyWidth');
            for (var n = sn; n < sn + kc; n++) {
                var shpd = scale[n % 12];
                var kid = 'k' + n.toString();
                if (shpd == 1) {
                    g.add(kid, {
                        width: kw,
                        height: blackKeyHeight,
                        fill: 'black',
                        defaultFill: 'black',
                        x: x,
                        note: n,
                        draw: function(ctx) {
                            ctx.save();
                            ctx.lineCap = 'square';
                            ctx.strokeStyle = 'black';
                            ctx.fillStyle = this.fill;
                            ctx.beginPath();
                            ctx.rect(this.x, 0, this.width, this.height);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        }
                    }).bind(kid, 'click', mKeyboard_createClickHandler(n, $this));
                    x += (kw / 2);
                } else {
                    g.add(kid, {
                        width: kw,
                        height: keyHeight,
                        fill: 'white',
                        defaultFill: 'white',
                        x: x,
                        note: n,
                        leftInset: ((n == sn) ? 0: scale[(n - 1) % 12]) * (kw / 2),
                        rightInset: ((n == sn + kc - 1) ? 0: scale[(n + 1) % 12]) * (kw / 2),
                        topInset: blackKeyHeight,
                        draw: function(ctx) {
                            ctx.save();
                            ctx.lineCap = 'square';
                            ctx.fillStyle = this.fill;
                            ctx.strokeStyle = 'black';
                            ctx.beginPath();
                            ctx.moveTo(this.x + this.leftInset, 0);
                            ctx.lineTo(this.x + this.width - this.rightInset, 0);
                            ctx.lineTo(this.x + this.width - this.rightInset, this.topInset);
                            ctx.lineTo(this.x + this.width, this.topInset);
                            ctx.lineTo(this.x + this.width, this.height);
                            ctx.lineTo(this.x, this.height);
                            ctx.lineTo(this.x, this.topInset);
                            ctx.lineTo(this.x + this.leftInset, this.topInset);
                            ctx.lineTo(this.x + this.leftInset, 0);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        }
                    }).bind(kid, 'click', mKeyboard_createClickHandler(n, $this));
                    x += scale[(n + 1) % 12] ? (kw / 2) : kw;
                }
            }
            
            g.size(x+kw,keyHeight);
            g.draw();
            
            $this.data( 'g', g );
        },
        set: function( notes ) {
            var ns = notes;
            var $this = $(this);
            ($this).data('g').each( function( item ) {
                if ( notes[item.note] != null ) {
                    item.fill = notes[item.note];
                } else {
                    item.fill = item.defaultFill;
                }
            } ).draw();
        }
    };
    
    $.fn.mKeyboard = function( method ) {
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.mKeyboard' );
        }    
    };
})(jQuery);
