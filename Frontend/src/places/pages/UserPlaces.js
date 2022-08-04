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
          const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
          setLoadedPlaces(responseData.places);
        } catch (error) {
          console.log(error);   
        }
      }
      fetchData();
    },[sendRequest,userId])
  
  const DeletePlaceHandler=(placeId)=>{
    setLoadedPlaces((prev)=>{
      return prev.filter(p=>p.id!==placeId);
    })
  }

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
      {
        !isloading &&loadedPlaces&&<PlaceList items={loadedPlaces} onDeletePlace={DeletePlaceHandler}/>
      }
      
    </React.Fragment>
   
  )
}

export default UserPlaces;
