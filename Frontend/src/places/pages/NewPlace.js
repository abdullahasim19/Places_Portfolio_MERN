import React,{useContext} from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import "./PlaceForm.css";


export default function NewPlace() {
  const history=useHistory();

  const auth=useContext(AuthContext);
  const {isloading,error,sendRequest,manageError,setError}=useHttpClient();

   const [formState,inputHandler] =useForm({
      title:{
          value:'',
          isValid:false
      },
      description:{
        value:'',
        isValid:false
      },
      address:{
        value:'',
        isValid:false
      },
      image:{
        value:null,
        isValid:false
      },
      latitude:{
        value:null,
        isValid:false
      },
      longitude:{
        value:null,
        isValid:false
      }
  },false)

  

 const onSubmitHandler=async (e)=>{
    e.preventDefault();
    if(isNaN(formState.inputs.latitude.value) || isNaN(formState.inputs.longitude.value))
    {
        setError('Invalid latitude or longitude');
        return;
    }
    
   try {
    const formData=new FormData();
    formData.append('title',formState.inputs.title.value);
    formData.append('description',formState.inputs.description.value);
    formData.append('address',formState.inputs.address.value);
    formData.append('image',formState.inputs.image.value);
    formData.append('latitude',formState.inputs.latitude.value);
    formData.append('longitude',formState.inputs.longitude.value);
      await sendRequest(process.env.REACT_APP_BACKEND_URL+'/places','POST',
      formData,
      {
        Authorization:'Bearer '+auth.token
      }
      );
      history.push('/');
   } catch (error) {
      console.log(error);
   }
 }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={manageError}/>
    <form className='place-form' onSubmit={onSubmitHandler}>
    {isloading && <LoadingSpinner asOverlay/>}
    <Input 
    id="title"
    element="input" type="text" label="Title" errorText="Invalid Title"
    validators={[VALIDATOR_REQUIRE()]}
    onInput={inputHandler}
    />

  <Input 
    id="description"
    element="textarea"  label="Description" 
    errorText="Invalid Description Enter atleast (5) characters"
    validators={[VALIDATOR_MINLENGTH(5)]}
    onInput={inputHandler}
    />

<Input 
    id="address"
    element="input"  label="Address" 
    errorText="Please enter a valid address"
    validators={[VALIDATOR_REQUIRE()]}
    onInput={inputHandler}
    />
  <Input 
    id="latitude"
    element="input"  label="Latitude" 
    errorText="Please enter a valid latitude"
    validators={[VALIDATOR_REQUIRE()]}
    onInput={inputHandler}
    />

<Input 
    id="longitude"
    element="input"  label="Longitude" 
    errorText="Please enter a valid longitude"
    validators={[VALIDATOR_REQUIRE()]}
    onInput={inputHandler}
    />
<ImageUpload
  id="image"
  Input={inputHandler}
  errorText="Please provide an image"
/>
  <Button type="submit" disabled={!formState.isValid} >
    ADD PLACE
  </Button>
  </form>
  </React.Fragment>
  )
}
