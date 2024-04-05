import React, { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { GoogleIcon } from '../icons';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider, 
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
 
export const Login:React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) return;
        const token = credential.accessToken;
        const user = result.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage);
      });
  };;

  const forgetPassword = () => {
    navigate('/restore-password')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <section className="py-40">
      <div className="container">
        <div className="mx-auto max-w-[420px] p-20 shadow-small rounded">
          <div className="mb-10">
            <h1 className="text-20 font-bold text-center">Log in</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-20">
              <label htmlFor="email-address" className="block">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                autoComplete=""
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-20">
              <label htmlFor="password" className="block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete=""
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div 
                className="link text-14 underline underline-offset-4"
                onClick={forgetPassword}
              >
                Forget password?
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="button w-full"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="mt-20">
            No profile yet? {' '}
            <NavLink to="/sign-up" className="font-semibold text-dark-cyan">
              Sign up
            </NavLink>
          </div>

          <div className="py-20 relative w-full before:content-[''] before:absolute before:left-0 before:top-1/2 before:right-0 before:-z-1 before:h-[1px] before:bg-grey">
            <div className="relative mx-auto block w-fit bg-white px-10 font-semibold uppercase">
              or
            </div>
          </div>

          <div>
            <button
              type="button"
              className="button button--icon button--white w-full"
              onClick={onLoginWithGoogle}
            >
              <GoogleIcon />
              Log in with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
