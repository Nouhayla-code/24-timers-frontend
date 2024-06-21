import React, { useState, useEffect } from "react";

interface DisciplinType {
  id: string;
  navn: string;
  resultattype: string;
  deltagerIds: string[];
}

interface DeltagerType {
  id: string;
  navn: string;
}

const DisciplinKomponent: React.FC = () => {
  const [data, setData] = useState<DisciplinType[] | null>(null);
  const [deltagere, setDeltagere] = useState<DeltagerType[] | null>(null); // State for existing deltagere
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedDeltagerIds, setSelectedDeltagerIds] = useState<string[]>([]); // State for selected deltagere
  const [currentDisciplinId, setCurrentDisciplinId] = useState<string>(""); // State to track current disciplin id

  useEffect(() => {
    fetchData();
    fetchDeltagere(); // Fetch existing deltagere
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/disciplin");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
      console.error("Fetching discipliner failed:", error);
    }
  };

  const fetchDeltagere = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/deltager");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      setDeltagere(result);
    } catch (error) {
      setError(error.message);
      console.error("Fetching deltagere failed:", error);
    }
  };

  const toggleModal = (disciplinId: string) => {
    setShowModal(!showModal);
    setCurrentDisciplinId(disciplinId);
  };

  const handleDeltagerChange = (deltagerId: string) => {
    const isSelected = selectedDeltagerIds.includes(deltagerId);
    if (isSelected) {
      setSelectedDeltagerIds(
        selectedDeltagerIds.filter((id) => id !== deltagerId)
      );
    } else {
      setSelectedDeltagerIds([...selectedDeltagerIds, deltagerId]);
    }
  };

  const addDeltagerToDisciplin = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/disciplin/${currentDisciplinId}/addDeltager`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedDeltagerIds),
        }
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      await fetchData(); // Refresh data after adding deltagere to disciplin
      setSelectedDeltagerIds([]); // Clear selected deltagere after successful addition
      toggleModal(""); // Close modal after adding deltagere
    } catch (error) {
      console.error("Error adding deltagere to disciplin:", error);
      setError(error.message); // Set state to show error to user
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Discipliner</h1>

      {error && <p className="text-red-500 mb-4">{`Fejl: ${error}`}</p>}
      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((disciplin) => (
            <div
              key={disciplin.id}
              className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-md transition duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {disciplin.navn}
              </h2>
              <p className="text-gray-600">{disciplin.resultattype}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => toggleModal(disciplin.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Tilføj Deltager
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Indlæser...</p>
      )}

      {/* Modal/Dialog for Selecting Deltager */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Tilføj Deltager til Disciplin
                </h2>
                {deltagere ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {deltagere.map((deltager) => (
                      <div key={deltager.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={deltager.id}
                          checked={selectedDeltagerIds.includes(deltager.id)}
                          onChange={() => handleDeltagerChange(deltager.id)}
                          className="mr-2"
                        />
                        <label htmlFor={deltager.id}>{deltager.navn}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Fetching deltagere...</p>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => toggleModal("")}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Annuller
                  </button>
                  <button
                    onClick={addDeltagerToDisciplin}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Gem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal/Dialog */}
    </div>
  );
};

export default DisciplinKomponent;
