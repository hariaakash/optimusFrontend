angular.module('optimusApp')
	.controller('userActivityCtrl', function ($rootScope, $scope, $http, $stateParams, $state) {
		$rootScope.checkAuth();
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$rootScope.userId = $stateParams.userId;
		$scope.getUserActivityInfo = function () {
			if ($rootScope.userId) {
				$http({
						method: 'GET',
						url: $rootScope.apiUrl + 'admins/userActivity/' + $rootScope.userId,
						params: {
							adminKey: $rootScope.adminKey
						}
					})
					.then(function (res) {
						if (res.data.status == true) {
							$rootScope.userActivityData = res.data.data;
						} else {
							$rootScope.toast('Error', res.data.msg, "error");
							$state.go('dashboard.home');
						}
					}, function (res) {
						$('#btnLoad').button('reset');
						$rootScope.toast('Failed', "Some error occurred, try again.", "error");
					});
			} else {
				$state.go('dashboard.home');
			}
		};
		$scope.getUserActivityInfo();
	});