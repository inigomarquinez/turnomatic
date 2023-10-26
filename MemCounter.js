class MemCounter {
  constructor(max) {
    this.max = max;
    this.count = 1;
  }

  inc() {
    if (this.count >= this.max) throw new Error('Max reached');
    return this.count++;
  }
}

export default MemCounter;
