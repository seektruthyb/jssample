/**
 * Created by yblee on 2018-05-14.
 */
class Stack {
    constructor(arr) {
        this.data = [];
        if(arr) {
            this._addAll(arr);
        }
    }
    size() {
        return this.data.length;
    }
    push(item=errParam()) {
        this._addElement(item);
        return item;
    }
    pop() {
        const obj = this.peek(),
            len = this.size();
        if(len < 1) throw new RangeError(len);
        this._removeElementAt(len - 1);
        return obj;
    }
    peek() {
        const len = this.size();
        if(len < 1) throw new RangeError(len);
        return this._elementAt(len - 1);
    }
    isEmpty() {
        return this.size() === 0;
    }
    search(obj) {
        const i = this._lastIndexOf(obj);
        if(i >= 0) {
            return this.size() - i;
        }
        return -1;
    }
    _addAll(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.push(arr[i]);
        }
    }
    _addElement(item=errParam()) {
        this.data.push(item);
    }
    _removeElementAt(i) {
        return this.data.pop();
    }
    _elementAt(i) {
        return this.data[i];
    }
    _lastIndexOf(obj) {
        const len = this.data.length-1;
        let index = -1;
        for (var i = len; i >= 0; i--) {
            if(this.data[len] === obj) {
                index = len;
                break;
            }
        }
        return index;
    }
}