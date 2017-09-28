/*global angular*/
(function () {
    'use strict';

    function Generator($scope) {
        var vm = this,

            capitalize = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };

        vm.metadata = {
            model: {},
            controller: {},
            route: {},
            pages: {},
            fields: [{
                fieldOrder: 1,
                dataType: 'String',
                controlType: 'text'
            }]
        };

        vm.addField = function () {
            vm.metadata.fields.push({
                fieldOrder: vm.metadata.fields.length + 1,
                dataType: 'String',
                controlType: 'text'
            });
        };

        vm.selectControl = function (field) {
            switch (field.dataType) {
                case 'String':
                    field.controlType = 'text';
                    break;
                case 'Boolean':
                    field.controlType = 'checkbox';
                    break;
                case 'Number':
                    field.controlType = 'tel';
                    break;
                case 'Integer':
                    field.controlType = 'tel';
                    break;
                case 'Decimal':
                    field.controlType = 'tel';
                    break;
                case 'Date':
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
                vm.metadata.route = {};
                vm.metadata.pages = {};
            } else {
                // model
                vm.metadata.model.pluralName = value + 's';
                vm.metadata.model.name = capitalize(value);
                vm.metadata.model.schemaName = value + 'Schema';
                vm.metadata.model.filename = value + '.js';

                // controller
                vm.metadata.controller.name = value + 'Controller';
                vm.metadata.controller.filename = value+ 's.js';

                // router
                vm.metadata.route.filename = value+ 's.js';

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