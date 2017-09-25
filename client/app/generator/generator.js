/*global angular*/
(function () {
    'use strict';

    function Generator($scope) {
        var vm = this;

        vm.metadata = {
            model: {},
            controller: {},
            router: {},
            pages: {},
            fields: [{
                fieldOrder: 1,
                dataType: 'string',
                controlType: 'text'
            }]
        };

        vm.addField = function () {
            vm.metadata.fields.push({
                fieldOrder: vm.metadata.fields.length + 1,
                dataType: 'string',
                controlType: 'text'
            });
        };

        vm.selectControl = function (field) {
            switch (field.dataType) {
                case 'string':
                    field.controlType = 'text';
                    break;
                case 'bool':
                    field.controlType = 'checkbox';
                    break;
                case 'int':
                    field.controlType = 'tel';
                    break;
                case 'decimal':
                    field.controlType = 'text';
                    break;
                case 'datetime':
                    field.controlType = 'calendar';
                    break;
            }
        };

        vm.pkSelected = function (field) {
            if (field.pk) {
                field.required = true;
                field.unique = true;
            }
        };

        $scope.$watch('vm.metadata.entityName', function (value) {
            if (!value) {
                vm.metadata.model = {};
                vm.metadata.controller = {};
                vm.metadata.router = {};
            } else {
                // model
                vm.metadata.model.pluralName = value + 's';
                vm.metadata.model.name = value + 'Model';
                vm.metadata.model.schemaName = value + 'Schema';
                vm.metadata.model.filename = value + 'Model.js';

                // controller
                vm.metadata.controller.filename = value + 'Controller.js';

                // router
                vm.metadata.router.filename = value + 'Router.js';

                // pages
                vm.metadata.pages.listViewHtmlPageFilename = value + '-list.html';
                vm.metadata.pages.listViewJSPageFilename = value + '-list.js';
                vm.metadata.pages.detailsViewHtmlPageFilename = value + '-details.html';
                vm.metadata.pages.detailsViewJSPageFilename = value + '-details.js';
            }
        })

        vm.generateMetadata = function () {
            if (vm.form.$valid) {
                var file = new Blob([JSON.stringify(vm.metadata, null, '\t')], {
                    type: 'application/text'
                });

                //trick to download store a file having its URL
                var fileURL = URL.createObjectURL(file);
                var a = document.createElement('a');
                a.href = fileURL;
                a.target = '_blank';
                a.download = vm.metadata.entityName + '.json';
                document.body.appendChild(a);
                a.click();
            }
        };
    }

    Generator.$inject = ['$scope'];

    angular.module('app').controller('generator', Generator);
})();
