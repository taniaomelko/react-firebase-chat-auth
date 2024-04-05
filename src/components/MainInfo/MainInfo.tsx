import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '../../firebase/firebase';
import { LockIcon, ProfileIcon } from '../icons';
import { LoaderIcon } from '../icons';

export const MainInfo = () => {
  const { 
    currentUser,
    currentUser: { photoURL, displayName, email, uid },
    setUser,
  } = useAuth();

  const [name, setName] = useState(displayName || '');

  const [file, setFile] = useState<any>(''); // Hold the file object
  const [previewURL, setPreviewURL] = useState(photoURL || ''); // Hold the preview URL
  const [imgError, setImgError] = useState(false);

  const [disabledButton, setDisabledButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Reset imgError when previewURL changes
    setImgError(false);
  }, [previewURL]);

  const handleChange = () => {
    setDisabledButton(false);
  }

  const changePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result as string);
        setImgError(false); // Reset the error state
      };
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = async () => {
    const photoRef = ref(storage, `profilePictures/${uid}`);
  
    try {
      await deleteObject(photoRef);
      console.log("Photo deleted successfully.");
      setPreviewURL('');
      setFile(null); 
    } catch (error) {
      console.error("Error deleting photo:", error);
    }

    setDisabledButton(false);
  };

  const changeEmail = () => {
    navigate('/change-email');
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setDisabledButton(true);

    await updateProfile(currentUser, { displayName: name });
    setUser({ ...currentUser, displayName: name });

    if (file) {
      const storageRef = ref(storage, `profilePictures/${currentUser?.uid}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(snapshot.ref);
        await updateProfile(currentUser, { photoURL });
        console.log("Profile updated.");
        setUser({ ...currentUser, photoURL }); // Update global user state with new photoURL
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }

    setLoading(false);
  };

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="mb-20 flex gap-20">
        {previewURL && !imgError ? (
          <img 
            className="shrink-0 w-80 h-80 rounded-full object-cover" 
            src={previewURL} 
            alt="Profile"
            onError={() => setImgError(true)} 
          />
        ) : (
          <ProfileIcon className="shrink-0 w-80 h-80" />
        )}

        <div>
          <div className="mb-4 text-14 font-bold">
            Profile Picture
          </div>
          <input
            type="file"
            id="profile-picture"
            onChange={changePhoto}
          />
          {previewURL && !imgError && (
            <div className="mt-4">
              <div 
                className="link text-14 underline underline-offset-4" 
                onClick={deletePhoto}
              >
                Delete current photo 
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-20">
        <label htmlFor="name" className="text-14 font-bold">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-20">
        <label htmlFor="email" className="text-14 font-bold">
          Email
        </label>
        <div className="relative">
          <input
            className="!pr-30 outline-none"
            type="email"
            id="email"
            value={email}
            readOnly
          />
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <LockIcon className="w-12 h-12" />
          </div>
        </div>

        <div 
          className="link text-14 underline underline-offset-4"
          onClick={changeEmail}
        >
          Request email change
        </div>
      </div>

      <div className="flex items-center gap-10">
        <button 
          type="submit" 
          disabled={disabledButton} 
          className="button"
          >
          Update Profile
        </button>

          {loading && (
            <LoaderIcon className="animate-spin text-cyan" />
          )}
      </div>

    </form>
  );
};
