$(function () {    
    component = new EditComponent();


});

var filters = new function Filter() {
    var self = this;

    self.getFilters = function () {
        var vendorName = $('#vendor-name').val() ? $('#vendor-name').val() : null;
        var vendorCnpj = $('#vendor-cnpj').val() ? $('#vendor-cnpj').val() : null;
        var vendorCity = $('#vendor-city').val() ? $('#vendor-city').val() : null;

        // Passou a pegar a informação de id do vendor através da propriedade id que foi vinculada no name.
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

            // A inclusão do vendor_id do produto passou a ser feita aqui.
            product.vendor_id = $(this).data().vendor_id;

            // Foi incluída a propriedade "removed" para todos os objetos que serão retornados.
            // Ela é adicionada como false aqui, pelo fato de ser de um produto que está em tela, portanto, está ativo.
            product.removed = false;

            products.push(product);
        });

        return {
            name: vendorName,
            CNPJ: vendorCnpj,
            city: vendorCity,
            // A inclusão do id do vendor passou a ser feita aqui.
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

        // Método criato para testar o front sem utilizar o backend.
        //self.CreateFakeData();

        self.loadViewData();       

        $('#btn-save').click(self.save);
        $('#button-new').click(self.generateProductElement);
    }

    // Método que cria um objeto fake do vendor para gerar dados sem o backend.
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

        // Inclusão do id do vendor na propriedade id do objeto data gerado para o campo name.
        $('#vendor-name').data("id", self.vendor.id);

        $(self.vendor.products).each(function(i){
            var product = this;

            // Adiciona o valor false na propriedade removed por padrão para todos os produtos exibidos ao carregar a tela.
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
        // Foi removida do método save a responsabilidade de incluir os dados de id que recebia do filter.


        // Lista os produtos removidos para incluir no objeto que será enviado como removed = true para o backend.
        var removedProducts = self.getRemovedProducts();

        // Adiciona os produtos removidos no objeto que será retornado.
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

    // Método que atualiza os produtos do vendor caso ele tenha sido removido e adicionado novamente.
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

        // Associa o método que atualiza os produtos que foram adicionados novamente
        // ao evento blur do input name, dessa forma a validação é feita toda vez que o usuário clicar fora do input.
        $("[name='product-name']", templateProducts).blur(self.updateRemovedProducts);

        $('button.btn-danger', templateProducts).click(self.removeProductElement);
        $(templateProducts).data('vendor_id', self.vendor.id);
        $('#products-container').append(templateProducts);

    }

    self.removeProductElement = function(){
        // Adiciona o status de removido no objeto ao clicar no botão de remover.
        self.vendor.products.filter(p => p.id == $(this).parent().parent().data().id)[0].removed = true;
        $(this).parent().parent().remove();
    }

    // Retorna os objetos que foram definitivamente excluídos.
    self.getRemovedProducts = function(){
        return self.vendor.products.filter(p => p.removed);
    }
     
    init();
}