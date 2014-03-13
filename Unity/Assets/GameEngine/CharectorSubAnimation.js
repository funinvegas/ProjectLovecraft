#pragma strict
function OnAnimationEvent(event:String) {
	//Debug.Log("CharectorSubAnimation");
	var mainChar = transform.parent.gameObject.GetComponent("MainCharector") as MainCharector;
	//Debug.Log("mainChar = " + mainChar);
	mainChar.OnAnimationEvent(event);
}
function Start () {

}

function Update () {

}