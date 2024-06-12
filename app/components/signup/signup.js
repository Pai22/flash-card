"use client"
import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { auth } from '../../lip/firebase/clientApp';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lip/firebase/clientApp';

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
          name: name, // Add the name field
          email: email,
        });
        setLoading(false);
        router.push("/todo-app");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setLoading(false);
      });
  };

  return (
    <div className='rounded-md text-sm px-4 flex flex-col pt-12 items-center '>
      <form onSubmit={handleSignUp} className='grid grid-cols-1 gap-2 w-[250px] min-w-fit items-center justify-center'>
        <h1 className='text-center'>Sign Up</h1>
        <Input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" name="email" placeholder="Email" required />
        <Input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="password" name="rePassword" placeholder="Re-Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
        <Button color="primary" type='submit'>Sign Up</Button>
        <p>{loading ? 'Signing up...' : ''}</p>
        <p className='text-center mt-4'>
          Already have an account? <a href="/todo-app" className='text-blue-500'>Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
