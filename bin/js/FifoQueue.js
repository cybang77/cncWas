function FifoQueue(size) {
    this._buf = [];
    this._max_size = size;
}

var proto = FifoQueue.prototype;
proto.enqueue = function(item) {
    if(this._buf.length > (this._max_size - 1)){
        this._buf.shift();
    }
    this._buf.push(item);
};

proto.dequeue = function() {
    return this._buf.shift();
};

proto.getAll = function() {
    let buffer = []
    this._buf.forEach(element => buffer.push(element))
    this._buf = []
    return buffer;
};

proto.print = function() {
    console.log(this._buf)
};

proto.clear = function() {
    this._buf = [];
};


module.exports = FifoQueue