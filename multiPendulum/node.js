class Node {
  constructor(x, y, upper) {
    if(x instanceof Vector) {
      this.pos = x;
      this.vel = new Vector();
      if(y) {
        this.upper = y;
        this.upper.lower = this;
      } else this.fixed = true;
      return;
    }
    this.pos = new Vector(x, y);
    this.vel = new Vector();
    if(upper) {
      this.upper = upper;
      this.upper.lower = this;
    }
    else
      this.fixed = true;
    }

  addForce(force, op) {
    if(this.fixed)
      return;
    if(!op)
      op = {};
    
    this.vel = this.vel.add(force);

    if(this.upper &&!op.up) {
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
      dir = dir.mult(this.vel.dot(dir));
      if(this.lower.fixed) {
        this.vel = this.vel.sub(dir);
      } else {
        dir = dir.div(2);
        this.vel = this.vel.sub(dir, {up:true});
        this.lower.addForce(dir);
      }
    }
  }

  update() {
    if(this.fixed)
      return;
    this.vel = this.vel.mult(1.0046);
    this.pos = this.pos.add(this.vel);
    
    this.pos = this.upper.pos.add(this.pos.sub(this.upper.pos).normalize().mult(distance));
  }

  draw() {
    cx.circleFill(this.pos, 6);
    if(this.upper)
      cx.line(this.pos, this.upper.pos);
  }
}