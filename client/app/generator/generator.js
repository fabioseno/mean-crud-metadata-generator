/*global angular*/
(function () {
    'use strict';

    function Generator($scope) {
        var vm = this,

            capitalize = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },

            pluralize = function (term) {
                var lastChar = term.substring(term.length - 1);

                if (lastChar !== 's') {
                    if (lastChar === 'y') {
                        term = term.substring(0, term.length - 1) + 'ies';
                    } else {
                        term += 's';
                    }
                }

                return term;
            };

        vm.colSizes = [];
        vm.listOrders = [];
        vm.formRows = [];

        vm.metadata = {
            server: {
                datasource: 'mysql',
                namingConvention: 'underscore',
                model: {},
                domain: {},
                controller: {},
                middleware: {},
                route: {},
            },
            web: {
                pages: {}
            },
            fields: [{
                fieldOrder: 1,
                dataType: 'String',
                controlType: 'text'
            }]
        };

        for (var i = 0; i < 12; i++) {
            vm.colSizes.push(i + 1);
        }

        for (var i = 0; i < 10; i++) {
            vm.listOrders.push(i + 1);
        }

        for (var i = 0; i < 10; i++) {
            vm.formRows.push(i + 1);
        }

        vm.addField = function () {
            vm.metadata.fields.push({
                fieldOrder: vm.metadata.fields.length + 1,
                dataType: 'String',
                controlType: 'text'
            });
        };

        vm.showMongoDBFields = function () {
            return (vm.metadata.server.datasource === 'mongodb');
        };

        vm.selectControl = function (field) {
            switch (field.dataType) {
                case 'String':
                    field.controlType = 'text';
                    break;
                case 'Boolean':
                    field.controlType = 'checkbox';
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
                vm.metadata.entityTitle = '';
                vm.metadata.entityPluralName = '';

                vm.metadata.server.model = {};
                vm.metadata.server.domain = {};
                vm.metadata.server.controller = {};
                vm.metadata.server.middleware = {};
                vm.metadata.server.route = {};
                vm.metadata.web.pages = {};
            } else {
                vm.metadata.entityTitle = capitalize(value);
                vm.metadata.entityPluralName = pluralize(value);

                // model
                vm.metadata.server.model.pluralName = pluralize(capitalize(value));
                vm.metadata.server.model.name = capitalize(value);
                vm.metadata.server.model.schemaName = value + 'Schema';
                vm.metadata.server.model.filename = value + '.model.js';

                // domain
                vm.metadata.server.domain.name = value + 'Domain';
                vm.metadata.server.domain.filename = value + '.domain.js';

                // controller
                vm.metadata.server.controller.name = value + 'Controller';
                vm.metadata.server.controller.filename = value + '.controller.js';

                // middleware
                vm.metadata.server.middleware.name = value + 'Middleware';
                vm.metadata.server.middleware.filename = value + '.middleware.js';

                // route
                vm.metadata.server.route.filename = value + '.route.js';

                // pages
                vm.metadata.web.pages.listViewHtmlPageFilename = pluralize(value) + '.html';
                vm.metadata.web.pages.listViewJSPageFilename = pluralize(value) + '.js';
                vm.metadata.web.pages.listViewJSPageControllerName = pluralize(value);

                vm.metadata.web.pages.detailsViewHtmlPageFilename = value + '.html';
                vm.metadata.web.pages.detailsViewJSPageFilename = value + '.js';
                vm.metadata.web.pages.detailsViewJSPageControllerName = value;
            }
        });

        $scope.$watch('vm.metadata.entityTitle', function (value) {
            if (value) {
                vm.metadata.entityPluralTitle = pluralize(value);
                vm.metadata.web.pages.listViewPageTitle = pluralize(value);
                vm.metadata.web.pages.detailsViewPageTitle = value;
            } else {
                vm.metadata.entityPluralTitle = '';
                vm.metadata.web.pages.listViewPageTitle = '';
                vm.metadata.web.pages.detailsViewPageTitle = '';
            }
        });

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
