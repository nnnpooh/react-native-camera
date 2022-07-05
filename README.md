# React native camera

- Use `react-native` version `0.68.2`. Version `0.69` does not work, yet.
- Install

  - `yarn add react-native-reanimated`
  - `yarn add react-native-vision-camera`
  - `yarn add vision-camera-code-scanner`

- Add in `android/app/src/main/AndroidManifest.xml`

  - `<uses-permission android:name="android.permission.CAMERA" />`

- Add in first line of `index.js` and other files that uses camera.
  - `import 'react-native-reanimated`
- Add in `.babel.config.js`

```
plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
```

- When nothing works, reset everything

```
rm -rf package-lock.json && rm -rf yarn.lock && rm -rf node_modules
npm i  # or "yarn"
```
