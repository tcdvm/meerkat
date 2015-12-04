'use strict';

app.controller('StudentsCtrl',
	function ($scope, $firebaseObject, $firebaseArray, Students, Patients) {
		$scope.students = Students.all;
		$scope.students.$loaded().then(function() {
			$scope.numStudents = $scope.students.length;
			var totalNewCases = 0;
			var totalRechecks = 0;
			var totalProcedures = 0;
		  // console.log(students.length); // data is loaded here
		  angular.forEach($scope.students, function(student) {
				totalNewCases += student.numNewCases;
				totalRechecks += student.numRechecks;
				totalProcedures += student.numProcedures;
        // console.log(student);
	    });
	    $scope.avgNewCases = totalNewCases/$scope.numStudents;
	    $scope.avgRechecks = totalRechecks/$scope.numStudents;
	    $scope.avgProcedures = totalProcedures/$scope.numStudents;
		});
		
    $scope.openPatientModal = function(patientId) {
      Patients.openPatientModal(patientId);
    };
	}); // end controller