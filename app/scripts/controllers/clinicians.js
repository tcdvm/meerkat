'use strict';

app.controller('CliniciansCtrl',
  function ($scope, $firebaseObject, $firebaseArray, Clinicians, Patients) {
    $scope.clinicians = Clinicians.all;
    $scope.orderedClinicians = Clinicians.orderedAll;
    $scope.charts = [];
    $scope.recentPatients = [];
    $scope.orderedClinicians.$loaded().then(function() {
      for(var i = 0; i < 6; i++) {
        var caseStats = Clinicians.getCaseStats($scope.orderedClinicians[i].$id);
        $scope.charts.push(
        {
          options: {
            chart: {
                polar: true,
                type: 'line'
              },
              exporting: {
                enabled: false
              }
            }, // end options
            size: {
              height: '300'
            },

            title: {
              text: '',
              style: {
                display: 'none'
              }
            },
            subtitle: {
              text: '',
              style: {
                display: 'none'
              }
            },
          
            pane: {
              size: '80%'
            },

            xAxis: {
              categories: ['KCS', 'Corneal Ulcers', 'Glaucoma', 'Cataracts', 'Anterior Uveitis', 'Retinal Disease', 'Other'],
              tickmarkPlacement: 'on',
              lineWidth: 0
            },
              
            yAxis: {
              gridLineInterpolation: 'polygon',
              lineWidth: 0,
              min: 0
            },
          
            tooltip: {
              shared: true,
              pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },
          
            legend: {
              enabled: false,
            },
          
            series: [{
              name: 'cases',
              pointPlacement: 'on',
              showInLegend: false,
              data: caseStats.caseStats
            }]
          }
       );
        var casesRef = Clinicians.getCasesRef($scope.orderedClinicians[i].$id);
        var query = casesRef.orderByChild('date').limitToLast(10);
        $scope.recentPatients.push($firebaseArray(query));
      } // end for-loop
      // console.log($scope.recentPatients);

      $scope.openPatientModal = function(patientId) {
        Patients.openPatientModal(patientId);
      };

    }); // once clinicians loaded

  }); // end controller