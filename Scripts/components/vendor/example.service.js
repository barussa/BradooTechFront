function ExampleService() {
    console.log(BASE_URL);

    var http = new HttpRequest();

    this.listarDados = function (filters) {

        return http.get(BASE_URL + 'vendors/listing', null, "application/json")
            .then(function (result) {
                return result;
            }, function (error) {
                return error;
            });
    }
    this.registerData = function (data) {

        return http.post(BASE_URL + 'vendors/register', JSON.stringify(data), "application/json")
            .then(function (result) {
                return result;
            }, function (error) {
                return error;
            });
    }

    this.editData = function (data) {
        return http.put(BASE_URL + 'vendors/update/' + data.id, JSON.stringify(data), "application/json")
            .then(function (result) {
                return result;
            }, function (error) {
                return error;
            });
    }
    
    this.deleteData = function (data) {
        console.log(data)
        return http.delete(BASE_URL + 'vendors/delete', data)
            .then(function (result) {
                return result;
            }, function (error) {
                return error;
            });
    }

}