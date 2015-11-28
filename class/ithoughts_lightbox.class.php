<?php

class ithoughts_lightbox_interface{
	static protected $basePlugin;
	static protected $plugin_base;
	static protected $options;
	static protected $base_url;
	static protected $base_lang;
	static protected $base;

	public function getPluginOptions($defaultsOnly = false){
		return self::$basePlugin->getOptions($defaultsOnly);
	}
}
class ithoughts_lightbox extends ithoughts_lightbox_interface{
	private $defaults;

	function __construct($plugin_base) {
		parent::$basePlugin		= &$this;
		parent::$plugin_base	= $plugin_base;
		parent::$base			= $plugin_base . '/class';
		parent::$base_lang		= $plugin_base . '/lang';
		parent::$base_url		= plugins_url( '', dirname(__FILE__) );

		$this->defaults = array(
			'version'		=> '-1',
			'autolightbox'	=> true,
			'loopbox'		=> true,
			'theme'			=> "cinema",
		);
		parent::$options		= $this->initOptions();

		add_action( 'init',                  		array(&$this,	'register_scripts_and_styles')	);
		add_action( 'wp_footer',             		array(&$this,	'wp_footer')					);
		add_action( 'wp_enqueue_scripts',    		array(&$this,	'wp_enqueue_styles')			);

		add_action( 'plugins_loaded',				array($this,	'localisation')					);

		add_filter( 'the_content', array(&$this, "filterContent") );
		//add_filter( 'img_caption_shortcode', array(&$this, "filterCaptionShortcode"), 10, 3 );
	}
	public function filterCaptionShortcode($a, $attrs, $content){
		$id = str_replace("attachment_", "", $attrs["id"]);
		$regexs = array(
			"addToExplicit" => array(
				"regex" => '/(<img(?![^>]*(?:data-lightbox="false"|data-lightbox=false|data-lightbox=\'false\'))[^>]*)(?=data-lightbox=["\']?(?:true|false)["\']?)data-lightbox=["\']?(?:true|false)["\']([^>]*>)/',
				"replace" => '$1 data-image-id="'.$id.'" data-lightbox="true" $2'
			),
			"addToImplicit" => array(
				"regex" => '/(<img(?![^>]*data-lightbox=["\']?(?:true|false)["\']?))([^>]*>)/',
				"replace" => '$1 data-image-id="'.$id.'" data-lightbox="true" $2'
			)
		);
		$content = preg_replace($regexs["addToExplicit"]["regex"],$regexs["addToExplicit"]["replace"], $content);
		$content = preg_replace($regexs["addToImplicit"]["regex"],$regexs["addToImplicit"]["replace"], $content);
		//'<img data-lightbox="true" class="wp-image-'.$id.'" size-thumbnail" src="http://wordpress.loc/wp-content/uploads/2015/10/neural-network-360-cylinder.jpgb508790f-63c7-4098-b5e1-a1328d1ebb40Original-150x150.jpg" alt="neural network 360 cylinder.jpgb508790f-63c7-4098-b5e1-a1328d1ebb40Original" width="150" height="150">
		return $content;//$atts	 . "SHORTCODED";
	}
	private function initOptions(){
		return array_merge($this->getOptions(true), get_option( 'ithoughts_lightbox', $this->getOptions(true) ));
	}
	public function getOptions($onlyDefaults = false){
		if($onlyDefaults)
			return $this->defaults;

		return $this->options;
	}

	public function localisation(){
		load_plugin_textdomain( 'ithoughts_lightbox', false, plugin_basename( dirname( __FILE__ ) )."/../lang" );
	}

	private function add_shortcodes(){
	}

	public function register_scripts_and_styles(){
		wp_register_script(
			'ithoughts_lightbox',
			parent::$base_url . '/js/ithoughts_lightbox.js',
			NULL
		);

		$opts = parent::$options;
		unset($opts["version"],$opts["autolightbox"]);
		wp_localize_script(
			'ithoughts_lightbox',
			'ithoughts_lightbox',
			$opts
		);



		wp_register_style(
			'ithoughts_lightbox',
			parent::$base_url . '/css/ithoughts_lightbox.css'
		);
	}

	public function wp_footer(){
		global $ithoughts_lightbox_scripts;
		if( !$ithoughts_lightbox_scripts )
			return;

		wp_print_scripts('ithoughts_lightbox');
	}

	public function wp_enqueue_styles(){
		wp_enqueue_style('ithoughts_lightbox');
	}

	public function filterContent($content){
		global $ithoughts_lightbox_scripts;

		if(!is_single())
			return $content;

		$count;
		$content = preg_replace("/(<img)(?!.*data-lightbox=)([^>]*>)/", '$1 data-lightbox="'.(parent::$options["autolightbox"] ? "true" : "false").'"$2', $content, -1, $count);
		$idmatches;
		preg_match_all("/<img(?=.*data-lightbox=(?:\"true\"|true|'true'))[^>]*class=\"[^\"]*wp-image-(\d+)[^\"]*\"[^>]*>/",$content, $idmatches);
		foreach($idmatches[0] as $matchIndex => $matchedString){
			$attachment = wp_get_attachment_image_src( $idmatches[1][$matchIndex], "ful", false );
			$content = str_replace($idmatches[0][$matchIndex], preg_replace("/<img(.*)>/", "<img data-lightbox-fullwidth=\"".$attachment[0]."\"$1>", $idmatches[0][$matchIndex]), $content);
		}
		if($count){
			$ithoughts_lightbox_scripts = true;
		}
		return $content;
	}
}