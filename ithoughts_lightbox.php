<?php
/*
Plugin Name: iThoughts Lightbox
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: A flexible, responsive and customizable lightbox plugin for WordPress. Express the beauty of your high definition images!
Version:     0.1.2
Author:      Gerkin
License:     GPLv2 or later
Text Domain: ithoughts_lightbox
Domain Path: /lang
*/

$ithoughts_lightbox_scripts = false;

require_once( dirname(__FILE__) . '/submodules/iThoughts-WordPress-Plugins-Toolbox/ithoughts_toolbox.class.php' );
require_once( dirname(__FILE__) . '/class/ithoughts_lightbox.class.php' );
new ithoughts_lightbox( dirname(__FILE__) );
if(is_admin()){
	require_once( dirname(__FILE__) . '/class/ithoughts_lightbox-admin.class.php' );
	new ithoughts_lightbox_Admin();
}
