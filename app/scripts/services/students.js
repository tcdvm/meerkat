'use strict';

app.factory('Students', function($firebase, $firebaseObject, $firebaseArray, FIREBASE_URL) {
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
    }
  };

  return Student;
});