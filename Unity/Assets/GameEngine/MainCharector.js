#pragma strict

var maxSpeed:Number = 1f;
var maxAnimationSpeed:Number = 1f;
private var facing = "E"; // (N)orth (S)outh (E)ast (W)est 
public var anim:Animator = null;
var direction = 4;
private var currentAction = 0;
var weaponSwish:GameObject = null;
var chargeUp:GameObject = null;
var mace:GameObject = null;
var speedFactor:float = 1;
var centerTargetOffset:Vector2 = new Vector2(0,0);
private var charging = false;
var playerControled = false;
static var globalPlayerObject:MainCharector = null;
var useCharge = false;
var attackRange:float = 2 * 0.32;

static var worldCharectors:Array = new Array();

class PlayerState {
	var player:MainCharector = null;
	function PlayerState(previousState:PlayerState) {
		Debug.Log("previousState = " + previousState);
		Debug.Log("newState = " + this);
		if(previousState) {
			player = previousState.player;
			if (player !== MainCharector.globalPlayerObject) {
				Debug.Log("PlayerState change Moving " + player.rigidbody2D.velocity.x + "," + player.rigidbody2D.velocity.y);
			}
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
	function OnTriggerCollision(other:GameObject) {
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
			//player.anim.SetInteger("action", 0);
		}
	}
	function OnFire1Down() {
		if (player.useCharge) {
			return new PlayerStateCharging(this);
		} else {
			return new PlayerStateSwinging(this);
		}
	}
	function ApplyDirection(xAxis:float, yAxis:float) {
		player.UpdateDirection(xAxis, yAxis);
		return this;
	}
}

class PlayerStateCharging extends PlayerState {
	var startTime:float = 0;
	function PlayerStateCharging(previousState:PlayerState) {
		super(previousState);
		startTime = Time.time;
		player.speedFactor = 0.5;
	}
	function OnFire1Up() {
		return new PlayerStateSwinging(this);
	}
	function OnFire1Down() {
		if( startTime > 0 && Time.time - startTime > 0.5) {
			if (player.chargeUp) {
				(player.chargeUp.GetComponent("Animator") as Animator).Play("basicCharge");
			}
			startTime = 0;
		}
		return this;
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
		player.speedFactor = 1;
		if (player.chargeUp) {
			(player.chargeUp.GetComponent("Animator") as Animator).Play("Idle");		
		}
	}
}
class PlayerStateSwinging extends PlayerState {
	function PlayerStateSwinging(previousState:PlayerState) {
		super(previousState);
		Debug.Log("Entering State PlayerStateSwinging");
		player.stopMoving();
		switch( player.direction ) {
		case 3: // North
			if (player.weaponSwish) {
				player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,0);
				player.weaponSwish.transform.localScale.x = -1;
			} 
			if (player.mace) {
				(player.mace.GetComponent("Animator") as Animator).Play("MaceNorth");
			}
			player.anim.Play("Swing North");
			break;
		case 2: // West
			if (player.weaponSwish) {
				player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,90);
				player.weaponSwish.transform.localScale.x = -1;
			}
			if (player.mace) {
				(player.mace.GetComponent("Animator") as Animator).Play("MaceWest");
			}
			player.anim.Play("Swing West");
			break;
		case 4: // South
			if (player.weaponSwish) {
				player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,180);
				player.weaponSwish.transform.localScale.x = 1;
			}
			if (player.mace) {
				(player.mace.GetComponent("Animator") as Animator).Play("MaceEast");
			}
			player.anim.Play("Swing South");
			break;
		case 1:  // East
			if (player.weaponSwish) {
				player.weaponSwish.transform.rotation = Quaternion.Euler(0,0,270);
				player.weaponSwish.transform.localScale.x = 1;
			} 
			if (player.mace) {
				(player.mace.GetComponent("Animator") as Animator).Play("MaceSouth");
			}
			player.anim.Play("Swing East");
			break;
		}
		//player.anim.SetInteger("action", 1);
		player.anim.speed = 1;
		if (player.weaponSwish) {
			(player.weaponSwish.GetComponent("Animator") as Animator).Play("SmallSwish");		
		}
	
	}
	function AttackTarget( target:MainCharector ) {
		var transform = player.transform;
		var centerTargetOffset = player.centerTargetOffset;
		var delta:Vector2 = (target.transform.position + target.centerTargetOffset) - (transform.position + centerTargetOffset);
		if (delta.magnitude < player.attackRange) {
			var injured = target.Injure();
			if (injured) {
				var normal = delta.normalized * 10;
				Debug.Log("Setting X:" + normal.x + " , " + normal.y );
				target.rigidbody2D.velocity = new Vector2(normal.x, normal.y);
				Debug.Log("Result X:" + target.rigidbody2D.velocity.x + " , " + target.rigidbody2D.velocity.y );
//				target.rigidbody2D.AddForce(delta.normalized * 100);
			}
		}
	}
	function OnAnimationEvent(event:String) {
		if (event == "Attack") {
			if (player.playerControled) {
				for( var i = 0; i < MainCharector.worldCharectors.length; ++i) {
					var target:MainCharector = MainCharector.worldCharectors[i] as MainCharector;
					if (target !== player) {
						AttackTarget(target);
					}
				}
			} else {
				AttackTarget(MainCharector.globalPlayerObject);
			}
		}
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
	//anim.SetInteger("action", currentAction);
	//anim.SetInteger("direction", direction);
	//weaponSwish = transform.Find("WeaponSwish") as GameObject;
	//chargeUp = transform.Find("ChargeUp") as GameObject;
	//mace = transform.Find("WeaponMace") as GameObject;
	for (var child:Transform in transform) {
		var name = child.name;
		switch(name) {
			case "WeaponSwish":
				weaponSwish = child.gameObject;
				break;
			case "ChargeUp":
				chargeUp = child.gameObject;
				break;
			case "WeaponMace":
				mace = child.gameObject;
				break;
		}
		//Debug.Log(" CHILD NAME = " + (child as Transform).name);
		
	}
	MainCharector.worldCharectors.Push(this);
}
function ActionFinished() {
	//currentAction = 0;
	//anim.SetInteger("action", currentAction);
}

function OnAnimationEvent(event:String) {
	//Debug.Log("Outer OnAnimationEvent");
	if (this !== MainCharector.globalPlayerObject) {
		Debug.Log("Start Animation Event Already Moving " + rigidbody2D.velocity.x + "," + rigidbody2D.velocity.y);
	}
	oldState = playerState;
	playerState = playerState.OnAnimationEvent(event);
	destroyOldState();
	if (this !== MainCharector.globalPlayerObject) {
		Debug.Log("Finish Animation Event Already Moving " + rigidbody2D.velocity.x + "," + rigidbody2D.velocity.y);
	}
}

private var lastInjureTime:float = 0;
var injuryImmunity:float = 20.3;
function Injure() {
	if (Time.time - lastInjureTime > injuryImmunity) {
		lastInjureTime = Time.time;
		Debug.Log(" Setting lastInjure Time = " + lastInjureTime);
		return true;
	}
	return false;
}

function stopMoving() {
	if (Time.time - lastInjureTime > injuryImmunity) {
		rigidbody2D.velocity = new Vector2(0,0);
	}
}

function UpdateDirection(xAxis:float, yAxis:float) {
	if( Time.time - lastInjureTime > injuryImmunity) {
		rigidbody2D.velocity = new Vector2(xAxis * maxSpeed * speedFactor, yAxis * maxSpeed * speedFactor);
	}
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
		switch(newDirection) {
			case 1:
				anim.Play("Walk East");
			break;
			case 2:
				anim.Play("Walk West");
			break;
			case 3:
				anim.Play("Walk North");
			break;
			case 4:
				anim.Play("Walk South");
			break;
		}
		//anim.SetInteger("direction", newDirection);
		direction = newDirection;
	}
	var mag = rigidbody2D.velocity.magnitude;
	anim.speed = mag/maxAnimationSpeed;

}
function destroyOldState() {
	if (oldState && oldState != playerState) {
		oldState.Destroy();
		oldState = playerState;
	}
}

function FixedUpdate () {
	if (playerControled) {
		PlayerInput();
	} else {
		AIInput();
	}
	transform.position.z = 5 - ((transform.position.y/-0.32) / 10);
}
function AIInput() {
	if (globalPlayerObject) {
		var delta:Vector2 = (globalPlayerObject.transform.position + globalPlayerObject.centerTargetOffset) - (transform.position + centerTargetOffset);
		var mag:Number = delta.magnitude;
		var xAxis:float = 0;
		var yAxis:float = 0;
		if (mag < 0.32 * 4) {
			delta = delta.normalized;
			xAxis = delta.x;
			yAxis = delta.y;
		}
		playerState = playerState.ApplyDirection(xAxis, yAxis);
		destroyOldState();
		
		if (mag < attackRange) {
			playerState = playerState.OnFire1Down();
			destroyOldState();
		} else {
			playerState = playerState.OnFire1Up();
			destroyOldState();
		}
		var fromVec:Vector2 = globalPlayerObject.transform.position + globalPlayerObject.centerTargetOffset;
		var toVec:Vector2 = transform.position + centerTargetOffset;
		//var angle = Vector2.Angle(fromVec, toVec);
		//Debug.Log("Angle = " + angle);
		var zeroAngle = new Vector2( 0, 1 );
		var ang:float = Vector2.Angle(zeroAngle, delta);
		//var cross:Vector3 = Vector3.Cross(fromVec, toVec);	 
		//if (cross.z > 0)
		//	ang = 360 - ang;
		if (delta.x < 0) {
			ang = 360 - ang;
		}
		//Debug.Log(ang);
	}
}

function PlayerInput() {
	if (!playerState) return;
	if (!globalPlayerObject) {
		globalPlayerObject = this;
	}
	oldState = playerState;
	if (Input.GetButton("Fire1")) {
		playerState = playerState.OnFire1Down();
		destroyOldState();
	} else {
		playerState = playerState.OnFire1Up();
		destroyOldState();
	}
	if (Input.GetButton("Fire2")) {
		playerState = playerState.OnFire2Down();
		destroyOldState();
	} else {
		playerState = playerState.OnFire2Up();
		destroyOldState();
	}
	var xAxis = Input.GetAxis("Horizontal");
	var yAxis = Input.GetAxis("Vertical");
	playerState = playerState.ApplyDirection(xAxis, yAxis);
	destroyOldState();
}
function Update () {
	//var tar:MainCharector = (MainCharector.worldCharectors[0] as MainCharector);
	//var rigid = tar.rigidbody2D;
	//Debug.Log("MainCharector.worldCharectors[0].rigidbody2D.velocity = " + rigid.velocity);
}