// ********************************************************************
// For use with SeCommerce by Silver Earth (c) 2014, 2015 Michael V Khalsa
// www.silverearth.com
// 
// Some functions are called on document.ready on the specific pages using them
// for performance reasons.
// *********************************************************************



// Used on product and kit detail pages to hide tabs that do not have an immediate div child
function seHideEmptyTabs() {
    var wasActiveHidden = false;

    $(".tab-content .tab-pane:not(:has(div))").each(function () {
        if ($(this).is(".active")) { wasActiveHidden = true};
        $('a[data-content-id="' + this.id + '"]').closest("li").hide();
     });

    if (wasActiveHidden == true) {
        // set the first tab as active, if any    
        var mytabs = $(".tab-content .tab-pane:has(div)");

        if (mytabs && mytabs.length > 0) {
           $(mytabs[0]).addClass("active");
           $('a[data-content-id="' + mytabs[0].id + '"]').closest("li").addClass("active");
        }
    }
};


// Used on the normal kit detail page. Updates display price with selection
function seUpdateKitPrice() {

    var seKitPrice = $('#item-price');
    if (seKitPrice == null) { return false };


    var myKitItems = $("div.se-kit-item .se-kit-item-price, div.se-kit-items select option:selected, div.se-kit-items input:checkbox:checked");

    var total = 0.00;
    var discount = 0.00;

    if (myKitItems.length == 0) { return false };
        $('.thumb_img').css('display','none');
    myKitItems.each(function () {
        if ($(this).attr('data-price')) {
            var qty = parseInt($(this).attr('data-qty'));
            if (!qty) { qty = 1 };

            total += (parseFloat($(this).attr('data-price')) * qty);
            discount += (parseFloat($(this).attr('data-discount')) * qty);
        }; 
        var thumb_img = '#' + $(this).parent().attr('name') + $(this).attr('value');
        $(thumb_img).css('display','table-row');
    });



    var priceDisplay = "$" + total.toFixed(2);
    if (discount > 0) { priceDisplay = priceDisplay + " <small>you saved $" + discount.toFixed(2) + "</small>" };

    seKitPrice.html(priceDisplay);
    return true;
};


// Add an active class to any side menu item that is stacked
// Currently only works if no query is part of the url which is fine for virtual pages
function seSetActiveSideMenu() {
    var myUrl = location.href.toLowerCase();
    $('ul.nav-stacked a[href="' + myUrl + '"]').each(function () { $(this).parent().addClass('active') });

    // $('ul.nav-stacked a').filter(function () {return this.href == myUrl;}).parent().addClass('active');

    // if a side column has no content, then change the main column to go all the way across
    //var sidecol = $('div.se-side-col');
    //if (sidecol.length = 1) { 
    //    var maincol = $('div.se-main-col');
    //    if (maincol.length = 1) { maincol.attr("class").replace("col-lg-9", "col-lg-12");}
    //};
};


// Makes all items with class 'se-item-same-height' same height
function se_same_heights() {
    var cells = $('div.se-item-same-height');
    if (cells.length < 3) { return false };
    var h = 0;
    $(cells).each(function () {
        $(this).css({ 'height': 'auto' });
        if ($(this).outerHeight() > h) {
            h = $(this).outerHeight();
        }
        $(this).css({ 'height': h });
    });
};


// Used for a catalog of items with 3 columns ( uses col-sm-4 in the row)
// Place class 'se-item-3col' on the div that you want to normalize.
//  and be sure to use only once within each item
function se_same_heights_3col() {

    var cells = $('div.se-item-3col');
    if (cells.length < 3) { return false };

    if ($(window).width() <= 320) {
        $(cells).each(function () {
            $(this).css({ 'height': 'auto' });
        });
        return true;
    };

    var h = 0, i = 0;
    var h1, h2;

    $(cells).each(function () {
        $(this).css({ 'height': 'auto' });

        i += 1;
        switch (i) {
            case 1:
                h = $(this).outerHeight();
                h1 = $(this);
                break;

            case 2:
                h2 = $(this);
                if ($(this).outerHeight() > h) {
                    h = $(this).outerHeight();
                    h1.css({ 'height': h });
                }
                break;

            case 3:
                if ($(this).outerHeight() > h) {
                    h = $(this).outerHeight();
                    h1.css({ 'height': h });
                    h2.css({ 'height': h });
                }
                break;

            default:
                i = 1;
                h = $(this).outerHeight();
                h1 = $(this);
        }

        $(this).css({ 'height': h });
    });
};


// Create a random token for api calls
function se_create_token() {
    var rand = function () {
        return Math.random().toString(36).substr(2); // remove `0.`
    };

    return rand() + rand();
};


// If e-mail is in a valid format
function se_is_email_valid(email) {
    if (!email || email == '') { return false };
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}


// Generate a modal pseudo alert
$.extend({
    bootalert: function(heading, msg, btnClass, headClass) {
        $("#dataAlertModal .modal-footer button").removeClass().addClass("btn btn-lg").addClass(btnClass);
        $("#dataAlertModal .modal-header").removeClass().addClass("modal-header").addClass(headClass);
        if (!$('#dataAlertModal').length) {
            $('body').append('<div id="dataAlertModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dataAlertLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header ' + headClass + '"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 id="dataAlertLabel">Notification</h3></div><div class="modal-body" style="background-color: white;"></div><div class="modal-footer" style="background-color: white;"><button class="btn ' + btnClass + '" data-dismiss="modal" aria-hidden="true"> Ok </button></div></div></div></div>');
        }
        $('#dataAlertModal #dataAlertLabel').text(heading);
        $('#dataAlertModal').find('.modal-body').html(msg);
        $('#dataAlertModal').modal({
            show : true
        });
    }
});


// Add a user's e-mail to a promotional list with ajax
function se_add_email() {

    var email = $('#emailSignupEmail').val().trim();

    if (!email || email == '') {
        $('#emailSignupSpinner').hide();
        $('#emailSignupResponseArea').show();
        $('#emailSignupMessage').html("<h4 class='text-danger'>Please enter your e-mail address.</h4>");
        return false;
    };

    if (se_is_email_valid(email) == false) {
        $('#emailSignupSpinner').hide();
        $('#emailSignupResponseArea').show();
        $('#emailSignupMessage').html("<h4 class='text-danger'>The e-mail address you entered is not in a valid format!</h4>");
        return false;
    };

    var theData = {};
    theData.email = email;
    theData.firstName = $('#emailSignupFirstName').val().trim();
    theData.lastName = $('#emailSignupLastName').val().trim();
    theData.token = se_create_token();


    $.ajaxSetup({
        beforeSend: function () {
            $('#emailSignupResponseArea').show();
            $('#emailSignupSpinner').show();
            $('#emailSignupMessage').html("<p class='text-success'>One moment...</p>");
        },

        complete: function () {
            $('#emailSignupSpinner').hide();
        }
    });

    $.ajax({
        url: "api/email/add-to-list",
        type: "POST",
        contentType: "application/json", 
        dataType: "json",
        data: JSON.stringify(theData),
     
        success: function (json) {
            if (json.length == 0) {
                $('#emailSignupMessage').html("<p class='text-danger'>Internal Error: No response returned for adding to email list</p>");

            } else if (json.token == theData.token) {
                $('#emailSignupModal').modal().hide();

                if (json.code == "1") {
                    $('#emailSignupMessage').html("<p class='text-success'>Thank You. Your e-mail address '" + email + "' has been included in our list.</p>");

                } else {
                    $('#emailSignupMessage').html("<p class='text-success'>Thank You. Your e-mail address '" + email + "' is already in our list.</p>");
                };

            } else {
                $('#emailSignupMessage').html("<h4 class='text-danger text-bold'>Security Alert: The returned token does not match the token this request was sent with!. This could have been a glitch, try again.</h4>");
            };
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            $('#emailSignupMessage').html("<h3  class='text-danger' >Unable to Add Your E-mail to List</h3><h4 class='text-danger text-bold'>" + json.Message + "</h4>");
        }
    });
};


// Get the home url with 'no' trailing slash using http:// protocol
// This is localhost aware.
function se_getHomeUrl() {
    if (window.location.host == "localhost") {
        var myurl = window.location.href;
        var myindex = myurl.indexOf("/", 18)
        if (myindex == -1) { return myurl };
        return myurl.substring(0, myindex)

    } else {
        var host = window.location.host;
        return "//" + window.location.host;
    };
};

// Adds a message if condition is false
function se_appendIfFail(condition, message, lineToAdd) {
    if (condition) return message;
    if (!lineToAdd || lineToAdd.length == 0) { return message };
    if (!message || message.length == 0) { return lineToAdd };
    return message + '<br>' + lineToAdd;
};

function se_redirect_shopcart() {
    location.href = se_getHomeUrl() + '/shopcart';
};

function se_email_product_to_friend(productId) {
   
    var theData = {};
    theData.productId = productId;
    theData.fromEmail = $('#emailProductFromEmail').val().trim();
    theData.fromName = $('#emailProductFromName').val().trim();
    theData.toEmail = $('#emailProductToEmail').val().trim();
    theData.toName = $('#emailProductToName').val().trim();
    theData.message = $('#emailProductMessage').val().trim();
    theData.token = se_create_token();

    var errMessage = '';
    errMessage = se_appendIfFail((theData.fromName && theData.fromName.length > 0), errMessage, 'Please enter your name.');
    errMessage = se_appendIfFail(se_is_email_valid(theData.fromEmail), errMessage, 'Please enter your e-mail address.');

    errMessage = se_appendIfFail((theData.toName && theData.toName.length > 0), errMessage, "Please enter your friend's name.");
    errMessage = se_appendIfFail(se_is_email_valid(theData.toEmail), errMessage, "Please enter your friend's e-mail.");

    errMessage = se_appendIfFail((theData.productId > 0), errMessage, 'Internal Error: A valid product id was not given for processing.');
    errMessage = se_appendIfFail((theData.token && theData.token.length > 0), errMessage, 'Internal Error: A security token was not generated. No action was taken.');

    if (errMessage != '') {
        $('#emailProductSpinner').hide();
        $('#emailProductResponseArea').show();
        $('#emailProductResponseMessage').html("<h4 class='text-danger'>" + errMessage + "</h4>");
        return false;
    };



    $.ajaxSetup({
        beforeSend: function () {
            $('#emailProductResponseArea').show();
            $('#emailProductSpinner').show();
            $('#emailProductResponseMessage').html("<p>One moment while we send your e-mail...</p>");
        },

        complete: function () {
            $('#emailProductSpinner').hide();
        }
    });


    $.ajax({
        url: "api/email/product-to-friend",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(theData),

        success: function (json) {
            if (json.length == 0) {
                $('#emailProductResponseMessage').html("Internal Error: No response returned.");

            } else if (json.token == theData.token) {
                $('#emailProductModal').modal().hide();

                if (json.code == "1") {
                    $.bootalert("E-mail Sent", "Your e-mail suggestion has been sent. Thank You!", "btn-success", "bg-success");

                } else {
                    $.bootalert("E-mail Sent", "Your e-mail suggestion has been sent. Thank You! (internal notification - the response code was not 1)", "btn-success", "bg-success");
                };

            } else {
                $('#emailProductResponseMessage').html("<h4 class='text-danger text-bold'>Security Alert: The returned token does not match the token this request was sent with!. This could have been a glitch, try again.</h4>");
            };
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            $('#emailProductResponseMessage').html("<h3>Unable to Send Your E-mail</h3><h4 class='text-danger text-bold'>" + json.Message + "</h4>");
        }
    });
};

function se_display_cart_summary() {

    var cartModal = $('#cartSummaryModal');
    if (cartModal.length == 0) { se_redirect_shopcart(); return false; }
    cartModal.modal().show;

    var cartModalBody = $('#cartSummaryBody');
    if (cartModalBody.length == 0) { se_redirect_shopcart(); return false; }
   
    $.ajaxSetup({
        beforeSend: function () {
            $('#cartSummaryTitle').html("Obtaining Shop Cart Details ...")
            cartModalBody.html("<img src='" + se_getHomeUrl() + "/images/ajax-loader.gif' alt='loading' class='img-responsive'/> <h4> loading ...</h4>");
        }
    });


    $.ajax({
        url: se_getHomeUrl() + "/api/cart/summary",
        type: "GET",
        contentType: "application/json",
        dataType: "json",

        success: function (json) {
            if (json.length == 0) {
                se_redirect_shopcart();
                return false;

            } else if (json.code == "1") {
                    var cartrows= '';
                    $.each(json.lineItems, function (i, row) {
                        if (i >= 6) {
                            //if (i == 6) { cartrows += "<tr><td></td><td><h5>cart summary limited to first 6 items. Go to cart to see full list.</h5>" }
                            if (i == 6) { cartrows += row.tableRow };

                        } else {
                            //cartrows += "<tr><td><img src='" + row.imageUrl + "' alt='product icon' class='img-responsive'/></td><td><h4><a href='" + row.link + "'>" + row.productName + "</a></h4><p>Quantity: <b>" + row.quantity + "</b> &nbsp;&nbsp;&nbsp; " + formatCurrency(row.price) + " each</p><td></tr>"
                            cartrows += row.tableRow
                        }
                     });

                    var carttable = "<table class='table table-striped'><tbody>" + cartrows + "</tbody><table>"
                    cartModalBody.html(carttable);

                    $('#cartSummaryTitle').html("<span class='glyphicon glyphicon-shopping-cart'></span>Shopping Cart<h4><span> " + json.itemsCount + "</span> item(s) for subtotal of <span >" + formatCurrency(json.subTotal) + "</span></h4>")

            } else {
                $('#cartSummaryTitle').html("<span class='glyphicon glyphicon-shopping-cart'></span>Shopping Cart ")
                cartModalBody.html("<h4>Cart is Empty</h4>");
            };
        },

        error: function (xhr, textStatus, errorThrown) {
            se_redirect_shopcart();
            return false;
        }
    });
};

// Add a drop-down carat to each menu item on navbar that have children
function se_addMenuCarats() {
    var topitems = $('.navbar-nav > li.dropdown > a');

    if (topitems.length > 0) {
        topitems.each(function () {
            $(this).append(' <span class="caret"></span>');
        })
    };
};

///^\d{5}(?:[\s-]\d{4})?$/ if spaces allowed

//jQuery.validator.addMethod("zipcode", function (value, element) {
//    return this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
//}, "Please provide a valid zipcode.");

//jQuery.validator.addMethod("cdnPostal", function (postal, element) {
//    return this.optional(element) ||
//    postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
//}, "Please specify a valid postal code.");

function formatCurrency(num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    return "$" + parseFloat(num).toFixed(2);
}


// **************** checkout functions ******************//

function se_toggle_ship_to_bill() {

    var cb = $('div #billSameAsShip');
    if (cb) { se_copy_ship_to_bill(); };

    var detail = $('div #billAddressDetail');
    if (detail) { $(detail).toggle(); };
}

function se_copy_ship_to_bill() {

    try {
        var bill = $('div #billAddressDetail');
        var ship = $('div #shipAddressDetail');
        if (!bill || !ship) { return };

        bill.find('#txtNameFirst').val(ship.find('#txtShipNameFirst').val());
        bill.find('#txtNameLast').val(ship.find('#txtShipNameLast').val());
        bill.find('#txtCompany').val(ship.find('#txtShipCompany').val());
        bill.find('#txtAddOne').val(ship.find('#txtShipAddOne').val());
        bill.find('#txtAddTwo').val(ship.find('#txtShipAddTwo').val());
        bill.find('#txtCity').val(ship.find('#txtShipCity').val());
        bill.find('#txtRegion').val(ship.find('#txtShipRegion').val());
        bill.find('#ListRegions').val(ship.find('#ListShipRegions').val());
        bill.find('#txtPostalCode').val(ship.find('#txtShipPostalCode').val());
        bill.find('#ListCountries').val(ship.find('#ListShipCountries').val());
        bill.find('#txtPhone').val(ship.find('#txtShipPhone').val());

        validateColor('#txtNameFirst');
        validateColor('#txtNameLast');
        validateColor('#txtAddOne');
        validateColor('#txtCity');

        // these fields are typically not present, but they might be on some sites.
        if (bill.find('#txtNameMiddle').length > 0) { bill.find('#txtNameMiddle').val(ship.find('#txtShipNameMiddle').val()); };
        if (bill.find('#txtAddTwo').length > 0) { bill.find('#txtAddTwo').val(ship.find('#txtShipAddTwo').val()); };
    }

    catch (err) { }
};

function se_showPaymentFields() {
   
    var paySection = $('div #se-section-payment');

    var paymentMethod = paySection.find("div #ListPaymentMethods option:selected");

    if (paymentMethod.attr('data-pay-method') === undefined) {
        var paymentMethod = paySection.find("div #ctl00_main_MyPayment1_listPaymentMethods option:selected");
    }

    if (!paymentMethod) { return };
      
    var ref = paymentMethod.attr('data-pay-method');

    if (!ref) { ref = 'se-pay-unknown' };

    paySection.find('.se-payment-detail').hide();
    
    paySection.find('#' + ref).show();

    se_set_valid_payment(paymentMethod.val() );
 
    se_set_payicon(paySection.find('.se-pay-icon'), paymentMethod.val() );
};


function se_set_valid_payment(payMethodId) {


    switch (payMethodId) {
        case "1":
            break;

        case "2":
            break;

        case "3":
            break;

        case "4":
            break;

        default:
            $('#main_EnterOrderDetail1_txtCardName').val('Pay By Phone');
            $('#main_EnterOrderDetail1_txtCardNumber').val('1234123412341234');
            $('#main_EnterOrderDetail1_txtCardSecurityCode').val('123');


            $('#main_FinalPayment1_txtCardName').val('Pay By Phone');
            $('#main_FinalPayment1_txtCardNumber').val('1234123412341234');
            $('#main_FinalPayment1_txtCardSecurityCode').val('123');
            break;

    }
};

function se_set_payicon(el, payMethodId) {
    if (!el) { return };

    switch (payMethodId) {
        case "1":
            el.attr('src', '../assets/images/payments/visa.png');
            break;

        case "2":
            el.attr('src', '../assets/images/payments/mastercard.png');
            break;

        case "3":
            el.attr('src', '../assets/images/payments/american-express.png');
            break;

        case "4":
            el.attr('src', '../assets/images/payments/discover.png');
            break;

        case "300":
            el.attr('src', '../assets/images/payments/paypal.png');
            break;

        default:
            el.attr('src', '');
            break;

    }
};

function getShipCountryId() { return $('#ListShipCountries').val() };

function getBillCountryId() { return $('#ListCountries').val() };

function getShipPostalCode() { return $('#txtShipPostalCode').val().trim();};

function getShipRegionCode() {

    var ep = 1;

    try {
        var regions = $('#ListShipRegions');

        ep = 2;
        if (regions && regions.is(':visible')) {
            ep = 5;
            return regions.val();

        } else {
            ep = 10;
            var region = $('#txtShipRegion');
            if (region == 'undefined') { return '' };
            if (region == 'null') { return '' };

            ep = 20
            var myval = region.val();
            if (myval == 'undefined' || !myVal) { return '' };
            return myval;
        };
    }
    catch (err) { return ''; } //alert("Internal Error fetching ship region code at error point: " + ep + ". Error Message: " + err.message); return ''; }
};


function isZipCodeValid(value) { return /^\d{5}(?:-\d{4})?$/.test(value); };
function isCanadaPostalValid(value) { return /[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/.test(value) };
function isIndiaPostalValid(value) { return /^\d{6}$/.test(value.replace(" ", "")) };
function is4digitPostalValid(value) { return /^\d{4}$/.test(value) };

function setShipMessage(value) {
    try { $('div #shipMessage').html(value); }
    catch (err) { }
};
   

function displayErrorSection(message) {
    try {
        var errorSection = $('div.se-section-error');
        if (errorSection == 'undefined') { return };
        errorSection.find('.se-body').html(message)
        errorSection.show();
    }
    catch (err) { }
};

function hideErrorSection() { $('div.se-section-error').hide() };


function se_internal_validatePostal(countryId, postalCode) {

    switch (countryId) {
        case "840": // USA
            if (!isZipCodeValid(postalCode)) {
                setShipMessage("<h5 class='text-danger'>Please enter a valid zip code to obtain shipping rates for the USA.<h45>");
                displayErrorSection("<h4 class='text-danger'>Please enter a valid zip code to obtain shipping rates for the USA.<h4><p>After you do so, then the Finalize Order button will appear.</p>")
                $('#ListShipMethods').html('');
                return false;
            };
            break;

        case "124": // Canada
            if (!isCanadaPostalValid(postalCode)) {
                setShipMessage("<h5 class='text-danger'>Please enter a valid postal code to obtain shipping rates for Canada.<h5>");
                displayErrorSection("<h4 class='text-danger'>Please enter a valid postal code to obtain shipping rates for Canada.<h4><p>After you do so, then the Finalize Order button will appear.</p>")
                $('#ListShipMethods').html('');
                return false;
            };
            break;

        case "356": // India
            if (!isIndiaPostalValid(postalCode)) {
                setShipMessage("<h5 class='text-danger'>Please enter a valid pin code to obtain shipping rates for India.<h5>");
                displayErrorSection("<h4 class='text-danger'>Please enter a valid pin code to obtain shipping rates for India.<h4><p>After you do so, then the Finalize Order button will appear.</p>")
                $('#ListShipMethods').html('');
                return false;
            };
            break;

        case "554": // new zealand
            if (!is4digitPostalValid(postalCode)) {
                setShipMessage("<h5 class='text-danger'>Please enter a valid post code to obtain shipping rates for New Zealand.<h5>");
                displayErrorSection("<h4 class='text-danger'>Please enter a valid post code to obtain shipping rates for New Zealand.<h4><p>After you do so, then the Finalize Order button will appear.</p>")
                $('#ListShipMethods').html('');
                return false;
            };
            break;

        case "36": // australia
            if (!is4digitPostalValid(postalCode)) {
                setShipMessage("<h5 class='text-danger'>Please enter a valid postal code to obtain shipping rates for Australia.<h5>");
                displayErrorSection("<h4 class='text-danger'>Please enter a valid postal code to obtain shipping rates for Australia.<h4><p>After you do so, then the Finalize Order button will appear.</p>")
                $('#ListShipMethods').html('');
                return false;
            };
            break;
    };

    return true;
};


var se_prevPostalRejected = false;
var se_prevCountryId = 0;

// Used by single page checkout
function se_fetch_ship_rates(tempId, homeCountryId, reason) {

    var countryId = getShipCountryId();
    if ((reason == "postcode") && (homeCountryId != countryId) && (!se_prevPostalRejected) && (se_prevCountryId == countryId)) { return };

    var postalCode = getShipPostalCode();

    $('div.se-section-nextstep').hide();

    
    // this will display the appropriate message if fails
    if (!se_internal_validatePostal(countryId, postalCode)) {
        se_prevPostalRejected = true;
        $('div.ship-rate-loading').hide();
       // alert("diagnostic message: failed postal code '" + postalCode + "' for country id " + countryId);
        return;
    };
  
    se_prevPostalRejected = false;
    se_prevCountryId = countryId;

    var theData = {};
    theData.tempOrderId = tempId
    theData.countryId = countryId;
    theData.postalCode = postalCode;
    theData.regionCode = getShipRegionCode();
    theData.token = se_create_token();

    $.ajaxSetup({
        beforeSend: function () {
            $('div.ship-rate-loading').show();
            $('div.se-section-nextstep').hide();
        },

        complete: function () {
            $('div.ship-rate-loading').hide();
        }
    });

   // alert('country / postal / region ' + countryId + ' ' + postalCode + ' region: ' + theData.regionCode);
    $.ajax({
        url: "../api/shiprate/rates",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(theData),

        success: function (json) {
            if (json.length == 0) {
                var myMessage ="<h4 class='text-danger'>Internal Error: No results returned from fetching ship rates.</h4><p>" + json.message + "</p>"
                setShipMessage(myMessage);
                displayErrorSection(myMessage);
                se_prevPostalRejected = true;
                $('#ListShipMethods').html('');

            } else if (json.code == 0) {
                setShipMessage("<h4 class='text-danger'>It appears that your cart is empty!</h4>>");
                $('#ListShipMethods').html('');
                $.bootalert("No Items in Cart", "It appears that you do not have any items in your cart. When you close this dialog you will be redirected back to your shopping cart.", "btn-warning", "bg-warning");
                se_prevPostalRejected = true;
                se_redirect_shopcart();
          
            } else if (json.code == 1) {
                // we should not have reached here, but place it in for insurance
                setShipMessage("<p>There are no shipping items in this cart.</p>");
                displayErrorSection("");
                $('#ListShipMethods').html('');
                $('div.se-section-nextstep').show();
                se_prevPostalRejected = true;

            } else if (json.code == 4 || !json.list) {
                setShipMessage("<h4 class='text-danger'>Unable to find any ship rates for this country and postal code.</h4>");
                displayErrorSection("<h4 class='text-danger'>Unable to find any ship rates for this country and postal code.</h4><p>" + json.message + "</p><p>ISO Country Id " + json.countryId + "</p><p>Postal Code " + json.postalCode + "</p><p>Region Code " + json.regionCode + "</p><p>Temp Order Id " + json.tempOrderId + "</p>");
                se_prevPostalRejected = true;
                $('#ListShipMethods').html('');

            } else {
                var options = '';

                $.each(json.list, function (i, row) {
                    options += row.optionItemHtml;
                });

                $('#ListShipMethods').html(options);

                $('div.se-section-nextstep').show();
                setShipMessage(json.message);
                displayErrorSection("");

                seUpdateTotals( (homeCountryId == countryId) );

            };

            $('div.ship-rate-loading').hide(); // repeat as does not always work on complete
        
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            setShipMessage("<h4 class='text-danger'>Error on ship rates lookup: " + json.Message + "</h4>");
            displayErrorSection('Error on ship rates lookup: ' + json.Message);

            $('div.ship-rate-loading').hide(); // repeat as does not always work on complete
         }
    });
};

function se_change_shipRegionInfo(tempOrderId, homeCountryId, billCountryMustSameAsShip) {
 
    var countryId = getShipCountryId();
    if (countryId == 0) { countryId = homeCountryId };

    se_prevPostalRejected = true;

    $('div.se-section-nextstep').hide();

    $.ajaxSetup({
        beforeSend: function () {
            $('div.ship-rate-loading').show();
        },

        complete: function () {
            $('div.ship-rate-loading').hide();
        }
    });

    $.ajax({
        url: "../api/region/" + countryId,
        type: "GET",
        contentType: "application/json",

        success: function (json) {

            // countryId countryName regionTypeName  regionList  isRegionList  requirePostalCode  postalCodeMaxLength 
            var regionsList = $('#ListShipRegions');
            var regionsBox = $('#txtShipRegion');

            if (json.isRegionList) {
                regionsList.show();
                regionsList.html(json.regionList);
                if (regionsBox) { regionsBox.hide() };

            } else {
                regionsList.hide();
                if (regionsBox) {
                    regionsBox.show();
                    regionsBox.val('');
                };

            };
                        
            $('#labelShipStateOrProvince').html(json.regionTypeName);
            $('#labelShipPostalCode').html(json.postalCodeName);

       
           // alert('postal code name ' + json.postalCodeName);
            // todo: set validators for ship postal code

            var boxShipPostCode = $('#txtShipPostalCode');
            boxShipPostCode.val('');

            se_set_maxlength(boxShipPostCode, json.postalCodeMaxLength);
            se_set_maxlength($('#txtPostalCode'), json.postalCodeMaxLength);

            if (billCountryMustSameAsShip) {
                
                $('#ListCountries').html("<option value='" + countryId + "' selected='selected'>" + json.countryName + "</option>")

                $('#labelStateOrProvince').html(json.regionTypeName);
                $('#labelPostalCode').html(json.postalCodeName);

                var regionsBillList = $('#ListRegions');
                var regionsBillBox = $('#txtRegion');

                if (json.isRegionList) {
                    regionsBillList.show();
                    regionsBillList.html(json.regionList);
                    regionsBillBox.hide();

                } else {
                    regionsBillList.hide();
                    regionsBillBox.show();
                    regionsBillBox.val('');
                };
                // todo: set validators for bill postal code
            };

            se_fetch_ship_rates(tempOrderId, homeCountryId, "country");
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            displayErrorSection('Error on regional lookup: ' + json.Message);
        }
    });
};

function se_change_shipRegionInfoOnly(tempOrderId, homeCountryId, billCountryMustSameAsShip) {

    var countryId = getShipCountryId();
    if (countryId == 0) { countryId = homeCountryId };

    se_prevPostalRejected = true;

  //  $('div.se-section-nextstep').hide();



    $.ajax({
        url: "../api/region/" + countryId,
        type: "GET",
        contentType: "application/json",

        success: function (json) {

            // countryId countryName regionTypeName  regionList  isRegionList  requirePostalCode  postalCodeMaxLength 
            var regionsList = $('#ListShipRegions');
            var regionsBox = $('#txtShipRegion');

            if (json.isRegionList) {
                regionsList.show();
                regionsList.html(json.regionList);
                if (regionsBox) { regionsBox.hide() };

            } else {
                regionsList.hide();
                if (regionsBox) {
                    regionsBox.show();
                    regionsBox.val('');
                };

            };

            $('#labelShipStateOrProvince').html(json.regionTypeName);
            $('#labelShipPostalCode').html(json.postalCodeName);


            // alert('postal code name ' + json.postalCodeName);
            // todo: set validators for ship postal code

            var boxShipPostCode = $('#txtShipPostalCode');
            boxShipPostCode.val('');

            se_set_maxlength(boxShipPostCode, json.postalCodeMaxLength);
            se_set_maxlength($('#txtPostalCode'), json.postalCodeMaxLength);

            if (billCountryMustSameAsShip) {

                $('#ListCountries').html("<option value='" + countryId + "' selected='selected'>" + json.countryName + "</option>")

                $('#labelStateOrProvince').html(json.regionTypeName);
                $('#labelPostalCode').html(json.postalCodeName);

                var regionsBillList = $('#ListRegions');
                var regionsBillBox = $('#txtRegion');

                if (json.isRegionList) {
                    regionsBillList.show();
                    regionsBillList.html(json.regionList);
                    regionsBillBox.hide();

                } else {
                    regionsBillList.hide();
                    regionsBillBox.show();
                    regionsBillBox.val('');
                };
                // todo: set validators for bill postal code
            };

        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            displayErrorSection('Error on regional lookup: ' + json.Message);
        }
    });
};

function se_set_maxlength(box, maxLen) {
    try {
        if (box == "undefined") { return };
        if (box == "null") { return };

        if (!maxLen || maxLen < 1) { return };
        $(box).attr("maxlength", maxLen);
    } catch(err){}
};

function se_set_postal_region_label(isForShip) {

    var countryId = 0;

    var stateLabel;
    var postalLabel;

    var stateValue = 'Region';
    var postalValue = 'Postal Code';

    if (isForShip) {
        countryId = getShipCountryId();
        var stateLabel = $('#labelShipStateOrProvince');
        var postalLabel = $('#labelShipPostalCode');

    } else {
        countryId = getBillCountryId();
        var stateLabel = $('#labelStateOrProvince');
        var postalLabel = $('#labelPostalCode');
    };


    switch (parseInt(countryId,10)) {
        case 840: // usa
            stateValue = 'State <span class="text-danger">*</span>';
            postalValue = 'Zip Code <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 10);
            se_set_maxlength($("txtPostalCode"), 10);
          
            break;

        case 124: // canada
            stateValue = 'Province <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 7);
            se_set_maxlength($("txtPostalCode"), 7);
            break;

        case 826: // uk
            stateValue = 'Area <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 15);
            se_set_maxlength($("txtPostalCode"), 15);
            break;

        case 36: // australia
            stateValue = 'State <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 4);
            se_set_maxlength($("txtPostalCode"), 4);
            break;

        case 356: // india
            stateValue = 'State or Territory <span class="text-danger">*</span>';
            postalValue = 'Pin Code';
            se_set_maxlength($("txtShipPostalCode"), 7);
            se_set_maxlength($("txtPostalCode"), 7);
            break;

        case 392: // japan
            stateValue = 'Prefecture <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 15);
            se_set_maxlength($("txtPostalCode"), 15);
            break;

        case 458: //malaysia
            stateValue = 'State or Territory <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 15);
            se_set_maxlength($("txtPostalCode"), 15);
            break;

        case 554: // new zealand
            stateValue = 'Region <span class="text-danger">*</span>';
            postalValue = 'Post Code <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 4);
            se_set_maxlength($("txtPostalCode"), 4);
            break;

        case 50: //bangladesh
            stateValue = 'District (zila) <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 15);
            se_set_maxlength($("txtPostalCode"), 15);
            break;

        case 0:
            stateValue = 'State/Province <span class="text-danger">*</span>';
            postalValue = 'Postal/Zip Code <span class="text-danger">*</span>';
            se_set_maxlength($("txtShipPostalCode"), 15);
            se_set_maxlength($("txtPostalCode"), 15);

            break;
    };


    if (stateLabel) { $(stateLabel).html(stateValue) };
    if (postalLabel) { $(postalLabel).html(postalValue) };
};



// used on a single page checkout to hides shipping areas
// called if there are no shipping items in cart
function se_no_ship_checkout() {

    $('#se-section-shipaddress').hide();
    $('#se-section-shipmethod').hide();
    $('#se-section-gift').hide();

    $('div.ship-rate-loading').hide();
    $('div.se-section-nextstep').show();

    try {
        // these might not be present on some pages
        $('#billSameAsShipContainer').hide();
        $('#billAddressDetail').show();
    }
    catch (err) { };
 };

function getSelectedShipAmount() {
   
    var selectedMethod = $('#ListShipMethods option:selected');
    if (!selectedMethod) {return 0.00};

    if (!$(selectedMethod).attr('data-ship-rate')) { return 0.00 };
  
    return parseFloat($(selectedMethod).attr('data-ship-rate'));
};


function seCalculateTax(shipAmount, regionCode, postalCode) {

    if (typeof (seTaxBasics) == 'undefined') { return false };
    if (seTaxBasics.length < 11) { return false };

    // update ship amount in array
    seTaxBasics[1] = shipAmount;

    var nationalTax = seTaxBasics[9];
  
    if (typeof(seTaxRegion) == 'undefined' && typeof(seTaxPost) == 'undefined' && nationalTax <= 0.0) { seTaxBasics[2] = 0.0; return true }; // we have no tax rates
  
    var isShipTax = ((seTaxBasics[10] == true) && shipAmount > 0.0);

    // return 0 if nothing to tax looking at total taxable sub total first
    if (seTaxBasics[3] <= 0.0) {
        if (!isShipTax) { seTaxBasics[2] = 0.0; return true };
    };

    var newTax = 0.00;

    if (nationalTax > 0.00) {
        if (isShipTax) {
            newTax += (nationalTax * (seTaxBasics[4] + shipAmount));
        } else {
            newTax += (nationalTax * seTaxBasics[4]);
        };
        newTax += (nationalTax * seTaxBasics[5]);
        newTax += (nationalTax * seTaxBasics[6]);
        newTax += (nationalTax * seTaxBasics[7]);
        newTax += (nationalTax * seTaxBasics[8]);
    };

    if (typeof(seTaxRegion) != 'undefined' && seTaxRegion.length > 5 && regionCode.length > 0) {
        for (var i = 0; i < seTaxRegion.length; i = i + 6) {
            if (seTaxRegion[i] == regionCode) {
                if (isShipTax) {
                    newTax += (seTaxRegion[i + 1] * (seTaxBasics[4] + shipAmount));
                } else {
                    newTax += (seTaxRegion[i + 1] * seTaxBasics[4]);
                };
                newTax += (seTaxRegion[i + 2] * seTaxBasics[5]);
                newTax += (seTaxRegion[i + 3] * seTaxBasics[6]);
                newTax += (seTaxRegion[i + 4] * seTaxBasics[7]);
                newTax += (seTaxRegion[i + 5] * seTaxBasics[8]);
            }
        }
    };
    
    if (typeof(seTaxPost) != 'undefined' && seTaxPost.length > 5 && postalCode.length > 0) {
        for (var i = 0; i < seTaxPost.length; i = i + 6) {
            if (seTaxPost[i] == postalCode) {
                if (isShipTax) {
                    newTax += (seTaxPost[i + 1] * (seTaxBasics[4] + shipAmount));
                } else {
                    newTax += (seTaxPost[i + 1] * seTaxBasics[4]);
                };
                newTax += (seTaxPost[i + 2] * seTaxBasics[5]);
                newTax += (seTaxPost[i + 3] * seTaxBasics[6]);
                newTax += (seTaxPost[i + 4] * seTaxBasics[7]);
                newTax += (seTaxPost[i + 5] * seTaxBasics[8]);
            }
        }
    };

    seTaxBasics[2] = parseFloat(newTax); //update the tax amount held in array
    return true;
}


function seUpdateTotals(isDomestic) {

    var ep = 1;

    try {
        if (typeof (seTaxBasics) == 'undefined') { return false };

        ep = 10;
        var shipAmount = getSelectedShipAmount();
        var regionCode = getShipRegionCode();
        var postalCode = getShipPostalCode();

        ep = 20;
        if (isDomestic) {
            // return if no tax basics
            ep = 22;
            if (!seCalculateTax(shipAmount, regionCode, postalCode)) { return };

        } else {
            seTaxBasics[2] = 0.00; //no tax for int'l
            seTaxBasics[1] = shipAmount;
        };

        ep = 30;
        var taxEl = $('.se-tax-amount');
        var shipEl = $('.se-ship-amount');
        var totalEl = $('.se-grand-total')

        ep = 40;
        var total = seTaxBasics[2] + shipAmount + seTaxBasics[0];

        ep = 50;
        if (taxEl.length > 0) { $(taxEl).html(seFormatCurrency(seTaxBasics[2])) };
        if (shipEl.length > 0) { $(shipEl).html(seFormatCurrency(shipAmount)) };
        if (totalEl.length > 0) { '<b>' + $(totalEl).html(seFormatCurrency(total)) + '</b>' };
    }

    catch (err) {
        alert ("Internal error updating the displayed totals at error point: " + ep + ". This will not effect the actual total price for order. Error Message: " + err.message )
    }
  };

function seGetCurrencySymbol() {
    if (seVars) { return seVars[0]; }
    return '$';
}

function seFormatCurrency(value) {
    if (!value) { value = 0.00; };
    if (isNaN(value)) { return value; };

    if (!seVars) { return '$' + value.toFixed(2); };

    if (seVars[3] == 'true') { return seVars[0] + ' ' +  value.toFixed(seVars[1]); };
    return seVars[0] + value.toFixed(seVars[1]);
}


function se_login_from_checkout() {

    var theData = {};
    theData.userName = $('#txtUserName').val().trim();
    theData.password = $('#txtPassword').val().trim();
    theData.rememberMe = $('cbRememberMe').is(':checked');
    theData.token = se_create_token();

    var errMessage = '';
    errMessage = se_appendIfFail((theData.userName && theData.userName.length > 0), errMessage, 'Please enter your user name.');
    errMessage = se_appendIfFail((theData.password && theData.password.length > 0), errMessage, 'Please enter your password.');
    errMessage = se_appendIfFail((theData.token && theData.token.length > 0), errMessage, 'Internal Error: A security token was not generated. No action was taken.');

    if (errMessage != '') {
        $('#loginMessage').html("<h4 class='text-danger'>" + errMessage + "</h4>");
        return false;
    };


    $.ajaxSetup({
        beforeSend: function () {
            $('#loginMessage').html("<p>One moment while we attempt to log you in...</p>");
        },
    });

 
    $.ajax({
        url: "../api/customer/login",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(theData),

        success: function (json) {
            if (json.token != theData.token) {
                 $('#loginMessage').html("<h4 class='text-danger text-bold'>Security Alert: The returned token does not match the token this request was sent with!. This could have been a glitch, try again.</h4>");

            } else if (json.isSuccess) {
                $('#loginMessage').html("<h4 class='text-bold'>Successfully logged on, one moment while we redirect you ...</h4>");
                se_redirect_shopcart();

            } else if (json.token == theData.token) {
                $('#loginMessage').html('<h4 class="se-text-black">' + json.message + '</h4>');
            };
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            $('#loginMessage').html("<h3>Error</h3><h4 class='text-danger text-bold'>" + json.Message + "</h4>");
        }
    });
};

function se_forgot_password() {

    var theData = {};
    theData.userName = $('#txtUserName').val().trim();
    theData.token = se_create_token();

    var errMessage = '';
    errMessage = se_appendIfFail((theData.userName && theData.userName.length > 0), errMessage, 'Please enter your user name for a forgot password lookup.');
    errMessage = se_appendIfFail((theData.token && theData.token.length > 0), errMessage, 'Internal Error: A security token was not generated. No action was taken.');

    if (errMessage != '') {
        $('#forgotPwdMessage').html("<h4 class='text-danger'>" + errMessage + "</h4>");
        return false;
    };


    $.ajaxSetup({
        beforeSend: function () {
            $('#forgotPwdMessage').html("<p>One moment while we attempt to e-mail you your password...</p>");
        },
    });


    $.ajax({
        url: "../api/customer/forgot",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(theData),

        success: function (json) {
            if (json.token != theData.token) {
                $('#forgotPwdMessage').html("<h4 class='text-danger text-bold'>Security Alert: The returned token does not match the token this request was sent with!. This could have been a glitch, try again.</h4>");

            } else if (json.isSuccess) {
                $('#forgotPwdMessage').html("<h4 class='text-bold'>" + json.message + "</h4>");

            } else {
                $('#forgotPwdMessage').html('<h4 class="se-text-danger">' + json.message + '</h4>');
            };
        },

        error: function (xhr, textStatus, errorThrown) {
            var json = JSON.parse(xhr.responseText);
            $('#forgotPwdMessage').html("<h3>Error</h3><h4 class='text-danger text-bold'>" + json.Message + "</h4>");
        }
    });
};

// *******************************************************//
// Document Ready actions below
// *******************************************************//

$(document).ready(function () {

    // do not combine selectors on search, except for when using the enter key
    $('#btnSearch').click(function () {
        var searchTerm = $('#searchInputBox').val();
        if (searchTerm == null || searchTerm == '') { $('#AlertText').html('Enter a search term first.'); $('#AlertModal').modal('show'); return false; };
        if (searchTerm.length > 54) { $('#AlertText').html('Search term limited to 54 characters.'); $('#AlertModal').modal('show'); return false; };
        location.href = se_getHomeUrl() + '/search?searchTerm=' + escape(searchTerm); return true;
    });

    $('#btnSearch2').click(function () {
        var searchTerm = $('#searchInputBox2').val();
        if (searchTerm == null || searchTerm == '') { $('#AlertText').html('Enter a search term first.'); $('#AlertModal').modal('show'); return false; };
        if (searchTerm.length > 54) { $('#AlertText').html('Search term limited to 54 characters.'); $('#AlertModal').modal('show'); return false; };
        location.href = se_getHomeUrl() + '/search?searchTerm=' + escape(searchTerm); return true;
    });


    $('#searchInputBox input').focus(function () { $(this).val('') });
    $('#searchInputBox2 input').focus(function () { $(this).val('') });

    $('#searchInputBox, #searchInputBox2').keypress(function (event) {
        // do not allow script characters
        // these would be blocked anyway by asp.net and throw a page error, but catch them early
        if (event.keyCode == 60) { event.preventDefault(); return false }; //  <
        if (event.keyCode == 62) { event.preventDefault(); return false }; //  >
        return true;
    });

    $('#searchInputBox, #searchInputBox2').keydown(function (event) {
        if (event.keyCode != 13) { return true }; //cr
        var searchTerm = $(this).val();
        if (searchTerm == null || searchTerm == '') { $('#AlertText').html('Enter a search term first.'); $('#AlertModal').modal('show'); return false; };
        if (searchTerm.length > 54) { $('#AlertText').html('Search term limited to 54 characters.'); $('#AlertModal').modal('show'); return false; };
        location.href = se_getHomeUrl() + '/search?searchTerm=' + escape(searchTerm);
        return false;
    });

});


$(document).ready(function () {

    se_addMenuCarats();

    $('#emailSignupSend').click(function () {
        se_add_email();
    });

    //$('#emailSignupClose').click(function () {     
    //    $('#emailSignupResponseArea').hide();
    //    $('#emailSignupSpinner').hide();
    //    $('#emailSignupMessage').html("");
    //    $('#emailSignupFirstName').html("");
    //    $('#emailSignupLastName').html("");
    //    $('#emailSignupEmail').html("");
    //});

    $('#shopCartLink').click(function () {
        se_display_cart_summary();
        return false;
    });

    $('#cartSummaryGoToCart').click(function () {
        se_redirect_shopcart();
    });
});

