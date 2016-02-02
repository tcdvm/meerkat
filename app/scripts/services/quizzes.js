'use strict';

app.factory('Quizzes', function($firebase, $firebaseArray, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL + 'quiz');
  // var cases = $firebase(ref.child('studentcases')).$asArray();
  var quizlets = $firebaseArray(ref);

  var Quiz = {
    all: quizlets,
    add: function(quiz) {
      console.log(quiz);
      return quizlets.$add(quiz);
    },
    // get: function(caseId) {
    //   return $firebase(ref.child('studentcases').child(caseId)).$asObject();
    // },
    // delete: function(studentcase) {
    //   return cases.$remove(studentcase);
    // },
    // deleteCase: function(caseId) {
    //   var onComplete = function(error) {
    //     if (error) {
    //       console.log('Case deleteCase synchronization failed');
    //     } else {
    //       console.log('Case deleteCase synchronization succeeded');
    //     }
    //   };
    //   var caseRef = ref.child(caseId);
    //   console.log('case Id: ' + caseId);
    //   caseRef.remove(onComplete);
    // }
  };

  return Quiz;

});