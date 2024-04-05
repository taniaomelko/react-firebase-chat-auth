import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { updateEmail } from "firebase/auth";
import { useAuth } from '../../firebase/authContext';

export const ChangeEmail = () => {
  const { currentUser } = useAuth();

  const [newEmail, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateEmail(currentUser, newEmail)
      .then(() => {
        setSuccess("Please check your inbox to confirm the email change. A confirmation message has been sent to your new email address to complete the update process.");
        setError('');
      })
      .catch((error) => {
        setSuccess('');
        setError(error.message);
      });
  };

  return (
    <section className="py-40">
      <div className="container">
        <div className="mx-auto max-w-[420px] p-20 shadow-small rounded">
          <Link to="/profile">
            ← Back 
          </Link>

          <div className="mb-10">
            <h1 className="text-20 font-bold text-center">Change Email</h1>
          </div>

          {!success ? (
            <>
              <div className="mb-10 text-14">
                You are about to update your email address that will be used for all future communications and account recovery processes. Please confirm your new email address below:
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-20">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your new email address"
                />
                  {error && (
                    <div className="mt-4 text-12 leading-10 text-red">{error}</div>
                  )}
                </div>

                <button type="submit" className="button w-full">
                  Update Email
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
