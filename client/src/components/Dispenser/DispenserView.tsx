import React from "react";

const DispenserView = ({ DispenserRec }) => {
  // Extracting field names and values
  const fieldNames = Object.keys(DispenserRec[0]);
  const fieldValues = Object.values(DispenserRec[0]);

  return (
    <div className="flex w-screen">
      <div className="overflow-x-auto" style={{ marginLeft: "280px" }}>
        <div className="rounded-lg shadow-md mt-20">
          <h1 className="text-4xl text-center font-semibold mb-6">Dispenser Details View</h1>

          <div className="overflow-x-auto" style={{ width: "1000px" }}>
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <tbody>       
                {/* First row for field names */}
                <tr>
                  <td className="px-4 py-2 border border-gray-300 font-semibold">SN</td>
                  
                  {/* Mapping over field names */}
                  {fieldNames.map((fieldName, index) => (
                    <td key={fieldName} className="px-4 py-2 border border-gray-300 font-semibold"><p className="flex flex-col">{fieldName}</p></td>
                  ))}
                </tr>
                {/* Second row for field values */}
                {DispenserRec.map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                    {/* Mapping over field values */}
                    {fieldValues.map((fieldValue, index) => (
                      <td key={index} className="px-4 py-2 border border-gray-300">
                        {fieldNames[index] === "sensitive" ? (
                          fieldValue ? "true" : "false"
                        ) : Array.isArray(fieldValue) ? (
                          <ul>
                            {fieldValue.map((value, idx) => (
                              <li key={idx}>{value}</li>
                            ))}
                          </ul>
                        ) : (
                          fieldValue
                        )}
                      </td>
                    ))}
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

export default DispenserView;
