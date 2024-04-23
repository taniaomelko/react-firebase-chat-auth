import React, { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';
import { auth } from "../../firebase/firebase";
import { PasswordInput } from '../PasswordInput/PasswordInput';

export const Signup: React.FC = () => { 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorEmail('');
    setErrorPassword('');

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        sendEmailVerification(user)
        .then(() => {
          setSuccess("Verification email sent! Please check your inbox and click the link to verify your email.");
          navigate("/log-in");
        })
        .catch(() => {
          // verification error
          setErrorEmail("Failed to send verification email.");
        });
      })
      .catch((error) => {
        // creating user error
        switch (error.code) {
          case 'auth/email-already-in-use':
            setErrorEmail('This email is already in use.');
            break;
          case 'auth/invalid-email':
            setErrorEmail('Email address is invalid.');
            break;
          case 'auth/weak-password':
            setErrorPassword('Password should be at least 6 characters.');
            break;
          default:
            alert('An error occurred. Please try again.');
            throw new Error('An error occurred. Please try again.');
        }
      });
  };
 
  return (
    <section className="py-40">
      <div className="container">
        <div className="mx-auto max-w-[420px] p-20 shadow-small rounded">
          <div className="mb-10">
            <h1 className="text-20 font-bold text-center">Sign up</h1>
          </div>

          {!success ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="mb-20">
                  <label htmlFor="email-address" className="block">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete=""
                    placeholder="Email address"
                  />

                  {errorEmail && (
                    <div className="mt-4 text-12 leading-10 text-red">
                      {errorEmail}
                    </div>
                  )}
                </div>

                <div className="mb-20">
                  <PasswordInput id="password" label="Password" setPassword={setPassword} />

                  {errorPassword && (
                    <div className="mt-4 text-12 leading-10 text-red">
                      {errorPassword}
                    </div>
                  )}
                </div>

                <button
                  type="submit" 
                  className="button w-full"
                >
                  Sign up
                </button>
              </form>

              <div className="mt-20">
                Already have an Profile?{' '}
                <NavLink to="/log-in" className="font-semibold text-dark-cyan">
                  Log in
                </NavLink>
              </div>  
            </>
          ) : (
            <div>{success}</div>
          )}
        </div>
      </div>
    </section>
  );
}
