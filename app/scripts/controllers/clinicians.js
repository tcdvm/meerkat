'use strict';

app.controller('CliniciansCtrl',
  function ($scope, $firebaseObject, $firebaseArray, Clinicians) {
    $scope.clinicians = Clinicians.all;
    $scope.clinicians.$loaded().then(function() {
      $scope.numClinicians = $scope.clinicians.length;
      var totalNewCases = 0;
      var totalRechecks = 0;
      var totalProcedures = 0;
      // console.log(clinicians.length); // data is loaded here
      angular.forEach($scope.clinicians, function(clinician) {
        totalNewCases += clinician.numNewCases;
        totalRechecks += clinician.numRechecks;
        totalProcedures += clinician.numProcedures;
        // console.log(clinician);
      });
      $scope.avgNewCases = totalNewCases/$scope.numClinicians;
      $scope.avgRechecks = totalRechecks/$scope.numClinicians;
      $scope.avgProcedures = totalProcedures/$scope.numClinicians;
    });

  }); // end controller