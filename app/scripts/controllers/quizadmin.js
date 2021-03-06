'use strict';

app.controller('QuizAdminCtrl',
  function ($scope, $firebaseObject, $firebaseArray, Quizzes) {
    $scope.quizlet ={
      category: 'cornea',
      question: 'What is the third letter of the alphabet?',
      answers: ['a', 'b', 'c', 'd'],
      correctAnswer: undefined,
      totalTries: 0,
      correctTries: 0
    } ;

    $scope.quizzes = Quizzes.all;

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