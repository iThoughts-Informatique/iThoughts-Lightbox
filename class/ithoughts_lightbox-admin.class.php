<?php

class ithoughts_lightbox_Admin extends ithoughts_lightbox_interface{
	public function __construct(){
		add_action( 'admin_init',	array(&$this, 'ajaxHooks') );
		add_action( 'admin_init',								array(&$this,	'register_scripts_and_styles')	);

		add_action( "admin_menu",	array(&$this, "menuPages"));

		add_action( 'admin_enqueue_scripts',					array(&$this,	'enqueue_scripts_and_styles')		);
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
	}
	public function enqueue_scripts_and_styles(){
		wp_enqueue_script( 'simple-ajax' );
	}
	public function options(){
		$ajax         = admin_url( 'admin-ajax.php' );
		$options      = parent::$options;

		/* Add required scripts for WordPress Spoilers (AKA PostBox) */
		wp_enqueue_script('postbox');
		wp_enqueue_script('post');
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
													<label for="theme"><?php _e('Theme', 'ithoughts_lightbox'); ?>:</label>
												</th>
												<td>
													<select name="theme" id="theme">
													</select>
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
		$postValues['autolightbox']  = ithoughts_tt_gl_toggleable_to_bool($postValues, 'autolightbox',  "enabled");
		$postValues['loopbox']  = ithoughts_tt_gl_toggleable_to_bool($postValues, 'loopbox',  "enabled");

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