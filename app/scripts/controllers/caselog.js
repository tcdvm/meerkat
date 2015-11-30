'use strict';

app.controller('CaseLogCtrl',
  function ($scope, $uibModal, $firebaseObject, $firebaseArray, Cases, Students, Patients, Clinicians) {

  $scope.diagnoses = ['Primary glaucoma', 'Secondary glaucoma', 'Cataract',
  'Anterior uveitis', 'Keratoconjunctivitis sicca', 'Indolent ulcer', 'Ulcerative keratitis',
  'Post-op cataract sx', 'Anterior lens luxation', 'Progressive retinal atrophy',
  'Sudden acquired retinal degeneration', 'Corneal dystrophy', 'Lipid keratopathy',
  'Calcific keratopathy', 'Uveal dermatologic syndrome'];

  $scope.procedures = ['Phacoemulsification (cataract sx)', 'Enucleation', 'Conjunctival graft', 'Biopsy',
  'Third eyelid removal', 'Debridement/Diamond Burr/Grid keratotomy', 'Thermokeratoplasty',
  'Entropion/Ectropion correction', 'Contact lens placement', 'Eyelid mass removal (any technique)'];

  $scope.summaryInstructions = '<b>Type a brief summary of the case.</b> <br>E.g. Indolent ulcer OS, 4th visit, previous debridements failed, today re-debrided, diamond burred, and placed contact lens.';

  // $scope.netId = '';
  $scope.netId = 'tchen';
  $scope.user = undefined;
  $scope.userCases = undefined;
  $scope.cases = Cases.all;
  $scope.radioModel = 'OD';

  $scope.case =  {
    studentId : '',
    studentName : '',
    date: '',
    patientId : '1234' + Math.floor(Math.random()*100),
    patientName : 'Fluffy' + Math.floor(Math.random()*10),
    patientSurname : 'Smith' + Math.floor(Math.random()*10),
    patientSpecies : 'Equine',
    caseType: 'new',
    surgeryProcedure: '',
    diagnoses : [
      {
        diagnosis:'Glaucoma',
        location: 'OS'
      },
      {
        diagnosis:'Cataracts',
        location: 'OD'
      }
    ],
    procedures: [
      {
        procedure: 'Enucleation',
        location: 'OD'
      }
    ],
    studentInvolvement: '2',
    summary: 'Mel populo diceret sapientem at, usu omnis maiorum ut. Ei debet semper sed.',
    clinician : 'Chen'
  };

  /**
   * Logs in user - creates student if necessary, updates chart
   */

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
      var caseTypes = Students.getCaseStats($scope.netId);
      console.log(caseTypes);
      // $scope.chartConfig.series[0].data = [caseTypes.numNewCases, caseTypes.numRechecks, 6, 6, 6, 6];
      console.log('diagnosis stats array');
      Students.refreshCaseStats($scope.netId);
      var caseStats = Students.getCaseStats($scope.netId);
      $scope.chartConfig.series[0].data = caseStats.caseStats;
    } else {
      console.log('No such user! Creating...');
      var modalInstance = $uibModal.open({
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
        newStudent.numProcedures = 0;
        newStudent.numDogs = 0;
        newStudent.numCats = 0;
        newStudent.numHorses = 0;
        newStudent.numOther = 0;
        newStudent.caseStats = {
          AnteriorUveitis: 0,
          Cataracts: 0,
          CornealUlcers: 0,
          Glaucoma: 0,
          KCS: 0,
          RetinalDisease: 0,
          Other: 0
        };
        $scope.user = $firebaseObject(Students.create(newStudent.netId, newStudent));
        // userObject = $firebaseObject(Students.create(newStudent.netId, newStudent));
        // userObject.$bindTo($scope, 'user');
        $scope.userCases = $firebaseArray(Students.getCasesRef($scope.netId));
        $scope.cases = $scope.userCases;
        var caseStats = Students.getCaseStats($scope.netId);
        $scope.chartConfig.series[0].data = caseStats.caseStats;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
      // Students.create($scope.netId, {name: 'me'});
    } // end else (creating new student)


  }; // end login

  /**
   * Logs out user - removes objects and then resets case info
   */

  $scope.logout = function() {
    // Free event listener & memory
    $scope.user.$destroy();
    $scope.user = undefined;
    $scope.userCases.$destroy();
    $scope.cases = Cases.all;
    $scope.case =  {
      studentId : '',
      studentName : '',
      date: '',
      patientId : '1234' + Math.floor(Math.random()*100),
      patientName : 'Fluffy' + Math.floor(Math.random()*10),
      patientSurname : 'Smith' + Math.floor(Math.random()*10),
      patientSpecies : 'Equine',
      caseType: 'new',
      surgeryProcedure: '',
      diagnoses : [
        {
          diagnosis:'Anterior Uveitis',
          location: 'OS'
        },
        {
          diagnosis:'Progressive retinal atrophy',
          location: 'OD'
        }
      ],
      procedures: [
        {
          procedure: 'Enucleation',
          location: 'OD'
        }
      ],
      studentInvolvement: '2',
      // treatment : 'Enucleation',
      // outcome : 'No more issues',
      // followup : 'None',
      summary : 'Lorem ipsum dolor sit amet, eu equidem fastidii salutandi quo, at quo esse purto.',
      clinicians : 'Hendrix'
    };
  }; // end logout
 
  $scope.addDiagnosis = function() {
    $scope.case.diagnoses.push({});
  };

  $scope.addProcedure = function() {
    $scope.case.procedures.push({procedure:'', location:'N/A'});
  };
  /**
   * Submits a case
   */

  $scope.submitCase = function () {

    $scope.case.studentId = $scope.user.netId;
    $scope.case.studentName = $scope.user.name;

    // Delete all empty diagnoses & procedures
    for (var i=$scope.case.diagnoses.length-1; i >= 0; i--) {
      if ($scope.case.diagnoses[i].diagnosis === null || $scope.case.diagnoses[i].diagnosis === '') {
        $scope.case.diagnoses.splice(i, 1);
      }
    }
    for (var j=$scope.case.procedures.length-1; j >= 0; j--) {
      if ($scope.case.procedures[j] === null || $scope.case.procedures[j] === '') {
        $scope.case.procedures.splice(j, 1);
      }
    }

    $scope.case.date = $scope.dt.getTime();

    // Create the case
    Cases.create($scope.case, $scope.user.netId).then(function(ref) {
      var id = ref.key();
      console.log('added record with id ' + id);

      // Update counts for user
      // switch($scope.case.caseType) {
      // case 'new':
      //   $scope.user.numNewCases += 1;
      //   $scope.user.$save();
      //   break;
      // case 'recheck':
      //   $scope.user.numRechecks += 1;
      //   $scope.user.$save();
      //   break;
      // case 'recheck':
      //   $scope.user.numSurgeries += 1;
      //   $scope.user.$save();
      //   break;
      // }
      
      // Add case to student's cases array & patient's
      Students.addCase($scope.case.studentId, id, $scope.case);
      Students.refreshCaseStats($scope.netId);
      var caseStats = Students.getCaseStats($scope.netId);
      $scope.chartConfig.series[0].data = caseStats.caseStats;
      Patients.addCase($scope.case.patientId, id, $scope.case);
      Clinicians.addCase($scope.case.clinician, id, $scope.case);
      Clinicians.refreshCaseStats($scope.case.clinician);

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
        diagnoses : [
          {
            diagnosis:'Anterior uveitis',
            location: 'OS'
          },
          {
            diagnosis:'Progressive retinal atrophy',
            location: 'OU'
          }
        ],
        procedures: [
          {
            procedure: 'Enucleation',
            location: 'OD'
          }
        ],
        studentInvolvement: '2',
        // treatment : 'Enucleation',
        // outcome : 'No more issues',
        // followup : 'None',
        summary : 'Lorem ipsum dolor sit amet, eu equidem fastidii salutandi quo, at quo esse purto.',
        clinician : 'Newbold'
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

  /**
   * Submits a case
   */

  $scope.deleteCase = function(scase) {
    Cases.deleteCase(scase.$id);
    Patients.deleteCase(scase.patientId, scase);
    Students.deleteCase(scase.studentId, scase);
    Students.refreshCaseStats($scope.netId);
    Clinicians.deleteCase(scase.clinician, scase);
    Clinicians.refreshCaseStats(scase.clinician);
    var caseStats = Students.getCaseStats($scope.netId);
    $scope.chartConfig.series[0].data = caseStats.caseStats;
  };


  $scope.today = function() {
    $scope.dt = new Date();
    $scope.dt.setHours(0,0,0,0);
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
  
  // $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];

  $scope.chartConfig = {
    options: {
        chart: {
            polar: true,
            type: 'line'
          },
          exporting: {
            enabled: false
          }
        }, // end options
        size: {
          height: '300'
        },

        title: {
          text: '',
          style: {
            display: 'none'
          }
        },
        subtitle: {
          text: '',
          style: {
            display: 'none'
          }
        },
      
        pane: {
          size: '80%'
        },

        xAxis: {
          categories: ['KCS', 'Corneal Ulcers', 'Glaucoma', 'Cataracts', 'Anterior Uveitis', 'Retinal Disease', 'Other'],
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
          
        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
        },
      
        tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
        },
      
        legend: {
          enabled: false,
        },
      
        series: [{
            name: 'cases',
            pointPlacement: 'on',
            showInLegend: false
          }]
        };

}); // end controller

app.filter('prettyArrayOutput', function() {
  return function(input) {
    var diagnoses = [];
    for (var i = 0; i < input.length; i++) {
      diagnoses.push(input[i].diagnosis);
    }
    var output = diagnoses.join(', ');
    return output;
  };
});

app.filter('capitalize', function() {
  return function(input) {
    if (input !== null) {
      input = input.toLowerCase();
      return input.substring(0,1).toUpperCase()+input.substring(1);
    }
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