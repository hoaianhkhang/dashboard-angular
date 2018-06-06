(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserDocumentModalCtrl', AddUserDocumentModalCtrl);

    function AddUserDocumentModalCtrl($scope,uuid,$uibModalInstance,toastr,Rehive,
                                      localStorageManagement,errorHandler) {

        var vm = this;

        $scope.addingDocument = false;
        vm.uuid = uuid;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.userDocumentParams = {
            file: {},
            document_type: 'Utility Bill',
            status: 'Verified'
        };
        $scope.documentSelected = false;
        $scope.documentTypeOptions = ['Utility Bill','Bank Statement','Lease Or Rental Agreement',
            'Municipal Rate and Taxes Invoice','Mortgage Statement','Telephone or Cellular Account','Insurance Policy Document',
            'Statement of Account Issued by a Retail Store','Government Issued ID','Passport','Drivers License',
            'ID Confirmation Photo','Other'];
        vm.documentTypeOptionsObj = {
            'Utility Bill': 'utility_bill',
            'Bank Statement': 'bank_statement',
            'Lease Or Rental Agreement': 'lease_or_rental_agreement',
            'Municipal Rate and Taxes Invoice': 'municipal_rate_and_taxes',
            'Mortgage Statement': 'mortgage_statement',
            'Telephone or Cellular Account': 'telephone',
            'Insurance Policy Document': 'insurance_policy',
            'Statement of Account Issued by a Retail Store': 'retail_store',
            'Government Issued ID': 'government_id',
            'Passport': 'passport',
            'Drivers License': 'drivers_license',
            'ID Confirmation Photo': 'id_confirmation',
            'Other': 'other'
        };
        $scope.documentStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];


        $scope.addDocument = function () {
            $scope.addingDocument = true;
            $scope.userDocumentParams.user = vm.uuid;
            $scope.userDocumentParams.status = $scope.userDocumentParams.status.toLowerCase();
            $scope.userDocumentParams['document_type'] = vm.documentTypeOptionsObj[$scope.userDocumentParams['document_type']];

            var formData = new FormData();

            for (var key in $scope.userDocumentParams) {
                if ($scope.userDocumentParams[key]) {
                    formData.append(key, $scope.userDocumentParams[key]);
                }
            }

            Rehive.admin.users.documents.create(formData).then(function (res) {
                toastr.success('Document successfully added');
                $uibModalInstance.close();
                $scope.$apply();
            }, function (error) {
                $scope.addingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.documentChanged = function () {
            $scope.documentSelected = true;
        };



    }
})();
