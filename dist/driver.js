const matA = new Float32Array([
  1.0, 2.0, 3.0, 4.0,
  5.0, 6.0, 7.0, 8.0,
  9.0, 10.0, 11.0, 12.0,
  13.0, 14.0, 15.0, 16.0
]);
const matB = new Float32Array([
  17.0, 18.0, 19.0, 20.0,
  21.0, 22.0, 23.0, 24.0,
  25.0, 26.0, 27.0, 28.0,
  29.0, 30.0, 31.0, 32.0
]);
console.log("A:", matA);
console.log("B:", matB);
var matAB = new Float32Array(16);
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    let sum = 0.0;
    for (let k = 0; k < 4; k++) {
      sum += matA[i * 4 + k] * matB[k * 4 + j];
    }
    matAB[i * 4 + j] = sum;
  }
}
console.log("A * B (vanilla js):", matAB);
// WASM
var memory = new WebAssembly.Memory({
  initial: 256,
  maximum: 512
});
var exports;
WebAssembly.instantiateStreaming(fetch("main.wasm"), {
  js: {
    mem: memory
  },
  env: {
    emscripten_resize_heap: function(delta) {
      memory.grow(delta);
    }
  }
}).then(results => {
  exports = results.instance.exports;
  // main execution below
  matAB = new Float32Array(16);
  let ptrAB = encodeFloatArray(matAB, matAB.length, 4);
  exports.matrix_multiply(matA, matB, ptrAB);
  matAB = decodeFloatArray(ptrAB, matAB.length);
  exports.wasm_free(ptrAB);
  console.log("A * B (wasm-c module):", matAB);
}).catch(err => {
  alert("Error loading main.js / main.wasm module", err);
  console.error("Error loading main.js / main.wasm module", err);
});

function encodeFloatArray(arr, len, sizeof) {
  let ptr = exports.wasm_malloc(len * sizeof);
  let out = new Float32Array(memory.buffer, ptr);
  for (let i = 0; i < len; i++) {
    out[i] = arr[i];
  }
  return ptr;
}

function decodeFloatArray(ptr, len) {
  return new Float32Array(memory.buffer).slice(ptr, ptr + len);
}