angular.module('fileUpload', ['ngFileUpload'])
.controller('MyCtrl',['Upload','$window','$http','$scope',function(Upload,$window,$http,$scope){
    var vm = this;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    
   
}
   /* vm.delete=function($index){
        url: 'http://localhost:3000/delete/upload',
        data:{file:file}
        }).then(function (resp) { 






    }*/
    
         vm.getData=function() {
            console.log("this");
        $http.get('http://localhost:3000/upload').success(function(data){
            console.log(data,"data");
            $scope.files = data;
            // $scope.veriler=data;   
       });    
    }

         vm.deleteFiles = function(fname) {
            //console.log("delete fn called");
            var res = fname.substr(8);
           // console.log(res);
                $http.post('http://localhost:3000/deletefile/' +res)
                        .success(function(data) {
                                $scope.result = data;
                              //  console.log("http working");
                                //console.log(result);
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                               // console.log("http not working");
                        });
        };
         vm.deleteAll = function(fname) {
           
                $http.post('http://localhost:3000/deleteall')
                        .success(function(data) {
                                //$scope.result = data;
                                //make arry containing files empty to remove the list from frontend
                                $scope.files = [];

                                //console.log(result);
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                              
                        });
        };



vm.removeRow = function(idx){
    console.log("hey");
          var index = 0;
          var comArr = eval( $scope.files );
          for( var i = 0; i < comArr.length; i++ ) {
                if( comArr[i].name === name ) {
                    index = i;
                    break;
                 }
          }
          if( index === -1 ) {
               alert( "Something gone wrong" );
          }
          $scope.files.splice( idx, 1 );
       };

    
    vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catoo error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log(progressPercentage)
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + $scope.progressPercentage + '% '; // capture upload progress
        });
    };
}]);