"use client";

import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { auth, app } from '../../lip/firebase/clientApp';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = (e) => {
    e.preventDefault();
    let email = e.currentTarget.email.value;
    let password = e.currentTarget.password.value;

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        alert("รหัสไม่ถูกต้องโปรดใส่ใหม่อีกครั้ง"); 
        setLoading(false);
      });
  };

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (e) {
      console.error("Error signing in with Google:", e.message);
      setLoading(false);
    }
  };

  return (
    <div className='rounded-md text-sm px-4 flex flex-col pt-12 items-center '>
      <form onSubmit={handleSignIn} className='grid grid-cols-1 gap-2 w-[250px] min-w-fit items-center justify-center'>
        <h1 className='text-center'>Sign In</h1>
        <Input type="email" name="email" placeholder="Email" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button color="primary" type='submit'>Login</Button>
        <p>{loading ? 'Signing in...' : ''}</p>
        <Button color="warning" type='button' onClick={signInWithGoogle}>Sign In with Google</Button>
        <p className='text-center mt-4'>
          Don't have an account? <a href="/components/signup" className='text-blue-500'>Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
