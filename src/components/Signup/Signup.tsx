import React, { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase/firebase";

export const Signup: React.FC = () => { 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    
    return async () => {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          navigate("/");
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(code, message);
          // Assuming errors are accumulated in an object by type
          setErrors({[code]: message});
        });
    };
  };

  // Helper function to extract and display an error message by code
  const getErrorMessage = (errorCode: string) => {
    const errorKeys = Object.keys(errors);
    const foundKey = errorKeys.find(key => key.includes(errorCode));
    return foundKey ? errors[foundKey] : '';
  };
 
  return (
    <section className="py-40">
      <div className="container">
        <div className="mx-auto max-w-[420px] p-20 shadow-small rounded">
          <div className="mb-10">
            <h1 className="text-20 font-bold text-center">Sign up</h1>
          </div>
          
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
              {getErrorMessage('email') && (
                <div className="mt-4 text-12 leading-10 text-red">
                  {getErrorMessage('email')}
                </div>
              )}
            </div>

            <div className="mb-20">
              <label htmlFor="password" className="block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                autoComplete=""
                placeholder="Password"
              />
              {getErrorMessage('password') && (
                <div className="mt-4 text-12 leading-10 text-red">
                  {getErrorMessage('password')}
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
        </div>
      </div>
    </section>
  );
}
