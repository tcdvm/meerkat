'use strict';

app.factory('Students', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL) {
  var studentsRef = new Firebase(FIREBASE_URL + 'students');
  var studentList = $firebaseArray(studentsRef);

  var Student = {
    all: studentList,
    create: function(netId, newstudent) {
      var newStudentRef = studentsRef.child(netId);
      var sync = $firebase(newStudentRef);
      sync.$set(newstudent);
      return sync.$asObject();
    },
    get: function(netId) {
      return $firebaseObject(studentsRef.child(netId));
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
    }
  };

  return Student;
});