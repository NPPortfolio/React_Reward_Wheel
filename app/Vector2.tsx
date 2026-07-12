export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  // Returns the calculated magnitude (length) of the vector
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Mutating operations (In-place changes)
  add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  normalize(): this {
    const mag = this.magnitude;
    if (mag > 0) {
      this.scale(1 / mag);
    }
    return this;
  }

  // Non-mutating operations (Returns a brand new instance)
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  distanceTo(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  midpoint(v : Vector2): Vector2 {
    return new Vector2((this.x + v.x)/2, (this.y + v.y)/2)
  }
}