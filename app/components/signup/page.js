"use client";

import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { auth, db } from '../../lip/firebase/clientApp';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    let email = e.currentTarget.email.value;

    // Check password length
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Check if password and re-password match
    if (password !== rePassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        // Store name in Cloud Firestore
        const userRef = collection(db, 'names');
        await addDoc(userRef, {
          uid: user.uid,
          name: name,
          email: email,
        });
        setLoading(false);
        router.push("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setLoading(false);
      });
  };

  const signUpWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // Store name in Cloud Firestore
      const userRef = collection(db, 'names');
      await addDoc(userRef, {
        uid: user.uid,
        name: user.displayName, // Use Google account name
        email: user.email,
      });
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing up with Google: ", error.message);
      setLoading(false);
    }
  };

  return (
    <div className='rounded-md  px-4 flex flex-col pt-12 items-center '>
      <form onSubmit={handleSignUp} className='grid grid-cols-1 gap-2 w-[250px] min-w-fit items-center justify-center'>
        <h1 className='text-center text-4xl font-bold'>Sign Up</h1>
        <Input size="sm" type="text" name="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input size="sm" type="email" name="email" label="Email" required />
        <Input size="sm" type="password" name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input size="sm" type="password" name="rePassword" label="Re-Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
        <Button color="primary" type='submit'>Sign Up</Button>
        <Button color="warning" type='button' onClick={signUpWithGoogle}>Sign Up with Google</Button>
        <p>{loading ? 'Signing up...' : ''}</p>
        <p className='text-center mt-4'>
          Already have an account? <a href="/dashboard" className='text-blue-500'>Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
