'use strict';

app.controller('CaseLogCtrl',
  function ($scope, $modal, $firebaseObject, $firebaseArray, Cases, Students, Patients) {

  // $scope.netId = '';
  $scope.netId = 'tchen';
  $scope.user = undefined;
  $scope.userCases = undefined;
  $scope.cases = Cases.all;

  $scope.login = function () {
    console.log('in login!');
    // Check if netID (student) exists
    if (Students.checkIfUserExists($scope.netId) !== null) {
      console.log('NetID exists!');
      $scope.user = $firebaseObject(Students.getRef($scope.netId));
      // userObject = $firebaseObject(Students.getRef($scope.netId));
      // userObject.$bindTo($scope, 'user');
      $scope.userCases = $firebaseArray(Students.getCasesRef($scope.netId));
      $scope.cases = $scope.userCases;
    } else {
      console.log('No such user! Creating...');
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
        console.log('Net ID & Student Name: ' + newStudent.netId + ' ' + newStudent.name);
        newStudent.numNewCases = 0;
        newStudent.numRechecks = 0;
        $scope.user = $firebaseObject(Students.create(newStudent.netId, newStudent));
        // userObject = $firebaseObject(Students.create(newStudent.netId, newStudent));
        // userObject.$bindTo($scope, 'user');
        $scope.userCases = $firebaseArray(Students.getCasesRef($scope.netId));
        $scope.cases = $scope.userCases;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
      // Students.create($scope.netId, {name: 'me'});
    }

  }; // end login

 
  $scope.case =  {
    studentId : '',
    studentName : '',
    date: '',
    patientId : '1234' + Math.floor(Math.random()*100),
    patientName : 'Fluffy' + Math.floor(Math.random()*10),
    patientSurname : 'Smith' + Math.floor(Math.random()*10),
    patientSpecies : 'Canine',
    caseType: 'new',
    surgeryProcedure: '',
    diagnoses : ['Glaucoma', 'Cataracts', ''],
    treatment : 'Enucleation',
    outcome : 'No more issues',
    followup : 'None',
    clinicians : ['chen']
  };

  $scope.submitCase = function () {

    $scope.case.studentId = $scope.user.netId;
    $scope.case.studentName = $scope.user.name;

    // Delete all empty diagnoses
    for (var i=$scope.case.diagnoses.length-1; i >= 0; i--) {
      if ($scope.case.diagnoses[i] === null || $scope.case.diagnoses[i] === '') {
        $scope.case.diagnoses.splice(i, 1);
      }
    }

    $scope.case.date = $scope.dt.getTime();
    // console.log($scope.dt.getTime());

    // Create the case
    Cases.create($scope.case, $scope.user.netId).then(function(ref) {
      var id = ref.key();
      console.log('added record with id ' + id);

      // Update counts for user
      switch($scope.case.caseType) {
      case 'new':
        $scope.user.numNewCases += 1;
        $scope.user.$save();
        break;
      case 'recheck':
        $scope.user.numRechecks += 1;
        $scope.user.$save();
        break;
      }
      
      // Add case to student's cases array & patient's
      Students.addCase($scope.case.studentId, id, $scope.case);
      Patients.addCase($scope.case.patientId, id, $scope.case);

      $scope.case =  {
        studentId : '',
        studentName : '',
        date: '',
        patientId : '1234' + Math.floor(Math.random()*100),
        patientName : 'Fluffy' + Math.floor(Math.random()*10),
        patientSurname : 'Smith' + Math.floor(Math.random()*10),
        patientSpecies : 'Canine',
        caseType: 'new',
        surgeryProcedure: '',
        diagnoses : ['Glaucoma', 'Cataracts', ''],
        treatment : 'Enucleation',
        outcome : 'No more issues',
        followup : 'None',
        clinicians : ['chen']
        // studentId: '',
        // studentName: '',
        // date: '',
        // patientId : '',
        // patientName : '',
        // patientSurname : '',
        // patientSpecies : '',
        // caseType: '',
        // surgeryProcedure: '',
        // diagnoses : ['', '', ''],
        // treatment : '',
        // outcome : '',
        // followup : '',
        // clinicians : []
      };
    });
  }; // end submitCase()

  $scope.deleteCase = function(scase) {
    if($scope.user) {
      console.log('going to decrement');
      switch(scase.caseType) {
      case 'new':
        $scope.user.numNewCases -= 1;
        $scope.user.$save();
        break;
      case 'recheck':
        $scope.user.numRechecks -= 1;
        $scope.user.$save();
        break;
      }
    }
    Cases.deleteCase(scase.$id);
    Patients.deleteCase(scase.patientId, scase);
    Students.deleteCase(scase.studentId, scase);
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