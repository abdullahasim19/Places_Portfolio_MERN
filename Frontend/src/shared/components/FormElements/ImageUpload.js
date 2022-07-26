import React,{useRef,useState,useEffect} from 'react';
import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
    const [file,setFile]=useState();
    const [previewUrl,setPreviewUrl]=useState();
    const [isValid,setisValid]=useState(false);

    useEffect(()=>{ //triggered to change the preview when file is changed
        if(!file)
        {
            return;
        }
        const fileReader=new FileReader();
        fileReader.onload=()=>{ //executed then file is loaded
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);// reading the file
    },[file]);

    const filePickerRef=useRef();

    const pickHandler=(event)=>{ //triggered when user picks the image
        let pickedFile;
        let valid=isValid;
        if(event.target.files && event.target.files.length===1)//making sure to select exactly one file
        {
            pickedFile=event.target.files[0]; //selecting the file
            setFile(pickedFile);
            setisValid(true);
            valid=true;
        }
        else
        {
            setisValid(false);
            valid=false;
        }
        props.Input(props.id,pickedFile,valid);
    }

    const imageHandler=()=>{ //to start picking the image
        filePickerRef.current.click();
    }
  return (
    <div className='form-control'>
        <input id={props.id} style={{display:'none'}} 
        type='file'
        ref={filePickerRef}
        accept='.jpg,.png,.jpeg'
        onChange={pickHandler}
        />
        <div className={`image-upload ${props.center && 'center'}`}>
            <div className='image-upload__preview'>
                {previewUrl?<img src={previewUrl} alt='Preview'/>:(<p>Please pick an image</p>)}
            </div>
            <Button type='button' onClick={imageHandler}>
                PICK IMAGE
            </Button>
        </div>
        {!isValid && <p>{props.errorText}</p>}
    </div>
  );
}

export default ImageUpload;
