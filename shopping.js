
$.cookie.json = true;
$.cookie.defaults.path = '/';

function getCartItems() {
    if ($.cookie('productlist')) {
        return $.cookie('productlist').cartItems;
    } else {
        return [];
    }
}

function saveCartItems(cart_items) {
    var obj = { "cartItems": cart_items };
    $.cookie('productlist', obj);
}

function emptyCartItems() {
    $.removeCookie('productlist');
}

function addItem(productid, productname, unit, price) {

    var cart_items = getCartItems();

    var is_exist = false;
    $(cart_items).each(function (i, v) {
        if (v && v.productid == productid) {
            is_exist = true;
        }
    });
    if (!is_exist) {
        var new_item = { "productid": productid, "productname": productname, "unit": unit, "price": price.replace(/,/g, ''), "quantity": 1 };
        cart_items.push(new_item);
        saveCartItems(cart_items);
        alert("Added to your cart!");
    } else {
        alert("Existed!");
    }
}

function updateItem(productid, q) {

    var cart_items = getCartItems();
    var t = 0;
    $(cart_items).each(function (i, v) {
        if (v && v.productid == productid) {
            cart_items[i].quantity = q;
            saveCartItems(cart_items);
            t = cart_items[i].price * q;
        }
    });
    return t;
}

function removeItem(productid) {

    var cart_items = getCartItems();

    $(cart_items).each(function (i, v) {
        if (v && v.productid == productid) {
            cart_items.splice(i, 1);
        }
    });

    saveCartItems(cart_items);
}

function showTotal() {
    var total = 0;
    var cart_items = getCartItems();
    $(cart_items).each(function (i, v) {
        if (v) {
            total += v.price * v.quantity;
        }
    });
    $("#sumtotal").html(total.toLocaleString('en'));
}

function loadCartItems() {

    var cart_items = getCartItems();
    var total = 0;
    $("#carts").html("");
    $(cart_items).each(function (i, v) {
        var t = v.price * v.quantity;
        total += t;
        $("#carts").append("<tr>"
            + "<td align='center'>" + v.productid + "</td>"
            + "<td>" + v.productname + "</td>"
            + "<td align='center'>" + v.unit + "</td>"
            + "<td align='right'>" + parseFloat(v.price).toLocaleString('en') + "</td>"
            + "<td align='right'><input type='number' class='quantity' value='" + v.quantity + "' min='1' max='1000'></td>"
            + "<td align='right'>" + t.toLocaleString('en') + "</td>"
            + "<td><button class='removeitem'>Remove</button></td>"
            + "</tr>");
    });
    $("#sumtotal").html(total.toLocaleString('en'));

    $(".quantity").bind("keyup change click", function () {
        var tr = $(this).closest("tr").find("td");
        var t = updateItem(tr.eq(0).html(), $(this).val());
        tr.eq(5).html(t.toLocaleString('en'));
        showTotal();
    });

    $(".removeitem").click(function () {
        if (confirm("Are you sure to remove this item?")) {
            var tr = $(this).closest("tr").find("td");
            removeItem(tr.eq(0).html());
            tr.remove();
            showTotal();
        }
    });
}

function Checkout() {
    var cart_items = getCartItems();

    $.ajax({
        url: '/Cart/Checkout',
        type: "POST",
        data: {},
        success: function (response) {
            if (response != "") {
                alert(response);
            }
        },
        error: function () {

        }
    });

    
}