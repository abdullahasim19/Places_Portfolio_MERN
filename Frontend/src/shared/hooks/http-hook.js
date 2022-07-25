import { useState,useCallback,useRef,useEffect} from "react";

export const useHttpClient=()=>
{
    const [isloading,setIsLoading]=useState(false);
    const [error,setError]=useState();

    const activeHttpRequests=useRef([]);

    const sendRequest=useCallback(async(url,method='GET',body=null,headers={})=>{
        setIsLoading(true);

        const httpAbortCtrll=new AbortController();
        activeHttpRequests.current.push(httpAbortCtrll);
        try {
            const response=await fetch(url,{
                method,
                body,
                headers,
                signal:httpAbortCtrll.signal
            });
            const responseData=await response.json();
            activeHttpRequests.current=activeHttpRequests.current.filter(req=>req!==httpAbortCtrll);

            if(!response.ok)
            {
               throw new Error(responseData.message);
            }
            setIsLoading(false);
            return responseData;

        } catch (error) {
            setError(error.message|| 'An unknown error occured');
            setIsLoading(false);
            throw error;
        }
    },[]);

    const manageError=()=>{
        setError(null);
    }
    useEffect(()=>{
        return ()=>{
            activeHttpRequests.current.forEach(abortctrl=>abortctrl.abort());
        };
    },[]);

    return {isloading,error,sendRequest,manageError};
}