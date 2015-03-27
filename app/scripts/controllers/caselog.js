'use strict';

app.controller('CaseLogCtrl', function ($scope, $modal, Cases, Students) {


  $scope.netId = undefined;
  $scope.user = undefined;
  var studentObject;

  // $scope.newUser = false;

  $scope.login = function () {
    console.log('in login!');
    // Check if netID (student) exists
    if (Students.checkIfUserExists($scope.netId) !== null) {
      console.log('NetID exists!');
      $scope.user = Students.get($scope.netId);
    } else {
      console.log('No such user! Creating...');
      // $scope.newUser = true;
      var modalInstance = $modal.open({
        templateUrl: 'newUser.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          netId: function() {
            return $scope.netId;
          } 
        }
      });

      modalInstance.result.then(function (newStudent) {
        // $scope.selected = selectedItem;
        console.log('Net ID & Student Name: ' + newStudent.netId + " " + newStudent.name);
        newStudent.numNewCases = 0;
        newStudent.numRechecks = 0;
        newStudent.numEmergencies = 0;
        newStudent.numProcedures = 0;
        studentObject = Students.create(newStudent.netId, newStudent);
        studentObject.$bindTo($scope, "user");
        console.log("student name: " + $scope.user.name);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
      // Students.create($scope.netId, {name: 'me'});
    }

  };

  $scope.cases = Cases.all;
 
  $scope.case =  {
    studentId : '',
    studentName : '',
    date: '',
    patientId : '',
    patientName : '',
    patientSurname : '',
    patientSpecies : '',
    caseType: '',
    surgeryProcedure: '',
    diagnoses : ['', '', ''],
    treatment : '',
    outcome : '',
    followup : '',
    clinicians : []
  };

  // $scope.newStudentFlag = true;

  // $scope.snames = Students.netIds();

  $scope.submitCase = function () {

    $scope.case.studentId = $scope.user.netId;
    $scope.case.studentName = $scope.user.name;

    // Delete all empty diagnoses
    for (var i=$scope.case.diagnoses.length-1; i >= 0; i--) {
      if ($scope.case.diagnoses[i] === null || $scope.case.diagnoses[i] === '') {
        $scope.case.diagnoses.splice(i, 1);
      }
    }

    // var stu = Students.all.$getRecord($scope.case.studentName);
    // console.log('Student is: ' + Students.all.length);
    // for(var j=0; j < Students.all.length; j++) {
    //   console.log(Students.all[j]);
    // }

    // If not an existing student, create a new one, add to database, set
    // case student to new student name
    // Else set case student to entered student name
    // if($scope.newStudentFlag) {
    //   var student = {
    //     studentName: $scope.netId
    //     // studentID: ''
    //   };

    //   Students.create(student).then(function(ref) {
    //     var blah = ref.name();
    //     console.log('Created student: ' + blah);
    //     // console.log(ref);
    //   });
    //   $scope.case.studentName = student.studentName;
    // } else {
    //   $scope.case.studentName = $scope.netId;
    // }

    // $scope.case.studentID = student.studentID;
    $scope.case.date = $scope.dt.getTime();
    // console.log($scope.dt.getTime());

    Cases.create($scope.case).then(function() {
      switch($scope.case.caseType) {
        case "new":
          $scope.user.numNewCases += 1;
          break;
        case "recheck":
          $scope.user.numRechecks += 1;
          break;
        case "emergency":
          $scope.user.numEmergencies += 1;
          break;
      }
      $scope.case =  {
        studentId: '',
        studentName: '',
        date: '',
        patientId : '',
        patientName : '',
        patientSurname : '',
        patientSpecies : '',
        caseType: '',
        surgeryProcedure: '',
        diagnoses : ['', '', ''],
        treatment : '',
        outcome : '',
        followup : '',
        clinicians : []
      };
      // console.log('hi');
      // console.log($scope.case.diagnoses);
      // $scope.newStudentFlag = true;
      // $scope.netId = '';
    });
  }; // end submitCase()

  $scope.deleteCase = function(scase) {
    switch(scase.caseType) {
      case "new":
        $scope.user.numNewCases -= 1;
        break;
      case "recheck":
        $scope.user.numRechecks -= 1;
        break;
      case "emergency":
        $scope.user.numEmergencies -= 1;
        break;
    }
    Cases.delete(scase);
  };

  $scope.debug = function() {
    // var stu = Students.all.$getRecord($scope.case.studentName);
    // console.log('Number of students is: ' + $scope.snames.length);
    // for(var j=0; j < $scope.snames.length; j++) {
    //   console.log($scope.snames[j]);
    // }
    // console.log($scope.snames);
    
    // var modalInstance = $modal.open({
    //   templateUrl: 'newUser.html',
    //   controller: 'ModalInstanceCtrl',
    //   resolve: {
    //     items: function() {
    //       return $scope.items;
    //     }
    //   }
    // });

    // modalInstance.result.then(function(selectedItem) {
    //   $scope.selected = selectedItem;
    //   console.log('Selected item: ' + selectedItem);
    // }, function() {
    //   console.log('Modal dismissed at: ' + new Date());
    // });
  };

  $scope.existingStudentSelected = function() {
    $scope.newStudentFlag = false;
    // console.log('Not a new student!');
  };

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    'show-weeks': false,
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MMMM dd, yyyy'];
  $scope.format = $scope.formats[4];

}); // end controller

app.filter('diagnoses', function() {
  return function(input) {
    var output = [];
    for (var i=0; i < input.length; i++) {
      output[i] = input[i].value;
    }
    return output.join(', ');
  };
});

app.controller('ModalInstanceCtrl', function($scope, $modalInstance, netId) {
  $scope.netId = netId;
  $scope.newStudentName = '';

  $scope.ok = function() {
    var newStudent = {
      netId: $scope.netId,
      name: $scope.newStudentName
    };
    $modalInstance.close(newStudent);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});