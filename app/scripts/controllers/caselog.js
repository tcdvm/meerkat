'use strict';

app.controller('CaseLogCtrl',
  function ($scope, $uibModal, $firebaseObject, $firebaseArray, Cases, Students, Patients, Clinicians, Quizzes, StudentQuizzes) {

  $scope.diagnoses = ['Primary glaucoma', 'Secondary glaucoma', 'Cataract',
  'Anterior uveitis', 'Keratoconjunctivitis sicca', 'Indolent ulcer', 'Ulcerative keratitis',
  'Post-op cataract sx', 'Anterior lens luxation', 'Progressive retinal atrophy',
  'Sudden acquired retinal degeneration', 'Corneal dystrophy', 'Lipid keratopathy',
  'Calcific keratopathy', 'Uveodermatologic syndrome', 'Diabetes mellitus'];

  $scope.procedures = ['Phacoemulsification (cataract sx)', 'Enucleation', 'Conjunctival graft', 'Biopsy',
  'Third eyelid removal', 'Debridement/Diamond Burr/Grid keratotomy', 'Thermokeratoplasty',
  'Entropion/Ectropion correction', 'Contact lens placement', 'Eyelid mass removal (any technique)'];

  $scope.summaryInstructions = '<b>Type a brief summary of the case.</b> <br>E.g. Indolent ulcer OS, 4th visit, previous debridements failed, today re-debrided, diamond burred, and placed contact lens.';
  $scope.loggedIn = false;
  $scope.loginText = 'Login';

  $scope.cases = Cases.recentCases();

  $scope.cases.$loaded();

  $scope.updateCaseFlag = false;

  // Store variables for the case (in case they are changed)
  $scope.updateCaseInfo = {
    caseId: '',
    studentId: '',
    patientId: '',
    clinician: ''
  };

  $scope.netId = '';
  $scope.user = undefined;
  $scope.userCases = undefined;
  $scope.radioModel = 'OD';
  $scope.quizAnswer = undefined;
  $scope.quizlet = {
    quiz: undefined,
    quizIndex: undefined,
    userAnswer: undefined,
    buttonPrompt: 'Answer',
    answersOn: true,
    noMore: false
  };

  $scope.studentquiz = undefined;

  function resetCase() {
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
      diagnoses : [
        {
          diagnosis:'',
          location: ''
        },
      ],
      procedures: [
        {
          procedure: '',
          location: ''
        }
      ],
      studentInvolvement: '',
      summary: '',
      clinician : ''
    };
  }

  resetCase();

  $scope.loginOrOut = function() {
    if($scope.loggedIn) {
      $scope.logout();
      $scope.loginText = 'Login';
    } else if(!$scope.loggedIn) {
      $scope.login();
      $scope.loginText = 'Logout';
    }
  };

  /**
   * Logs in user - creates student if necessary, updates chart
   */

  $scope.login = function () {
    if (Students.checkIfUserExists($scope.netId) !== null) {
      $scope.user = $firebaseObject(Students.getRef($scope.netId));

      $scope.userCases = $firebaseArray(Students.getCasesRef($scope.netId));
      $scope.cases = $scope.userCases;

      Students.refreshCaseStats($scope.netId);
      var caseStats = Students.getCaseStats($scope.netId);
      $scope.chartConfig.series[0].data = caseStats.caseStats;
      StudentQuizzes.getStudent($scope.netId);
      $firebaseObject(StudentQuizzes.getStudentQuizIndexRef($scope.netId)).$bindTo($scope, 'quizlet.quizIndex').then(function(){
        $scope.quizlet.quiz = Quizzes.getQuestion($scope.quizlet.quizIndex.$value);
        if(!$scope.quizlet.quiz) {
          console.log(StudentQuizzes.getStudentQuizIndexRef($scope.netId));
          $scope.quizlet.noMore = true;
        }
      });
      $scope.loggedIn = true;
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
        $scope.userCases = $firebaseArray(Students.getCasesRef($scope.netId));
        $scope.cases = $scope.userCases;
        var caseStats = Students.getCaseStats($scope.netId);
        $scope.chartConfig.series[0].data = caseStats.caseStats;
        StudentQuizzes.addStudent(newStudent.netId);
        $scope.loggedIn = true;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    } // end else (creating new student)

    // Get question for quiz
  }; // end login

  /**
   * Logs out user - removes objects and then resets case info
   */

  $scope.logout = function() {
    // Free event listener & memory
    $scope.user.$destroy();
    $scope.user = undefined;
    $scope.userCases.$destroy();
    $scope.cases = Cases.recentCases();

    resetCase();

    $scope.loggedIn = false;
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

      // Add case to student's cases array & patient's
      Students.addCase($scope.case.studentId, id, $scope.case);
      Students.refreshCaseStats($scope.netId);
      var caseStats = Students.getCaseStats($scope.netId);
      $scope.chartConfig.series[0].data = caseStats.caseStats;
      Patients.addCase($scope.case.patientId, id, $scope.case);
      Clinicians.addCase($scope.case.clinician, id, $scope.case);
      Clinicians.refreshCaseStats($scope.case.clinician);

      resetCase();

    });
  }; // end submitCase()

  $scope.deleteCase = function(scase) {
    Cases.deleteCase(scase.$id);
    Patients.deleteCase(scase.patientId, scase.$id);
    Students.deleteCase(scase.studentId, scase.$id);
    Students.refreshCaseStats($scope.netId);
    Clinicians.deleteCase(scase.clinician, scase.$id);
    Clinicians.refreshCaseStats(scase.clinician);
    var caseStats = Students.getCaseStats($scope.netId);
    $scope.chartConfig.series[0].data = caseStats.caseStats;
  };

  $scope.editCase = function(scase) {
    var caseToEdit = Cases.get(scase.$id);
    console.log(caseToEdit);
    $scope.case = caseToEdit;
    $scope.dt = new Date(caseToEdit.date);
    $scope.updateCaseFlag = true;

    $scope.updateCaseInfo.caseId = scase.$id;
    $scope.updateCaseInfo.studentId = caseToEdit.studentId;
    $scope.updateCaseInfo.patientId = caseToEdit.patientId;
    $scope.updateCaseInfo.clinician = caseToEdit.clinician;

    // $scope.case.patientId = caseToEdit.patientId;
    // console.log($scope.case.patientId);
  };

  $scope.updateCase = function() {
    console.log($scope.updateCaseInfo);
    // Basically, delete the case first
    Cases.deleteCase($scope.updateCaseInfo.caseId);
    Patients.deleteCase($scope.updateCaseInfo.patientId, $scope.updateCaseInfo.caseId);
    Students.deleteCase($scope.updateCaseInfo.studentId, $scope.updateCaseInfo.caseId);
    Students.refreshCaseStats($scope.updateCaseInfo.studentId);
    Clinicians.deleteCase($scope.updateCaseInfo.clinician, $scope.updateCaseInfo.caseId);
    Clinicians.refreshCaseStats($scope.updateCaseInfo.clinician);
    var caseStats = Students.getCaseStats($scope.netId);
    $scope.chartConfig.series[0].data = caseStats.caseStats;

    // Then re-add the case
    $scope.submitCase();

    $scope.updateCaseFlag = false;
    $scope.updateCaseInfo = {
      caseId: '',
      studentId: '',
      patientId: '',
      clinician: ''
    };
  };

  $scope.cancelEdit = function() {
    resetCase();
    $scope.updateCaseFlag = false;
    $scope.today();
    $scope.updateCaseInfo = {
      caseId: '',
      studentId: '',
      patientId: '',
      clinician: ''
    };
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

  $scope.openPatientModal = function(patientId) {
    console.log('opening patient modal with ' + patientId);
    Patients.openPatientModal(patientId);
  };

  $scope.alerts = [
    { type: 'danger', msg: 'Wrong. So..so..wrong.'},
    { type: 'success', msg: 'Correct!'}
  ];

  $scope.activeAlert = undefined;

  $scope.submitAnswer = function() {
    if($scope.quizlet.buttonPrompt === 'Next Question') {
      // Increase index, turn on answers, reset answer, change prompt, get question
      console.log($scope.quizlet.quizIndex);
      $scope.quizlet.quizIndex.$value++;
      console.log($scope.quizlet.quizIndex);
      if($scope.quizlet.quizIndex.$value === Quizzes.all.length) {
        $scope.quizlet.noMore = true;
        $scope.activeAlert = undefined;
        StudentQuizzes.setQuizComplete($scope.netId);
      } else {
        $scope.quizlet.answersOn = true;
        $scope.quizlet.buttonPrompt = 'Answer';
        $scope.quizlet.userAnswer = undefined;
        $scope.activeAlert = undefined;
        $scope.quizlet.quiz = Quizzes.getQuestion($scope.quizlet.quizIndex.$value);
      }
    } else if($scope.quizlet.buttonPrompt === 'Answer') {
      if ($scope.quizlet.userAnswer === $scope.quizlet.quiz.correctAnswer) {
        $scope.activeAlert = $scope.alerts[1];
        $scope.quizlet.buttonPrompt = 'Next Question';
        $scope.quizlet.answersOn = false;
        Quizzes.answerSubmitted($scope.quizlet.quizIndex.$value, $scope.quizlet.userAnswer);
        StudentQuizzes.addAnswer($scope.quizlet, $scope.netId);
        console.log('Correct answer');
      } else {
        $scope.activeAlert = $scope.alerts[0];
        $scope.quizlet.buttonPrompt = 'Try Again?';
        $scope.quizlet.answersOn = false;
        Quizzes.answerSubmitted($scope.quizlet.quizIndex.$value, $scope.quizlet.userAnswer);
        StudentQuizzes.addAnswer($scope.quizlet, $scope.netId);
        console.log('incorrect');
      }
    } else if($scope.quizlet.buttonPrompt === 'Try Again?') {
      $scope.activeAlert = undefined;
      $scope.quizlet.answersOn = true;
      $scope.quizlet.userAnswer = undefined;
      $scope.activeAlert = undefined;
      $scope.quizlet.buttonPrompt = 'Answer';
    }
  };

}); // end controller

app.filter('prettyDiagnosisArrayOutput', function() {
  return function(input) {
    if (!input) {
      return;
    }
    var diagnoses = [];
    for (var i = 0; i < input.length; i++) {
      if (input[i].location !== 'N/A') {
        diagnoses.push(input[i].diagnosis + ' ' + input[i].location);
      } else {
        diagnoses.push(input[i].diagnosis);
      }
    }
    var output = diagnoses.join(', ');
    return output;
  };
});

app.filter('prettyProcedureArrayOutput', function() {
  return function(input) {
    var diagnoses = [];
    for (var i = 0; i < input.length; i++) {
      diagnoses.push(input[i].procedure + ' ' + input[i].location);
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