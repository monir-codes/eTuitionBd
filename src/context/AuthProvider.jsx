import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateCurrentUser, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

     const createUser = (email, pass)=>{
       return createUserWithEmailAndPassword(auth, email, pass);
     }

     const signIn = (email, pass)=>{
        return signInWithEmailAndPassword(auth, email, pass);
     }

     const logOut = ()=>{
        return signOut(auth).then(
            console.log('logged out')
            
        ).catch(err=> 
            console.log(err)
        )
     };

     const updateUserProfile = (name, url)=>{
        return updateProfile(auth.currentUser,{
        displayName: name, photoURL: url
        }).then(()=>{
            console.log('Profile successfully updated')
        }).catch((err)=>{
            console.log(err)
        })
     };

     const googleSignIn = ()=>{
        return signInWithPopup(auth, googleProvider)
     }

     useEffect(()=>{
         const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setLoading(true)
            // console.log(currentUser)
            setUser(currentUser)
            if(currentUser){
                const loggedUser = {email: currentUser.email}
                fetch('http://localhost:3000/get-token',{
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(loggedUser)
                }).then(res=> res.json())
                .then(data=>{
                    // console.log(data)
                    localStorage.setItem('access-token', data.token)
                })
            }else{
                localStorage.removeItem('access-token')
            }
            setLoading(false)
        })

        return ()=> unSubscribe
     },[])

    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        createUser,
        updateUserProfile,
        signIn,
        logOut,
        googleSignIn    

    }
    return <AuthContext value={authInfo}>{children}</AuthContext>
};

export default AuthProvider;