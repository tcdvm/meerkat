'use strict';

app.controller('QuizAdminCtrl',
  function ($scope, $firebaseObject, $firebaseArray, Quizzes) {
    $scope.quizlet ={
      category: 'cornea',
      question: 'What is the third letter of the alphabet?',
      answers: ['a', 'b', 'c'],
      correctAnswer: '2'
    } ;

    $scope.addAnswer = function() {
      $scope.quizlet.answers.push('a');
    };

    $scope.removeAnswer = function() {
      $scope.quizlet.answers.splice($scope.quizlet.answers.length-1);
    };

    $scope.addQuizlet = function() {
      Quizzes.add($scope.quizlet);
    };

  });