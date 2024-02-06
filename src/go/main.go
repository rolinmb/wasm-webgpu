package main

import (
  "fmt"
  "log"
  "net/http"
  "crypto/tls"
)

const (
  DIST = "dist"
  CERTPATH = "src/go/security/cert.crt"
  KEYPATH = "src/go/security/pkey.pem"
)

func mainHandler(h http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    fmt.Println("mainHandler(): * New Client Request: ", r.RemoteAddr)
    h.ServeHTTP(w, r)
  })
}

func main() {
  http.Handle("/", mainHandler(http.FileServer(http.Dir(DIST))))
  tlsConfig := &tls.Config{
    MinVersion: tls.VersionTLS12,
    PreferServerCipherSuites: true,
  }
  server := &http.Server{
    Addr: ":443",
    TLSConfig: tlsConfig,
  }
  fmt.Println("main(): Starting local hosting server for wasm-webgpu on https://localhost:443")
  err := server.ListenAndServeTLS(CERTPATH, KEYPATH)
  if err != nil {
    log.Fatalf("main(): An error occured while starting the HTTPS server: %v", err)
  }
}
