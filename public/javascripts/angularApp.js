var app = angular.module('flapperNews', []);

app.factory('posts', ['$http', function($http){
  // service body
  var o = {
    posts: [
]
  };


  return o;


}]);

app.controller('MainCtrl', [
'$scope',
'posts',
'$http',
function($scope, posts,$http){
$scope.posts = posts.posts;


$scope.addPost = function(){

if(!$scope.cantDeLagartoSinHueso || $scope.cantDeLagartoSinHueso === '' || !$scope.cantYuca || $scope.cantYuca === '' || !$scope.cantCambur || $scope.cantCambur === '' ) { return; }


$http.get('/posts?cantDeLagartoSinHueso=' + $scope.cantDeLagartoSinHueso + '&cantYuca=' + $scope.cantYuca + '&cantCambur=' + $scope.cantCambur).success (function (response) {
    console.log("Llego el pedido");
    alert("Llego el pedido" + JSON.stringify(response));
    
  })
  .error (function() {
    alert("SERVER GET TEST FAILED THO");
  });


  
  $scope.posts.push({
  	cantCambur: $scope.cantCambur,
    cantYuca: $scope.cantYuca,
    cantDeLagartoSinHueso: $scope.cantDeLagartoSinHueso,
  });
  $scope.cantCambur = '';
  $scope.cantDeLagartoSinHueso = '';
  $scope.cantYuca = '';


};

$scope.incrementUpvotes = function(post) {
  post.cantDeLagartoSinHueso += 1;
};

}]);