"use client";

import React, { useState } from "react";
import { Button, Input, Spinner, Link } from "@nextui-org/react";
import { auth, db } from "../../lip/firebase/clientApp";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    let email = e.currentTarget.email.value;

    // Check password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Check if password and re-password match
    if (password !== rePassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        // Store name in Cloud Firestore
        const userRef = collection(db, "names");
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
      const userRef = collection(db, "names");
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
    <>
      <div className="flex items-center justify-center">
        <div className="container xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 m-20">
          <h2 className="pb-3 text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-400">
            Sign up
          </h2>
          <p className="text-center text-md text-gray-700 mt-1 mb-1">
            Create an account
          </p>
          <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Name
              </label>
              <Input
                size="md"
                variant="bordered"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Re-Password
              </label>
              <Input
                size="md"
                variant="bordered"
                type="password"
                name="rePassword"
                placeholder="Enter your re-password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </div>
            <Button
              className=" font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-400"
              variant="solid"
              color="primary"
              type="submit"
            >
              Sign up
            </Button>
            {loading && <Spinner color="default" labelColor="foreground" />}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-600">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <Button className="flex items-center justify-center mt-4 font-bold text-black" color="default" type="button" onClick={signUpWithGoogle}>
              <img
                src="/assets/google.png"
                alt="Google"
                className="w-6 h-6 mr-2"
              />{" "}
              Sign Up with Google
            </Button>
            <p className="text-xs text-center text-gray-700 mt-4">
              I'm already a member!{" "}
              <Link href="/dashboard" className="text-xs text-blue-500">
              Sign In
            </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
