#pragma strict
import System.IO;
import SimpleJSON;

var mapFile:String = "";
var spriteTemplate:Transform = null;
private var tileIDToSpriteMap: Array = new Array();
private var tileLayers:Array = new Array();

function Start () {
   if (mapFile) {
   var fileName = Application.dataPath + mapFile;
   Debug.Log("Reading Map File: " + fileName);
   var fileText = ReadFile(fileName);
   var fileData = JSON.Parse(fileText);
   Debug.Log(fileData);
   var pathToMap = mapFile.Substring(0, Mathf.Max(mapFile.LastIndexOf('\\'), mapFile.LastIndexOf('/')) + 1);
   LoadTileSets(fileData['tilesets'].AsArray, pathToMap);
   LoadTileLayers(fileData['layers'].AsArray);
  } else {
  	Debug.Log("Missing Map File Name");
  }
  DrawTileLayers();
}

function Update () {

}

function WriteFile(filepathIncludingFileName : String, content: String)
{
    var sw : StreamWriter = new StreamWriter(filepathIncludingFileName);
    sw.WriteLine("Line to write");
    sw.WriteLine("Another Line");
    sw.Flush();
    sw.Close();
}

function ReadFile(filepathIncludingFileName : String) {
    var sr = new File.OpenText(filepathIncludingFileName);
    var returnVal = ""; 
    var input = "";
    while (true) {
        input = sr.ReadLine();
        if (input == null) { break; }
        returnVal += input;
        //Debug.Log(input);
    }
    sr.Close();
    return returnVal;
}

function FilePathToResourcePath(filePath:String) {
	var resourceExtensionStart = filePath.LastIndexOf('.');
	var resourcesString = "Resources";
	var resourcePathStart = filePath.IndexOf(resourcesString) + resourcesString.Length + 1;
	return filePath.Substring(resourcePathStart, resourceExtensionStart - resourcePathStart);
}

function LoadTileSets(tileSets: JSONArray, referencePath: String) {
	for (var i = 0; i < tileSets.Count; ++i) {
		var expectedOffset = tileSets[i]['firstgid'].AsInt;
		
		var tilesAcross:Number = tileSets[i]['imagewidth'].AsInt / tileSets[i]['tilewidth'].AsInt;
		var tilesTall:Number = tileSets[i]['imageheight'].AsInt / tileSets[i]['tileheight'].AsInt;
		var image:String = tileSets[i]['image'].Value;
		var resourceName = FilePathToResourcePath(image);
		Debug.Log(resourceName);
		Debug.Log(image);
		//var resourceName = "PublicDomain/tiles_12";
		var textures:Array = Resources.LoadAll(resourceName, Sprite);
		for(var texIndex = 0; texIndex < textures.length; ++texIndex) {
			var sp:Sprite = textures[texIndex] as Sprite;
			while( tileIDToSpriteMap.length < expectedOffset + texIndex ) {
				Debug.Log("Pushing null for " + tileIDToSpriteMap.length);
				tileIDToSpriteMap.Push(null);
			}
			tileIDToSpriteMap[expectedOffset + texIndex] = sp;
		}
	}
}

function LoadTileLayers(jsonLayers: JSONArray) {
	for( var i = 0; i < jsonLayers.Count; ++i) {
		var layer:TileLayer = new TileLayer();
		layer.InitFromJSON(jsonLayers[i]);
		tileLayers.Push(layer);
		
	}
}
function DrawTileLayer(layer:TileLayer, layerIndex:Number) {
	var tileData:Array = layer.data;
	if (tileData.length > 0 ) {
		var width = layer.width;
		Debug.Log("Drawing " + tileData.length + " tiles");
		for( var i = 0; i < tileData.length; ++i) {
			var tileID:int = System.Convert.ToInt32(tileData[i]);
			if (tileID > 0 ) {
				var sp:Sprite = tileIDToSpriteMap[tileID] as Sprite;
				if (sp) {
					var vec:Vector3 = Vector3(transform.position.x + i%width * 0.32, 
										      transform.position.y + Mathf.Floor(i/width) * -0.32, 
										      transform.position.z - layerIndex);
					Debug.Log("Drawing " + sp.name + " at " + vec.x + "," + vec.y );
					var obj = Instantiate (sp, vec, Quaternion.identity);
					var t = Instantiate( spriteTemplate, vec, Quaternion.identity);
				    var spriteRenderer:SpriteRenderer = t.GetComponent(SpriteRenderer);
				    spriteRenderer.sprite = obj;
				    t.transform.parent = transform;
				} else {
					Debug.Log("Missing Sprite " + tileID);
				}
			}
		}
	}
}
function DrawTileLayers() {
	for( var i = 0; i < tileLayers.length; ++i) {
		DrawTileLayer(tileLayers[i] as TileLayer, i);
	}
}
