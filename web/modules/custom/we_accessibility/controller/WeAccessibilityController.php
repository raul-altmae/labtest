<?php

//Calling from the Controller
/**
* @file
* Contains \Drupal\we_accessibility\Controller\LotusController.php
*/
namespace Drupal\we_accessibility\Controller;

use Drupal\Core\Controller\ControllerBase;

class WeAccessibilityController extends ControllerBase {
  public function content() {
    return array(
      '#theme' => 'we-accessibility'
    );

  }
}