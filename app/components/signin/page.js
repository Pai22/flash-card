"use client";

import React, { useState } from "react";
import { Button, Input, Link, Spinner } from "@nextui-org/react";
import { auth, app, db } from "../../lip/firebase/clientApp";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDoc);

      if (!userDocSnap.exists()) {
        // If user doesn't exist in Firestore, create a new document
        await setDoc(userDoc, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        });
      }
      router.push("/dashboard");
    } catch (e) {
      console.error("Error signing in with Google:", e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <div className="container xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="pb-3 text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
          Sign in
        </h2>
        <p className="text-center text-gray-700 mb-4">
          Enter your email and password
        </p>
        <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Email address
            </label>
            <Input
              size="md"
              variant="bordered"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <Input
              size="md"
              variant="bordered"
              type={isVisible ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <Button
            className="font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500"
            variant="solid"
            color="primary"
            type="submit"
          >
            Sign in
          </Button>
          {loading && <Spinner color="default" labelColor="foreground" />}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-600">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <Button
            className="flex items-center justify-center mt-4 font-bold text-black"
            variant="solid"
            color="default"
            type="button"
            onClick={signInWithGoogle}
          >
            <img
              src="/assets/google.png"
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            Sign In with Google
          </Button>
          <div className="text-xs text-center text-gray-700 mt-4">
            Don't have an account?{" "}
            <Link href="/components/signup" className="text-xs text-blue-500">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
