<?php

namespace Drupal\we_accessibility\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;

/**
 * Provides a 'WeAccessibility' block.
 *
 * @Block(
 *  id = "we_accessibility",
 *  admin_label = @Translation("Accessibility Block"),
 * )
 */
class WeAccessibilityBlock extends BlockBase implements FormInterface {

  public function build() {
    /** @var \Drupal\Core\Form\FormBuilderInterface $formBuilder */
    $formBuilder = \Drupal::service('form_builder');

    $build = [];
    $build['we_accessibility_block'] = [
      '#attributes' => array('class' => 'accessibility-form'),
      '#theme' => 'we_accessibility',
      '#form' => $formBuilder->getForm($this),
      '#attached' => array(
        'library' => array(
          'we_accessibility/accessibility',
        ),
      ),
    ];
    $build['#cache']['max-age'] = 0;
    return $build;
  }

  public function getFormId() {
    return 'we_accessibility_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $tempstore = \Drupal::service('tempstore.private')->get('we_accessibility');
    $fontSize = $tempstore->get('font_size') ? $tempstore->get('font_size') : '0';
    $lineHeight = $tempstore->get('line_height') ? $tempstore->get('line_height') : '0';
    $contrast = $tempstore->get('contrast') ? $tempstore->get('contrast') : '0';
    $noStyles = $tempstore->get('options[u-no-styles]') ? $tempstore->get('options[u-no-styles]') : '0';
    $noColors = $tempstore->get('options[u-no-colors]') ? $tempstore->get('options[u-no-colors]') : '0';
    $form['font_size'] = array(
      '#type' => 'radios',
      '#title' => $this
        ->t('Text size'),
      '#default_value' => $fontSize,
      '#options' => array(
        'u-fz-2' => $this
          ->t('Extra large'),
        'u-fz-1' => $this
          ->t('Large'),
        '0' => $this
          ->t('Default'),
      ),
      '#ajax' => array(
        'callback' => '::autosave',
        'event' => 'change',
        'wrapper' => 'ajax_placeholder',
        'progress' => array(
          'type' => 'throbber',
          'message' => NULL,
        ),
      ),
    );

    $form['line_height'] = array(
      '#type' => 'radios',
      '#title' => $this
        ->t('Line height'),
      '#default_value' => $lineHeight,
      '#options' => array(
        'u-lh-2' => $this
          ->t('Extra large'),
        'u-lh-1' => $this
          ->t('Large'),
        '0' => $this
          ->t('Default'),
      ),
      '#ajax' => array(
        'callback' => '::autosave',
        'event' => 'change',
        'wrapper' => 'ajax_placeholder',
        'progress' => array(
          'type' => 'throbber',
          'message' => NULL,
        ),
      ),
    );

    $form['contrast'] = array(
      '#type' => 'radios',
      '#title' => $this
        ->t('Contrast'),
      '#default_value' => $contrast,
      '#options' => array(
        'u-contrast-1' => $this
          ->t('High contrast'),
        '0' => $this
          ->t('Default')
      ),
      '#ajax' => array(
        'callback' => '::autosave',
        'event' => 'change',
        'wrapper' => 'ajax_placeholder',
        'progress' => array(
          'type' => 'throbber',
          'message' => NULL,
        ),
      ),
    );

    $form['other'] = array(
      '#type' => 'fieldgroup',
      '#title' => $this->t('Other options'),
      '#attributes' => array(
        'class' => 'fieldgroup fieldgroup-other',
      ),
    );

    $form['other']['options'] = array(
      '#type' => 'checkboxes',
      '#options' => array(
        'u-no-styles' => $this
          ->t('Remove all styles'),
        'u-no-colors' => $this
          ->t('Remove backgrounds and colors'),
      ),
      '#ajax' => array(
        'callback' => '::autosave',
        'event' => 'change',
        'wrapper' => 'ajax_placeholder',
        'progress' => array(
          'type' => 'throbber',
          'message' => NULL,
        ),
      ),
    );

    $form['other']['actions'] = array(
      '#type' => 'item',
      '#weight' => 3,
      '#attributes' => array(
        'class' => array('form-reset'),
      ),
    );

    $form['other']['actions']['reset'] = array(
      '#type' => 'button',
      '#value' => $this->t('Reset options'),
      '#attributes' => array(
        'class' => array('button-reset'),
      ),
      '#ajax' => array(
        'callback' => '::resetFormOptions',
        'event' => 'click',
        'wrapper' => 'ajax_placeholder',
        'progress' => array(
          'type' => 'throbber',
          'message' => NULL,
        ),
      ),
    );

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#name' => '',
    ];

    // Add placeholder for Ajax response markup
    $form['ajax_response'] = array(
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#value' => t('Placeholder for ajax response'),
      '#attributes' => array(
        'class' => array('hidden'),
        'id' => array('ajax_placeholder'),
      ),
    );

    return $form;
  }

  public function autosave(array &$form, FormStateInterface $form_state) {
    $elem = $form_state->getTriggeringElement();
    $elemID = $elem['#id'];
    $elemName = $elem['#name'];
    $elemValue = $elem['#value'];

    $tempstore = \Drupal::service('tempstore.private')->get('we_accessibility');
    $tempstore->set($elemName, $elemValue);

    $response = new AjaxResponse();
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', [$elemName, $elemValue]));

    return $response;
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

  public function resetFormOptions(array &$form, FormStateInterface $form_state) {
    $tempstore = \Drupal::service('tempstore.private')->get('we_accessibility');
    $tempstore->set('font_size','0');
    $tempstore->set('line_height','0');
    $tempstore->set('contrast','0');
    $tempstore->set('options[u-no-styles]','0');
    $tempstore->set('options[u-no-colors]','0');

    $response = new AjaxResponse();
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', ['font_size', '0']));
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', ['line_height', '0']));
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', ['contrast', '0']));
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', ['options[u-no-styles]', '0']));
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', ['options[u-no-colors]', '0']));
    $response->addCommand(new InvokeCommand(NULL, 'setAccessibility', ['reset', '.we-accessibility-form']));

    return $response;
  }
}
