//JavaScript to support SeCommerce Wish List by Silver Earth (tm) 
//(c) 2015 all rights reserved, only for use with SeCommerce by Silver Earth
// Sept 3, 2015 Michael V Khalsa

var EMPTY_WISHLIST_ICON_CLASS = "glyphicon-heart-empty";
var WISHLIST_ICON_CLASS = "glyphicon-heart";

//Called from jQuery document ready on a catalog page
function seSetWishList(idList) {

    if (!idList || idList == null || idList == '') { setWishListIconAndCount(0); return };
    var wishids = idList.split(",");

    setWishListIconAndCount(idList.count);

    var myItems = $(".wish-list-toggle");
    if (myItems.length == 0) { return };

    myItems.each(function () {
        if ($(this).attr('data-productid')) {
            var id = parseInt($(this).attr('data-productid'));

            if (id && id > 0) {
                for (var i = 0; i < wishids.length; i += 1) {
                    if (wishids[i] == id) {
                        $(this).removeClass(EMPTY_WISHLIST_ICON_CLASS).addClass(WISHLIST_ICON_CLASS);
                        break;
                    }
                }
            }
        };
    });

};

//Called from onclick event or otherwise wired from a user clicking on a wish list icon next for a product
//  on either a catalog or product detail page
//Requires _se-customerid var has been defined previous to calling this.
function seToggleWishList(src1) {

    // If not logged on, instead of giving a notice to logon, this could be modified to open a logon modal on web page instead.
    if (!_se_customerid || _se_customerid == 0) { 
        $('#WishlistModal').modal('show'); 
        return; 
    }

    try {
        var src = $(src1).children('.glyphicon')[0];
        if ($(src).attr('data-productid')) {
            var id = parseInt($(src).attr('data-productid'));
            if (!id) { return; };
            //alert('product id is ' + id);

            if ($(src).hasClass(EMPTY_WISHLIST_ICON_CLASS)) { 
                wishListAdd(id, src);
                $(src1).children('.text').html('Added to wishlist');

            }

        } else {
            alert('Internal Error: reference to product id data attribute or a positive product id was not found ' + src);
        };
    }
    catch (err) {
        //chances are that jquery has not been loaded yet at bottom of page
    }

};


// FUNCTIONS BELOW ARE HELPERS FOR ABOVE //

function setWishListIconAndCount(icount) {
    try {
        var myIcon = $("#wishListIcon");

        if (myIcon) {
            if (icount > 0) {
                $(myIcon).removeClass(EMPTY_WISHLIST_ICON_CLASS).addClass(WISHLIST_ICON_CLASS);
            } else {
                $(myIcon).removeClass(WISHLIST_ICON_CLASS).addClass(EMPTY_WISHLIST_ICON_CLASS);
            };
        }

        var myCount = $("#wishListCount");
        if (myCount) { $(myCount).html(icount) }
    }

    catch (err) { }
}


function wishListAdd(id, src) {
    if (!id || id < 1) { return false; }

    $.ajax({
        url: "api/wishlist/add/" + id,
        type: "GET",
        contentType: "application/json",
        dataType: "json",

        success: function (json) {
            if (json.length == 0) {
                alert("error " + "no response");

            } else {
                $(src).removeClass(EMPTY_WISHLIST_ICON_CLASS).addClass(WISHLIST_ICON_CLASS);

                setWishListIconAndCount(json.totalLineCount);
                // uncomment line below to display a message to customer
                alert(json.message);

            };
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            alert("error adding product to wish list" + json.Message);
        }
    });

};

function wishListRemove(id, src) {
    if (true) {return false;}
    if (!id || id < 1) { return false; }

    $.ajax({
        url: "api/wishlist/remove/" + id,
        type: "GET",
        contentType: "application/json",
        dataType: "json",

        success: function (json) {
            if (json.length == 0) {
                alert("error " + "no response");

            } else {
                $(src).removeClass(WISHLIST_ICON_CLASS).addClass(EMPTY_WISHLIST_ICON_CLASS);
                setWishListIconAndCount(json.totalLineCount);
                // uncomment line below to display a message to customer
                //alert(json.message);

            };
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            alert("error removing product from wish list " + json.Message);
        }
    });

};