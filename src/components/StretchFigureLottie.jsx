import React from 'react';
import Lottie from 'lottie-react';
import stretchingFigure from '../animations/stretching-figure.json';

const StretchFigureLottie = ({ style }) => (
  <Lottie 
    animationData={stretchingFigure} 
    loop={true} 
    autoplay={true} 
    style={{ width: 48, height: 48, ...style }} 
  />
);

export default StretchFigureLottie; 