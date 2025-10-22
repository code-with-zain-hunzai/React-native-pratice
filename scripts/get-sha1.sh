#!/bin/bash

echo "Getting SHA-1 fingerprint for Google Sign-In setup..."
echo ""

# Method 1: Using gradlew signingReport (recommended)
echo "Method 1: Using gradlew signingReport"
echo "======================================"
cd android
./gradlew signingReport | grep -A 5 -B 5 "SHA1"
cd ..

echo ""
echo "Method 2: Using keytool directly"
echo "================================="
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep -A 1 -B 1 "SHA1"

echo ""
echo "Copy the SHA1 value and add it to your Google Cloud Console Android OAuth client."
echo "Make sure to remove any colons (:) from the SHA1 value when pasting it."
