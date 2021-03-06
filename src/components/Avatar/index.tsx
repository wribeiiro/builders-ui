import React from 'react';
import { Wrapper, Image, CameraView } from './styles';
import { ImageAvatarPlaceholder } from '~/assets/images';
import { ImagePicker, RNCamera } from '~/utils/modules';

const defaultAccessibility = 'Upload de Avatar';

interface Props {
  image: string;
  showBorder: boolean;
  displayCamera: boolean;
  size: number;
  onPress: (x: any) => void;
  onUpload: (x: any) => any;
  accessibility?: string;
}

interface State {
  uploadedImage: string;
}

class Avatar extends React.Component<Props, State> {
  camera: any;

  openPicker = (): Promise<void> => {
    const options = {
      title: 'Selecionar foto',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Tirar foto',
      chooseFromLibraryButtonTitle: 'Escolher da galeria',
      quality: 0.3,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    return new Promise((resolve) => {
      ImagePicker.launchImageLibrary(options, (response) => {
        this.setState({ uploadedImage: response.uri });
        resolve();
      });
    });
  };

  handleUploaded = (image: any): void => {
    const { onUpload } = this.props;
    if (image && !image.didCancel) {
      onUpload(image);
    }
  };

  takePicture = async (): Promise<void> => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.setState({ uploadedImage: data });
      return data;
    }
  };

  getUploadImage = (): any => {
    const { uploadedImage } = this.state;
    return uploadedImage;
  };

  clearUploadImage = (): void => {
    this.setState({ uploadedImage: '' });
  };

  render(): JSX.Element {
    const {
      accessibility,
      image = null,
      size = 50,
      onPress = (): void => {},
      showBorder = true,
      displayCamera = null,
      ...rest
    } = this.props;
    const { uploadedImage } = this.state;
    return (
      <Wrapper
        accessibility={accessibility || defaultAccessibility}
        size={size}
        onPress={onPress}
        disabled={!onPress}
        showBorder={showBorder}
        {...rest}
      >
        {displayCamera && !uploadedImage ? (
          <CameraView
            ref={(ref): void => {
              this.camera = ref;
            }}
            size={size}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.auto}
            androidCameraPermissionOptions={{
              title: 'Camera',
              message: 'Precisamos da sua permissão para usar a camera.',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancelar',
            }}
          />
        ) : (
          <Image
            source={
              uploadedImage
                ? { uri: uploadedImage }
                : { uri: image } || ImageAvatarPlaceholder
            }
          />
        )}
      </Wrapper>
    );
  }
}

export default Avatar;
