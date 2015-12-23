<?php # -*- coding: utf-8 -*-

// This file is based on wp-includes/js/tinymce/langs/wp-langs.php

if ( ! defined( 'ABSPATH' ) )
    exit;

if ( ! class_exists( '_WP_Editors' ) )
    require( ABSPATH . WPINC . '/class-wp-editor.php' );

function ithoughts_lightbox_tinymce_plugin_translation() {
    $strings = array(
        "set_lightboxes" => __('Configure lightboxes','ithoughts_lightbox'),
    );
    $locale = _WP_Editors::$mce_locale;
    $translated = 'tinyMCE.addI18n("' . $locale . '.ithoughts_lightbox_tinymce", ' . json_encode( $strings ) . ");\n";

     return $translated;
}

$strings = ithoughts_lightbox_tinymce_plugin_translation();

