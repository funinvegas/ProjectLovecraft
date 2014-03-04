#pragma strict
import System.IO;
import SimpleJSON;

var mapFile:String = "";
private var tileIDToSpriteMap: Array = new Array();
private var tileIDs:Array = new Array();

function Start () {
   if (mapFile) {
   var fileName = Application.dataPath + mapFile;
   Debug.Log("Reading Map File: " + fileName);
   var fileText = ReadFile(fileName);
   var fileData = JSON.Parse(fileText);
   Debug.Log(fileData);
   var pathToMap = mapFile.Substring(0, Mathf.Max(mapFile.LastIndexOf('\\'), mapFile.LastIndexOf('/')) + 1);
   LoadTileSets(fileData['tilesets'].AsArray, pathToMap);
   LoadTileIds(fileData[
  } else {
  	Debug.Log("Missing Map File Name");
  }
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
        Debug.Log(input);
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
	var tileID = 0;
	for (var i = 0; i < tileSets.Count; ++i) {
	    var tilesAcross:Number = tileSets[i]['imagewidth'].AsInt / tileSets[i]['tilewidth'].AsInt;
		var tilesTall:Number = tileSets[i]['imageheight'].AsInt / tileSets[i]['tileheight'].AsInt;
		var image:String = tileSets[i]['image'].Value;
		var resourceName = FilePathToResourcePath(image);
		Debug.Log(resourceName);
		//var resourceName = "PublicDomain/tiles_12";
		var textures:Array = Resources.LoadAll(resourceName, Sprite);
		Debug.Log(textures);
		Debug.Log(textures.length);
		for(var texIndex = 0; texIndex < textures.length; ++texIndex) {
			tileIDToSpriteMap.Push(textures[texIndex]);
		}
	}
}

