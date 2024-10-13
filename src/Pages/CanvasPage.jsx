import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Circle} from 'lucide-react';
import {useCallback, useRef, useState} from 'react';
import {Image as KonvaImage, Layer, Rect, Stage} from 'react-konva';
import useImage from 'use-image';
import certificate from '../assets/sample.png';

const CanvasPage = () => {
  const [image, setimage] = useState();
  const stageRef = useRef(null);

  const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onImportImageSelect = useCallback(e => {
    if (e.target.files?.[0]) {
      const imageUrl = URL.createObjectURL(e.target.files?.[0]);
      const image = new Image(1800, 1800);
      image.src = imageUrl;
      setimage(image);
    }
    e.target.files = null;
  }, []);

  const exportCanvas = () => {
    const dataUri = stageRef.current?.toDataURL({pixelRatio: 3});
    downloadURI(dataUri);
  };

  return (
    <div className='w-full h-full p-5'>
      <div className='text-3xl font-bold text-gray-800'>Canvas</div>
      <Button onClick={() => exportCanvas()}>Export canvas</Button>
      <div className='w-72 mt-4'>
        {/* <Input /> */}
        <input type='file' onChange={e => onImportImageSelect(e)} />
      </div>
      <div className='mt-4 border-2 border-gray-400 shadow-xl rounded-sm'>
        <Stage width={800} height={600} className='' ref={stageRef}>
          <Layer width={800}>{image && <KonvaImage image={image} height={600} width={800} />}</Layer>
          <Layer>
            <Rect width={50} height={50} fill='red' draggable />
            <Circle x={200} y={200} stroke='black' radius={50} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasPage;

// const LionImage = ({image}) => {
//   const imgRef = useRef(null);
//   const [imageDimensions, setimageDimensions] = useState();

//   //   const data = useImage(
//   //     'https://res.cloudinary.com/ds96vmvih/image/upload/v1714541773/eelonSchoolManagementApp/certificates/templates/onu5zxeoso5ghjtgyyt3.png'
//   //   );
//   console.log(imgRef.current);
//   return <Image image={image} height={600} width={800} ref={imgRef} />;
// };
