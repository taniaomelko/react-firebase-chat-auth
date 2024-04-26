import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export const RestorePassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess("A password reset email has been sent. Please check your inbox.");
        setError('');
      })
      .catch(() => {
        setSuccess('');
        setError("No account found with this email address. Please make sure you've entered it correctly.");
      });
  };

  return (
    <section className="py-40">
      <div className="container">
        <div className="mx-auto max-w-420 p-20 shadow-small rounded">
          <Link to="/log-in">
            ← Back 
          </Link>

          <div className="mb-10">
            <h1 className="text-20 font-bold text-center">Restore password</h1>
          </div>

          {!success ? (
            <>
              <div className="mb-10 text-14">
                Enter your email address below. We will look into your account and send you a password reset email.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-20">
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />

                  {error && (
                    <div className="mt-4 text-12 leading-10 text-red">{error}</div>
                  )}
                </div>

                <button type="submit" className="button w-full">
                  Send Reset Email
                </button>
              </form>
            </>
          ) : (
            <div>{success}</div>
          )}
        </div>
      </div>
    </section>
  );
};
