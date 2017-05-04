// Cart constructor
// gets the old cart when adding (first time the oldCart is an empty object)
// assign values of the old cart
// add a new item (check if it exists), increase quantity, price, totalQty, totalPrice


module.exports = function Cart(oldCart) {       // add old cart into new cart
    // gather data from the old cart
    this.items = oldCart.items || {};           // an object, stored with product id
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    // adding new item to the cart
    this.add = function (item, id) {
        // check if the item is already in the cart
        var storedItem = this.items[id];
        // if not, make a new entry
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        // after making a new entry, or if it already is in the cart
        storedItem.qty++;
        storedItem.price = storedItem.item.basePrice * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.basePrice;

        // transform it into an array for lists etc.
        this.generateArray = function () {
            var arr = [];
            for (var id in this.items) {
                arr.push(this.items[id]);
            }
            return arr;
        };
    }
};