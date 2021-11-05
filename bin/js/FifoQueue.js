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

proto.qsize = function() {
    return this._buf.length;
}

proto.heapify = function() {
    let index = this._buf.length - 1 // 계속해서 변하는 index 값
    const lastInsertedNode = this._buf[index]

    // while (index > 0) {
    //     const parentIndex = this.getParentIndex(index)
  
    //     // 부모 노드의 key 값이 마지막에 삽입된 노드의 키 값 보다 크다면
    //     // 부모의 자리를 계속해서 아래로 내린다.
    //     if (this._buf[parentIndex].key > lastInsertedNode.key) {
    //       this._buf[index] = this._buf[parentIndex]
    //       index = parentIndex
    //     } else break
    //   }
  
    //   // break 를 만나서 자신의 자리를 찾은 상황
    //   // 마지막에 찾아진 곳이 가장 나중에 들어온 노드가 들어갈 자리다.
    //   this._buf[index] = lastInsertedNode
}


module.exports = FifoQueue