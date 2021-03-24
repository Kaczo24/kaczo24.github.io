class Node {
  constructor(a, upper) {
    this.vel = new Vector();
    this.angle = a;
    this.avel = 0;
    if(upper) {
      this.upper = upper;
      this.upper.lower = this;
      this.pos = this.upper.pos.add(new Vector(0, distance).rotate(a));
    }
    else {
      this.fixed = true;
      this.pos = new Vector(width/2, 100);
    }
  }

  addForce(force, op) {
    if(this.fixed) return;
    if(!op) op = {};

    this.vel = this.vel.add(force);

    if(this.upper && !op.up) {
      let dir = this.upper.pos.sub(this.pos).normalize();
      dir = dir.mult(this.vel.dot(dir));

      if(this.upper.fixed) {
        this.vel = this.vel.sub(dir);
      } else {
        dir = dir.div(2);
        this.vel = this.vel.sub(dir);
        this.upper.addForce(dir, {low:true});
      }
    }

    if(this.lower && !op.low) {
      let dir = this.lower.pos.sub(this.pos).normalize();
      dir = dir.mult(this.vel.dot(dir)/2);

      this.vel = this.vel.sub(dir, {up:true});
      this.lower.addForce(dir);
    }
  }

  update() {
    if(!this.fixed) {

      this.avel += this.vel.dot(this.upper.pos.sub(this.pos).rotate(-Math.PI/2).normalize()) / distance;
      this.angle += this.avel;

      this.pos = this.upper.pos.add(new Vector(0, distance).rotate(this.angle));
      this.vel = new Vector();
    }
    this.draw();
    if(this.lower)
      this.lower.update();
  }

  draw() {
    cx.circleFill(this.pos, 6);
    if(this.upper)
      cx.line(this.pos, this.upper.pos);
  }
}