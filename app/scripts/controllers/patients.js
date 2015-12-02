'use strict';

app.controller('PatientsCtrl',
  function ($scope, $firebaseObject, $firebaseArray, $uibModal, Patients) {
    // $scope.students.$loaded().then(function() {
    //   $scope.numStudents = $scope.students.length;
    //   var totalNewCases = 0;
    //   var totalRechecks = 0;
    //   var totalProcedures = 0;
    //   // console.log(students.length); // data is loaded here
    //   angular.forEach($scope.students, function(student) {
    //     totalNewCases += student.numNewCases;
    //     totalRechecks += student.numRechecks;
    //     totalProcedures += student.numProcedures;
    //     // console.log(student);
    //   });
    //   $scope.avgNewCases = totalNewCases/$scope.numStudents;
    //   $scope.avgRechecks = totalRechecks/$scope.numStudents;
    //   $scope.avgProcedures = totalProcedures/$scope.numStudents;
    // });
    $scope.patientId = 12344;

    $scope.getPatientCasesRef = function(patientId) {
      Patients.getCasesRef(patientId);
    };

    $scope.open = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '../views/patientModal.html',
        controller: 'PatientModalCtrl',
        size: 'lg',
        resolve: {
          patientId: function() {
            return $scope.patientId;
          }
        }
      });

      modalInstance.result.then(function() {
        console.log('clicked ok');
      }, function() {
        console.log('clicked cancel');
      });
    };

  }); // end controller

app.controller('PatientModalCtrl', function($scope, $uibModalInstance, $firebase, $firebaseObject, $firebaseArray, Patients, patientId) {
  $scope.patientId = patientId;
  var patientRef = Patients.getRef(patientId);
  var patientInfo = {};
  patientRef.on('value', function(snapshot) {
    console.log(snapshot.val());
    patientInfo = snapshot.val();
    $scope.patientName = patientInfo.name;
    $scope.patientSurname = patientInfo.surname;
    $scope.patientSpecies = patientInfo.species;
  }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });

  var patientCasesRef = Patients.getCasesRef(patientId);
  patientCasesRef.on('value', function(snapshot) {
    console.log(snapshot.val());
    $scope.patientCases = snapshot.val();
  }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });

  $scope.events = [{
    badgeClass: 'info',
    badgeIconClass: 'glyphicon-check',
    title: 'First heading',
    content: 'Some awesome content.'
  }, {
    badgeClass: 'warning',
    badgeIconClass: 'glyphicon-credit-card',
    title: 'Second heading',
    content: 'More awesome content.'
  }];


  console.log('hi');

  $scope.ok = function() {
    $uibModalInstance.close('controller: hit ok');
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('controller: hit cancel');
  };

});