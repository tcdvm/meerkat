'use strict';

app.factory('Students', function($firebase, FIREBASE_URL) {
  var studentsRef = new Firebase(FIREBASE_URL + '/students');
  var studentList = $firebase(studentsRef).$asArray();

  var Student = {
    all: studentList,
    create: function(netId, newstudent) {
      var newStudentRef = studentsRef.child(netId);
      var sync = $firebase(newStudentRef);
      sync.$set(newstudent);
      return true;
    },
    get: function(studentId) {
      return $firebase(studentsRef.child(studentId)).$asObject();
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