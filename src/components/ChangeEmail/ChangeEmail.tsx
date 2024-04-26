import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  EmailAuthProvider, 
  updateEmail,
  reauthenticateWithCredential, 
  sendEmailVerification,
} from "firebase/auth";

import { useAuth } from '../../firebase/authContext';
import { PasswordInput } from '../PasswordInput/PasswordInput';

export const ChangeEmail = () => {
  const { currentUser, currentUser: { email } } = useAuth();

  const [password, setPassword] = useState('');
  const [newEmail, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (newEmail && password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [newEmail, password]);

  function reauthenticate(password: string) {
    const credential = EmailAuthProvider.credential(email, password);

    return reauthenticateWithCredential(currentUser, credential);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    reauthenticate(password)
    .then(() => { 
      updateEmail(currentUser, newEmail)
      .then(() => {
        sendEmailVerification(currentUser)
          .then(() => {
            setSuccess("Verification email sent! Please check your inbox and click the link to verify your email.");
            console.log("Email updated successfully!");
          })
          .catch((error) => {
            throw new Error(error);
          });
        })
        .catch(() => {
          setErrorEmail('Invalid email.');
        });
    })
    .catch(() => {
      setErrorPassword('Wrong password.');
    });
  };

  return (
    <section className="py-40">
      <div className="container">
        <div className="mx-auto max-w-420 p-20 shadow-small rounded">
          <Link to="/profile">
            ← Back 
          </Link>

          <div className="mb-10">
            <h1 className="text-20 font-bold text-center">Change Email</h1>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-10 text-14">
                For security, please enter your current password to confirm your identity before updating your email address.
              </div>

              <div className="mb-20">
                <PasswordInput id="password" setPassword={setPassword} />
                {errorPassword && (
                  <div className="mt-4 text-12 leading-10 text-red">
                    {errorPassword}
                  </div>
                )}
              </div>

                <div className="mb-10 text-14">
                  You are about to update your email address that will be used for all future communications and account recovery processes. Please confirm your new email address below:
                </div>

              <div className="mb-20">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your new email address"
                />
                {errorEmail && (
                  <div className="mt-4 text-12 leading-10 text-red">
                    {errorEmail}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="button w-full"
                disabled={disabled}
              >
                Update Email
              </button>
            </form>
          ) : (
            <div>{success}</div>
          )}
        </div>
      </div>
    </section>
  );
};
