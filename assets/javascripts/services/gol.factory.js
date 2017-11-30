(function() {
  'use strict';

  angular.module('app').factory('golFactory', golFactory);

  golFactory.$inject = ['$http', '$q', '$log'];

  function golFactory($http, $q, $log) {
    return {
      createWorld: createWorld,
      getNextGen: getNextGen
    };

    function createWorld() {
      var canceler = $q.defer();
      var requestCanceled = false;

      return { perform: perform, cancel: cancel };

      function perform(gridSize) {
        return $http
          .get('http://127.0.0.1:5000/gol/' + gridSize, {
            params: { random: 5 },
            timeout: canceler.promise
          })
          .then(createWorldComplete)
          .catch(createWorldFailed);
      }

      function cancel() {
        requestCanceled = true;
        canceler.resolve();
      }

      function createWorldComplete(response) {
        return response.data;
      }

      function createWorldFailed(error) {
        if (requestCanceled) {
          requestCanceled = false;
          return { canceled: true };
        } else {
          $log.error('createWorldFailed:', error);
        }
      }
    }

    function getNextGen() {
      var canceler = $q.defer();
      var requestCanceled = false;

      return { perform: perform, cancel: cancel };

      function perform(data) {
        return $http
          .post('http://127.0.0.1:5000/gol', data, { timeout: canceler.promise })
          .then(getNextGenComplete)
          .catch(getNextGenFailed);
      }

      function cancel() {
        requestCanceled = true;
        canceler.resolve();
      }

      function getNextGenComplete(response) {
        return response.data;
      }

      function getNextGenFailed(error) {
        if (requestCanceled) {
          requestCanceled = false;
          return { canceled: true };
        } else {
          $log.error('getNextGenFailed:', error);
        }
      }
    }
  }
})();
