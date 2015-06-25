angular.module('marre', [])
  .controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.currentYear = 2001;
    $scope.yearIndex = 0;

    $scope.stocks = {
      'Ericsson B': 13,
      'TeliaSonera': 37,
      'Kinnevik': 137,
      'ICA': 73
    };

    $scope.cash = 3754;
    $scope.portfolio = {};

    $scope.portfolioValue = function() {

      var sum = 0;
      for(var key in $scope.portfolio) {
        if(!$scope.portfolio.hasOwnProperty(key))
          continue;
        sum += $scope.stocks[key] * $scope.portfolio[key];
      }

      return sum;
    };

    $scope.init = function() {
      $http.get('assets/data.json')
        .success(function(data) {
          console.log('data loaded');

          $scope.allData = data;
          console.log($scope.allData);

          $scope.stocks = $scope.getStockDataForYearIndex($scope.yearIndex);
        });
    };

    $scope.getStockDataForYearIndex = function(index) {
      var stocks = {};

      for(var stockName in $scope.allData) {
        if($scope.allData[stockName][index] !== null) {
          stocks[stockName] = $scope.allData[stockName][index];
        }
      }

      return stocks;
    };

    $scope.totalValue = function() {
      return $scope.cash + $scope.portfolioValue();
    };

    $scope.previousValue = function(stock) {
      var previous = $scope.getStockDataForYearIndex($scope.yearIndex - 1);
      if(previous === undefined)
        return;
      if(previous[stock] === undefined)
        return 'N/A';
      return previous[stock];
    };

    $scope.stockHoldingsValue = function(stock) {
      if($scope.portfolio[stock] !== undefined) {
        return $scope.portfolio[stock] * $scope.stocks[stock];
      }

      return 0;
    };

    $scope.stockHoldingsCount = function(stock) {
      if($scope.portfolio[stock] !== undefined) {
        return $scope.portfolio[stock];
      }

      return 0;
    };

    $scope.increaseHolding = function(stock) {
      if($scope.stocks[stock] > $scope.cash) {
        return;
      }

      $scope.cash -= $scope.stocks[stock];

      if($scope.portfolio[stock] !== undefined) {
        return $scope.portfolio[stock] += 1;
      }

      $scope.portfolio[stock] = 1;
    };

    $scope.decreaseHolding = function(stock) {
      if($scope.portfolio[stock] === undefined)
        return;

      if($scope.portfolio[stock] >= 1) {
        $scope.cash += $scope.stocks[stock];
        $scope.portfolio[stock] -= 1;
      }
    };

    $scope.nextYear = function() {
      $scope.yearIndex++;
      $scope.currentYear++;
      $scope.stocks = $scope.getStockDataForYearIndex($scope.yearIndex);
    };

    $scope.init();
  }]);
