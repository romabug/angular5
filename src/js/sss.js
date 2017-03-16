 ///222222 SSSS.JS
 // yeoman --- 生成项目框架 angular-seed   generator-angular


 console.log(' ssssss.js loaded....');


 var app = angular.module("myapp", []);

 app.controller("myctrl", function($scope) {
     $scope.yourName = " input-tony  ";
     $scope.lisaname = " this is lisa name";

     // $scope.list = [{

     //         id: '111',
     //         name: 'lisa girl',
     //         company: 'hotel bullman',
     //         city: 'shishi'

     //     },
     //     [{

     //         id: '222',
     //         name: 'vivian girl',
     //         company: 'huawai bullman',
     //         city: 'shanghai'

     //     }];


 });






 app.directive("appTestIt", [function() {

     return {
         restrict: 'A',
         replace: true,
         //  template : "<span>zi dong yi directiv </span>",
         templateUrl: '/html-tpl/tpl-head.html',
         // scope: {
         //     data: '=';
         // }

     };


 }]);







 app.controller("urctrl", ['$scope', function($scope) {
     // $scope.city = "shang hai";
     // $scope.company = " huawei";

     $scope.list1 = [{

         id: '111',
         name: 'lisa girl',
         company: 'hotel bullman',
         city: 'shishi'

     }, {

         id: '222',
         name: 'vivian girl',
         company: 'huawai bullman',
         city: 'shanghai'

     }];

 }]);




 app.directive("appDoIt", [function() {

     return {
         restrict: 'A',
         replace: true,
         //  template : "<span>zi dong yi directiv </span>",
         templateUrl: '/html-tpl/tpl-list.html',
         // scope: {
         //     data: '='
         // }

     };


 }]);










 // <div ng-app="firstapp"  ng-controller = "myctrl" >

 // </div>









 // gulp.task("run", function(){

 //  gulp.src('./dist/**/*.js')
 //  .pipe( gulp.dest('./dist/dd' ));


 // });
 //