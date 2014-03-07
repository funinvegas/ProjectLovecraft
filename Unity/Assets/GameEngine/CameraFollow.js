
#pragma strict

var target : Transform;
var smoothTime = 0.3;
private var thisTransform : Transform;
private var velocity : Vector2;
private var maxDistance:Number = (0.32 * 4);
private var lockView = false;
function Start()
{
	thisTransform = transform;
}

function FixedUpdate() 
{
	var delta:Vector2 = thisTransform.position - target.position;
	var mag:Number = delta.magnitude;
	if (mag > maxDistance) {
		var newLoc:Vector2 = new Vector2(target.transform.position.x, target.transform.position.y) + (delta.normalized * maxDistance);
		
		if (newLoc.x < LevelLoader.MaxLeftPixel + (Camera.main.pixelWidth/200)) {
			newLoc.x = LevelLoader.MaxLeftPixel + (Camera.main.pixelWidth/200);
		}
		if (newLoc.x > LevelLoader.MaxRightPixel - (Camera.main.pixelWidth/200)) {
			newLoc.x = LevelLoader.MaxRightPixel - (Camera.main.pixelWidth/200);
		}
		if (newLoc.y > LevelLoader.MaxTopPixel - (Camera.main.pixelHeight/200)) {
			newLoc.y = LevelLoader.MaxTopPixel - (Camera.main.pixelHeight/200);
		}
		if (newLoc.y < LevelLoader.MaxBottomPixel + (Camera.main.pixelHeight/200)) {
			newLoc.y = LevelLoader.MaxBottomPixel + (Camera.main.pixelHeight/200);
		}
		thisTransform.position.x = newLoc.x;
		thisTransform.position.y = newLoc.y;
	}
		/*var delta:Vector2 = thisTransform.position - target.position;
	var newLoc:Vector2;
	/*var t = smoothTime * (maxDistance - delta.magnitude);
	if (t < 0) { t = 0; }
		newLoc = new Vector2(
			Mathf.SmoothDamp( 
				thisTransform.position.x, 
				target.position.x, velocity.x, t),
			Mathf.SmoothDamp( 
				thisTransform.position.y, 
				target.position.y, velocity.y, t)
			);
	Debug.Log("t = " + t);
	* /
	var mag = delta.magnitude;
	if (mag > maxDistance || lockView) {
		newLoc = target.position + (delta.normalized * Mathf.Min(maxDistance, mag));
		if (!lockView) {
			Debug.Log("locking view");
		}
		lockView = true;
	} else {
		newLoc = new Vector2(
			Mathf.SmoothDamp( 
				thisTransform.position.x, 
				target.position.x, velocity.x, smoothTime),
			Mathf.SmoothDamp( 
				thisTransform.position.y, 
				target.position.y, velocity.y, smoothTime)
			);
	}
	if (mag < maxDistance/2) {
		if (lockView) {
			Debug.Log("unlocking view");
		}
		lockView = false;
	}
	if (newLoc.x < LevelLoader.MaxLeftPixel + (Camera.main.pixelWidth/200)) {
		newLoc.x = LevelLoader.MaxLeftPixel + (Camera.main.pixelWidth/200);
	}
	if (newLoc.x > LevelLoader.MaxRightPixel - (Camera.main.pixelWidth/200)) {
		newLoc.x = LevelLoader.MaxRightPixel - (Camera.main.pixelWidth/200);
	}
	if (newLoc.y > LevelLoader.MaxTopPixel - (Camera.main.pixelHeight/200)) {
		newLoc.y = LevelLoader.MaxTopPixel - (Camera.main.pixelHeight/200);
	}
	if (newLoc.y < LevelLoader.MaxBottomPixel + (Camera.main.pixelHeight/200)) {
		newLoc.y = LevelLoader.MaxBottomPixel + (Camera.main.pixelHeight/200);
	}
	thisTransform.position.x = newLoc.x;
	thisTransform.position.y = newLoc.y;
	*/
}