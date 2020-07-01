$(function () {
    
    component = new ExampleComponent();
    

});

var filters = new function Filtro() {

    var self = this;

    self.obter = function () {
        return {
            "exampleFilter": 1
        };
    }
}

function ExampleComponent() {

    var api = new ExampleService();
    var self = this;
    self.datatable;

    var init = function () {

        self.pesquisar();

        

    }
    self.getDataTable = function(){
        return self.datatable;
    }

    self.pesquisar = function () {

        api.listarDados().then(function (data) {

            if(data != undefined && data != null && data.status == 'success')
            {
                $(data.resp).each(function(i){
                    var obj = this;

                    var newRow = `<tr id='vendor_${obj.id}'>
                    <td>${(i + 1)}</td>
                    <td>${obj.name}</td>
                    <td>${obj.cnpj}</td>
                    <td>${obj.city}</td>
                    <td><a href='javascript:void(0)'>${obj.products.length}</a></td>
                    <td class="actions">
                        <a class="btn btn-success btn-xs" href="view.html">View</a>
                        <a class="btn btn-warning btn-xs" href="edit.html">Edit</a>
                        <a class="btn btn-danger btn-xs"  href="#">Delete</a>
                        </td>
                    </tr>`;
                    
                    $('#vendor_table tbody').append(newRow);
                    
                    $('#vendor_' + obj.id + ' a.btn.btn-danger').click(self.delete);

                    $('#vendor_' + obj.id + ' a.btn.btn-success,#vendor_' + obj.id + ' a.btn.btn-warning').click(self.setViewData);

                    $('#vendor_' + obj.id).data(obj);

                });   
                self.datatable = $('#vendor_table').DataTable();
            }
        });

    }

    self.setViewData = function(){
        var vendor = $(this).parent().parent().data();
        sessionStorage.setItem('vendor_data', JSON.stringify(vendor));
    };

    self.delete = function(){
        var vendor = $(this).parent().parent().data();

        swal({
            title: "Are you sure?",
            text: `Do you want to delete ${vendor.name}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
        if (willDelete) {
            api.deleteData(vendor.id).then(function (data) {    
                
                console.log(data);
                if(data != undefined && data != null && data.status == 'success')
                {
                    swal("Vendor deleted successfully.", {
                        icon: "success",
                    });
                    var table = self.getDataTable();
                    console.log(table);
                    table.row('#vendor_' + vendor.id).remove().draw();
                }
            });  
            
        }
        });
        
    }

    init();
}