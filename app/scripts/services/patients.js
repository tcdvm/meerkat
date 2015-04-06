'use strict';

app.factory('Patients', function($firebase, $firebaseObject, $firebaseArray, FIREBASE_URL) {
  var patientsRef = new Firebase(FIREBASE_URL + 'patients');
  var patientsList = $firebaseArray(patientsRef);

  var Patient = {
    all: patientsList,
    create: function(patientId, patientInfo) {
      var newPatientRef = patientsRef.child(patientId);
      newPatientRef.set(patientInfo);
      return newPatientRef;
    },
    getRef: function(patientId) {
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
    checkIfPatientExists: function(patientId) {
      console.log('Checking if ' + patientId + ' exists...');
      console.log(patientsList.$getRecord(patientId));
      return patientsList.$getRecord(patientId);
    },
    getCasesRef: function(patientId) {
      return patientsRef.child(patientId).child('cases');
    }
  };

  return Patient;
});