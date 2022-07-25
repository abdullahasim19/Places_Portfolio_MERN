import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import PlaceList from '../components/PlaceList';
import {useHttpClient} from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

function UserPlaces(props) {

    const [loadedPlaces,setLoadedPlaces]=useState();
    const {isloading,error,sendRequest,manageError}=useHttpClient();

    const userId=useParams().userId; // loading places according to the userId

    useEffect(()=>{
      const fetchData=async()=>{
        try {
          const responseData=await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
          setLoadedPlaces(responseData.places);
        } catch (error) {
          console.log(error);   
        }
      }
      fetchData();
    },[sendRequest,userId])
    

  return (
    <React.Fragment>
      <ErrorModal error={error} onCancel={manageError}/>
      {
        isloading&&(
          <div className='center'>
            <LoadingSpinner/>
          </div>
        )
      }
      {
        !isloading &&loadedPlaces&&<PlaceList items={loadedPlaces}/>
      }
      
    </React.Fragment>
   
  )
}

export default UserPlaces;
