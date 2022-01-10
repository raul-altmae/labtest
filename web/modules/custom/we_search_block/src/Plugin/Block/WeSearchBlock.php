<?php

namespace Drupal\we_search_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Provides a 'WESearchBlock' block.
 *
 * @Block(
 *  id = "we_search_block",
 *  admin_label = @Translation("Search block"),
 * )
 */
class WeSearchBlock extends BlockBase implements FormInterface {

  public function build() {
    /** @var \Drupal\Core\Form\FormBuilderInterface $formBuilder */
    $formBuilder = \Drupal::service('form_builder');

    $build[] = $formBuilder->getForm($this);
    $build[] = [
      '#type' => 'html_tag',
      '#tag' => 'button',
      '#value' => $this->t('Toggle search'),
      '#attributes' => [
        'class' => ['btn', 'btn--searchform-toggle'],
        'data-searchform-toggle' => ''
      ]
    ];

    $build['#attributes']['class'][] = 'search-block-form';

    return $build;
  }

  public function getFormId() {
    return 'we_search_block_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $route = 'view.search.search';

    $form['#action'] = Url::fromRoute($route)->toString();
    $form['#method'] = 'get';

    $form['keys'] = [
      '#type' => 'search',
      '#title' => $this->t('Search'),
      '#title_display' => 'invisible',
      '#size' => 15,
      '#default_value' => '',
      '#attributes' => [
        'title' => $this->t('Enter the terms you wish to search for.'),
        'placeholder' => $this->t('Search from page')
      ],
    ];

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Search'),
      '#name' => '',
    ];

    $form['#after_build'][] = '::removeFormIds';

    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {}

  public function submitForm(array &$form, FormStateInterface $form_state) {}

  public function removeFormIds(array $form) {
    unset($form['form_token']);
    unset($form['form_build_id']);
    unset($form['form_id']);
    return $form;
  }
}