(function() {
  'use strict';

  angular.module('app').controller('WorldController', WorldController);

  WorldController.$inject = ['$interval', 'golFactory'];

  function WorldController($interval, golFactory) {
    var vm = this;
    var createWorldRequest = golFactory.createWorld();
    var nextGenRequest = golFactory.getNextGen();

    vm.world = [];
    vm.gridSize = 20;
    vm.autoPlayInterval = null;
    vm.autoPlay = false;
    vm.worldCssClass = 'grid-20';

    vm.createWorld = createWorld;
    vm.toggleCell = toggleCell;
    vm.clearWorld = clearWorld;
    vm.getNextGen = getNextGen;
    vm.toggleAutoPlay = toggleAutoPlay;

    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      createWorld();
    }

    function onDestroy() {
      createWorldRequest.cancel();
      nextGenRequest.cancel();
    }

    function createWorld() {
      cancelAutoPlay();
      vm.worldCssClass = setWorldCssClass();
      createWorldRequest.perform(vm.gridSize).then(setWorld);
    }

    function setWorld(response) {
      // Cancel the interval and turn off autoplay if the world is stabilized
      if (angular.equals(vm.world, response)) {
        cancelAutoPlay();
        return false;
      }

      vm.world = response;
    }

    function clearWorld() {
      vm.world.map(function(row) {
        row.fill(0);
      });
    }

    function toggleCell(row, cell) {
      // toggles value between 0 and 1
      vm.world[row][cell] = 1 - vm.world[row][cell];
    }

    function getNextGen() {
      nextGenRequest.perform(vm.world).then(setWorld);
    }

    function toggleAutoPlay() {
      if (vm.autoPlay) {
        vm.autoPlayInterval = $interval(function () {
          getNextGen();
        }, 500);
      } else {
        $interval.cancel(vm.autoPlayInterval);
      }
    }

    function cancelAutoPlay() {
      if (vm.autoPlay) {
        vm.autoPlay = false;
        $interval.cancel(vm.autoPlayInterval);
      }
    }

    function setWorldCssClass() {
      switch (true) {
        case vm.gridSize >= 50:
          return 'grid-50';
        case vm.gridSize >= 40:
          return 'grid-40';
        case vm.gridSize >= 30:
          return 'grid-30';
        case vm.gridSize >= 20:
          return 'grid-20';
        case vm.gridSize >= 10:
          return 'grid-10';
        default:
          return 'grid-20';
      }
    }
  }
})();
