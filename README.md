Compiling C to WASM to speed up some math in the browser for WebGPU

TODO: WASM c function call doesn't do matrix multiplication as desired, need to troubleshood further

Compile and host main.c (compiles Go server first, then transpiles C to WASM, then starts Go server):
>  go build -C src/go -o main && emcc src/c/main.c -o dist/main.js && ./src/go/main