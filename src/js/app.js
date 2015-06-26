angular.module('marre', [])
  .controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.originalCash = 3754;
    $scope.currentYear = 2001;
    $scope.yearIndex = 0;

    $scope.allData ={
      stocks: {},
      yearTexts: []
    };
    $scope.stocks = {};
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
      var shareToken = $scope.readShareUrl();

      if(shareToken) {
        $scope.cash = shareToken.cash;
        $scope.portfolio = shareToken.portfolio;
        $scope.yearIndex = shareToken.yearIndex;
        $scope.currentYear = 2001 + shareToken.yearIndex;
      }

      $http.get('assets/data.json')
        .success(function(data) {
          $scope.allData = data;
          console.log(data);
          $scope.stocks = $scope.getStockDataForYearIndex($scope.yearIndex);
        });
    };

    $scope.getStockDataForYearIndex = function(index) {
      var stocks = {};

      for(var stockName in $scope.allData.stocks) {
        if($scope.allData.stocks[stockName][index] !== null) {
          stocks[stockName] = $scope.allData.stocks[stockName][index];
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
        $scope.portfolio[stock] += 1;
      } else {
        $scope.portfolio[stock] = 1;
      }

      $scope.updateShareUrl();
    };

    $scope.decreaseHolding = function(stock) {
      if($scope.portfolio[stock] === undefined)
        return;

      if($scope.portfolio[stock] >= 1) {
        $scope.cash += $scope.stocks[stock];
        $scope.portfolio[stock] -= 1;
        $scope.updateShareUrl();
      }
    };

    $scope.nextYear = function() {
      $scope.yearIndex++;
      $scope.currentYear++;
      $scope.stocks = $scope.getStockDataForYearIndex($scope.yearIndex);
      $scope.updateShareUrl();
      window.scrollTo(0, 0);
    };

    $scope.updateShareUrl = function() {
      var shareToken = {
        cash: $scope.cash,
        portfolio: $scope.portfolio,
        yearIndex: $scope.yearIndex
      };

      window.location.hash = btoa(JSON.stringify(shareToken));
    };

    $scope.readShareUrl = function() {
      try {
        return JSON.parse(atob(window.location.hash.substr(1)));
      } catch(e) {
        return null;
      }
    };

    $scope.init();
  }]);
