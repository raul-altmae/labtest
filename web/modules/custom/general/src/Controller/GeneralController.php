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
  const SAMPLE_REQUEST_TERMS = ['country', 'customer', 'product', 'order_raised_by', 'sample_type', 'size_autocomplete', 'care_label', 'edge_finishing', 'stitch_pattern', 'needle_spacing', 'packaging', 'shipping_method', 'current_status', 'china'];

  /**
   * Builds the response.
   */
  public function feed() {
    $submissions = $this->entityTypeManager()->getStorage('webform_submission')->loadByProperties(['webform_id' => 'sample_request']);
    $items = [];
    /** @var \Drupal\webform\WebformSubmissionInterface $submission */
    foreach ($submissions as $submission) {
      $data = $submission->getData();
      $this->processTerms($data);
      $data['required_date_of_arrival'] = DrupalDateTime::createFromFormat('Y-m-d', $data['required_date_of_arrival'])->format('c');
      $items[] = $data;
    }
    return JsonResponse::create(['items' => $items]);
  }

  private function processTerms(array &$data) {
    foreach ($data as $key => $value) {
      if (in_array($key, self::SAMPLE_REQUEST_TERMS, TRUE)) {
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
