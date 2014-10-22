angular.module('trnr', ['ngTouch']).controller('MainController', function($scope, $interval){

    var cfg = {
        hangingTimeInSec: 8,
        restingTimeInSec: 5,
        longRestingTimeInSec: 2 * 60
    };

    var cancellation = angular.noop; // will be invoked when trying to stop the process

    $scope.isRunning = false;
    $scope.state = 'waiting';
    $scope.counter = 0;
    $scope.cycleCounter = 0;

    $scope.start = function() {
        $scope.isRunning = true;
        $scope.state = 'prepare';
        $scope.counter = 3;

        cancellation = $interval(function(){
            if($scope.isRunning){

                $scope.counter--;

                if($scope.counter == 0){

                    document.getElementById('beep').play();

                    if($scope.state === 'prepare' || $scope.state === 'rest' || $scope.state === 'longrest'){
                        $scope.state = 'hang';
                        $scope.counter = cfg.hangingTimeInSec;
                        return;
                    }
                    if($scope.state === 'hang'){
                        $scope.state = 'rest';
                        $scope.cycleCounter++;
                        if($scope.cycleCounter % 25 === 0){
                            $scope.stop('yey');
                        }
                        else if($scope.cycleCounter % 5 == 0){
                            $scope.state = 'longrest';
                            $scope.counter = cfg.longRestingTimeInSec;
                        }
                        else{
                            $scope.counter = cfg.restingTimeInSec;
                        }
                    }
                }
            }

        }, 1000);
    };

    $scope.stop = function(state){
        if($scope.isRunning){
            $scope.isRunning = false;
            $interval.cancel(cancellation);

            $scope.state = state || 'waiting';
            $scope.counter = $scope.cycleCounter = 0;
        }
    };



});
