import React,{useState,useEffect} from 'react';
import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
export default function Users() {

  const {isloading,error,sendRequest,manageError}=useHttpClient();

  const [loadedUsers,setLoadedUsers]=useState();
  useEffect(()=>{
    const fetchUsers=async()=>{
      try 
      {
        const responseData=await sendRequest('http://localhost:5000/api/users/');//by default method is get
        setLoadedUsers(responseData.users);
      } 
      catch (error) 
      {
        console.log("Error");
        console.log(error); 
      }
    }
    fetchUsers();
  },[sendRequest])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={manageError}/>
      {
        isloading&&(
          <div className='center'>
              <LoadingSpinner/>
          </div>
        )
      }
       {!isloading &&loadedUsers&&<UsersList items={loadedUsers}/>}
    </React.Fragment>
   
  )
}
