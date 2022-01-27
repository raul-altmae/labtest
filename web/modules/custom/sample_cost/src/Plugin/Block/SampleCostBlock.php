<?php

namespace Drupal\sample_cost\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides an example block.
 *
 * @Block(
 *   id = "sample_cost",
 *   admin_label = @Translation("Sample Cost"),
 *   category = @Translation("Sample Cost")
 * )
 */
class SampleCostBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private EntityTypeManagerInterface $entityTypeManager;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $webformSubmissions = $this->entityTypeManager->getStorage('webform_submission')->loadByProperties(['webform_id' => 'sample_request']);
    $currentYear = DrupalDateTime::createFromFormat('Y-m-d', date('Y').'-01-01');
    $sampleCost = 0;
    $carrierCost = 0;
    /** @var \Drupal\webform\WebformSubmissionInterface $webformSubmission */
    foreach ($webformSubmissions as $webformSubmission) {
      $webformData = $webformSubmission->getData();
      $orderDate = DrupalDateTime::createFromFormat('Y-m-d', $webformData['order_date']);
      if (isset($webformData['china'])) {
        /** @var Term $china */
        $china = Term::load($webformData['china']);
        if (!empty($china) && strtolower($china->getName()) === 'yes' && $orderDate >= $currentYear) {
          $sampleCost += (float) $webformData['total_cost_of_order'];
          $carrierCost += (float) $webformData['courier_cost_usd'];
        }
      }
    }

    return [
      'sample_cost' => $sampleCost,
      'carrier_cost' => $carrierCost,
      'total' => $sampleCost + $carrierCost,
    ];
  }

}
