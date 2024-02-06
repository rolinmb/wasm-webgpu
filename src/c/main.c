#include <emscripten.h>
#include <stdlib.h>

int main() { return 0; }

const int SIZE = 4;

EMSCRIPTEN_KEEPALIVE
void matmul(float* A, float* B, float* ab) {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      float result = 0.0;
      for (int k = 0; k < SIZE; k++) {
        result += A[i * SIZE + k] * B[k * SIZE + j];
      }
      ab[i * SIZE + j] = result;
    }
  }
}

EMSCRIPTEN_KEEPALIVE
void *wasm_malloc(size_t n) {
  return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void wasm_free(void *ptr) {
  return free(ptr);
}