<?php
/*
Plugin Name: iThoughts Lightbox
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: The best Lightbox tool the web made
Version:     0.0
Author:      Gerkin
License:     GPLv2 or later
Text Domain: ithoughts_lightbox
Domain Path: /lang
*/

$ithoughts_lightbox_scripts = false;

require_once( dirname(__FILE__) . '/fn-lib.php' );
require_once( dirname(__FILE__) . '/class/ithoughts_lightbox.class.php' );
new ithoughts_lightbox( dirname(__FILE__) );
if(is_admin()){
	require_once( dirname(__FILE__) . '/class/ithoughts_lightbox-admin.class.php' );
	new ithoughts_lightbox_Admin();
}
