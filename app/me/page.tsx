/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useAuth } from "@/contexts/AuthContext";
import ImageUploadDialog from "@/components/ImageUploadDialog";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import SecondaryButton from "@/components/SecondaryButton";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Img } from "react-image";
import { toast } from "react-toastify";
import { objectKeysAreEquivalant } from "@/src/form-helpers";
import CautiousButton from "@/components/CautiousButton";
import AccordionSection from "@/components/Accordian";
import Skeleton from "./skeleton";
import { SkeletonField } from "@/components/Skeleton";

const MyProfile: NextPage = () => {
  const { user, logout } = useAuth();
  const [values, setValues] = useState({
    uid: '',
    email: '',
    emailVerified: false,
    displayName: '',
    photoURL: '',
    phoneNumber: '',
    disabled: false,
  });

  const [isProfileUploadDialogOpen, setIsProfileUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [cleanValues, setCleanValues] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false)

  const setValuesSafely = (update: typeof values | ((prevValues: typeof values) => typeof values)) => {
    setValues(prevValues => {
      const newValues = typeof update === 'function' ? update({ ...prevValues }) : update;
      const safeValues: any = { ...prevValues };

      for (const [key, value] of Object.entries(newValues)) {
        if (value !== undefined) {
          safeValues[key] = value;
        }
      }

      return safeValues;
    });
  };

  const handleProfilePicChange = (url: string) => {
    setValuesSafely(prevState => ({ ...prevState, photoURL: url }));
  };

  const handleUploadSuccess = (filename: string) => {
    handleProfilePicChange(`/api/web-assets/${filename}`)
    setIsProfileUploadDialogOpen(false)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setValuesSafely({ ...values, [id]: value });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
  
    if (!form.checkValidity()) {
      return;
    }
    
    setIsSaving(true);
    try {
      const idToken = await user?.getIdToken(true);
      const sanitizedPhoneNumber = values.phoneNumber.replace(/\D/g, '');

      const response = await fetch(`/api/users/${values.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: values.displayName,
          phoneNumber: sanitizedPhoneNumber,
          photoURL: values.photoURL
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error.message);
      } else {
        toast.success("user was updated successfully!");
        setValuesSafely(data);
        setCleanValues(data);
      }
    } catch (error) {
      console.log("Error saving user data", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    const idToken = await user?.getIdToken(true);
    try {

      const response = await fetch(`/api/users/${user?.uid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        setDeleted(true)
        toast.success(`${user?.email} deleted. Logging out...`, {
          onClose: () => (
            logout()
          )
        });
      } else {
        const errData = await response.json();
        toast.error(errData.error.message);
      }
    } catch (error) {
      console.error(error)
      toast.error("An unknown error occurred while deleting your account");
    }
    setIsDeleting(false)
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      user.getIdToken(true).then((idToken: string) => {
        const getUserData = async () => {
          try {
            const response = await fetch('/api/users?me=true', {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            });

          
            if (!response.ok) {
              toast.error("an error occurred when attemping to retreive this user. Please try again later")
            }

            const data = await response.json();
            setValuesSafely(data);
            setCleanValues(data);
            
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            setIsLoading(false)
          }
        };
        getUserData();
      }).catch((error) => {
        console.error('Error getting ID token:', error);
      });

    }
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave the page?';
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    if (isDirty != false) {
      setIsDirty(false)
    }
    if (cleanValues) {
      const dirtied = !objectKeysAreEquivalant(values, cleanValues);
      setIsDirty(dirtied)
    }
  }, [values, cleanValues, isDirty])

  return (
    <main className="flex flex-col justify-center items-center">

      {!deleted ? <>

        <h1 className="text-xl font-semibold">Your user account</h1>

        <form onSubmit={handleSave} className="panel flex flex-col w-screen sm:w-5/6 lg:w-1/2 xl:1/3 shadow-l ">

          {isLoading || isSaving ? <Skeleton/> :
            <div className="flex flex-col md:flex-row w-full p-8 space-y-6 md:space-y-0 md:space-x-6">
              <div className="w-full md:w-3/4 space-y-2">

                {/* Email field */}
                <div className="flex flex-col space-y-2 mb-5">
                  <span className="font-medium" >Email</span>
                  <div className="text-lg pl-2">{values.email}</div>
                </div>

                {/* Display Name field */}
                <div className="flex flex-col">
                  <label htmlFor="displayName">Display Name</label>
                  <input required type="text" id="displayName"
                    value={values.displayName}
                    autoComplete="name"
                    onChange={handleInputChange}
                    className="border rounded w-full py-2 px-3" />
                </div>

                {/* Phone Number field */}
                <div className="flex flex-col">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel" 
                    id="phoneNumber"
                    autoComplete="tel" 
                    value={values.phoneNumber}
                    pattern="(\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}"
                    onChange={handleInputChange}
                    className="border rounded w-full py-2 px-3"
                    />
                </div>
              </div>

              <div className="w-full md:w-1/4 p- rounded-lg space-y-2">

                {/* Photo URL field */}
                <div className="flex flex-col space-y-2 mb-5">
                  <label htmlFor="photoURL">Photo</label>
                  {
                    values.photoURL ?
                      <Img src={values.photoURL} alt="Profile Photo" className="h-32 object-cover rounded-xl" /> :
                      <div className="h-32 object-cover rounded-xl bg-gray-300 flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                  }

                  <SecondaryButton onClick={function (): void {
                    setIsProfileUploadDialogOpen(true)
                  }}>Update Photo</SecondaryButton>

                  <input
                    type="hidden"
                    id="photoURL"
                    onChange={handleInputChange}
                    value={values.photoURL}
                  />

                  <ImageUploadDialog
                    namespace="profile-pics"
                    title="Upload a profile picture"
                    show={isProfileUploadDialogOpen}
                    onUploadSuccess={handleUploadSuccess}
                    onClose={(val: boolean) => {
                      setIsProfileUploadDialogOpen(val)
                    }}
                  />
                </div>

                {/* Email Verified field */}
                <div className="flex items-center justify-between">
                  <label htmlFor="emailVerified">Email Verified</label>
                  <input readOnly type="checkbox" id="emailVerified" checked={values.emailVerified} className="form-checkbox h-6 w-6 text-gray-500 border rounded" />
                </div>
              </div>
            </div>
          }

          <div className="flex flex-col w-full items-start">
            <PrimaryButton
              type="submit"
              className="w-5/6 sm:w-1/3"
              disabled={isSaving || !isDirty}>
              {isSaving ? "Saving..." : "Save"}
            </PrimaryButton>
            {isSaving && <ProgressBar />}
          </div>

        </form>
        {/* UID field */}
        <div className="font-mono text-xs mb-5">
          {isLoading ? <SkeletonField className='w-80' ></SkeletonField> :
            <p><span className="font-bold">uid: </span> {values.uid}</p>
          }
        </div>

        <AccordionSection className="flex flex-col w-screen sm:w-5/6 lg:w-1/2 xl:1/3 shadow-l panel bg-t"
          isOpen={isAccordionOpen} toggleAccordion={() => setIsAccordionOpen(!isAccordionOpen)}
          title={"Account"}>

          <p className="text-sm mb-2 font-semibold">Deleting an account has the following disclaimer:</p>
          <ul className="list-disc pl-5 text-sm mb-5">
            <li>Certain user associated data is retained for posterity and auditing</li>
            <li>Your personally identifiable data will be removed or anonymized</li>
            <li>The locations you own will be deleted and will not be recoverable</li>
          </ul>

          <CautiousButton
            areYouSureMessage={`Are you sure you want to permanently delete the user account for ${user?.email}? Accounts can't be undeleted?`}
            onConfim={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </CautiousButton>
          {isDeleting && <ProgressBar />}
        </AccordionSection>

      </> : <p>We have received your request to have your account deleted. Sorry to see you go. </p>}

    </main>
  );
};

export default MyProfile;
