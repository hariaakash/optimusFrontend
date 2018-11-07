angular.module('optimusApp')
	.controller('userCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $interval) {
		$rootScope.checkAuth();
		$rootScope.userId = $stateParams.userId;
		$scope.getUserInfo = () => {
			if ($rootScope.userId) {
				$http({
						method: 'GET',
						url: $rootScope.apiUrl + 'admins/user/' + $rootScope.userId,
						params: {
							adminKey: $rootScope.adminKey
						}
					})
					.then((res) => {
						if (res.data.status == true) {
							$scope.userData = res.data.data;
							$scope.getContainerStats();
						} else {
							$rootScope.toast('Error', res.data.msg, "error");
							$state.go('dashboard.home');
						}
					}, () => {
						$('#btnLoad').button('reset');
						$rootScope.toast('Failed', "Some error occurred, try again.", "error");
					});
			} else {
				$state.go('dashboard.home');
			}
		};
		$scope.blockUser = () => {
			$http({
					method: 'POST',
					url: $rootScope.apiUrl + 'admins/blockUser',
					data: {
						adminKey: $rootScope.adminKey,
						userId: $rootScope.userId
					}
				})
				.then((res) => {
					if (res.data.status == true) {
						$state.reload();
						$rootScope.toast('Success', res.data.msg, "success");
					} else {
						$('#btnLoad').button('reset');
						$rootScope.toast('Failed', res.data.msg, "error");
					}
				}, () => {
					$rootScope.toast('Failed', "Some error occurred, try again.", "error");
				});
		};
		$scope.unBlockUser = function () {
			$http({
					method: 'POST',
					url: $rootScope.apiUrl + 'admins/unblockUser',
					data: {
						adminKey: $rootScope.adminKey,
						userId: $rootScope.userId
					}
				})
				.then((res) => {
					if (res.data.status == true) {
						$state.reload();
						$rootScope.toast('Success', res.data.msg, "success");
					} else {
						$('#btnLoad').button('reset');
						$rootScope.toast('Failed', res.data.msg, "error");
					}
				}, () => {
					$rootScope.toast('Failed', "Some error occurred, try again.", "error");
				});
		};
		$scope.changeLimit = (limit) => {
			if (limit >= 0) {
				$http({
						method: 'POST',
						url: $rootScope.apiUrl + 'admins/changeLimitUser',
						data: {
							adminKey: $rootScope.adminKey,
							userId: $rootScope.userId,
							limit,
						}
					})
					.then((res) => {
						if (res.data.status == true) {
							$state.reload();
							$rootScope.toast('Success', res.data.msg, "success");
						} else {
							$('#btnLoad').button('reset');
							$rootScope.toast('Failed', res.data.msg, "error");
						}
					}, () => {
						$rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
					});
			} else {
				$rootScope.toast('Failed', 'Limit should be >= 0', 'error');
			}
		};
		$scope.getContainerStats = () => {
			$scope.userData.containers.forEach((container) => {
				$http({
						method: 'POST',
						url: $rootScope.apiUrl + 'admins/userContainerStats',
						data: {
							adminKey: $rootScope.adminKey,
							userId: $rootScope.userId,
							containerId: container._id,
						}
					})
					.then((res) => {
						if (res.data.status == true) container.stats = res.data.data.stats;
						else delete container.stats;
					}, () => {
						delete container.stats;
						$rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
					});
			});
		};
		$interval(() => {
			$scope.getContainerStats();
		}, 60000);
		$scope.getUserInfo();
	});