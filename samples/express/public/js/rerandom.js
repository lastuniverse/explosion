function rerandom(seed) {
  // всякая инициализационная хрень
  if (this instanceof rerandom === false) {
    return new rerandom(seed);
  }

  var self = this;

  this.p1 = 2654435761;
  this.p2 = 2246822519;
  this.p3 = 3266489917;
  this.p4 = 668265263;
  this.p5 = 374761393;

  this.cut = 2097151;


  this.seed = seed;

}

rerandom.prototype.GetxxHash = function() {
    let buf = arguments
    let h32;
    let index = 0;
    let len = buf.length;

    if (len >= 4) {
      let limit = len - 4;
      let v1 = this.seed + this.p1 + this.p2;
      let v2 = this.seed + this.p2;
      let v3 = this.seed + 0;
      let v4 = this.seed - this.p1;

      while (index <= limit) {
        v1 = this.CalcSubHash (v1, buf[index]);
        index++;
        v2 = this.CalcSubHash (v2, buf[index]);
        index++;
        v3 = this.CalcSubHash (v3, buf[index]);
        index++;
        v4 = this.CalcSubHash (v4, buf[index]);
        index++;
      }

      h32 = this.RotateLeft (v1, 1) + this.RotateLeft (v2, 7) + this.RotateLeft (v3, 12) + this.RotateLeft (v4, 18);
    }
    else {
      h32 = this.seed + this.p5;
    }

    h32 += len * 4;

    while (index < len) {
      h32 += buf[index] * this.p3;
      h32 = this.RotateLeft (h32, 17) * this.p4;
      index++;
    }

    h32 ^= h32 >> 15;
    h32 *= this.p2;
    h32 ^= h32 >> 13;
    h32 *= this.p3;
    h32 ^= h32 >> 16;

    return h32&this.cut;

};

rerandom.prototype.RotateLeft = function(value, count) {
  return (value << count) | (value >> (32 - count));
}

rerandom.prototype.CalcSubHash = function(value, read_value) {
    value += read_value * this.p2;
    value = this.RotateLeft (value, 13);
    value *= this.p1;
    return value;
}
