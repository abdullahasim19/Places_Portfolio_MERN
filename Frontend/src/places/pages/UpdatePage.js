import React,{useEffect,useState,useContext} from 'react';
import {useParams} from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';


function UpdatePage() {
  const history=useHistory();
  const auth=useContext(AuthContext);

  const placeId=useParams().placeId;
  const {isloading,error,sendRequest,manageError}=useHttpClient();
  const [loadedPlace,setloadedPlace]=useState();
  
  const [formState,inputHandler,setFormData]=useForm({
    title:{
        value:'',
        isValid:false
    },
    description:{
        value:'',
        isValid:false
    }
  },false)
  
  useEffect(()=>{
    const fetchPlace=async()=>{
      try {
        const responseData=await sendRequest(`http://localhost:5000/api/places/${placeId}`)
        setloadedPlace(responseData.place);

        setFormData({
          title:{
            value:responseData.place.title,
            isValid:true
        },
        description:{
            value:responseData.place.description,
            isValid:true
        }},true
        )

      } catch (error) {
        console.log(error);
      }
    }
    fetchPlace();
  },[sendRequest,placeId,setFormData])

  

  const placeUpdateSubmitHandler=async(e)=>{
    e.preventDefault();
    try {
      await sendRequest(`http://localhost:5000/api/places/${placeId}`,'PATCH',
      JSON.stringify({
        title:formState.inputs.title.value,
        description:formState.inputs.description.value
    }),
    {
      'Content-Type':'application/json'
    }
    );
    history.push('/'+auth.userId+'/places');

    } catch (error) {
      console.log(error);    
    }
  }

  if(isloading)
  {
    return(
      <div className='center'>
        <LoadingSpinner/>
      </div>
    );
  }

  if(!loadedPlace&&!error)
  {
    return(
        <div className='center'>
          <Card>
            <h2>Could not find place</h2>
            </Card>
        </div>
    );
  }
  
  return(
    <React.Fragment>
      <ErrorModal error={error} onClear={manageError}/>
      {
        !isloading&&loadedPlace&&(
          <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input id="title" element="input" type="text" label="Title" 
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
          />
  
          <Input id="description" element="text" label="Description" 
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description atleast (5) characters"
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
              UPDATE PLACE
          </Button>
  
      </form>
        )
      }
    
    </React.Fragment>
  );

}

export default UpdatePage;
