var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/amazonDB", {useNewUrlParser: true});

var productSchema = mongoose.Schema({
    Name: String,
    Price: String,
    Picture: String,
    Orders: Number
});

productSchema.methods.order = function(cb) {
    this.Orders += 1;
    this.save(cb);
};

var Product = mongoose.model("Product", productSchema);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param("product", function(req, res, next, id) {
    Product.findById(id, function(err, product) {
        if(err) return next(err);
        else {
            if(!product) { return next(new Error("can't find product")); }
            req.productItem = product;
            return next();
        }
    });
});

router.post("/product", function(req, res, next) {
    var product = new Product(req.body);
    product.save(function(error, post) {
        if(error) console.error(error);
        else {
            console.log("post worked");
            res.sendStatus(200);
        }
    });
    
});

router.get("/product", function(req, res, next) {
   Product.find(function(error, productList) {
       if(error) console.error(error);
       else {
           console.log("get worked");
           res.json(productList);
       }
   }); 
});

router.delete("/product/:product/remove", function(req, res, next) {
    req.productItem.remove();
    res.sendStatus(200);
});

router.put("/product/:product/order", function(req, res, next) {
    req.productItem.order(function(err, product) {
        if(err) return next(err);
        else {
            res.json(product);
        }
    });
});



module.exports = router;
