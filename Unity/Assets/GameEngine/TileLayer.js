#pragma strict
import SimpleJSON;
class TileProperty { 
	var pName:String = "";
	var pValue:String = "";
}
class TilePoint { 
	var x:Number = 0;
	var y:Number = 0;
}
class TileObject {
	 var height:Number = 0;
	 var objectName:String = "";
	 var properties:Array = new Array();
	 var type:String = "";
	 var visible = true;
	 var width:Number = 0;
	 var x:Number = 0;
	 var y:Number = 0;
	 var polygon:Array = new Array();
	 
	function InitFromJSON( json:JSONNode) {
		height = json['height'].AsInt || 0;
		objectName = json['name'].Value || "";
		type = json['type'].Value || "";
		visible = json['visible'].AsBool || false;
		width = json['width'].AsInt || 0;
		x = json['x'].AsInt || 0;
		y = json['y'].AsInt || 0;
		var jsonProp = json['properties'].AsArray;
		var i = 0;
		if(jsonProp) {
			for(i = 0; i < jsonProp.Count; ++i) {
				var prop = new TileProperty();
				prop.pName = jsonProp[i]['name'].Value || "";
				prop.pValue = jsonProp[i]['value'].Value || "";
				properties.Push(prop);
			}
		}
		var jsonPoly = json['polygons'].AsArray;
		if(jsonProp) {
			for(i = 0; i < jsonProp.Count; ++i) {
				var point = new TilePoint();
				point.x = jsonProp[i]['x'].AsInt || 0;
				point.y = jsonProp[i]['y'].AsInt || 0;
				polygon.Push(point);
			}
		}
	}
}

class TileLayer {

	var data:Array = new Array();
	var height:Number = 0;
	var layerName:String = "";
	var opacity:Number = 1;
	var type:String = "";
	var visible = true;
	var width:Number = 0;
	var x:Number = 0;
	var y:Number = 0;
	var objects:Array = new Array();

	function InitFromJSON (json:JSONNode) {
		var dataArray:JSONArray = json['data'].AsArray;
		var i = 0;
		for(i = 0; i < dataArray.Count; ++i) {
			data.Push(dataArray[i].AsInt);
		}
		height = json['height'].AsInt || 0;
		layerName = json['name'].Value || "";
		opacity = json['opacity'].AsInt || 0;
		type = json['type'].Value || "";
		visible = json['visible'].AsBool || false;
		width = json['width'].AsInt || 0;
		x = json['x'].AsInt || 0;
		y = json['y'].AsInt || 0;
		var objectArray = json['objects'];
		if (objectArray) {
			for(i = 0; i < objectArray.Count; ++i) {
				var tileObject = new TileObject();
				tileObject.InitFromJSON(objectArray[i]);
				objects.Push(tileObject);
			}
		}
		
	}

	function Start () {

	}

	function Update () {

	}
}