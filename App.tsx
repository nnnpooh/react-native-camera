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
  const [isScanned, setIsScanned] = useState(false);
  const [barCodeArray, setBarCodeArray] = useState<any[]>([]);
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

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  // console.log({barcodes});

  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);
      setBarCodeArray([]);
      barcodes.forEach(async (scannedBarcode: any) => {
        if (scannedBarcode.rawValue !== '') {
          setBarCodeArray(prev => [...prev, scannedBarcode.rawValue]);
        }
      });
    }
  };

  useEffect(() => {
    toggleActiveState();
  }, [barcodes]);

  console.log(barCodeArray);
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
        {barCodeArray.map(el => (
          <Text>{el}</Text>
        ))}
        <Text>Camera permission: {hasPermission}</Text>
      </VStack>

      <RNHoleView
        holes={[{x: 50, y: 390, width: 120, height: 120, borderRadius: 60}]}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />
    </NativeBaseProvider>
  );
};

export default App;
