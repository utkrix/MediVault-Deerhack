import React from "react";

const MedicalView = ({ medicalReport }) => {
  // Extracting field names and values
  const fieldNames = Object.keys(medicalReport);
  const fieldValues = Object.values(medicalReport);

  return (
    <div className="flex w-screen">
      <div className="overflow-x-auto" style={{ marginLeft: "280px" }}>
        <div className="rounded-lg shadow-md mt-20">
          <h1 className="text-4xl text-center font-semibold mb-6">Medical Report View</h1>

          <div className="overflow-x-auto" style={{ width: "1000px" }}>
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <tbody>
                {/* First row for field names */}
                <tr>
                  <td className="px-4 py-2 border border-gray-300 font-semibold">SN</td>
                  {/* Mapping over field names */}
                  {fieldNames.map((fieldName, index) => (
                    <td key={fieldName} className="px-4 py-2 border border-gray-300 font-semibold">{fieldName}</td>
                  ))}
                </tr>
                {/* Second row for field values */}
                <tr>
                  <td className="px-4 py-2 border border-gray-300">1</td>
                  {/* Render Patient ID */}
                  <td className="px-4 py-2 border border-gray-300">{medicalReport.patient_id}</td>
                  {/* Mapping over field values, skipping SN */}
                  {fieldValues.map((fieldValue, index) => (
                    // Skip rendering SN
                    index !== 0 && (
                      <td key={index} className="px-4 py-2 border border-gray-300">
                        {/* Render image_cid as a link */}
                        {fieldNames[index] === "image_cid" ? (
                          <a href={fieldValue} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">view</a>
                        ) : (
                          fieldValue
                        )}
                      </td>
                    )
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalView;
