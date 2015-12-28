<?php

class ithoughts_lightbox_Admin extends ithoughts_lightbox_interface{
	public function __construct(){
		add_action( 'admin_init',	array(&$this, 'ajaxHooks') );
		add_action( 'admin_init',								array(&$this,	'register_scripts_and_styles')	);

		add_action( "admin_menu",	array(&$this, "menuPages"));

		add_action( 'admin_enqueue_scripts',					array(&$this,	'enqueue_scripts_and_styles')		);

		add_filter( 'mce_buttons',								array(&$this, "ithoughts_tt_gl_tinymce_register_buttons") );

		add_filter( "mce_external_plugins",						array(&$this, "ithoughts_tt_gl_tinymce_add_buttons") );

		add_filter( 'mce_external_languages',					array(&$this, 'tinymce_add_translations') );
	}
	public function ajaxHooks(){
		add_action( 'wp_ajax_ithoughts_lightbox_update_options',	array(&$this, 'update_options') );
	}

	public function menuPages(){
		add_options_page(__("iThoughts Lightbox", "ithoughts_lightbox"), __("iThoughts Lightbox", "ithoughts_lightbox"), "manage_options", "ithoughts_lightbox", array(&$this, "options"));
	}

	public function register_scripts_and_styles(){
		wp_register_script(
			'simple-ajax',
			parent::$base_url . '/js/simple-ajax-form.js',
			array('jquery-form')
		);

		wp_register_style(
			'ithoughts_lightbox-admin',
			parent::$base_url . '/css/ithoughts_lightbox-admin.css'
		);
	}
	public function ithoughts_tt_gl_tinymce_register_buttons( $buttons ) {
		array_push( $buttons, 'lightbox');
		return $buttons;
	}
	public function ithoughts_tt_gl_tinymce_add_buttons( $plugin_array ) {
		$plugin_array['ithoughts_lightbox_tinymce'] = parent::$base_url . '/js/ithoughts_lightbox-tinymce.js';
		return $plugin_array;
	}
	public function tinymce_add_translations($locales){
		$locales ['ithoughts_lightbox_tinymce'] = self::$base . '/../lang/ithoughts_lightbox_tinymce_lang.php';
		return $locales;
	}
	public function enqueue_scripts_and_styles($hook){
		wp_enqueue_script( 'simple-ajax' );
		wp_enqueue_style('ithoughts_lightbox-admin');
	}

	public function options(){
		$ajax         = admin_url( 'admin-ajax.php' );
		$options      = parent::$options;

		/* Add required scripts for WordPress Spoilers (AKA PostBox) */
		wp_enqueue_script('postbox');
		wp_enqueue_script('post');


		$themedropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'theme', array(
			'selected' => $options["theme"],
			'options'  => array(
				'cinema'	=> array(
					"title"	=> __('Cinema',	'ithoughts_lightbox'),
					"attrs"	=> array(
						"title"	=> __('Dark theme with very opaque black background',	'ithoughts_lightbox'),
					),
				),
				'halo'		=>	array(
					"title"	=> __('Halo',	'ithoughts_lightbox'),
					"attrs"	=> array(
						"title"	=> __('Bright theme with very opaque white background',	'ithoughts_lightbox'),
					),
				),
			)
		));
?>
<div class="wrap">
	<div id="ithoughts-lightbox-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<h2><?php _e('Options', 'ithoughts_lightbox'); ?></h2>
			<div id="dashboard-widgets-wrap">
				<div id="dashboard-widgets">
					<div id="normal-sortables" class=""><!--Old removed classes: "meta-box-sortables ui-sortable"-->
						<form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" data-target="update-response">

							<div id="ithoughts_lightbox_options_1" class="postbox">
								<div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php _e('Lightbox listing options', 'ithoughts_lightbox'); ?></span></h3>
								<div class="inside">
									<table class="form-table">
										<tbody>
											<tr>
												<th>
													<label for="autolightbox"><?php _e('Auto Lightbox', 'ithoughts_lightbox'); ?>:</label>
												</th>
												<td>
													<input autocomplete="off" type="checkbox" name="autolightbox" id="autolightbox" value="enabled" <?php echo ($options["autolightbox"] ? " checked" : ""); ?>/>
												</td>
											</tr>
											<tr>
												<th>
													<label for="loopbox"><?php _e('Loop Lightbox', 'ithoughts_lightbox'); ?>:</label>
												</th>
												<td>
													<input autocomplete="off" type="checkbox" name="loopbox" id="loopbox" value="enabled" <?php echo ($options["loopbox"] ? " checked" : ""); ?>/>
												</td>
											</tr>
											<tr>
												<th>
													<label for="zoom"><?php _e('Enable zoom if possible', 'ithoughts_lightbox'); ?>:</label>
												</th>
												<td>
													<input autocomplete="off" type="checkbox" name="zoom" id="zoom" value="enabled" <?php echo ($options["zoom"] ? " checked" : ""); ?> onchange="jQuery('#maxZoomLevel').prop('disabled', !this.checked);"/>
												</td>
											</tr>
											<tr>
												<th>
													<label for="maxZoomLevel"><?php _e('Maximum zoom level', 'ithoughts_lightbox'); ?>:</label>
												</th>
												<td>
													<input autocomplete="off" type="number" min="1" name="maxZoomLevel" id="maxZoomLevel" value="<?php echo $options["maxZoomLevel"]; ?>" <?php echo (!$options["zoom"] ? ' disabled="disabled"' : ""); ?>/>
												</td>
											</tr>
											<tr>
												<th>
													<label for="theme"><?php _e('Theme', 'ithoughts_lightbox'); ?>:</label>
												</th>
												<td>
													<?php echo $themedropdown; ?>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<p>
								<input autocomplete="off" type="hidden" name="action" value="ithoughts_lightbox_update_options"/>
								<input autocomplete="off" type="submit" name="submit" class="alignleft button-primary" value="<?php _e('Update Options', 'ithoughts_tooltip_glossary'); ?>"/>
							</p>
						</form>
						<div id="update-response" class="clear confweb-update"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
	}

	public function update_options(){
		$lightbox_options = parent::$options;

		$postValues = $_POST;
		$postValues['autolightbox']	= ithoughts_tt_gl_toggleable_to_bool($postValues,	'autolightbox',	"enabled");
		$postValues['loopbox']		= ithoughts_tt_gl_toggleable_to_bool($postValues,	'loopbox',		"enabled");
		$postValues['zoom']			= ithoughts_tt_gl_toggleable_to_bool($postValues,	'zoom',			"enabled");

		$lightbox_options = array_merge($lightbox_options, $postValues);
		$defaults = parent::getPluginOptions(true);
		foreach($lightbox_options as $optkey => $optvalue){
			if(!isset($defaults[$optkey]))
				unset($lightbox_options[$optkey]);
		}

		$outtxt = "";

		update_option( 'ithoughts_lightbox', $lightbox_options );
		parent::$options = $lightbox_options;
		$outtxt .= ('<p>' . __('Options updated', 'ithoughts_lightbox') . '</p>') ;

		die( json_encode(array(
			"text" => $outtxt,
			"valid" => true
		)));
	}
}