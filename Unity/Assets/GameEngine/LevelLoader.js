#pragma strict
import System.IO;
import SimpleJSON;

var mapFile:String = "";
private var tileIDToSpriteMap: Array;

function Start () {
   if (mapFile) {
   var fileName = Application.dataPath + mapFile;
   Debug.Log("Reading Map File: " + fileName);
   var fileText = ReadFile(fileName);
   var fileData = JSON.Parse(fileText);
   Debug.Log(fileData);
   var pathToMap = mapFile.Substring(0, Mathf.Max(mapFile.LastIndexOf('\\'), mapFile.LastIndexOf('/')) + 1);
   LoadTileSets(fileData['tilesets'].AsArray, pathToMap);
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
        Debug.Log("line="+input);
    }
    sr.Close();
    return returnVal;
}

function LoadTileSets(tileSets: JSONArray, referencePath: String) {
	/*var tileID = 0;
	for (var i = 0; i < tileSets.Count; ++i) {
	    var tilesAcross:Number = tileSets[i]['imagewidth'].AsInt / tileSets[i]['tilewidth'].AsInt;
		var tilesTall:Number = tileSets[i]['imageheight'].AsInt / tileSets[i]['tileheight'].AsInt;
		var image:String = tileSets[i]['image'].Value;
		var resourceName = Application.dataPath + referencePath + image.Substring(0, image.LastIndexOf('.'));
		var resourceExtension = image.Substring(image.LastIndexOf('.'));
		*/
		var resourceName = "PublicDomain";
		var textures = Resources.LoadAll(resourceName, Texture2D);
		Debug.Log(resourceName);
		Debug.Log(textures);
		Debug.Log(textures.Length);
		textures = Resources.LoadAll(resourceName, Sprite);
		Debug.Log(resourceName);
		Debug.Log(textures);
		Debug.Log(textures.Length);
		return;
/*	    string[] names = new string[textures.Length];
	     
	    for(int ii=0; ii< names.Length; ii++) {
	    	names[ii] = textures[ii].name;
	    }
  */   
    //Sprite sprite = textures[Array.IndexOf(names, "textureName")];
	/*	
		
		for(var tileX = 0; tileX < tilesAcross; ++tileX) {
			for(var tileY = 0; tileY < tilesTall; ++tileY) {
			    var assetPath:String = resourceName + "_" + tileID;// + resourceExtension;
			    Debug.Log(assetPath);
//			    Resources.LoadAssetAtPath
				var texture:Texture2D = Resources.LoadAssetAtPath(assetPath, Texture2D) as Texture2D;
//				var texture:Texture2D = AssetDatabase.LoadAssetAtPath(assetPath, Texture2D) as Texture2D;
				Debug.Log(texture);
				tileIDToSpriteMap.Push(texture);
				tileID += 1;
			}
		}
	}*/
}

