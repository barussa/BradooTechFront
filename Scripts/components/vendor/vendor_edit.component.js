$(function () {    
    component = new EditComponent();


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

            product.id = $(this).data().id ? $(this).data().id : null;

            products.push(product);
        });
        return {
            name: vendorName,
            CNPJ: vendorCnpj,
            city: vendorCity,
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

    self.loadViewData = function(){
        $('#vendor-name').val(self.vendor.name);
        $('#vendor-cnpj').val(self.vendor.cnpj);
        $('#vendor-city').val(self.vendor.city);

        $(self.vendor.products).each(function(i){
            var product = this;
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
        
        vendor.id = self.vendor.id;
        vendor.products.map(function(product){
            product.vendor_id = vendor.id;
            return product;
        });
        
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
     
    init();
}