'use strict';

app.factory('Patients', function($firebase, $firebaseObject, $firebaseArray, $uibModal, FIREBASE_URL) {
  var patientsRef = new Firebase(FIREBASE_URL + 'patients');
  // var patientsList = $firebaseArray(patientsRef);

  var Patient = {
    // all: patientsList,
    // create: function(patientId, patientInfo) {
    //   var newPatientRef = patientsRef.child(patientId);
    //   newPatientRef.set(patientInfo);
    //   return newPatientRef;
    // },
    getRef: function(patientId) {
      console.log('getref: ' + patientId);
      return patientsRef.child(patientId);
    },
    // delete: function(patientId) {
    //   return patientsList.$remove(patientId);
    // },
    // netIds: function() {
    //   var studentNamesArray = [];

    //   for(var k = 0; k < studentList.length; k++) {
    //     studentNamesArray.push(studentList[k].netId);
    //   }

    //   return studentNamesArray;
    // },
    // checkIfPatientExists: function(patientId) {
    //   console.log('Checking if ' + patientId + ' exists...');
    //   console.log(patientsList.$getRecord(patientId));
    //   return patientsList.$getRecord(patientId);
    // },
    getCasesRef: function(patientId) {
      return patientsRef.child(patientId).child('cases');
    },
    addCase: function(patientId, id, scase) {
      var c = {};
      c[id] = scase;
      console.log('In addcase');
      console.log(patientId);
      // patientsRef.child(patientId).child('cases').update(c);
      patientsRef.child(patientId).once('value', function(snapshot) {
        if(snapshot.val()) {
          console.log('PatientId ' + patientId + ' exists!');
        } else {
          console.log('PatientId ' + patientId + ' does NOT exist! Creating...');
          var newPatient =  {};
          newPatient.patientId = scase.patientId;
          newPatient.name = scase.patientName;
          newPatient.surname = scase.patientSurname;
          newPatient.species = scase.patientSpecies;

          patientsRef.child(patientId).update(newPatient);
        }
        patientsRef.child(patientId).child('cases').update(c);
      }, function(errorObject) {
        console.log('The read failed: ' + errorObject.code);
      });
    },
    deleteCase: function(patientId, scase) {
      var onComplete = function(error) {
        if (error) {
          console.log('Patient deleteCase synchronization failed');
        } else {
          console.log('Patient deleteCase synchronization succeeded');
        }
      };
      var caseRef = patientsRef.child(patientId).child('cases').child(scase.$id);
      caseRef.remove(onComplete);
      // If no cases associated with patient, delete patient
      caseRef.parent().once('value', function(snapshot) {
        if(!snapshot.val()) {
          console.log('Patient has no cases, deleting...');
          caseRef.parent().parent().remove(onComplete);
        }
      }, function(errorObject) {
        console.log('The read failed: ' + errorObject.code);
      });
    },
    openPatientModal: function(patientId) {
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
    }
  };

  return Patient;
});