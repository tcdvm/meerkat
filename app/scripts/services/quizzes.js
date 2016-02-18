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
    getRandomQuestion: function() {
      return quizlets[Math.floor(Math.random()*quizlets.length)];
    },
    getQuestion: function(index) {
      return quizlets[index];
    }

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
    //         } else {
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

app.factory('StudentQuizzes', function($firebase, $firebaseArray, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL + 'studentquizzes');

  var studentquizzes = $firebaseArray(ref);

  var StudentQuiz = {
    all: studentquizzes,
    addStudent: function (netId) {
      var newStudentRef = ref.child(netId);
      var newstudent = {
        quizIndex: 0,
        completedAll: false,
        questionsAnswered: []
      };
      newStudentRef.set(newstudent);
      return newStudentRef;
    },
    getStudent: function(netId) {
      return studentquizzes.$getRecord(netId);
    },
    getStudentQuizIndexRef: function(netId) {
      return ref.child(netId).child('quizIndex');
    },
    setQuizComplete: function(netId) {
      var studentRef = ref.child(netId).child('completedAll');
      studentRef.transaction(function() {
        return true;
      });
    }
  };

  return StudentQuiz;

});