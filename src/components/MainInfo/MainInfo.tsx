import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage, auth } from '../../firebase/firebase';
import { LockIcon, ProfileIcon } from '../icons';
import { LoaderIcon, PencilIcon } from '../icons';

export const MainInfo = () => {
  const user = auth.currentUser;

  const { 
    currentUser: { photoURL, displayName, email, uid }, 
    setUser 
  } = useAuth();

  const [name, setName] = useState(displayName || '');
  const [file, setFile] = useState<File | null>(null); // Hold the file object
  const [previewURL, setPreviewURL] = useState(photoURL || ''); // Hold the preview URL
  const [imageError, setImageError] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Reset imageError when previewURL changes
    setImageError(false);
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
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const shortenFileName = (fileName: string) => {
    const maxLength = 20; // Maximum length of the file name
    const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2); // Extract the file extension
    const baseName = fileName.slice(0, (fileName.lastIndexOf(".") - 1) >>> 0); // Extract the base name without extension

    if (fileName.length <= maxLength) {
      // Return the original name if it's short enough
      return fileName;
    }

    // Calculate how much of the base name we can include
    const baseNameLength = maxLength - extension.length - 4; // Subtract 4 for the ellipsis and the dot before the extension
    if (baseNameLength < 1) {
      // If there's not enough space for even one character of the base name plus the ellipsis and extension, return the extension only
      return `...${extension}`;
    }

    // Return the shortened base name plus the ellipsis and extension
    return `${baseName.slice(0, baseNameLength)}...${extension}`;
  }

  const handleClickFileInput = () => {
    const fileInput = document.getElementById('profile-picture');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDeletePhoto = async () => {
    setPreviewURL('');
    setFile(null);
    setDisabledButton(false);
  };

  const changeEmail = () => {
    navigate('/change-email');
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setDisabledButton(true);

    if (user) { 
      await updateProfile(user, { displayName: name });
      setUser({ ...user, displayName: name });

      if (file) {
        const storageRef = ref(storage, `profilePictures/${user?.uid}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const photoURL = await getDownloadURL(snapshot.ref);
          await updateProfile(user, { photoURL });
          console.log("Profile updated.");
          setUser({ ...user, photoURL }); 
        } catch (error) {
          alert(`Error updating profile: ${error}`);
          throw new Error(`Error updating profile: ${error}`);
        } finally {
          setLoading(false);
        }
      }
  
      if (!file) {
        const photoRef = ref(storage, `profilePictures/${uid}`);

        await deleteObject(photoRef)
          .then(() => {
            updateProfile(user, { photoURL: null });
            setUser({ ...user, photoURL: null });
          })
          .catch(() => {
            alert('An error occurred. Please try again.');
            throw new Error('An error occurred. Please try again.');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } 
  };

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="mb-4 text-14 font-bold">
        Profile Picture
      </div>

      <div className="mb-20 flex flex-wrap gap-20">
        <div className="relative">
          {previewURL && !imageError ? (
            <img
              className="shrink-0 w-80 h-80 rounded-full object-cover"
              src={previewURL}
              alt="Profile"
              onError={() => setImageError(true)}
            />
          ) : (
            <ProfileIcon className="shrink-0 w-80 h-80" />
          )}

          <input
            type="file"
            accept="image/*"
            id="profile-picture"
            className="hidden"
            onChange={changePhoto}
          />

          <button
            type="button"
            className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-tranparent transition duration-300 hover:bg-black/20"
            onClick={handleClickFileInput}
          >
            <div className="absolute right-0 bottom-0 p-6 bg-light-grey rounded-full">
              <PencilIcon className="" />
            </div>
          </button>
        </div>

        <div>
          {file && file.name && (
            <div className="">{shortenFileName(file.name)}</div>
          )}

          {previewURL && !imageError && (
            <div className="mt-4">
              <div
                className="link text-14 underline underline-offset-4"
                onClick={handleDeletePhoto}
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
