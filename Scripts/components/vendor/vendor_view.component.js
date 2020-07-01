$(function () {
    
    component = new ViewComponent();


});

var filters = new function Filter() {

    
}

function ViewComponent() {
    
    var api = new ExampleService();
    var self = this;
    self.vendor;

    var init = function () {
        self.vendor = JSON.parse(sessionStorage.getItem('vendor_data'));
        self.loadViewData();
    }

    self.loadViewData = function(){
        $('#vendor-name').html(self.vendor.name);
        $('#vendor-cnpj').html(self.vendor.cnpj);
        $('#vendor-city').html(self.vendor.city);

        $(self.vendor.products).each(function(){
            var product = this;
            $('.product-container').append(`
                <div class="row">
                    <div class="col-md-4">
                    <p><strong>Name</strong></p>
                        <p>${product.name}</p>
                    </div>
                
                    <div class="col-md-4">
                    <p><strong>Code</strong></p>
                        <p>${product.code}</p>
                    </div>
                
                    <div class="col-md-4">
                    <p><strong>Price</strong></p>
                        <p>${product.price}</p>
                    </div>
                </div>
            `);
        });
    }

         
    init();
}