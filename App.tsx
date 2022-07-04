import 'react-native-reanimated';
import {scanBarcodes} from 'vision-camera-code-scanner';
import {runOnJS} from 'react-native-reanimated';
import {useFrameProcessor} from 'react-native-vision-camera';
import React, {FC, useEffect, useState} from 'react';
import {NativeBaseProvider, VStack, Text} from 'native-base';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {RNHoleView} from 'react-native-hole-view';
import {StyleSheet} from 'react-native';
const App: FC = () => {
  const [hasPermission, setHasPermission] = useState('');
  const [barCodes, setBarcodes] = useState<any>('');
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        let status = await Camera.getCameraPermissionStatus();
        setHasPermission(status);
        if (status !== 'authorized') {
          await Camera.requestCameraPermission();
          status = await Camera.getCameraPermissionStatus();
          setHasPermission(status);
          if (status === 'denied') {
            console.log('Camera permission denied');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkCameraPermission();
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;

  const [barcodes, frameProcessor] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  console.log({barcodes});

  useEffect(() => {
    console.log('here');
    const toggleActiveState = async () => {
      if (barcodes && barcodes.length > 0) {
        console.log({barcodes});
      }
    };
    toggleActiveState();
  }, [barcodes]);

  return (
    <NativeBaseProvider>
      {device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          audio={false}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      )}
      <VStack>
        <Text>Camera permission: {hasPermission}</Text>
      </VStack>
    </NativeBaseProvider>
  );
};

export default App;
