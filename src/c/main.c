#include <emscripten.h>

int main() { return 0; }

const int SIZE = 4;

EMSCRIPTEN_KEEPALIVE
void matmul(float* A, float* B, float* ab) {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      ab[i * SIZE + j] = 0.0;
      for (int k = 0; k < SIZE; k++) {
        ab[i * SIZE + j] += A[i * SIZE + k] * B[k * SIZE + j];
      }
    }
  }
}