var matA = new Float32Array([
  1.0, 2.0, 3.0, 4.0,
  5.0, 6.0, 7.0, 8.0,
  9.0, 10.0, 11.0, 12.0,
  13.0, 14.0, 15.0, 16.0
]);
var matB = new Float32Array([
  17.0, 18.0, 19.0, 20.0,
  21.0, 22.0, 23.0, 24.0,
  25.0, 26.0, 27.0, 28.0,
  29.0, 30.0, 31.0, 32.0
]);
var ab = new Float32Array(16);
console.log("matA:", matA);
console.log("matB:", matB);
console.log("ab (before):", ab);

var memory = new WebAssembly.Memory({
    initial: 512,
    maximum: 1024
});

var exports;

WebAssembly.instantiateStreaming(
  fetch("main.wasm"),
  {
    js: {
        mem: memory
    },
    env: {
        emscripten_resize_heap: function(delta) {
        memory.grow(delta);
        }
    }
  }
).then(results => {
    exports = results.instance.exports;
    memory = results.instance.exports.memory;
    function encodeFloat32Arr(arr, len) {
      var ptr = exports.wasm_malloc(len);
      var out = new Float32Array(memory.buffer, ptr, len);  
      for (var i = 0; i < len; i++) {
        out[i] = arr[i];
      }
      return ptr;
    }
    function runWASM() {
      const ptrA = encodeFloat32Arr(matA, matA.length);
      const ptrB = encodeFloat32Arr(matB, matB.length);
      var ptrAB = encodeFloat32Arr(ab, ab.length);
      console.log("ptrAB (before):", ptrAB);
      exports.matmul(ptrA, ptrB, ptrAB);
      console.log("ab (after):", ab);
      console.log("ptrAB (after):", ptrAB);
      exports.wasm_free(ptrA);
      exports.wasm_free(ptrB);
      exports.wasm_free(ptrAB);
    }
    window.addEventListener("load", runWASM());
  }
);

