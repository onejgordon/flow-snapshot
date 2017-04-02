import React from 'react';
import { Image } from 'react-native';
import gravatar from 'gravatar-api';
import images from '../../config/images';
import styles from './styles';

const Settings = (props) => {
  const gravatarOptions = {
    email: props.email,
    parameters: { size: 200 },
  };

  const uri = gravatar.imageUrl(gravatarOptions);
  return (
    <Image
      source={{ uri }}
      defaultSource={images.avatarPlaceholder}
    />
  );
};

Settings.propTypes = {
  email: React.PropTypes.string,
};

export default Settings;