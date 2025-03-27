<?php

namespace Drupal\general\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Returns responses for general routes.
 */
class GeneralController extends ControllerBase {
  const TERMS = ['batch_no', 'component_1', 'component_2', 'component_3', 'component_4', 'component_5', 'material_1', 'material_2', 'material_3', 'material_4', 'material_5', 'product_type', 'reason_for_test', 'requested_by', 'service_required', 'testing_company'];
  
  const IGNORE_KEYS = ['test_result_1', 'test_result_2', 'test_result_3', 'test_result_4'];

  /**
   * Builds the response.
   */
  public function feed() {
    $submissions = $this->entityTypeManager()->getStorage('webform_submission')->loadByProperties(['webform_id' => 'sample_request']);
    $items = [];
    /** @var \Drupal\webform\WebformSubmissionInterface $submission */
    foreach ($submissions as $submission) {
      $data = $submission->getData();
      $this->processRows($data);
        
      $items[] = $data;
    }
    return JsonResponse::create(['items' => $items]);
  }

  private function processRows(array &$data) {
    foreach ($data as $key => $value) {
      if (in_array($key, self::IGNORE_KEYS, TRUE)) {
        unset($data[$key]);
      }
      if (in_array($key, self::TERMS, TRUE)) {
        $data[$key] = $this->getTermName($value);
      }
    }
  }

  private function getTermName($id) {
    $term = Term::load($id);
    if (!empty($term)) {
      return $term->getName();
    }
    return $id;
  }

}
