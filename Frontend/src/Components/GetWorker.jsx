// // src/components/GetWorker.jsx

// import React, { useState } from 'react';

// const GetWorker = () => {
//   const [work, setWork] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [workers, setWorkers] = useState([]);
//   const [error, setError] = useState('');

//   const fetchWorkers = async () => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/api/workers?work=${encodeURIComponent(work)}&pincode=${encodeURIComponent(pincode)}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setWorkers(data);
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch workers');
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (work && pincode) {
//       fetchWorkers();
//     } else {
//       setError('Please provide both work and pincode');
//     }
//   };

//   return (
//     <div className="get-worker">
//       <h1>Find Workers</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="work">Work:</label>
//           <input
//             id="work"
//             type="text"
//             value={work}
//             onChange={(e) => setWork(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="pincode">Pincode:</label>
//           <input
//             id="pincode"
//             type="text"
//             value={pincode}
//             onChange={(e) => setPincode(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Search</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//       {workers.length > 0 && (
//         <ul>
//           {workers.map((worker) => (
//             <li key={worker.id}>
//               {worker.name} - {worker.work}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default GetWorker;
