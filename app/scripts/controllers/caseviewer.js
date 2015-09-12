'use strict';

app.controller('CaseViewerCtrl',
	function ($scope, $firebaseObject, $firebaseArray, Cases) {
		$scope.caseArray = [];
		$scope.cases = Cases.all;
		$scope.cases.$loaded().then(function() {
			for (var i = 0; i < $scope.cases.length; i++) {
			  $scope.caseArray.push($scope.cases[i]);
			}
    });
		// $scope.students.$loaded().then(function(students) {
		// 	$scope.numStudents = $scope.students.length;
		// 	var totalNewCases = 0;
		// 	var totalRechecks = 0;
		// 	var totalProcedures = 0;
		//   console.log(students.length); // data is loaded here
		//   angular.forEach($scope.students, function(student) {
		// 		totalNewCases += student.numNewCases;
		// 		totalRechecks += student.numRechecks;
		// 		totalProcedures += student.numProcedures;
  //       console.log(student);
	 //    });
	 //    $scope.avgNewCases = totalNewCases/$scope.numStudents;
	 //    $scope.avgRechecks = totalRechecks/$scope.numStudents;
	 //    $scope.avgProcedures = totalProcedures/$scope.numStudents;
		// });

	}); // end controller