'use strict';

app.factory('Cases', function($firebase, $firebaseArray, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL + 'studentcases');
  // var cases = $firebase(ref.child('studentcases')).$asArray();
  var cases = $firebaseArray(ref);

  var Case = {
    all: cases,
    create: function(studentcase) {
      // console.log(studentcase);
      return cases.$add(studentcase);
    },
    get: function(caseId) {
      return $firebase(ref.child('studentcases').child(caseId)).$asObject();
    },
    delete: function(studentcase) {
      return cases.$remove(studentcase);
    }
  };

  return Case;

});