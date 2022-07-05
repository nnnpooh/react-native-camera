import 'react-native-reanimated';
import React, {FC, useEffect, useState} from 'react';
import {NativeBaseProvider, VStack, Text, Button} from 'native-base';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {StyleSheet} from 'react-native';
// import {scanBarcodes} from 'vision-camera-code-scanner';
// import {runOnJS} from 'react-native-reanimated';
// import {useFrameProcessor} from 'react-native-vision-camera';
// import {RNHoleView} from 'react-native-hole-view';

const App: FC = () => {
  const [hasPermission, setHasPermission] = useState('');
  const [isActive, setIsActive] = useState(false);
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
    if (barcodes && barcodes.length > 0) {
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
      {device && isActive && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          audio={false}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      )}
      <VStack alignItems={'center'} space={4} mt={4}>
        {/* <Text>Camera permission: {hasPermission}</Text> */}
        {!isActive ? (
          <Button
            onPress={() => {
              setIsActive(true);
              setBarCodeArray([]);
            }}>
            Camera On
          </Button>
        ) : (
          <Button
            onPress={() => {
              setIsActive(false);
              setBarCodeArray([]);
            }}
            colorScheme="secondary">
            Camera Off
          </Button>
        )}

        {isActive && barCodeArray.length > 0 && (
          <VStack
            alignItems={'center'}
            bg="primary.100"
            p={3}
            borderRadius="lg">
            {barCodeArray.map(el => (
              <Text key={el}>{el}</Text>
            ))}
          </VStack>
        )}
      </VStack>

      {/* <RNHoleView
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
      /> */}
    </NativeBaseProvider>
  );
};

export default App;
