import React,{useState,useContext} from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_EMAIL,VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE} from '../../shared/utils/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './Auth.css';

function Auth() {

    const auth=useContext(AuthContext);

    const {isloading,error,sendRequest,manageError}=useHttpClient();    

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

    const authSubmitHandler=async (e)=>{
        e.preventDefault();
        if(!isLoginMode)
        {
            try 
            {
                const formData=new FormData();
                formData.append('name',formState.inputs.name.value);
                formData.append('email',formState.inputs.email.value);
                formData.append('password',formState.inputs.password.value);
                formData.append('image',formState.inputs.image.value);
                const responseData=await sendRequest('http://localhost:5000/api/users/signup','POST',
                formData
                );
                
                auth.login(responseData.userId,responseData.token);
                
            } 
            catch (error) {
                console.log("Error occured!");
                console.log(error);   
            }
        }
        else
        {
            try 
            {
                const responseData=await sendRequest('http://localhost:5000/api/users/login','POST',
                JSON.stringify({
                    email:formState.inputs.email.value,
                    password:formState.inputs.password.value
                    }),{'Content-Type':'application/json'},
                 );
                auth.login(responseData.userId,responseData.token);
            } 
            catch (error) {
                console.log("Error occured!");
                console.log(error);
            }
        }
    }

    // used to switch between login and signup
    const switchModeHandler=()=>{
        if(!isLoginMode)
        {
            setFormData({
                ...formState.inputs,
                name:undefined,
                image:undefined
            },formState.inputs.email.isValid&&formState.inputs.password.isValid)
        }
        else
        {
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:false
                },
                image:{
                    value:null,
                    isValid:false
                }
            },false)
                      
        }

        setIsLoginMode(prev=>!prev)
    }


  return (
    <React.Fragment>
        <ErrorModal error={error} onClear={manageError}/>
    <Card className="authentication">
        {
            isloading&&<LoadingSpinner asOverlay/>
        }
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
            {
                !isLoginMode&&(
                    <ImageUpload id='image' center Input={inputHandler} 
                    errorText="Please provide an image"/>
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
    </React.Fragment>
  )
}

export default Auth;
