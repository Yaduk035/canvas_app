import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Circle} from 'lucide-react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Image as KonvaImage, Layer, Rect, Stage, Text as KonvaText, Transformer} from 'react-konva';
import {buttonVariants} from '@/components/ui/button';

const CanvasPage = () => {
  const [image, setImage] = useState();
  const [OGImageDimensions, setOGImageDimensions] = useState();
  const [canvasDimensions, setcanvasDimensions] = useState({height: 600, width: 800});
  const [enableEditing, setenableEditing] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const stageRef = useRef(null);

  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (enableEditing) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [enableEditing]);

  const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onImportImageSelect = useCallback(file => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.src = imageUrl;

      // Get the original dimensions first
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        setOGImageDimensions({width: originalWidth, height: originalHeight});

        // Calculate height based on maintaining the aspect ratio with width set to 1800
        const newWidth = 800;
        const aspectRatio = originalWidth / originalHeight;
        const newHeight = Math.floor(newWidth / aspectRatio);

        setcanvasDimensions({height: newHeight, width: newWidth});

        // Create a new image with the resized dimensions
        const resizedImage = new Image(newWidth, newHeight);
        resizedImage.src = imageUrl;

        setImage(resizedImage); // Set the resized image
      };

      img.onerror = () => {
        console.error('Failed to load image.');
      };
    }
  }, []);

  const fetchImageFromUrl = async url => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const file = new File([blob], 'cdnImage.jpg', {type: blob.type});
      console.log(file?.height);
      onImportImageSelect(file); // Reusing the local file handling function
    } catch (error) {
      console.error('Failed to fetch image from URL:', error);
    }
  };

  const exportCanvas = () => {
    const dataUri = stageRef.current?.toDataURL({pixelRatio: 3});
    downloadURI(dataUri);
  };

  useEffect(() => {
    fetchImageFromUrl('https://res.cloudinary.com/ds96vmvih/image/upload/v1714541773/eelonSchoolManagementApp/certificates/templates/onu5zxeoso5ghjtgyyt3.png');
  }, []);

  console.log(shapeRef.current === document.activeElement);

  return (
    <div className='w-full h-full p-5'>
      <div className='text-3xl font-bold text-gray-800'>Canvas</div>
      <div className='w-72 my-4'>
        <input type='file' onChange={e => onImportImageSelect(e.target.files[0])} />
      </div>
      <div className='w-96 p-2'>
        <Textarea disabled={!enableEditing} value={schoolName} onChange={e => setSchoolName(e.target.value)} />
      </div>
      <div className='flex gap-4'>
        <Button onClick={() => setenableEditing(prev => !prev)} variant={enableEditing ? 'destructive' : ''}>
          {enableEditing ? 'Stop editing' : 'Edit'}
        </Button>
        <Button disabled={enableEditing} onClick={() => exportCanvas()}>
          Export canvas
        </Button>
      </div>
      <div className='mt-4 border-2 border-gray-400 shadow-xl rounded-sm'>
        <Stage width={canvasDimensions.width} height={canvasDimensions.height} className='' ref={stageRef}>
          <Layer>{image && <KonvaImage image={image} />}</Layer>

          <Layer draggable={enableEditing}>
            <KonvaText
              fontSize={20}
              x={10}
              y={10}
              fontFamily='serif'
              fontStyle='600'
              //   textDecoration='underline'
              //   lineHeight={1}
              letterSpacing={0.5}
              align='center'
              fill='rgb(50,50,50)'
              text={schoolName}
              //   text={`MM school \nKomarappalayam,\nNamakkal`}
              ref={shapeRef}
            />
            {enableEditing && (
              <Transformer
                rotationSnaps={[0, 90, 180, 270, 360]}
                rotationSnapTolerance={7}
                rotateAnchorOffset={30}
                flipEnabled={false}
                shouldOverdrawWholeArea
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                ref={trRef}
              />
            )}
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
