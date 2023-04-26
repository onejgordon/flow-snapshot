> **_NOTE:_**  This repository is no longer maintained.

# Flow Snapshot

This is a mobile client for Android (and hopefully soon iOS) to submit snapshots to [Flow Dashboard](https://github.com/onejgordon/flow-dashboard/)

## Commands

### Generate Release APK

`cd android && ./gradlew assembleRelease`

### Run on Device

`react-native run-android`

### Test Release Build

#### For React-Native 0.39.x

`react-native run-android --configuration=release`

#### For more recent versions

`react-native run-android --variant=release`
