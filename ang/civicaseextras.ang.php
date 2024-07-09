<?php

use CRM_Civicase_Helper_GlobRecursive as GlobRecursive;

/**
 * Returns a list of Civicaseextras JS files to be bundled.
 *
 * @return array
 */
function getCivicaseExtrasJSFiles () {
  return array_merge([
    'assetBuilder://visual-bundle.js',
    'ang/civicaseextras.js'
  ], GlobRecursive::getRelativeToExtension(
    'uk.co.compucorp.civicaseextras',
    'ang/civicase-base/*.js'
  ));
}

/**
 * Returns a list of Civicaseextras settings that will be shared with the front-end.
 *
 * @return array
 */
function getCivicaseExtrasSettings () {
  return [
    'overdueNotificationLimit' => (int) Civi::settings()->get('civicaseCaseLastUpdatedNotificationLimit'),
  ];
}

return [
  'js' => getCivicaseExtrasJSFiles(),
  'css' => [
    'assetBuilder://visual-bundle.css',
    'css/*.css',
  ],
  'partials' => [
    'ang/civicaseextras',
  ],
  'settings' => getCivicaseExtrasSettings(),
  'requires' => [
    'crmUtil'
  ],
  'basePages' => [],
];
