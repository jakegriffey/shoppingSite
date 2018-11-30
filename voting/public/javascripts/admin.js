var app = window.angular.module("app", []);

app.controller("shopCtrl", function($scope, $http) {
    $scope.products = [];
    $scope.selectedProducts = [];
    $scope.ordered = false;
    $scope.orderedProducts = [];
    
    $scope.getProducts = function() {
        var url = "product";
        
        $http.get(url).then(function(resp) {
            console.log("get worked");
            $scope.products = resp.data;
        });
    };
    
    $scope.chooseProduct = function(product) {
        var found = false;
        
        $scope.selectedProducts.forEach(function(item) {
            if(item == product) {
                found = true;
            }
        });
        
        if(!found) {
            console.log("added product");
            $scope.selectedProducts.push(product);
        } else {
            console.log("removed product");
            for(var i = 0; i < $scope.selectedProducts.length; ++i) {
                if($scope.selectedProducts[i] == product) {
                    $scope.selectedProducts.splice(i, 1);
                }
            }
        }
    };
    
    
    $scope.orderProducts = function() {
        $scope.selectedProducts.forEach(function(product) {
            var url = "product/" + product._id + "/order";
            $http.put(url).success(function(data) {
                product.Orders += 1;
            });
        });
        
        $scope.ordered = true;
        $scope.orderedProducts = $scope.selectedProducts;
    };
});

app.controller("administrationCtrl", function($scope, $http) {
    
    $scope.products = [];
    
    $scope.addProduct = function() {
        var newProduct = {
            Name: $scope.productNameField,
            Price: $scope.productPriceField,
            Picture: $scope.productURLField,
            Orders: 0
        };
        
        var url = "product";
        $http({
            url: url,
            method: "POST",
            data: newProduct
        }).success(function(data, status, headers, config){
            console.log("post success");
            $scope.productNameField = "";
            $scope.productPriceField = "";
            $scope.productURLField = "";
            $scope.getProducts();
        }).error(function(data, status, headers, config) {
            console.log("post (add product) failed");
        });
        
    };
    
    $scope.getProducts = function() {
        var url = "product";
        
        $http.get(url).then(function(resp) {
            console.log("get worked");
            $scope.products = resp.data;
        });
    };
    
    $scope.deleteProduct = function(product) {
        var url = "product/" + product._id + "/remove";
        $http.delete(url).success(function(data) {
            console.log("delete worked");
            $scope.getProducts();
        });
    };
})