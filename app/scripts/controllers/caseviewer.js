'use strict';

app.controller('CaseViewerCtrl',
	function ($scope, $firebaseObject, $firebaseArray, Cases) {
		var newCases = {};
		var recheckCases = {};
		var procedureCases = {};

		var newCasesArray = [];
		var recheckCasesArray = [];
		var procedureCasesArray = [];

		$scope.caseArray = []; // used for pagination
		$scope.cases = Cases.all;
		$scope.cases.$loaded().then(function() {
			for (var i = 0; i < $scope.cases.length; i++) {
			  $scope.caseArray.push($scope.cases[i]);
			  // console.log(new Date($scope.cases[i].date).setHours(0,0,0,0));
			  var dateKey = new Date($scope.cases[i].date).setHours(0,0,0,0);
			  switch($scope.cases[i].caseType) {
        case 'new':
          newCases[dateKey] = (newCases[dateKey] || 0) + 1;
          break;
        case 'recheck':
          recheckCases[dateKey] = (recheckCases[dateKey] || 0) + 1;
          break;
        case 'procedure':
					procedureCases[dateKey] = (procedureCases[dateKey] || 0) + 1;
          break;
			  }
			  // console.log(Object.keys(newCases));
			}
		  console.log(recheckCases);
		  // console.log(recheckCases);
		  // console.log(procedureCases);
		  for (var date in newCases) {
				newCasesArray.push([parseInt(date, 10), newCases[date]]);
		  }
		  newCasesArray = newCasesArray.sort(function(a,b){return a[0]-b[0];});

		  for (date in recheckCases) {
				recheckCasesArray.push([parseInt(date, 10), recheckCases[date]]);
		  }
		  recheckCasesArray = recheckCasesArray.sort(function(a,b){return a[0]-b[0];});

		  for (date in procedureCases) {
				procedureCasesArray.push([parseInt(date, 10), procedureCases[date]]);
		  }
		  procedureCasesArray = procedureCasesArray.sort(function(a,b){return a[0]-b[0];});

    });

    $scope.chartConfig = {
	    options: {
        chart: {
          type: 'spline'
        },
        tooltip: {
					formatter: function () {
						return Highcharts.dateFormat('%b %e, %Y (%a)', new Date(this.x)) + ': ' + this.y;
					}
        },
        exporting: {
          enabled: false
        }
	    }, // end options
	    series: [
		    {
					name: 'New Cases',
					data: newCasesArray
		    },
		    {
					name: 'Rechecks',
					data: recheckCasesArray
		    },
		    {
					name: 'Procedures',
					data: procedureCasesArray
		    }
	    ],
	    title: {
        text: 'Hello'
	    },
	    xAxis: {
				type: 'datetime',
				title: {text:'Date'},
        dateTimeLabelFormats: { // don't display the dummy year
          day: '%e of %b'
        }
	    },
	    yAxis: {
				title: {text: 'Cases (#)'}
	    },
	    loading: false
    };
	}); // end controller


		// $scope.students.$loaded().then(function(students) {
		// 	$scope.numStudents = $scope.students.length;
		// 	var totalNewCases = 0;
		// 	var totalRechecks = 0;
		// 	var totalProcedures = 0;
		//   console.log(students.length); // data is loaded here
		//   angular.forEach($scope.students, function(student) {
		// 		totalNewCases += student.numNewCases;
		// 		totalRechecks += student.numRechecks;
		// 		totalProcedures += student.numProcedures;
  //       console.log(student);
	 //    });
	 //    $scope.avgNewCases = totalNewCases/$scope.numStudents;
	 //    $scope.avgRechecks = totalRechecks/$scope.numStudents;
	 //    $scope.avgProcedures = totalProcedures/$scope.numStudents;
		// });
