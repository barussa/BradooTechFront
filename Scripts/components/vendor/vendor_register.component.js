$(function () {
    
    component = new RegisterComponent();

   

});



var filters = new function Filter() {

    var self = this;

    self.getFilters = function () {
        var vendorName = $('#vendor-name').val() ? $('#vendor-name').val() : null;
        var vendorCnpj = $('#vendor-cnpj').val() ? $('#vendor-cnpj').val() : null;
        var vendorCity = $('#vendor-city').val() ? $('#vendor-city').val() : null;
        
        var products = [];
        $("#products-container .products").each(function () {
            var product = new Object();
            var formProducts = $(this).find("input").serializeArray();
            
            $(formProducts).each(function () {
                var formProduct = this;
                product[formProduct.name.replace("product-", "")] = formProduct.value ? formProduct.value : null;
            });

            products.push(product);
        });
        console.log(products);
        return {
            name: vendorName,
            CNPJ: vendorCnpj,
            city: vendorCity,
            products: products
        };
    }
}

function RegisterComponent() {
    
    var api = new ExampleService();
    var self = this;

    var init = function () {
        $('#btn-save').click(self.save);
        $('#button-new').click(self.generateProductElement);
        
    }

    self.generateProductElement = function(){
        var templateProducts = $('.products:first').clone();
        $(templateProducts).append(`
        <div class="form-group col-md-4 col-lg-2">
            <button type="button" class="btn btn-sm btn-danger">X</button>
        </div>`);

        $('button.btn-danger', templateProducts).click(self.removeProductElement);
        $('#products-container').append(templateProducts);

    }

    self.removeProductElement = function(){
        $(this).parent().parent().remove();
    }

    self.save = function(){
        var vendor = filters.getFilters();

        api.registerData(vendor).then(function (data) {
    
            console.log(data)
            if(data != undefined && data != null && data.status == 'ok')
            {
                if(data.data.error){
                    //alert(data.data.error);
                    swal({
                        title: "Error!",
                        text: data.data.error,
                        icon: "error"
                      });
                    
                }else{
                    window.location.href="index.html"
                }
            }
        },
        function(error){
            console.log(error);
        });
    }

    self.makeid = function (length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    self.getRndInteger = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    self.generateTestData = function(productQuantity){
        productQuantity--;
        $("#vendor-name").val(self.makeid(5));
        $("#vendor-cnpj").val(self.getRndInteger(100000000000, 999999999999));
        $("#vendor-city").val(self.makeid(3) + " " + self.makeid(5));
        
        $(productQuantity).each(function(){
            $('#button-new').click();
        });
    
        $(".products").each(function () {
          $(this).find("[name='product-name']").val(self.makeid(5));
          $(this).find("[name='product-code']").val(self.getRndInteger(2, 300));
          $(this).find("[name='product-price']").val(self.getRndInteger(100, 500));
        });
    }
    
     
    init();
}