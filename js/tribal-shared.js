// 
// This work by http://twitter.com/Ben_Lowe of http://www.triballabs.net is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 2.0 UK: England & Wales License.
// http://creativecommons.org/licenses/by-nc-sa/2.0/uk/ 
//

// http://www.foliotek.com/devblog/getting-the-width-of-a-hidden-element-with-jquery-using-width/
$.fn.getHiddenDimensions = function (includeMargin) {
    var $item = this,
	        props = { position: 'absolute', visibility: 'hidden', display: 'block' },
	        dim = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
	        $hiddenParents = $item.parents().andSelf().not(':visible'),
	        includeMargin = (includeMargin == null) ? false : includeMargin;

    var oldProps = [];
    $hiddenParents.each(function () {
        var old = {};

        for (var name in props) {
            old[name] = this.style[name];
            this.style[name] = props[name];
        }

        oldProps.push(old);
    });

    // TribalLabs: add 5px to width as it doesn't seem to be perfect
    dim.width = $item.width() + 5;
    dim.outerWidth = $item.outerWidth(includeMargin);
    dim.innerWidth = $item.innerWidth();
    dim.height = $item.height();
    dim.innerHeight = $item.innerHeight();
    dim.outerHeight = $item.outerHeight(includeMargin);

    $hiddenParents.each(function (i) {
        var old = oldProps[i];
        for (var name in props) {
            this.style[name] = old[name];
        }
    });

    return dim;
}