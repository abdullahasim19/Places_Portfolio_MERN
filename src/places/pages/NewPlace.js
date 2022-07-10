import React from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';

import "./PlaceForm.css";



export default function NewPlace() {

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
      }
  },false)

  

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
