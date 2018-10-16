(function (_, angular, activityTypes) {
  var module = angular.module('civicaseextras');

  module.directive('civicaseExtrasCaseOutcome', function () {
    return {
      scope: { case: '=' },
      templateUrl: '~/civicaseextras/CaseOutcome.html',
      controller: 'civicaseExtrasCaseOutcomeController'
    };
  });

  module.controller('civicaseExtrasCaseOutcomeController', function ($q, $scope, crmApi, CiviCaseExtrasCustomFields) {
    var customFieldsMap = {};
    $scope.activityOutcomes = [];

    (function init () {
      $q.all([
        CiviCaseExtrasCustomFields.get(),
        getActivityOutcomes()
      ])
        .then(function (results) {
          customFieldsMap = results[0];

          storeActivityOutcomes(results[1].values);
        });
    })();

    /**
     * Requests a list of activities of the "outcome" group.
     *
     * @return {Promise}
     */
    function getActivityOutcomes () {
      return crmApi('Activity', 'get', {
        'sequential': 1,
        'case_id': $scope.case.id,
        'activity_type_id.grouping': 'outcome'
      });
    }

    /**
     * Stores the activity outcomes as a list of activity type and custom fields
     * that belong to the outcome.
     *
     * @param {Array} activityOutcome a list of activities that belong to the "outcome" group.
     */
    function storeActivityOutcomes (activityOutcomes) {
      $scope.activityOutcomes = _.map(activityOutcomes, function (activityOutcome) {
        var activityType = activityTypes[activityOutcome.activity_type_id].label;
        var customFields = getCustomFieldsForActivity(activityOutcome);

        return {
          activityType: activityType,
          customFields: customFields
        };
      });
    }

    /**
     * Returns a list of custom fields for the given activity. Any field that
     * starts with `custom_` will be returned as a pair of the custom field label
     * and the field value (Ex: { label: 'Custom Outcome Field', value: 123 }).
     *
     * @param {Object} activity the activity containing the custom fields.
     * @return {Array} the list of custom fields belonging to the activity.
     */
    function getCustomFieldsForActivity (activity) {
      return _.chain(activity)
        .pick(function (value, fieldName) {
          return _.startsWith(fieldName, 'custom_');
        })
        .map(function (value, fieldName) {
          return {
            label: customFieldsMap[fieldName].label,
            value: value
          };
        })
        .value();
    }
  });
})(CRM._, angular, CRM.civicase.activityTypes);