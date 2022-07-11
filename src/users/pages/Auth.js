import React,{useState} from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_EMAIL,VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE} from '../../shared/utils/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';

import './Auth.css';

function Auth() {
    const [isLoginMode,setIsLoginMode]=useState(true)


   const[formState,inputHandler,setFormData] =useForm({
        email:{
            value:'',
            isValid:false
        },
        password:{
            value:'',
            isValid:false
        }
    },false)

    const authSubmitHandler=(e)=>{
        e.preventDefault();
        console.log(formState.inputs)
    }



    // used to switch between login and signup
    const switchModeHandler=()=>{
        if(!isLoginMode)
        {
            setFormData({
                ...formState.inputs,
                name:undefined
            },formState.inputs.email.isValid&&formState.inputs.password.isValid)
        }
        else
        {
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:false
                }
            },false)
                      
        }

        setIsLoginMode(prev=>!prev)
    }

  return (
    <Card className="authentication">
        <form onSubmit={authSubmitHandler}>
            {
                isLoginMode?
            (<h2>Login</h2>): <h2>SignUp</h2>
            }
            <hr/>
            {
                !isLoginMode&&(
                    <Input element="input" type="text" id="name" label="Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a Name"
                    onInput={inputHandler}
                    />
                )
            }
            <Input element="input" id="email" type="email" label="E-mail" 
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address"
            onInput={inputHandler}
            />

            <Input element="input" id="password" type="password" label="Password" 
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, atleast 5 characters"
            onInput={inputHandler}
            />

            <Button type="submit" disabled={!formState.isValid}>
                {isLoginMode ? 'LOGIN' : 'SIGNUP'}
            </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
            Switch to {isLoginMode ? "SIGNUP" : "LOGIN"}
        
        </Button>
    </Card>
  )
}

export default Auth
