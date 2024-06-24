// app/lip/hooks/useAuth.js
'use client'

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/clientApp';

function useAuth() {
    const [ user, setLocalUser ] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                console.log('There is user.');
                setLocalUser(user);
            }else{
                console.log('There is no user.');
                setLocalUser(null);
            }
        })
        return () => unsubscribe();
    },[])


    return user;
    
}export default useAuth;