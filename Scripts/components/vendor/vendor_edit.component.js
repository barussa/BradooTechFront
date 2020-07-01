$(function () {    
    component = new EditComponent();


});

var filters = new function Filter() {
    var self = this;

    self.getFilters = function () {
        var vendorName = $('#vendor-name').val() ? $('#vendor-name').val() : null;
        var vendorCnpj = $('#vendor-cnpj').val() ? $('#vendor-cnpj').val() : null;
        var vendorCity = $('#vendor-city').val() ? $('#vendor-city').val() : null;

        var vendorId = $("#vendor-name").data("id");

        var products = [];
        $("#products-container .products").each(function () {
            var product = new Object();
            var formProducts = $(this).find("input").serializeArray();
            $(formProducts).each(function () {
                var formProduct = this;
                product[formProduct.name.replace("product-", "")] = formProduct.value ? formProduct.value : null;
            });

            product.id = $(this).data().id ? $(this).data().id : null;

            product.vendor_id = $(this).data().vendor_id;

            product.removed = false;

            products.push(product);
        });

        return {
            name: vendorName,
            CNPJ: vendorCnpj,
            city: vendorCity,
            id: vendorId,
            products: products
        };
    }

}

function EditComponent() {
    
    var api = new ExampleService();
    var self = this;
    self.vendor;

    var init = function () {
        self.vendor = JSON.parse(sessionStorage.getItem('vendor_data'));


        self.loadViewData();       

        $('#btn-save').click(self.save);
        $('#button-new').click(self.generateProductElement);
    }

    self.CreateFakeData = function(){
        self.vendor = {
            "name": "Vendor Test",
            "id": 12,
            "city": "Test City",
            "cnpj": "12345678911",
            "products": [
                {
                    "id": 1,
                    "vendor_id": 12,
                    "price": 10,
                    "code": 121,
                    "name": "Queijo"
                },
                {
                    "id": 2,
                    "vendor_id": 12,
                    "price": 15,
                    "code": 123,
                    "name": "Xícara"
                }
            ]
        };
    }
    
    self.loadViewData = function(){
        $('#vendor-name').val(self.vendor.name);
        $('#vendor-cnpj').val(self.vendor.cnpj);
        $('#vendor-city').val(self.vendor.city);

        $('#vendor-name').data("id", self.vendor.id);

        $(self.vendor.products).each(function(i){
            var product = this;

            self.vendor.products[i].removed = false;

            if(i > 0)
                self.generateProductElement();
            $('#products-container [name="product-name"]:last').val(product.name);
            $('#products-container [name="product-code"]:last').val(product.code);
            $('#products-container [name="product-price"]:last').val(product.price);
            $('#products-container .products:last').data({'id': product.id, 'vendor_id': self.vendor.id});
        });
    }

    self.save = function(){
        var vendor = filters.getFilters();

        var removedProducts = self.getRemovedProducts();

        vendor.products.push(...removedProducts);
        console.log(vendor)
        api.editData(vendor).then(function (data) {
    
            if(data != undefined && data != null && data.status == 'success')
            {
                if('error' in data){
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

    self.updateRemovedProducts = function() {
        var formData = filters.getFilters();
        var callingObj = this;
        
        $(formData.products).each(function(){
            var formProduct = this;
            if (self.vendor.products.filter(p => p.removed && p.name.trim().toLowerCase() == formProduct.name.trim().toLowerCase()).length){
                self.vendor.products.filter(p => p.name.trim().toLowerCase() == formProduct.name.trim().toLowerCase())[0].removed = false;
                $(callingObj).parent().parent().data(self.vendor.products.filter(p => p.name.trim().toLowerCase() == formProduct.name.trim().toLowerCase())[0]);
                console.log("atualizado", self.vendor.products.filter(p => p.name.trim().toLowerCase() == formProduct.name.trim().toLowerCase())[0]);
            }
        });
    }

    self.generateProductElement = function(){
        var templateProducts = $('.products:first').clone();
        $(templateProducts).append(`
        <div class="form-group col-md-4 col-lg-2">
            <button type="button" class="btn btn-sm btn-danger">X</button>
        </div>`);

        $("[name='product-name']", templateProducts).blur(self.updateRemovedProducts);

        $('button.btn-danger', templateProducts).click(self.removeProductElement);
        $(templateProducts).data('vendor_id', self.vendor.id);
        $('#products-container').append(templateProducts);

    }

    self.removeProductElement = function(){
        self.vendor.products.filter(p => p.id == $(this).parent().parent().data().id)[0].removed = true;
        $(this).parent().parent().remove();
    }

    self.getRemovedProducts = function(){
        return self.vendor.products.filter(p => p.removed);
    }
     
    init();
}