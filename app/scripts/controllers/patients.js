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
    $scope.getPatientCasesRef = function(patientId) {
      Patients.getCasesRef(patientId);
    };

    $scope.open = function(patientId) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '../views/patientModal.html',
        controller: 'PatientModalCtrl',
        size: 'lg',
        resolve: {
          patientId: function() {
            return patientId;
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
  $scope.patientName = '';
  $scope.patientSurname = '';
  $scope.patientSpecies = '';
  $scope.patientCases = [];

  var patientRef = Patients.getRef(patientId);
  var patientInfo = {};
  patientRef.on('value', function(snapshot) {
    // console.log(snapshot.val());
    patientInfo = snapshot.val();
    $scope.patientName = patientInfo.name;
    $scope.patientSurname = patientInfo.surname;
    $scope.patientSpecies = patientInfo.species;
  }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });

  var patientCasesRef = Patients.getCasesRef(patientId);
  patientCasesRef.on('value', function(snapshot) {
    // console.log(snapshot.val());
    var patientCases = snapshot.val();
    // Iterate over each case (data will be in "value", key is firebase key)
    angular.forEach(patientCases, function (value, key) {
      console.log('Key' + key);
      console.log(value);
      var caseObject = value;
      if(caseObject.caseType === 'new') {
        caseObject.badgeClass = 'primary';
        caseObject.badgeIconClass ='glyphicon-star';
      } else { // caseType is recheck
        caseObject.badgeClass = 'success';
        caseObject.badgeIconClass = 'glyphicon-ok';
      }
      if(caseObject.surgeryProcedure) {
        caseObject.badgeClass = 'danger';
        caseObject.badgeIconClass = 'glyphicon-flash';
      }
      var now = new Date();
      var timeDiff = Math.abs(now - caseObject.date);
      caseObject.when = Math.floor(timeDiff / (1000 * 3600 * 24));

      $scope.patientCases.push(caseObject);
    });
  }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });

  $scope.events = [{
    badgeClass: 'info',
    badgeIconClass: 'glyphicon-star',
    title: 'First heading',
    content: 'Some awesome content.'
  }, {
    badgeClass: 'danger',
    badgeIconClass: 'glyphicon-flash',
    title: 'Second heading',
    content: 'More awesome content. Mel populo diceret sapientem at, usu omnis maiorum ut. Ei debet semper sed.'
  }];


  console.log('hi');

  $scope.ok = function() {
    $uibModalInstance.close('controller: hit ok');
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('controller: hit cancel');
  };

});