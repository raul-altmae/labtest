(function ($, Drupal, drupalSettings) {
jQuery(document).ready(() => {
  jQuery('#edit-client-protocol-name').on( "change", function() {
    const optionsObject = {
      '548': '556',
      '552': '553',
      '549': '556',
      '547': '557',
      '550': '554',
      '551': '555'
    };
    jQuery('#edit-version-').val(optionsObject[jQuery(this).val()]).change();
  });
  // Add on change event for quantity table calculations
  jQuery('.order-qty-units, .units-packed-in-cartons-qty').on("change", function() {
    const index = jQuery(this).attr("id").split('-')[3];
    cartonsPercentage(index);
    unitsNotPacked(index);
    calculateTotalPercentage();
  });


  jQuery("table[data-drupal-selector|='edit-quantity-items'] input.form-number").on('change', calcTotalQuantity);

  jQuery("#edit-customer").on('change', setTests);

  jQuery("#edit-container-testing").on('change', setTestValue);

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

function setTestValue() {
  const editTests = jQuery("#edit-tests");
  const testingValues = jQuery(".testingValues").filter(function() {
    return this.checked;
  }).map(function() {
    return jQuery(this).val();
  }).get();
  editTests.val(testingValues.join("\n"));
}

function setTests() {
  const testing = jQuery("#edit-container-testing");
  const editTests = jQuery("#edit-tests");
  const testValues = editTests.val().split("\n");
  testing.empty();
  editTests.val('');
  for (const test of drupalSettings.tests[jQuery("#edit-customer").val()]) {
    if (test !== '') {
      const checked = testValues.includes(test);
      testing.append(`
        <div class="webform-element--title-inline form-type-checkbox js-form-item form-item js-form-type-checkbox form-type--checkbox form-type--boolean">
          <input data-drupal-selector="edit-test" type="checkbox" id="edit-${test}" name="${test}" value="${test}" class="form-checkbox form-boolean form-boolean--type-checkbox testingValues" ${checked ? 'checked' : ''}>
          <span class="checkbox-toggle">
            <span class="checkbox-toggle__inner"></span>
          </span>
          <label for="edit-${test}" class="form-item__label option">${test}</label>
      </div>`);
    }
  }
}

function calcTotalQuantity()  {
  const inputName = jQuery(this).attr('class').split(' ')[0];
  let totalName = '';
  switch (inputName) {
    case 'order-qty-units':
      totalName = '#edit-total-order-qty';
      break;
    case 'shipment-qty-units':
      totalName = '#edit-total-shipment-quantity';
      break;
    case 'shipment-qty-carton':
      totalName = '#edit-total-shipment-quantity-carton';
      break;
    case 'presented_qty_for_inspection':
      totalName = '#edit-present-quantity';
      break;
    case 'units-packed-in-cartons-qty':
      totalName = '#edit-units-in-cartons';
      break;
  }
  calculateQuantityTotal(`.${inputName}`, totalName);
}

  function calcAllTotalQuantity()  {
    calculateQuantityTotal(`.order-qty-units`, '#edit-total-order-qty');
    calculateQuantityTotal(`.shipment-qty-units`, '#edit-total-shipment-quantity');
    calculateQuantityTotal(`.shipment-qty-carton`, '#edit-total-shipment-quantity-carton');
    calculateQuantityTotal(`.presented_qty_for_inspection`, '#edit-present-quantity');
    calculateQuantityTotal(`.units-packed-in-cartons-qty`, '#edit-units-in-cartons');
  }
  function calcAllTotalDefects()  {
    calculateQuantityTotal(`.defect-critical`, `#edit-total-critical`);
    calculateQuantityTotal(`.defect-major`, `#edit-total-major`);
    calculateQuantityTotal(`.defect-minor`, `#edit-total-minor`);
    const result = jQuery('#edit-result-value');
    if (Number(jQuery('#edit-total-minor').val())+ Number(jQuery('#edit-total-major').val()) + Number(jQuery('#edit-total-critical').val()) > 0 ){
      result.val('FAIL');
    } else {
      result.val('PASS');
    }
  }

function calcTotalDefects()  {
  const defectLevel = jQuery(this).attr('class').split(' ')[0].split('-')[1];
  calculateQuantityTotal(`.defect-${defectLevel}`, `#edit-total-${defectLevel}`);
  const result = jQuery('#edit-result-value');
  if (jQuery(this).val() > 0) {
    result.val('FAIL');
  } else {
    result.val('PASS');
  }
}

function calcQuantity() {
  const index = jQuery(this).attr("id").split('-')[3];
  cartonsPercentage(index);
  unitsNotPacked(index);
  calculateTotalPercentage();
}

function cartonsPercentage(index) {
  const orderQtyUnits = jQuery(`input[name|='quantity[items][${index}][order_qty_units]']`).val();
  const unitsPacketQTY = jQuery(`input[name|='quantity[items][${index}][units_packed_in_cartons_qty]']`).val();
  const packetPercentageValue = (unitsPacketQTY / orderQtyUnits)  * 100;
  const percentageString = !isNaN(packetPercentageValue) ? `${Math.round(packetPercentageValue)}%` : '0%'

  jQuery(`input[name|='quantity[items][${index}][units_packed_in_cartons_]']`).val(percentageString);
}

function unitsNotPacked(index) {
  const orderQtyUnits = jQuery(`input[name|='quantity[items][${index}][order_qty_units]']`).val();
  const unitsPacketQTY = jQuery(`input[name|='quantity[items][${index}][units_packed_in_cartons_qty]']`).val();
  const qty = orderQtyUnits - unitsPacketQTY;
  const percentage = (qty / orderQtyUnits)  * 100;
  const percentageString = !isNaN(percentage) ? `${Math.round(percentage)}%` : '0%'

  jQuery(`input[name|='quantity[items][${index}][units_finished_not_packed_qty]']`).val(qty);
  jQuery(`input[name|='quantity[items][${index}][units_finished_not_packed_]']`).val(percentageString);
}

function calculateQuantityTotal(fieldClass, totalId) {
  let orderQtyTotal = 0;
  jQuery(fieldClass).each(function () {
    orderQtyTotal += Number(jQuery(this).val());
  })
  jQuery(totalId).val(orderQtyTotal);
}

function calculateTotalPercentage() {
  const orderQtyUnits = jQuery(`#edit-total-order-qty`).val();
  const unitsPacketQTY = jQuery(`#edit-units-in-cartons`).val();
  const packetPercentageValue = (unitsPacketQTY / orderQtyUnits)  * 100;
  const percentageString = !isNaN(packetPercentageValue) ? `${Math.round(packetPercentageValue)}%` : '0%'

  const qty = orderQtyUnits - unitsPacketQTY;
  const percentage = (qty / orderQtyUnits)  * 100;
  const percentagePackageString = !isNaN(percentage) ? `${Math.round(percentage)}%` : '0%'

  jQuery(`#edit-units-in-cartons-`).val(percentageString);
  jQuery(`#edit-units-not-packaged-qty`).val(qty);
  jQuery(`#edit-units-not-packaged-`).val(percentagePackageString);
}

  function defectCode(index) {
    const defectDescription = jQuery(`select[name|='defect[items][${index}][defect_description]']`).val();
    jQuery(`input[name|='defect[items][${index}][defect_code]']`).val(drupalSettings.defectCodes[defectDescription]);
  }
})(jQuery, Drupal, drupalSettings);
