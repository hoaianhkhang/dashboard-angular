import toastrLibConfig from './toastrLibConfig';
import widgetsDirective from './widgets/widgets.directive';
import progressBarRoundDirective from './progressBarRound/progressBarRound.directive';
import pageTopDirective from './pageTop/pageTop.directive';
import searchBarResultsDirective from './pageTop/searchBarResults/searchBarResults.directive';
import contentTopDirective from './contentTop/contentTop.directive';
import baWizardStepDirective from './baWizard/baWizardStep.directive';
import baWizardDirective from './baWizard/baWizard.directive';

module.exports = angular.module('BlurAdmin.theme.components', []);

toastrLibConfig();
widgetsDirective();
progressBarRoundDirective();
pageTopDirective();
searchBarResultsDirective();
contentTopDirective();
baWizardStepDirective();
baWizardDirective();