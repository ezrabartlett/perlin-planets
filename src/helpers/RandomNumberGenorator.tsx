export default class RandomNumberGenerator {
    seed: number

    constructor(seed: string) {
      this.seed = hashCode(seed);
    }
  
    // LCG parameters from Numerical Recipes
    next() {
      const a = 1664525;
      const c = 1013904223;
      const m = Math.pow(2, 32); // 2^32
      this.seed = (a * this.seed + c) % m;
      return this.seed / m;
    }
  
    // Generate a random integer between 0 and max - 1
    getInt(min: number = 0, max: number = 10) {
        const raw = Math.abs(this.next());
        return Math.floor(raw*(max-min)+min);
    }

    // Generate a random integer between 0 and max - 1
    getDouble(min: number = 0.0, max: number = 1.0) {
        const raw = Math.abs(this.next() * max);
        return raw*(max-min)+min;
    }
  }

  // Create a simple hash code function for the seed
const hashCode = function(seed: string) {
    var hash = 0;
    if (seed.length === 0) return hash;
    for (var i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
};
  
