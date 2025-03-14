(function ($, Drupal, drupalSettings) {
jQuery(document).ready(() => {
  const testingContainer = jQuery("#edit-container-testing");

  jQuery("#edit-customer").on('change', setTests);
  if (drupalSettings.editForm) {
    testingContainer.on('change', addTestFields);
  }

  testingContainer.on('change', setTestValue);

  jQuery("#edit-return-to-sender").on('change', function () {
    const comments = jQuery("#edit-comments")
    const testingCompany = jQuery("#edit-testing-company").val();
    const requestedBy = jQuery("#edit-requested-by").val();
    const address = drupalSettings.testingCompanies[testingCompany];
    const requestedByName = drupalSettings.requestedBy[requestedBy];
    const commentText = `Please return to sender,
${requestedByName}`;
    if (requestedByName !== undefined) {
      if (comments.data('requestedBy') === requestedBy) {
        comments.val('');
        comments.data('requestedBy', '')
      } else {
        comments.val(commentText);
        comments.data('requestedBy', requestedBy)
      }
    }
  });
  setTests();
});

  function addTestFields() {
    const tests = jQuery(".testingValues");

   tests.each(function() {
      const test = jQuery(this).val();
      const testResults = document.getElementById(`container-${test}-results`)
      const testPassed =  document.getElementById(`container-${test}-passed`);
      if (this.checked) {
        testResults.classList.remove("hidden");
        testPassed.classList.remove("hidden");
      } else {
        testResults.classList.add("hidden");
        testPassed.classList.add("hidden");
      }
    });

  }

function setTestValue() {
  const editTests = jQuery("#edit-tests");
  const editTestResults = jQuery("#edit-test-results");
  const editTestFailed = jQuery("#edit-test-failed");
  const tests = jQuery(".testingValues");
  const testingValues = tests.filter(function() {
    return this.checked;
  }).map(function() {
    return jQuery(this).val();
  }).get();
  editTests.val(testingValues.join("\n"));

  const testingResults = tests.filter(function() {
    return this.checked;
  }).map(function() {
    const name = jQuery(this).val();
    return JSON.stringify({name: name, testingResult: document.getElementById(`edit-${name}-results`)?.value ?? '', passed: document.getElementById(`edit-${name}-passed`)?.checked ?? false});
  }).get();
  editTestResults.val(testingResults.join("\n"));

  const testingFailed = tests.filter(function() {
    return this.checked;
  }).filter(function() {
    const name = jQuery(this).val();
    return !document.getElementById(`edit-${name}-passed`)?.checked;
  }).map(function() {
    const name = jQuery(this).val();
    const result = document.getElementById(`edit-${name}-results`).value;
    return `${name}: ${result}`;
  }).get();
  editTestFailed.val(testingFailed.join("\n"));
}

function setTests() {
  const testing = jQuery("#edit-container-testing");
  const editTestResults = jQuery("#edit-test-results");
  testing.empty();
  for (const test of drupalSettings.tests[jQuery("#edit-customer").val()]) {
    if (test !== '') {
      if (drupalSettings.editForm) {
        const testValues = editTestResults.val().split("\n").map(function(item) {
          return JSON.parse(item);
        });
        const testValue = testValues.find((value) => value.name === test);
        testing.append(
            `<div class="webform-flexbox js-webform-flexbox js-form-wrapper grow justify-between form-wrapper items-center" id="edit-flexbox-${test}"><div class="grow justify-start webform-flex"><div class="webform-flex--container"><div class="form-type-checkbox js-form-item form-item js-form-type-checkbox form-type--checkbox form-type--boolean js-form-item-test form-item--test">
              <input data-drupal-selector="edit-${test}" type="checkbox" id="edit-${test}" name="${test}" value="${test}" class="form-checkbox form-boolean form-boolean--type-checkbox testingValues" ${testValue ? 'checked' : ''}>
              <span class="checkbox-toggle">
                <span class="checkbox-toggle__inner"></span>
              </span>
              <label for="edit-${test}" class="form-item__label option">${test}</label>
              </div>
            </div></div>

            <div id="container-${test}-results" class="webform-flex flex-auto ${!testValue ? 'hidden' : ''}"><div class="webform-flex--container"><div class="form-type-textfield js-form-item form-item js-form-type-textfield form-type--textfield js-form-item-${test}-results form-item--${test}-results form-item--no-label">
                <label for="edit-${test}-results" class="form-item__label visually-hidden">test results</label>
                <input data-drupal-selector="edit-${test}-results" type="text" id="edit-${test}-results" name="${test}_results" value="${testValue?.testingResult ?? ''}" size="60" maxlength="255" class="form-text form-element form-element--type-text form-element--api-textfield">
            </div>
            </div></div><div id="container-${test}-passed" class="webform-flex flex-auto justify-end ${!testValue ? 'hidden' : ''}"><div class="webform-flex--container"><div class="webform-element--title-inline form-type-checkbox js-form-item form-item js-form-type-checkbox form-type--checkbox form-type--boolean js-form-item-passed form-item--passed">
                <input data-drupal-selector="edit-${test}-passed" type="checkbox" id="edit-${test}-passed" name="${test}-passed" value="1" class="form-checkbox form-boolean form-boolean--type-checkbox" ${testValue?.passed ? 'checked' : ''}>
                <span class="checkbox-toggle">
                    <span class="checkbox-toggle__inner"></span>
                </span>
                <label for="edit-${test}-passed" class="form-item__label option">Passed</label>
            </div>
            </div></div></div>`);

      } else {
        testing.append(`
          <div class="webform-element--title-inline form-type-checkbox js-form-item form-item js-form-type-checkbox form-type--checkbox form-type--boolean">
            <input data-drupal-selector="edit-test" type="checkbox" id="edit-${test}" name="${test}" value="${test}" class="form-checkbox form-boolean form-boolean--type-checkbox testingValues">
            <span class="checkbox-toggle">
              <span class="checkbox-toggle__inner"></span>
            </span>
            <label for="edit-${test}" class="form-item__label option">${test}</label>
          </div>`);
      }

    }
  }
}
})(jQuery, Drupal, drupalSettings);
