'use strict';

app.controller('QuizAdminCtrl',
  function ($scope, $firebaseObject, $firebaseArray) {
    $scope.category = 'kcs';
    $scope.question = 'What is the second letter of the alphabet?';
    $scope.answers = ['a', 'b', 'c', 'd'];
    $scope.correctAnswer = null;

    $scope.addAnswer = function() {
      $scope.answers.push('a');
    };

    $scope.removeAnswer = function() {
      $scope.answers.splice($scope.answers.length-1);
    };

  });