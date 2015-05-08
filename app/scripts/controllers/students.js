'use strict';

app.controller('StudentsCtrl',
	function ($scope, $firebaseObject, $firebaseArray, Students) {
			$scope.students = Students.all;
		});