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

var ab = new Float32Array(16);

WebAssembly.instantiateStreaming(
  fetch("main.wasm"), {}
).then(results => {
  console.log("matA:", matA);
  console.log("matB:", matB);
  console.log("ab (before):", ab);
  results.instance.exports.matmul(matA.buffer, matB.buffer, ab.buffer);
  console.log("ab (after):", ab);
});