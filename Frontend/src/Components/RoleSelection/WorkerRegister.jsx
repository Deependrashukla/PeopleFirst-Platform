import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './WorkerRegister.css'; // Import the CSS file

const RegisterWorker = () => {
  const [age, setAge] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Check if the worker is at least 18 years old
    if (age < 18) {
      alert("Worker must be at least 18 years old.");
      return;
    }
  
    // Create the object containing worker data to send to the API
    console.log(data)
    // const workerData = {
    //   firstName: data.firstName,
    //   lastName: data.lastName,
    //   address: data.address,
    //   pincode: data.pincode,
    //   occupation: data.occupation,
    //   aadhaarNumber: data.aadhaarNumber,
    //   experience: data.experience,
    //   mobile: data.mobile,
    //   dob: data.dob,
    //   age: age,
    //   email: data.email,
    //   aadhaarCardPhoto: data.aadhaarCardPhoto[0],  // Taking the first file from input
    //   workerPhoto: data.workerPhoto[0],  // Taking the first file from input
    // };
  
    //console.log(workerData); // View the object in console before sending
  
    // Example: Send the object to your API using fetch or axios
    fetch('http://127.0.0.1:5000/register-worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
    alert("Registration successful! Data ready to be sent to the API.");
  };
  

  // Watch Date of Birth field and calculate age
  const dob = watch('dob');
  
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

  // Update the age state whenever the Date of Birth changes
  useEffect(() => {
    const calculatedAge = calculateAge(dob);
    setAge(calculatedAge);
  }, [dob]);

  return (
    <div className="container">
      <h2>Worker Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        
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

        <div>
          <label>Aadhaar Card Photo</label>
          <input type="file" {...register('aadhaarCardPhoto', { required: true })} />
          {errors.aadhaarCardPhoto && <p>Aadhaar card photo is required</p>}
        </div>

        <div>
          <label>Worker's Photo</label>
          <input type="file" {...register('workerPhoto', { required: true })} />
          {errors.workerPhoto && <p>Worker's photo is required</p>}
        </div>

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

        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterWorker;
