import {useState,useEffect,useCallback}from 'react';

let logoutTimer;

export const useAuth=()=>{
const[token,setToken]=useState(false);
  const [userId,setUserid]=useState(null);
  const [tokenDate,setTokenDate]=useState();

  const login=useCallback((uid,newtoken,expirationDate)=>{
    setToken(newtoken);
    setUserid(uid);
    const tokenExpirationDate= expirationDate||new Date(new Date().getTime()+1000*60*60);//1 hour in future time stamp
    // console.log(expirationDate);
    // console.log(tokenExpirationDate);
    setTokenDate(tokenExpirationDate);
    localStorage.setItem('userData',JSON.stringify({userId:uid,token:newtoken,
      expiration:tokenExpirationDate.toISOString()}));
  },[])

  const logout=useCallback((uid)=>{
    setToken(null);
    setUserid(null);
    setTokenDate(null);
    localStorage.removeItem('userData');
  },[])

  useEffect(()=>{
      const storedData=JSON.parse(localStorage.getItem('userData'));
      if(storedData&&storedData.token)        
      {
        if(new Date(storedData.expiration)>new Date()) //checking if expiration date is in future
            login(storedData.userId,storedData.token,new Date(storedData.expiration));
      }
  },[login])

  useEffect(()=>{ //auto logout logic
    if(token && tokenDate)
    {
      const remainingTime=tokenDate.getTime()-new Date().getTime();
      logoutTimer=setTimeout(logout,remainingTime);
    }
    else
    {
      clearTimeout(logoutTimer);
    }
  },[token,logout,tokenDate]);//token will change on login and logout
  return {token,login,logout,userId};
}