#pragma strict

var maxSpeed:Number = 10f;
private var facing = "E"; // (N)orth (S)outh (E)ast (W)est 
public var anim:Animator = null;
var direction = 4;
private var currentAction = 0;
var weaponSwish:GameObject = null;
var chargeUp:GameObject = null;
private var charging = false;

class PlayerState {
	var player:MainCharector = null;
	function PlayerState(previousState:PlayerState) {
		Debug.Log("previousState = " + previousState);
		Debug.Log("newState = " + this);
		if(previousState) {
			player = previousState.player;
		}
	}
	function OnFire1Down() {
		return this;
	}
	function OnFire1Up() {
		return this;
	}
	function OnFire2Down() {
		return this;
	}
	function OnFire2Up() {
		return this;
	}
	function OnFire3Down() {
		return this;
	}
	function OnFire3Up() {
		return this;
	}
	function ApplyDirection(xAxis:float, yAxis:float) {
		return this;
	}
	function OnAnimationEvent(event:String) {
		return this;
	}
	function Destroy() {
	}
}

class PlayerStateWalking extends PlayerState {
	function PlayerStateWalking(previousState:PlayerState) {
		super(previousState);
		if (previousState) {
			player.anim.speed = 0;
			player.anim.SetInteger("action", 0);
		}
	}
	function OnFire1Down() {
		return new PlayerStateCharging(this);
	}
	function ApplyDirection(xAxis:float, yAxis:float) {
		player.UpdateDirection(xAxis, yAxis);
		return this;
	}
}

class PlayerStateCharging extends PlayerState {
	function PlayerStateCharging(previousState:PlayerState) {
		super(previousState);
		(player.chargeUp.GetComponent("Animator") as Animator).Play("basicCharge");		
	}
	function OnFire1Up() {
		return new PlayerStateSwinging(this);
	}
	function ApplyDirection(xAxis:float, yAxis:float) {
		player.UpdateDirection(xAxis, yAxis);
		return this;
	}
	function OnAnimationEvent(event:String) {
		if (event == "chargeComplete") {
			Debug.Log("Charge Complete");
		}
		return this;
	}
	function Destroy() {
		(player.chargeUp.GetComponent("Animator") as Animator).Play("Idle");		
	}
}
class PlayerStateSwinging extends PlayerState {
	function PlayerStateSwinging(previousState:PlayerState) {
		super(previousState);
		Debug.Log("Entering State PlayerStateSwinging");
		switch( player.direction ) {
		case 3:
			player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,0);
			break;
		case 2:
			player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,90);
			break;
		case 4:
			player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,180);
			break;
		case 1:
			player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,270);
			break;
		}
		player.anim.SetInteger("action", 1);
		player.anim.speed = 1;
		(player.weaponSwish.GetComponent("Animator") as Animator).Play("SmallSwish");		
	}
	function OnAnimationEvent(event:String) {
		if (event == "WalkCycle") {
			return new PlayerStateWalking(this);
		}
		return this;
	}
	function Destroy() {
	}
}

private var playerState:PlayerState = new PlayerStateWalking(null);
private var oldState:PlayerState = null;

function Start () {
	// Finish initializing first state
	playerState.player = this;
	anim = gameObject.GetComponent("Animator") as Animator;
	anim.speed = 0;
	anim.SetInteger("action", currentAction);
	anim.SetInteger("direction", direction);
	weaponSwish = GameObject.Find("WeaponSwish") as GameObject;
	chargeUp = GameObject.Find("ChargeUp") as GameObject;
	
}
function ActionFinished() {
	currentAction = 0;
	anim.SetInteger("action", currentAction);
}

function OnAnimationEvent(event:String) {
	//Debug.Log("Outer OnAnimationEvent");
	oldState = playerState;
	playerState = playerState.OnAnimationEvent(event);
	destroyOldState();
}

function UpdateDirection(xAxis:float, yAxis:float) {
	rigidbody2D.velocity = new Vector2(xAxis * maxSpeed, yAxis * maxSpeed);
	var newDirection = direction;
	if (Mathf.Abs(xAxis) > Mathf.Abs(yAxis)) {
		// moving east west
		if (xAxis > 0) {
			if (newDirection != 1) { Debug.Log("Direction =  1"); }
			newDirection = 1;
		} else {
			if (newDirection != 2) { Debug.Log("Direction =  2"); }
			newDirection = 2;
		}
	} else {
		// moving north south
		if (yAxis > 0) {
			if (newDirection != 3) { Debug.Log("Direction =  3"); }
			newDirection = 3;
		} else if(yAxis < 0) {
			if (newDirection != 4) { Debug.Log("Direction =  4"); }
			newDirection = 4;
		}
	}
	if (newDirection != direction) {
		anim.SetInteger("direction", newDirection);
		direction = newDirection;
	}
	var mag = rigidbody2D.velocity.magnitude;
	anim.speed = mag/maxSpeed;

}
function destroyOldState() {
	if (oldState && oldState != playerState) {
		oldState.Destroy();
		oldState = playerState;
	}
}

function FixedUpdate () {
	oldState = playerState;
	if (Input.GetButtonDown("Fire1")) {
		playerState = playerState.OnFire1Down();
		destroyOldState();
	}
	if (Input.GetButtonUp("Fire1")) {
		playerState = playerState.OnFire1Up();
		destroyOldState();
	}
	if (Input.GetButtonDown("Fire2")) {
		playerState = playerState.OnFire2Down();
		destroyOldState();
	}
	if (Input.GetButtonUp("Fire3")) {
		playerState = playerState.OnFire2Up();
		destroyOldState();
	}
	var xAxis = Input.GetAxis("Horizontal");
	var yAxis = Input.GetAxis("Vertical");
	playerState = playerState.ApplyDirection(xAxis, yAxis);
		destroyOldState();


	/*
	
			var walking = true;

	var EWMove = Input.GetAxis("Horizontal");
	var NSMove = Input.GetAxis("Vertical");
	rigidbody2D.velocity = new Vector2(EWMove * maxSpeed, NSMove * maxSpeed);
	var newDirection = direction;
	if (Mathf.Abs(EWMove) > Mathf.Abs(NSMove)) {
		// moving east west
		if (EWMove > 0) {
			if (newDirection != 1) { Debug.Log("Direction =  1"); }
			newDirection = 1;
		} else {
			if (newDirection != 2) { Debug.Log("Direction =  2"); }
			newDirection = 2;
		}
	} else {
		// moving north south
		if (NSMove > 0) {
			if (newDirection != 3) { Debug.Log("Direction =  3"); }
			newDirection = 3;
		} else if(NSMove < 0) {
			if (newDirection != 4) { Debug.Log("Direction =  4"); }
			newDirection = 4;
		}
	}	
	var startCharge = Input.GetButtonDown("Fire1");	
	var swingWeapon = Input.GetButtonUp("Fire1");	
	var castSpell = Input.GetButtonDown("Fire2");
	
	if (startCharge) {
		walking = false;
		(chargeUp.GetComponent("Animator") as Animator).SetTrigger("Play");
		//weaponSwish = GameObject.Find("WeaponSwish") as GameObject;
//		(GameObject.Find("WeaponSwish").GetComponent("Animator") as Animator).SetTrigger("Play");
		
		
	} else if (swingWeapon) {
		walking = false;
		currentAction = 1;
		anim.SetInteger("action", currentAction);
		
		(chargeUp.GetComponent("Animator") as Animator).SetTrigger("Stop");
		(weaponSwish.GetComponent("Animator") as Animator).SetTrigger("Play");
		(weaponSwish.GetComponent("Animator") as Animator).SetTrigger("Play");
		switch( newDirection ) {
		case 3:
			weaponSwish.transform.rotation = Quaternion.Euler(0,0,0);
			break;
		case 2:
			weaponSwish.transform.rotation = Quaternion.Euler(0,0,90);
			break;
		case 4:
			weaponSwish.transform.rotation = Quaternion.Euler(0,0,180);
			break;
		case 1:
			weaponSwish.transform.rotation = Quaternion.Euler(0,0,270);
			break;
		}
	} else {
		var fire2 = Input.GetButton("Fire2");
		if (fire2) {
			walking = false;
			currentAction = 2;
			anim.SetInteger("action", currentAction);
		}
	}
	if (walking && currentAction == 0) {
		if (newDirection != direction) {
			anim.SetInteger("direction", newDirection);
			direction = newDirection;
		}
				
		var mag = rigidbody2D.velocity.magnitude;
		anim.speed = mag/maxSpeed;
//		if (anim.speed != 0 ) 
//		Debug.Log("Max speed = " + anim.speed);
	} else {
		anim.speed = 1;
		rigidbody2D.velocity = new Vector2(0, 0);
	}*/
	
}
function Update () {

}