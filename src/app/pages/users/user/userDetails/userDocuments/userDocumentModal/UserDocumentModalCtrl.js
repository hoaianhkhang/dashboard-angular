(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserDocumentModalCtrl', UserDocumentModalCtrl);

    function UserDocumentModalCtrl($scope,Rehive,$uibModalInstance,document,toastr,$filter,uuid,
                                   $ngConfirm,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = uuid;
        vm.updatedDocument = {};
        vm.addressTracking = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.document = document;
        $scope.updatingDocument = false;
        $scope.showingDocumentFile = true;
        $scope.defaultImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        if(typeof document.metadata == 'string'){
            try{
                document.metadata = JSON.parse(document.metadata);
            } catch(err) {
                document.metadata = {metadata: document.metadata};
            }

        }
        $scope.editDocument = {
            file: {},
            document_type: document.document_type,
            status: $filter('capitalizeWord')(document.status),
            note: document.note,
            metadata: document.metadata
        };
        $scope.userInfo = {
            status: $filter('capitalizeWord')($scope.user.status)
        };
        $scope.userAddresses.forEach(function (element,index) {
            $scope.userAddresses[index].status = $filter('capitalizeWord')($scope.userAddresses[index].status);
        });

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

        $scope.kycDocumentSelected = function (field) {
            $scope.showingDocumentFile = false;
            $scope.documentChanged(field);
        };

        $scope.checkIfMetadataExists = function () {
            if(Object.keys($scope.editDocument.metadata).length == 0){
                return false;
            } else {
                return true;
            }
        };

        $scope.documentChanged = function (field) {
            vm.updatedDocument[field] = $scope.editDocument[field];
        };

        $scope.updateDocument = function () {
            $scope.updatingDocument = true;
            vm.updatedDocument.status ? vm.updatedDocument.status = vm.updatedDocument.status.toLowerCase() : '';
            if(vm.updatedDocument['document_type']){
                vm.updatedDocument['document_type'] = vm.documentTypeOptionsObj[vm.updatedDocument['document_type']];
            }

            var fileSelected = vm.updatedDocument.file,
                formData = new FormData();

            if(fileSelected) {
                formData.append('file', fileSelected);
                delete vm.updatedDocument.file;
            }

            for (var key in vm.updatedDocument) {
                if (vm.updatedDocument[key]) {
                    formData.append(key, vm.updatedDocument[key]);
                }
            }

            Rehive.admin.users.documents.update($scope.document.id, formData).then(function (res) {
                $scope.updatingDocument = false;
                toastr.success('Document successfully updated');
                if($scope.document.document_category == 'Proof Of Address'){
                    $scope.executeUpdateUserAddressFromDocumentModal();
                    $scope.$apply();
                } else if((document.document_category == 'Proof Of Identity')
                    || (document.document_category == 'Advanced Proof Of Identity')) {
                    $scope.updateUserBasicInfoFromDocumentModal();
                    $scope.$apply();
                } else {
                    $uibModalInstance.close($scope.document);
                    $scope.$apply();
                }
            }, function (error) {
                $scope.updatingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };

        $scope.deleteDocumentConfirm = function () {
            $ngConfirm({
                title: 'Delete document',
                content: 'Are you sure you want to delete this document?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteDocument();
                        }
                    }
                }
            });
        };

        $scope.deleteDocument = function () {
            $scope.updatingDocument = true;
            Rehive.admin.users.documents.delete($scope.document.id).then(function (res) {
                $scope.updatingDocument = false;
                toastr.success('Document successfully deleted');
                $uibModalInstance.close($scope.document);
                $scope.$apply();
            }, function (error) {
                $scope.updatingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.updateUserBasicInfoFromDocumentModal = function(){
            if(vm.token) {
                var formData = new FormData();

                formData.append('status', $scope.userInfo.status.toLowerCase());

                Rehive.admin.users.update(vm.uuid, formData).then(function (res) {
                    $uibModalInstance.close($scope.document);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.addressStatusTracking = function (address) {
            vm.addressTracking[address.id] = address.status;
        };

        $scope.executeUpdateUserAddressFromDocumentModal = function () {
            var objectLength = Object.keys(vm.addressTracking).length,
                count = 0;

            if(objectLength > 0){
                for(var key in vm.addressTracking){
                    if((count + 1) == objectLength){
                        $scope.updateUserAddressFromDocumentModal(key,vm.addressTracking[key],'last');
                    } else {
                        $scope.updateUserAddressFromDocumentModal(key,vm.addressTracking[key]);
                    }
                    count = count + 1;
                }
            } else {
                $uibModalInstance.close($scope.document);
            }
        };

        $scope.updateUserAddressFromDocumentModal = function(id,status,last){
            if(vm.token) {
                Rehive.admin.users.addresses.update(id,{
                    status: status.toLowerCase()
                }).then(function (res) {
                    if(last){
                        $uibModalInstance.close($scope.document);
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };




    }
})();
