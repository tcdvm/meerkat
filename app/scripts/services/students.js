'use strict';

app.factory('Students', function($firebase, $firebaseObject, $firebaseArray, FIREBASE_URL, Diagnoses) {
  var studentsRef = new Firebase(FIREBASE_URL + 'students');
  var studentList = $firebaseArray(studentsRef);

  var Student = {
    all: studentList,
    create: function(netId, newstudent) {
      var newStudentRef = studentsRef.child(netId);
      newStudentRef.set(newstudent);
      return newStudentRef;
    },
    getRef: function(netId) {
      return studentsRef.child(netId);
    },
    delete: function(student) {
      return studentList.$remove(student);
    },
    netIds: function() {
      var studentNamesArray = [];

      for(var k = 0; k < studentList.length; k++) {
        studentNamesArray.push(studentList[k].netId);
      }

      return studentNamesArray;
    },
    checkIfUserExists: function(studentId) {
      console.log('Checking if ' + studentId + ' exists...');
      console.log(studentList.$getRecord(studentId));
      return studentList.$getRecord(studentId);
    },
    getCasesRef: function(studentId) {
      return studentsRef.child(studentId).child('cases');
    },
    addCase: function(studentId, caseId, newCase) {
      var c = {};
      var caseDetails = newCase;
      // c[caseId] = newCase.patientId;
      c[caseId] = caseDetails;
      studentsRef.child(studentId).child('cases').update(c);
    },
    deleteCase: function(studentId, scase) {
      var onComplete = function(error) {
        if (error) {
          console.log('Student deleteCase synchronization failed');
        } else {
          console.log('Student deleteCase synchronization succeeded');
        }
      };
      var caseRef = studentsRef.child(studentId).child('cases').child(scase.$id);
      caseRef.remove(onComplete);
    },
    getCaseStats: function(studentId) {
      var caseTypes = {};
      studentsRef.child(studentId).on('value', function(snapshot) {
        var studentStats = snapshot.val();
        // console.log('student stats:' + studentStats);
        caseTypes.numNewCases = studentStats.numNewCases;
        caseTypes.numRechecks = studentStats.numRechecks;
        var caseStatsObj = studentStats.caseStats;
        // Order of array: KCS', 'Corneal Ulcers', 'Glaucoma', 'Cataracts', 'Anterior Uveitis', 'Retinal Disease'
        var caseStatsArray = [caseStatsObj.KCS, caseStatsObj.CornealUlcers, caseStatsObj.Glaucoma,
          caseStatsObj.Cataracts, caseStatsObj.AnteriorUveitis, caseStatsObj.RetinalDisease];
        caseTypes.caseStats = caseStatsArray;
      }, function(errorObject) {
        console.log('Error in getting stats' + errorObject.code);
      });
      return caseTypes;
    },
    refreshCaseStats: function(studentId) {
      var newCaseCount = 0;
      var recheckCaseCount = 0;
      var procedureCount = 0;
      var dogCount = 0;
      var catCount = 0;
      var horseCount = 0;
      var otherCount = 0;
      var diagnosisCount = {
        KCS: 0,
        CornealUlcers: 0,
        Glaucoma: 0,
        Cataracts: 0,
        AnteriorUveitis: 0,
        RetinalDisease: 0
      };
      // var diagnosisStats = [];

      // Go through each case - get if new or recheck, compile case types (if compiled)
      studentsRef.child(studentId).child('cases').once('value', function(snapshot) {
        snapshot.forEach(function(caseSnapshot) {
          // Compile case type stats
          var scase = caseSnapshot.val();
          switch(scase.caseType) {
          case 'new':
            newCaseCount += 1;
            break;
          case 'recheck':
            recheckCaseCount += 1;
            break;
          case 'procedure':
            procedureCount += 1;
            break;
          }

          // Compile case type stats
          scase.diagnoses.forEach(function(diagnosis) {
            var category = Diagnoses.category(diagnosis);
            if(category !== '') {
              diagnosisCount[category] += 1;
            } else {
              console.log('Diagnosis: ' + diagnosis + ' not found.');
            }
          });

          switch(scase.patientSpecies) {
          case 'Canine':
            dogCount += 1;
            break;
          case 'Feline':
            catCount += 1;
            break;
          case 'Equine':
            horseCount += 1;
            break;
          case 'Other':
            otherCount += 1;
            break;
          }

        }); // end forEach

        console.log('refreshing cases - new, rechecks, procedures:' + newCaseCount + recheckCaseCount + procedureCount);
        studentsRef.child(studentId).child('numNewCases').set(newCaseCount);
        studentsRef.child(studentId).child('numRechecks').set(recheckCaseCount);
        studentsRef.child(studentId).child('numProcedures').set(procedureCount);
        studentsRef.child(studentId).child('numDogs').set(dogCount);
        studentsRef.child(studentId).child('numCats').set(catCount);
        studentsRef.child(studentId).child('numHorses').set(horseCount);
        studentsRef.child(studentId).child('numOther').set(otherCount);
        studentsRef.child(studentId).child('caseStats').set(diagnosisCount);
        // for(var index in diagnosisCount) {
        //   diagnosisStats.push(diagnosisCount[index]);
        //   // console.log(index + diagnosisCount[index]);
        // }
        // diagnosisCount.forEach(function(diagnosis) {
        //   diagnosisStats.push(diagnosisCount[diagnosis]);
        // });
        // console.log(diagnosisStats);
      });
      // return diagnosisStats;
    } // end refreshCaseStats
  };

  return Student;
});