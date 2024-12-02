import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './WorkerRegister.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { auth, storage } from '../../firebase-config';

// Function to upload a file to Firebase Storage
const uploadFile = async (file, path) => {
  if (!file) return null;
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref); // Get the public download URL
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

const RegisterWorker = () => {
  const [age, setAge] = useState(0);
  const [step, setStep] = useState(1); // Step state to track pagination
  const [aadhaarCardPhotoUrl, setAadhaarCardPhotoUrl] = useState('');
  const [workerPhotoUrl, setWorkerPhotoUrl] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dob = watch('dob');  // Watch dob value for changes

  const onSubmit = async (data) => {
    const updatedData = { ...data, age };

    if (age < 18) {
      alert("Worker must be at least 18 years old.");
      return;
    }

    console.log(updatedData);

    // Upload Aadhaar Card Photo and Worker Photo if not already uploaded
    const aadhaarCardPhotoUrl = await uploadFile(data.aadhaarCardPhoto[0], `aadhaarPhotos/${Date.now()}_${data.aadhaarCardPhoto[0].name}`);

    // Now, call the KYC verification endpoint
    const kycRequestData = {
      front_image_path: aadhaarCardPhotoUrl,
      back_image_path: aadhaarCardPhotoUrl,
      doc_insert_id: 1, // or other unique doc_insert_id
      nat_id: 91 // Or the actual national ID value
    };

    // Call the KYC verification API
    try {
      const kycResponse = await fetch('http://127.0.0.1:5000/verify-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kycRequestData),
      });

      const kycData = await kycResponse.json();
      console.log('KYC Verification Response:', kycData);

      if (kycData.success) {
        // If KYC verification is successful, proceed with registration
        fetch('http://127.0.0.1:5000/add-worker-deatils', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        })
          .then(response => response.json())
          .then(updatedData => {
            console.log('Success:', updatedData);
            alert("Registration successful! Data ready to be sent to the API.");
            navigate("/event-form");
          })
          .catch((error) => {
            console.error('Error:', error);
            alert("Registration unsuccessful!");
          });
      } else {
        // Handle failed KYC verification
        alert("KYC verification failed. Please try again.");
      }
    } catch (error) {
      console.error('Error during KYC verification:', error);
      alert("KYC verification failed. Please try again.");
    }
  };

  // Function to calculate age from dob
  const calculateAge = (dob) => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return 0;
  };

  useEffect(() => {
    // Recalculate age whenever dob changes
    const calculatedAge1 = calculateAge(dob);
    console.log("AGE:", calculatedAge1);
    setAge(calculatedAge1);
  }, [dob]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="container">
      <h2>Worker Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Step 1: Name Information */}
        {step === 1 && (
          <>
            <div>
              <label>First Name</label>
              <input type="text" {...register('firstName', { required: true })} />
              {errors.firstName && <p>First name is required</p>}
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" {...register('lastName', { required: true })} />
              {errors.lastName && <p>Last name is required</p>}
            </div>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}

        {/* Step 2: Address Information */}
        {step === 2 && (
          <>
            <div>
              <label>Address</label>
              <input type="text" {...register('address', { required: true })} />
              {errors.address && <p>Address is required</p>}
            </div>
            <div>
              <label>Pincode</label>
              <input type="text" {...register('pincode', { required: true, pattern: /^[0-9]{6}$/ })} />
              {errors.pincode && <p>Valid 6-digit Pincode is required</p>}
            </div>
            <button type="button" onClick={prevStep}>Back</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}

        {/* Step 3: Job Information */}
        {step === 3 && (
          <>
            <div>
              <label>Occupation</label>
              <input type="text" {...register('occupation', { required: true })} />
              {errors.occupation && <p>Occupation is required</p>}
            </div>
            <div>
              <label>Aadhaar Card Number</label>
              <input type="text" {...register('aadhaarNumber', { required: true, pattern: /^[0-9]{12}$/ })} />
              {errors.aadhaarNumber && <p>Valid 12-digit Aadhaar number is required</p>}
            </div>
            <button type="button" onClick={prevStep}>Back</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}

        {/* Step 4: File Upload */}
        {step === 4 && (
          <>
            <div>
              <label>Aadhaar Card Photo</label>
              <input
                type="file"
                accept="image/*"
                {...register("aadhaarCardPhoto", { required: true })}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  const path = `aadhaarPhotos/${Date.now()}_${file.name}`;
                  const url = await uploadFile(file, path);
                  setAadhaarCardPhotoUrl(url);
                  console.log("Aadhaar Card Photo URL:", url);
                }}
              />
              {errors.aadhaarCardPhoto && <p>Aadhaar card photo is required</p>}
            </div>
            <div>
              <label>Worker's Photo</label>
              <input
                type="file"
                accept="image/*"
                {...register("workerPhoto", { required: true })}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  const path = `workerPhotos/${Date.now()}_${file.name}`;
                  const url = await uploadFile(file, path);
                  setWorkerPhotoUrl(url);
                  console.log("Worker's Photo URL:", url);
                }}
              />
              {errors.workerPhoto && <p>Worker's photo is required</p>}
            </div>
            <button type="button" onClick={prevStep}>Back</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}

        {/* Step 5: Contact and Personal Information */}
        {step === 5 && (
          <>
            <div>
              <label>Years of Experience</label>
              <input type="number" {...register('experience', { required: true, min: 0 })} />
              {errors.experience && <p>Experience is required</p>}
            </div>
            <div>
              <label>Mobile Number</label>
              <input type="tel" {...register('mobile', { required: true, pattern: /^[0-9]{10}$/ })} />
              {errors.mobile && <p>Valid 10-digit mobile number is required</p>}
            </div>
            <div>
              <label>Date of Birth</label>
              <input type="date" {...register('dob', { required: true })} />
              {errors.dob && <p>Date of birth is required</p>}
            </div>
            <div>
              <label>Age</label>
              <input type="number" value={age} readOnly />
              {age < 18 && dob && <p>Worker must be at least 18 years old</p>}
            </div>
            <div>
              <label>Email</label>
              <input type="email" {...register('email', { required: true })} />
              {errors.email && <p>Email is required</p>}
            </div>
            <button type="button" onClick={prevStep}>Back</button>
            <button type="submit">Register</button>
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterWorker;
