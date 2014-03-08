#pragma strict

var maxSpeed:Number = 10f;
private var facing = "E"; // (N)orth (S)outh (E)ast (W)est 
private var anim:Animator = null;
private var direction = 4;
private var currentAction = 0;

function Start () {
	anim = gameObject.GetComponent("Animator") as Animator;
	anim.speed = 0;
	anim.SetInteger("action", currentAction);
	anim.SetInteger("direction", direction);
}
function ActionFinished() {
	currentAction = 0;
	anim.SetInteger("action", currentAction);
}
function FixedUpdate () {
	var walking = true;
	var fire1 = Input.GetButton("Fire1");
	if (fire1) {
		walking = false;
		currentAction = 1;
		anim.SetInteger("action", currentAction);
	} else {
		var fire2 = Input.GetButton("Fire2");
		if (fire2) {
			walking = false;
			currentAction = 2;
			anim.SetInteger("action", currentAction);
		}
	}
	if (walking && currentAction == 0) {
		var EWMove = Input.GetAxis("Horizontal");
		var NSMove = Input.GetAxis("Vertical");
		rigidbody2D.velocity = new Vector2(EWMove * maxSpeed, NSMove * maxSpeed);
		var oldDir = direction;
		if (Mathf.Abs(EWMove) > Mathf.Abs(NSMove)) {
			// moving east west
			if (EWMove > 0) {
				if (direction != 1) { Debug.Log("Direction =  1"); }
				direction = 1;
			} else {
				if (direction != 2) { Debug.Log("Direction =  2"); }
				direction = 2;
			}
		} else {
			// moving north south
			if (NSMove > 0) {
				if (direction != 3) { Debug.Log("Direction =  3"); }
				direction = 3;
			} else if(NSMove < 0) {
				if (direction != 4) { Debug.Log("Direction =  4"); }
				direction = 4;
			}
		}
		if (oldDir != direction) {
			anim.SetInteger("direction", direction);
		}
		
		var mag = rigidbody2D.velocity.magnitude;
		anim.speed = mag/maxSpeed;
		if (anim.speed != 0 ) 
		Debug.Log("Max speed = " + anim.speed);
	} else {
		anim.speed = 1;
		rigidbody2D.velocity = new Vector2(0, 0);
	}
	
}
function Update () {

}