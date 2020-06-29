$(function () {
    // Cria uma instância do component.
    
    component = new ViewComponent();

    // Todo conteúdo nesse espaço é carregado quando a página é concluída.

});

var filters = new function Filter() {

    
}

function ViewComponent() {
    
    var api = new ExampleService();
    var self = this;
    self.vendor;

    // Conteúdo para ser carregado ao concluir o carregamento do component.
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

    
     
    // Executa o init após finalizar as definições do component.
    init();
}