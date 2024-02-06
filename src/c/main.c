#include <emscripten.h>

int main() {return 0;}

EMSCRIPTEN_KEEPALIVE
void matmul(float A[4][4], float B[4][4], float ab[4][4]) {
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      ab[i][j] = 0.0;
      for (int k = 0; k < 4; k++) {
        ab[i][j] += A[i][k] * B[k][j];
      }
    }
  }
}