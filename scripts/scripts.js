jQuery.noConflict();
jQuery(document).ready(function () {
    jQuery("body").removeClass("no-js");
    FixSocialWidths();
    Set_FindAMember_RegionHovers();
    ToggleFindAMemberFilters();
    CachePrintStylesheet();
    FindAMemberControlSubmit();
    SetEnterFocus();
    ForceTwitterLinksToOpenInNewWindow();
});

function CachePrintStylesheet() {
    var headID = document.getElementsByTagName("head")[0];
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = '/css/print.min.css';
    cssNode.media = 'print';
    headID.appendChild(cssNode);
}

function FixSocialWidths() {
    var twitter = jQuery(".socialControls .twitterFeed");
    var linkedin = jQuery(".socialControls .linkedInFeed");

    //alert(twitter.length);
    //alert(linkedin.length);

    if (twitter.length == 0 && linkedin.length == 1) {
        jQuery(linkedin[0]).attr("style", "width:100%");
    }
    else if (twitter.length == 1 && linkedin.length == 0)
    {
        jQuery(twitter[0]).attr("style", "width:100%; float:left");
    }

}

function ToggleFindAMemberFilters() {
    jQuery('#findAMemberToggler').attr('href', '#');
    jQuery('#findAMemberToggler').click(function (e) {
        e.preventDefault();

        if (jQuery('.findAMemberControlFilters').is(":visible")) {
            jQuery('#findAMemberToggler img').attr("src", "/images/fmc_open.png");
        } else {
            jQuery('#findAMemberToggler img').attr("src", "/images/fmc_close.gif");
        }

        jQuery('.findAMemberControlFilters').fadeToggle("fast");
    });
}

function Set_FindAMember_RegionHovers() {

    jQuery('map[name=regionMap] area').each(function (index) {
        var id = this.id;
        jQuery('#' + id).hover(
            function () {
                jQuery('.' + id + 'Hover').fadeIn('fast');
            },
            function () {
                jQuery('.' + id + 'Hover').fadeOut('fast');
            }
        );
        jQuery('#' + id).click(
            function () {
                if (jQuery('.' + id + 'Selected').is(":hidden")) {
                    jQuery('.selectedRegion').fadeOut('fast');
                    jQuery('.' + id + 'Selected').toggle();
                    jQuery("input:radio[name=region]:checked").removeAttr("checked");
                    jQuery('#' + id + 'Radio').attr("checked", true);
                } else {
                    jQuery('.selectedRegion').fadeOut('fast');
                    jQuery("input:radio[name=region]:checked").removeAttr("checked");
                }
            }
        );
    });
}

function SetEnterFocus() {
    jQuery('.topSearch').keydown(function (e) {
        if (e.keyCode == 13) {
            //jQuery(this).children('input[type=button]')[0].click();
        }
    });
}


function FindAMemberControlSubmit() {

    jQuery("#FamcSearchButton").click(function () {
        var url = "/pkf-firms";
        var regionParam;
        if (jQuery("input:radio[name=region]:checked").val() != null) {
            regionParam = "region=" + jQuery("input:radio[name=region]:checked").val();
        }

        var sectors = "";
        var sectorsParam;
        jQuery('.sectors .sectorCb:checked').each(function () {
            if (sectors != "") {
                sectors = sectors+ "%2C";
            }
            sectors = sectors + jQuery(this).val().replace(" ", "+");
        });
        if (sectors != "") {
            sectorsParam = "sectors=" + sectors;
        }

        if (regionParam != null) {
            url = url + "?" + regionParam;
        }
        if (sectorsParam != null) {
            if (regionParam != null) {
                url = url + "&" + sectorsParam;
            } else {
                url = url + "?" + sectorsParam;
            }
        }

        window.location = url;
    });
}

function ForceTwitterLinksToOpenInNewWindow() {

    jQuery(".twitterFeed a").on("click", function () {
        this.target = "_blank";
    });

}

/***
 * jQuery.matchColumns - make bottoms of column match 
 * four object parameters at the moment
 * children : (optional, string) children are the nodes within the container that the height is to be added to
 * position : (optional, string - default bottom) position is where you where you want the extra height to be added
 * restart :  (optional, integer) if you want to reset the height at the start of each row, give the column number
 * style :    (optional,string [padding,margin] ) which style attribute the height is to be added to
 * imageWait : (optional, boolean) Waits until all of the images in the columns are loaded before performing the function */

(function(jQuery) {
    jQuery.fn.matchColumns = function( obj ){

    if( !obj ) obj = {};

    if( !this.length ) return;
    
    var columns = this;
      
    var children = obj.children || null;
    var position = obj.position || "bottom";
    var restart = obj.restart || null;
    var style = obj.style || "margin";

    function setColumns()
    {
        var lowest = 0;
        var lowList = [];
        columns.each(
            function(i) 
            {
                if( restart && i % restart == 0 )
                {
                    lowList[lowList.length] = 0;lowest =0;
//                    if( jQuery.browser.msie ) // if rows are floated and not cleared there are problems in IE. Don't know which browser is rendering correctly but assume it is not IE. This is only a problem if the bottom is being found, not the height.
//                    {
                        jQuery(this).before('<div class="REMOVED_AFTER_FOUND_BOTTOM" style="clear:both;font-size:0;height:0;width:100%;"/>');
//                    }
                }
                
                var bottom = jQuery(this).offset().top + this.offsetHeight;
                this.currentBottom = bottom;
                if (bottom>lowest) {lowest = bottom;}
                if( restart ) {lowList[lowList.length-1] = lowest;}
            })
        .css("height", "auto")
        .siblings(".REMOVED_AFTER_FOUND_BOTTOM").remove().end()
        .each(
          function(i)
          {
            if( lowList.length )
            {
                lowest = lowList[ Math.ceil((i+1)/(restart))-1 ];
            }
            var el = this;
            var diff = lowest-this.currentBottom;
            var endHeight = this.offsetHeight + diff;
            if(diff > 0)
            {
              if (children)
              {
                var tries = 0;
                jQuery(el).find( children ).each( function() {
                    while( el.offsetHeight < endHeight && tries < 6 ) // if it can't get it in 4 tries then something if wrong
                    {
                        var exist = jQuery(this).css( style + "-" + position ).replace(/px/,"") * 1;
                        if( isNaN(exist) ) exist = 0;
                        jQuery(this).css( style + "-" + position , endHeight - el.offsetHeight + exist);
                        tries++;
                    }
                });
              } 
              else 
              {
                jQuery(this).css("padding-" + position , diff + jQuery(this).css("padding-" + position ).replace("px","")*1);
              }
            }
          }  
        );
    }; // end function setColumns
    
    if( obj.imageWait )
    {
        var totalToLoad = 0;
        
        function finishedLoad()
        {
            totalToLoad--;
            if( !totalToLoad ) setColumns();
        }
        
        columns.find("img").each( function(i) {
            if( !this.complete ) 
            {
                // IE doesn't return complete for failed images so check to see if it currently loading
                if( jQuery.browser.msie && this.readyState != "loading" ) return;
                totalToLoad++;
                this.onload = finishedLoad;
            }
        });
        if( !totalToLoad ) setColumns();
    }
    else
    {
        setColumns();
    }
    
  }
})(jQuery);


/***********************************************************
    the rest of the items happen after the dom has finshed loading
    ***********************************************************/
jQuery(function () {
    /* equalize the columns on the three column boxes (collections and home page)
    uses matchColumns plugin for jQuery */
    jQuery(".main  .smallImageComponent").matchColumns({ children: ".details", position: "bottom", restart: 2, imageWait: true });
    jQuery(".secondaryArticles .article .content").matchColumns({ children: ".excerpt", position: "bottom", imageWait: true });
    jQuery(".secondary .publication").matchColumns({ children: ".readMore", position: "top",  imageWait: true });

});

jQuery(function () {
    jQuery('.hideable h2').click(function () {
        jQuery(this).parents('.hideable').find('.details').slideToggle('fast');
    });
});

(function () {
    var onsiteUrls = location.host;
    var downloadDocTypes = "(pdf|rss)jQuery";

    var pageLocation = unescape((window.googlePageview || location.pathname).replace(/(^\/)|(\/jQuery)/g, "")) || "home";
    var site = new RegExp(onsiteUrls, "ig");
    var download = new RegExp(downloadDocTypes, "ig");

    jQuery(document).delegate("a","click", function () {
        if (window._gaq) {
            var action = "";
            // return for javascript links
            if (this.href.match(/(^javascript)|(^#)/) || !this.href) return true;

            // mailto
            if (this.href.match(/mailto/ig)) {
                action = "mailto";
            }
            // download
            else if (this.href.match(download)) {
                action = "download";
            }
            // external link
            else if (!this.href.match(site)) {
                action = "external";
            }

            if (action) {
                var to = this.href.replace( /http[s]*:\/\//i , "");
                _gaq.push(["_trackEvent", "Links", action, "TO: " + this.href.replace(/http[s]*:\/\//i, "") + "; FROM: " + pageLocation]);
            }
        }
    });
})();


