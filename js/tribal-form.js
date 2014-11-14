// 
// This work by http://twitter.com/Ben_Lowe of http://www.triballabs.net is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 2.0 UK: England & Wales License.
// http://creativecommons.org/licenses/by-nc-sa/2.0/uk/ 
//
$(function () {

    var multiColumnDtMargin = 0;
    var gapBetweenCols = 10;
    // initialise each list
    $(document).ready(function () {
        $('.dl-horizontal').parent().each(function (i) {
            $(this).InitialiseForm();
            $(this).resizeDlHorizontal();
        });
    });

    // capture resizing of the list (using jquery.ba-resize.js)
    $('.dl-horizontal').parent().resize(function () {
        $(this).resizeDlHorizontal();
    });

    $.fn.InitialiseForm = function () {
        jQuery('.dl-horizontal', this).each(function (j) {
            var maxLabelWidth = new Array();
            var isMultiCol = $(this).hasClass('dl-multicolumn');
            // default to one column
            var colCount = 1;
            if (isMultiCol) {
                // if multi column then default to 2 columns // changed to 1
                colCount = 1;
                if (typeof ($(this).data('colcount')) !== 'undefined') {
                    colCount = $(this).data('colcount');
                }
            }

            // make sure all have the colcount set
            $(this).data('colcount', colCount);

            // set starter width values for each column
            for (i = 0; i < colCount; i++) {
                maxLabelWidth[i] = 0;
            }

            var width = $(this).parent().width();

            // set the dt width to auto to allow for correct measurments. Doesn't work if set in css.
            jQuery('dt', this).css('width', 'auto');
            jQuery('dt', this).css('float', 'left');

            jQuery('dt', this).each(function (i) {

                if (multiColumnDtMargin == 0) {
                    multiColumnDtMargin = parseInt($(this).css('margin-left')) + parseInt($(this).css('margin-right'));
                }

                var titleWidth = $(this).getHiddenDimensions(false).width;

                if (titleWidth > maxLabelWidth[i % colCount]) {
                    maxLabelWidth[i % colCount] = titleWidth;
                }

                if (i % colCount != 0) {
                    $(this).css('clear', 'none');
                }
            });

            // undo the temporary float set
            jQuery('dt', this).css('width', '');
            jQuery('dt', this).css('float', '');

            for (i = 0; i < colCount; i++) {
                if (i == 0) {
                    $(this).data('maxLabel' + i + 'Width', maxLabelWidth[i]);
                }
                else {
                    $(this).data('maxLabel' + i + 'Width', maxLabelWidth[i] + gapBetweenCols);
                }

            }
        });
    }

    $.fn.resizeDlHorizontal = function () {
        var width = $(this).width();

        jQuery('.dl-horizontal', this).each(function (j) {
            var padLeft = parseInt($(this).css('padding-left'));
            var padRight = parseInt($(this).css('padding-right'));

            width -= padLeft + padRight;

            var isMultiCol = $(this).hasClass('dl-multicolumn');
            var colCount = $(this).data('colcount');

            if ($(window).width() < 768) {
                jQuery('dt', this).css('width', 'auto');
                jQuery('dd', this).css('width', 'auto');
            }
            else {
                jQuery('dt', this).each(function (i) {
                    // set width of title to max width for that column
                    $(this).css('width', $(this).parent().data('maxLabel' + [i % colCount] + 'Width'));

                });

                jQuery('dd', this).each(function (i) {
                    $(this).css('width', (width / colCount) - $(this).parent().data('maxLabel' + [i % colCount] + 'Width') - $(this).css('margin-left').replace('px', '') - multiColumnDtMargin - 1);
                    $(this).css('height', '');
                });

                // fix for IE8 to make sure values don't follow on from previously floated elements
                var maxHeight = 0;
                jQuery('dd', this).each(function (i) {
                    if (i % colCount == 0) {
                        maxHeight = 0;
                    }
                    if ($(this).height() >= maxHeight) {
                        maxHeight = $(this).height();
                    }
                    else {
                        $(this).css('height', maxHeight);
                    }
                });
            }
        });
    }
});