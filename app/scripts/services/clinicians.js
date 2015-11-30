'use strict';

app.factory('Clinicians', function($firebase, $firebaseObject, $firebaseArray, FIREBASE_URL, Diagnoses) {
  var orderedCliniciansRefQ = new Firebase(FIREBASE_URL + 'clinicians').orderByChild('vieworder');
  var cliniciansRef = new Firebase(FIREBASE_URL + 'clinicians');
  var cliniciansList = $firebaseArray(cliniciansRef);
  var orderedCliniciansList = $firebaseArray(orderedCliniciansRefQ);

  var Clinician = {
    all: cliniciansList,
    orderedAll: orderedCliniciansList,
    create: function(name) {
      var newCliniciansRef = cliniciansRef.child(name);
      var newclinician = {
        numNewCases: 0,
        numRechecks: 0,
        numProcedures: 0,
        numDogs: 0,
        numCats: 0,
        numHorses: 0,
        numOther: 0,
        caseStats: {
          AnteriorUveitis: 0,
          Cataracts: 0,
          CornealUlcers: 0,
          Glaucoma: 0,
          KCS: 0,
          RetinalDisease: 0,
          Other: 0
        }
      };
      newCliniciansRef.set(newclinician);
      return newCliniciansRef;
    },
    getRef: function(name) {
      return cliniciansRef.child(name);
    },
    delete: function(name) {
      return cliniciansList.$remove(name);
    },
    getCasesRef: function(name) {
      return cliniciansRef.child(name).child('cases');
    },
    addCase: function(name, caseId, newCase) {
      var c = {};
      var caseDetails = newCase;
      // c[caseId] = newCase.patientId;
      c[caseId] = caseDetails;
      cliniciansRef.child(name).child('cases').update(c);
    },
    deleteCase: function(name, scase) {
      var onComplete = function(error) {
        if (error) {
          console.log('Clinician deleteCase synchronization failed');
        } else {
          console.log('Clinician deleteCase synchronization succeeded');
        }
      };
      var caseRef = cliniciansRef.child(name).child('cases').child(scase.$id);
      caseRef.remove(onComplete);
    },
    getCaseStats: function(name) {
      var caseTypes = {};
      cliniciansRef.child(name).on('value', function(snapshot) {
        var clinicianStats = snapshot.val();
        // console.log('student stats:' + studentStats);
        caseTypes.numNewCases = clinicianStats.numNewCases;
        caseTypes.numRechecks = clinicianStats.numRechecks;
        var caseStatsObj = clinicianStats.caseStats;
        // Order of array: KCS', 'Corneal Ulcers', 'Glaucoma', 'Cataracts', 'Anterior Uveitis', 'Retinal Disease', 'Other'
        var caseStatsArray = [caseStatsObj.KCS, caseStatsObj.CornealUlcers, caseStatsObj.Glaucoma,
          caseStatsObj.Cataracts, caseStatsObj.AnteriorUveitis, caseStatsObj.RetinalDisease, caseStatsObj.Other];
        caseTypes.caseStats = caseStatsArray;
      }, function(errorObject) {
        console.log('Clinicians: Error in getting stats' + errorObject.code);
      });
      return caseTypes;
    },
    refreshCaseStats: function(name) {
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
        RetinalDisease: 0,
        Other: 0
      };
      // var diagnosisStats = [];

      // Go through each case - get if new or recheck, compile case types (if compiled)
      cliniciansRef.child(name).child('cases').once('value', function(snapshot) {
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
          }

          if(scase.surgeryProcedure) {
            procedureCount += 1;
          }

          // Compile case type stats
          scase.diagnoses.forEach(function(diagnosis) {
            var category = Diagnoses.category(diagnosis.diagnosis);
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

        console.log('Clinicians: refreshing cases - new, rechecks, procedures:' + newCaseCount + recheckCaseCount + procedureCount);
        cliniciansRef.child(name).child('numNewCases').set(newCaseCount);
        cliniciansRef.child(name).child('numRechecks').set(recheckCaseCount);
        cliniciansRef.child(name).child('numProcedures').set(procedureCount);
        cliniciansRef.child(name).child('numDogs').set(dogCount);
        cliniciansRef.child(name).child('numCats').set(catCount);
        cliniciansRef.child(name).child('numHorses').set(horseCount);
        cliniciansRef.child(name).child('numOther').set(otherCount);
        cliniciansRef.child(name).child('caseStats').set(diagnosisCount);
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

  return Clinician;
});