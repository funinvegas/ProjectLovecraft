#pragma strict

var maxSpeed:Number = 10f;
private var facing = "E"; // (N)orth (S)outh (E)ast (W)est 
function Start () {
}
function FixedUpdate () {
	var EWMove = Input.GetAxis("Horizontal");
	var NSMove = Input.GetAxis("Vertical");
	rigidbody2D.velocity = new Vector2(EWMove * maxSpeed, NSMove * maxSpeed);
}
function Update () {

}