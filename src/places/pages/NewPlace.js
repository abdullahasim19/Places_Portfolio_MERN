import React,{useCallback,useReducer} from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/utils/validators';

import "./NewPlace.css";

const formReducer=(state,action)=>{
  if (action.type==="INPUT_CHANGE")
  {
    let formIsValid=true;
    for (const inputId in state.inputs)
    {
        if(inputId===action.inputId)
        {
          formIsValid=formIsValid&&action.isValid;
        }
        else
        {
          formIsValid=formIsValid&&state.inputs[inputId].isValid;
        }
    }
    return{
      ...state,
      inputs:{
        ...state.inputs,
        [action.inputId]:{value:action.value,isValid:action.isValid}
      },
      isValid:formIsValid
    }
  }
  return state;
}

export default function NewPlace() {

  const[formState,dispatch]=useReducer(formReducer,{
    inputs:{
      title:{
          value:'',
          isValid:false
      },
      description:{
        value:'',
        isValid:false
      }
    },
    isValid:false
  });
  const inputHandler=useCallback((id,value,isValid)=>{
    dispatch({type:"INPUT_CHANGE",value:value,isValid:isValid,inputId:id})
  },[]);

 const onSubmitHandler=(e)=>{
    e.preventDefault();
    console.log(formState.inputs) //backend logic will be added later
 }

  return (
  <form className='place-form' onSubmit={onSubmitHandler}>
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

  <Button type="submit" disabled={!formState.isValid} >
    ADD PLACE
  </Button>
  </form>
  )
}
