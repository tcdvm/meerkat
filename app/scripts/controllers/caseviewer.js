'use strict';

app.controller('CaseViewerCtrl',
	function ($scope, $firebaseObject, $firebaseArray, Cases) {
		var newCases = {};
		var recheckCases = {};
		var procedureCases = {};

		var newCasesArray = [];
		var recheckCasesArray = [];
		var procedureCasesArray = [];

		var speciesArray = [0, 0, 0, 0];

		$scope.caseArray = []; // used for pagination
		$scope.cases = Cases.all;
		$scope.cases.$loaded().then(function() {
			for (var i = 0; i < $scope.cases.length; i++) {
			  $scope.caseArray.push($scope.cases[i]); // used for pagination

			  switch($scope.cases[i].patientSpecies) {
			  case 'Canine':
					speciesArray[0]++;
					break;
			  case 'Feline':
					speciesArray[1]++;
					break;
			  case 'Equine':
					speciesArray[2]++;
					break;
			  case 'Other':
					speciesArray[3]++;
					break;
			  }

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
			}
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

    $scope.caseDistChartConfig = {
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
        text: 'Case distribution'
	    },
	    xAxis: {
				type: 'datetime',
				title: {text:'Date'},
        dateTimeLabelFormats: { // don't display the dummy year
          day: '%e %b'
        }
	    },
	    yAxis: {
				title: {text: 'Cases (#)'}
	    },
	    loading: false
    };

    $scope.speciesChartConfig = {
	    options: {
        chart: {
          type: 'bar'
        },
        exporting: {
          enabled: false
        },
        tooltip: {
					formatter: function () {
						return this.y;
					}
        }
	    }, // end options
	    series: [
		    {
					name: 'Species',
					data: speciesArray
		    }
	    ],
	    title: {
        text: 'Species seen'
	    },
	    xAxis: {
				categories: ['Canine', 'Feline', 'Equine', 'Other']
	    },
	    yAxis: {
				title: {text: 'Cases (#)'}
	    },
	    loading: false
    };
	}); // end controller


