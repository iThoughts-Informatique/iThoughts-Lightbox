<?php

if(!class_exists("ithoughts_toolbox")){
	class ithoughts_toolbox {
		public static function concat_attrs($attrs){
			$str = "";
			foreach($attrs as $key => $value){
				if(isset($value) && $value != NULL){
					$str .= ' '.$key.'="'.str_replace(array('"', "'"), array("&quot;", "&apos;"), $value).'"';
				}
			}
			return $str;
		}
		public static function generate_input_select($name, $options){
			$strret = '<select name="'.$name.'"';
			if(!isset($options["attributes"]))
				$options["attributes"] = array();
			if(!isset($options["attributes"]["id"]))
				$options["attributes"]["id"] = $name;
			if(!isset($options["attributes"]["autocomplete"]))
				$options["attributes"]["autocomplete"] = "off";

			$strret .= ithoughts_toolbox::concat_attrs($options["attributes"]);
			if(isset($options["multiple"]) && $options["multiple"])
				$strret .= " multiple";
			$strret .= ">";

			if(isset($options["options"]) && is_array($options["options"])){
				if(array_values($options["options"]) === $options["options"]){
					foreach($options["options"] as $value){
						$strret .= '<option value="'.$value.'">'.$value.'</option>';
					}
				} else {
					foreach($options["options"] as $key => $value){
						$strret .= '<option value="'.$key.'" ';
						if(is_array($value)){
							if(!isset($value["attributes"]))
								$options["attributes"] = array();
							$strret .= ithoughts_toolbox::concat_attrs($value["attributes"]);
						}
						if(isset($options["selected"]) && ((is_array($options["selected"]) && in_array($key, $options["selected"])) || (!is_array($options["selected"]) && $options["selected"] == $key)))
							$strret .= ' selected="selected"';
						$strret .= '>';
						if(is_array($value)){
							if(isset($value["text"]) && $value["text"]){
								$strret .= $value["text"];
							} else {
								$strret .= $key;
							}
						} else {
							$strret .= $value;
						}
						$strret .= '</option>';
					}
				}
			}

			$strret .= "</select>";
			return $strret;
		}
		/* Format:
		$ret = ithoughts_toolbox::generate_input_check(
			"name",
			array(
				"radio" => false, // Will display the inputs as radio buttons if true, checkboxes elsewhere
				"selected" => array("opt1", "opt2"), // The current value(s) selected. If one single, accepts string
				"options" => array(
					"opt1" => array(
						"attributes" => array() // Optionnal. All attributes in this array will be concatenated in the input, eg styles, ID, class, etc
					),
					"opt2" => array(
						"attributes" => array(
							"style" => "color: #fff;"
						)
					),
					"opt3" => array()
					),
				)
			)
		);

		// Will return an array, then display each checkbox that way:
		> echo $ret["opt2"];

		>> <input type="checkbox" checked="checked" style="color:#fff;" name="name" value="opt2" id="name_opt2"/>
		*/
		public static function generate_input_check($name, $options){
			$ret = array();
			$allLabeled = true;
			if(!isset($options["options"]))
				return $ret;

			if(!is_array($options["options"]))
				$options["options"] = array($options["options"]);

			foreach($options["options"] as $option => $data){
				$str = "";
				$strLabel = NULL;
				if(isset($data["label"]) && $data["label"]){
					if($data["label"] != null && is_array($data["label"])){
						if(isset($data["label"]["text"])){
							$strLabel = $data["label"]["text"];
							$attrs = "";
							if(isset($data["label"]["attributes"]) && is_array($data["label"]["attributes"])){
								$attrs = ithoughts_toolbox::concat_attrs($data["label"]["attributes"]);
							}
							$str .= '<label for="'.$name."_".$option.' '.$attrs.'">&nbsp;';
						}
					} else {
						$str .= '<label for="'.$name."_".$option.'">&nbsp;';
						$strLabel = $data["label"];
					}
				} else {
					$allLabeled = false;
				}
				$str .= '<input name="'.$name.'"';
				if(isset($options["radio"]) && $options["radio"])
					$str .= ' type="radio"';
				else
					$str .= ' type="checkbox"';
				$str .= ' value="'.$option.'"';
				if(!isset($data["attributes"]))
					$data["attributes"] = array();
				if(!isset($data["attributes"]["id"]))
					$data["attributes"]["id"] = $name."_".$option;
				if(!isset($data["attributes"]["autocomplete"]))
					$data["attributes"]["autocomplete"] = "off";

				$str .= ithoughts_toolbox::concat_attrs($data["attributes"]);
				if(isset($options["selected"]) && ((is_array($options["selected"]) && in_array($option, $options["selected"])) || (!is_array($options["selected"]) && $options["selected"] == $option)))
					$str .= ' checked="checked"';
				$str .= '/>';
				if($strLabel != NULL){
					$str .= '&nbsp;'.$strLabel.'</label>';
				}

				$ret[$option] = $str;
			}
			if($allLabeled && isset($options["implode"])){
				$ret = implode($options["implode"], $ret);
			} else if(count($ret) == 1){
				$keys = array_keys($ret);
				return $ret[$keys[0]];
			}
			return $ret;
		}
		public static function generate_input_color($name, $value){

		}
		public static function generate_input_text($name, $options){
			$str = '<input name="'.$name.'"';
			if(isset($options["type"]))
				$str .= ' type="'.$options["type"].'"';
			if(isset($options["value"]) && $options["value"] !== NULL && trim($options["value"]) != "")
				$str .= ' value="'.$options["value"].'"';

			if(!isset($options["attributes"]))
				$options["attributes"] = array();
			if(!isset($options["attributes"]["id"]))
				$options["attributes"]["id"] = $name;
			if(!isset($options["attributes"]["autocomplete"]))
				$options["attributes"]["autocomplete"] = "off";

			$str .= ithoughts_toolbox::concat_attrs($options["attributes"]);
			$str .= '/>';
			return $str;
		}
		/**************************************************************************************************************************************************************************************************************\
|**************************************************************************************************************************************************************************************************************|
\**************************************************************************************************************************************************************************************************************/
		public static function unaccent( $text, $from = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ", $to = "AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn", $encoding = "UTF-8" ){
			$l = mb_strlen($text, $encoding);
			$out = "";
			for($i = 0; $i < $l; $i++){
				$c = mb_substr($text, $i, 1, $encoding);
				$t = mb_strpos($from,$c,0,$encoding);
				if($t === false)
					$out .= $c;
				else
					$out .= mb_substr($to, $t, 1, $encoding);
			}
			return $out;
		}
		public static function decode_json_attr($str){
			return json_decode(html_entity_decode($str), true);
		}
		public static function encode_json_attr($obj){
			return htmlentities(json_encode($obj));
		}
		public static function array_flatten($array) {
			$return = array();
			foreach ($array as $key => $value) {
				if (is_array($value)){
					$return = array_merge($return, ithoughts_toolbox::array_flatten($value));
				} else {
					$return[$key] = $value;
				}
			}

			return $return;
		}
		/**************************************************************************************************************************************************************************************************************\
|**************************************************************************************************************************************************************************************************************|
\**************************************************************************************************************************************************************************************************************/
		public static function checkbox_to_bool($array,$key, $truevalue){
			if(!isset($array[$key]))
				return false;
			if($array[$key] === true)
				return true;
			return $array[$key] === $truevalue;
		}
	}
}