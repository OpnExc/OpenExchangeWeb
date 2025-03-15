package main

import (
    "crypto/rand"
    "encoding/base64"
    "fmt"
)

func main() {
    b := make([]byte, 32)
    _, err := rand.Read(b)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println(base64.StdEncoding.EncodeToString(b))
}