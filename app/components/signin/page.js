"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox } from "@nextui-org/react";
import { auth, app } from "../../lip/firebase/clientApp";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
    <div className="container max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
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
        <Button className="mt-4 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500" variant="solid" color="primary" type="submit">
          Sign in
        </Button>
        {loading && (
          <Button isLoading color="default">
            Loading
          </Button>
        )}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-600">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <Button
          className="flex items-center justify-center mt-4 font-bold text-white"
          variant="solid"
          color="warning"
          type="button"
          onClick={signInWithGoogle}
        >
          <img src="/assets/google.png" alt="Google" className="w-6 h-6 mr-2" />
          Sign In with Google
        </Button>
        <div className="text-xs text-center text-gray-700  mt-4">
          Don't have an account?{" "}
          <a href="/components/signup" className="text-blue-500 ">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  </div>
);
};

export default SignIn;
