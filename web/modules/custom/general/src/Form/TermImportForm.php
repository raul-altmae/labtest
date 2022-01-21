<?php

namespace Drupal\general\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\taxonomy\Entity\Term;

/**
 * Provides a general form.
 */
class TermImportForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'general_term_import';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['vid'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Term vid'),
      '#required' => TRUE,
    ];

    $form['terms'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Terms'),
      '#description' => $this->t('Each term should be on a newline'),
      '#required' => TRUE,
    ];

    $form['actions'] = [
      '#type' => 'actions',
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Send'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $vid = $form_state->getValue('vid');
    $status = 'Ended loading Terms: <br>';
    foreach (explode("\n",$form_state->getValue('terms')) as $termName) {
      $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => $vid, 'name' => $termName]);
      $term = array_shift($term);
      if (empty($term)) {
        $term = Term::create([
          'vid' => $vid,
          'name' => $termName
        ]);
        $term->save();
        $status .= "Term with name $termName added <br>";
      } else {
        $status .= "Term with name $termName exists <br>";
      }
    }
    $this->messenger()->addStatus(['#markup' => $status]);
  }

}
