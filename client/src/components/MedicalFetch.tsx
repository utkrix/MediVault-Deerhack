import React, { useState, useEffect } from "react";
import hashValue from "../../utils/hash";

const MedicalFetch = () => {
  const [medicalData, setMedicalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authToken"));
        const query = hashValue(token);
        const response = await fetch(`http://192.168.103.55:1992/api/chain/${query}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch medical data");
        }
        
        const data = await response.json();
        setMedicalData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medical data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex w-screen">
      <div className="overflow-x-auto" style={{ marginLeft: "280px" }}>
        <div className="rounded-lg shadow-md mt-20">
          <h1 className="text-4xl text-center font-semibold mb-6">
            Medical Data
          </h1>
          <div className="overflow-x-auto" style={{ width: "1000px" }}>
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Index</th>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Timestamp</th>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Patient ID</th>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Doctor</th>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Diagnosis</th>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Treatment</th>
                  <th className="px-4 py-2 border border-gray-300 font-semibold">Image</th>
                </tr>
              </thead>
              <tbody>
                {medicalData.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">{record.index}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(record.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2 border border-gray-300">{record.data && record.data.patient_id}</td>
                    <td className="px-4 py-2 border border-gray-300">{record.data && record.data.doctor}</td>
                    <td className="px-4 py-2 border border-gray-300">{record.data && record.data.diagnosis}</td>
                    <td className="px-4 py-2 border border-gray-300">{record.data && record.data.treatment}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {record.data && (
                        <a target="_blank" href={`http://192.168.103.55:1992/api/image/${record.data.image_cid}`} className="text-blue-500 underline">
                          view
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalFetch;
