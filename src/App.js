import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
firebase.initializeApp(firebaseConfig);
function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    photo: "",
    isValid: false,
    error: "",
    existingUser: false,
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSign = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signOutUser = {
          isSignIn: false,
          name: "",
          email: "",
          photo: "",
        };
        setUser(signOutUser);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const switchForm = (e) => {
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  };
  // ?input validation
  const is_valid_email = (email) => {
    return /^.+@.+\..+$/.test(email);
  };
  //? input validation
  const hasNumber = (input) => {
    return /\d/.test(input);
  };
  const handleCreateAccount = (e) => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch((error) => {
          console.log(error);
          const createdUser = { ...user };
          createdUser.isSignIn = false;
          createdUser.error = error.message;
          setUser(createdUser);
        });
    } else {
      console.log("form is not valid", {
        email: user.email,
        pass: user.password,
      });
    }
    e.preventDefault();
    e.target.reset();
  };

  const signIn = (e) => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch((error) => {
          console.log(error);
          const createdUser = { ...user };
          createdUser.isSignIn = false;
          createdUser.error = error.message;
          setUser(createdUser);
        });
    }
    e.preventDefault();
    e.target.reset();
  };
  const handleChange = (e) => {
    const newUserInfo = {
      ...user,
    };
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 9 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };
  return (
    <div className="App">
      {user.isSignIn ? (
        <button onClick={() => handleSignOut()}>Sign out</button>
      ) : (
        <button onClick={() => handleSign()}>Sign In with Google</button>
      )}
      {user.isSignIn && (
        <div>
          <p>Welcome ,{user.name}</p>
          <p>Your email :{user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      {user.error && (
        <div>
          <p style={{ color: "red" }}>{user.error} </p>
        </div>
      )}

      <h1>Our own authentication</h1>
      <input
        type="checkbox"
        name="switchForm"
        onChange={switchForm}
        id="switchForm"
      />
      <label htmlFor="switchForm">Returning User</label>
      <form
        style={{ display: user.existingUser ? "block" : "none" }}
        onSubmit={signIn}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="Your Email"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="Password"
          required
        />
        <br />
        <input type="submit" value="signIn" />
      </form>
      <form
        style={{ display: user.existingUser ? "none" : "block" }}
        onSubmit={handleCreateAccount}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="name"
          placeholder="Your Name"
          required
        />
        <br />
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="Your Email"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="Password"
          required
        />
        <br />
        <input type="submit" value="Create Account" />
      </form>
    </div>
  );
}

export default App;
