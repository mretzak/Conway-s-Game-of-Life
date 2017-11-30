(function() {
  'use strict';

  angular.module('app').controller('WorldController', WorldController);

  WorldController.$inject = ['golFactory'];

  function WorldController(golFactory) {
    var vm = this;
    var defaultGridSize = 10;
    var createWorldRequest = golFactory.createWorld();
    var nextGenRequest = golFactory.getNextGen();

    vm.gridSize = defaultGridSize;
    vm.world = [];

    vm.createWorld = createWorld;
    vm.toggleCell = toggleCell;
    vm.getNextGen = getNextGen;
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
      createWorldRequest.perform(vm.gridSize).then(setWorld);
    }

    function setWorld(response) {
      vm.world = response;
    }

    function toggleCell(row, cell) {
      // toggles value between 0 and 1
      vm.world[row][cell] = 1 - vm.world[row][cell];
    }

    function getNextGen() {
      nextGenRequest.perform(vm.world).then(setWorld);
    }
  }
})();
