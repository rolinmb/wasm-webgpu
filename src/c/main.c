#include <stdlib.h>
#include <emscripten.h>

int main() { return 0; }

EMSCRIPTEN_KEEPALIVE
void *wasm_malloc(size_t n) {
  return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void wasm_free(void *ptr) {
  free(ptr);
}

EMSCRIPTEN_KEEPALIVE
void matrix_multiply(float *result, const float *matrixA, const float *matrixB) {
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      result[i * 4 + j] = 0.0;
      for (int k = 0; k < 4; k++) {
        result[i * 4 + j] += matrixA[i * 4 + k] * matrixB[k * 4 + j];
      }
    }
  }
}