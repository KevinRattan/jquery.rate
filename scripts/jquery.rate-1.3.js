/*!
* jQuery Rate Plugin
* version: 1.3 (10-AUG-2012)
* @requires jQuery v1.7 or later
* optionally utilizes the metadata plugin
*
* Copyright (c) Kevin Rattan
* Examples and documentation at: http://www.time2yak.com
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* changes from 1.0 - fixes undefined problem with unchecked boxes (jquery 1.7.2)
* changes from 1.1 - refactoring for cleaner code
* changes from 1.2 - work arounds for situation where user does not have control over naming
                     e.g. using values of inputs rather than name 
                     - allows plugin to work with Web Forms
*/

; (function ($) {

    var setRatings = function (score, scoreSection, zero, one) {
        $('img', scoreSection).each(function () {
            $this = $(this);
            var m = ($this.prop("alt") <= score) ? $this.prop('src', one) : $this.prop('src', zero);
        });
    };

    $.fn.rate = function (options) {
        var settings = {
            innerElm: '#ratingRadios',  //the id of container element that has the radio buttons inside it
            imagePath: '/Content/Icons/',  //the path to the images
            imageZero: 'False.png', //the 0 image
            imageOne: 'True.png',  //the 1 image
            imageWidth: '21', // the width of the images in pixels
            ratingMax: 5  //scale of rating between 1 and this number
        };
        $.extend(settings, options);
        return this.each(function () {
            var m = $.metadata ? $.extend({}, settings, $.metadata.get(this)) : settings;
            var $this = $(this);
            $(m.innerElm, $this).hide();
            var score = $('input:checked', $this).val();
            if (typeof (score) == "undefined") {
                score = 0;
            }
            var htmlString = "";
            for (x = 1; x < m.ratingMax + 1; x++) {
                var image = (score >= x) ? m.imageOne : m.imageZero;
                htmlString += '<img src="' + m.imagePath + image + '" alt="' + x + '" width="' + m.imageWidth + '" style="cursor:pointer" />';
            }
            $this.append(htmlString);
            var zeroImage = m.imagePath + m.imageZero;
            var oneImage = m.imagePath + m.imageOne;
            $this.on("click", "img", function (e) {
                //work around  for browser bug/features where multiple radio buttons can have checked property
                //set to checked if they are not visible 
                $('input:radio', $this).removeAttr('checked');
                var s = parseFloat($(this).prop("alt"));
                $('input:radio[value=' + s + ']', $this).attr('checked', 'checked');
                setRatings(s, $this, zeroImage, oneImage);
            }).on("mouseover", "img", function () {
                setRatings(parseFloat($(this).prop("alt")), $this, zeroImage, oneImage);
            }).on("mouseout", "img", function () {
                setRatings(parseFloat($(this).prop("alt")), $this, zeroImage, oneImage);
            }).on("mouseout", function () {
                var s = $('input:checked', $this).val();
                if (typeof (s) == "undefined") {
                    s = 0;
                }
                setRatings(parseFloat(s), $this, zeroImage, oneImage);
            });
        });
    };

})(jQuery);

