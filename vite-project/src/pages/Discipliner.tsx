import React, { useState, useEffect } from "react";

interface DisciplinType {
  id: string;
  navn: string;
  resultattype: string;
}

const DisciplinKomponent: React.FC = () => {
  const [data, setData] = useState<DisciplinType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newDisciplin, setNewDisciplin] = useState({
    navn: "",
    resultattype: "",
  });

  useEffect(() => {
    fetchData();
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
      console.error("Fetching data failed:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setNewDisciplin({
      ...newDisciplin,
      [name]: value,
    });
  };

  const createDisciplin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/disciplin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDisciplin),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      await fetchData(); // Refresh data after creation
      toggleModal(); // Close modal after creation
      setNewDisciplin({
        navn: "",
        resultattype: "",
      }); // Reset form
    } catch (error) {
      console.error("Error creating disciplin:", error);
    }
  };

  const deleteDisciplin = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/disciplin/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      await fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting disciplin:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Discipliner</h1>

      {/* Add Disciplin Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Tilføj Disciplin
        </button>
      </div>

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
                  onClick={() => deleteDisciplin(disciplin.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  SLET
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Indlæser...</p>
      )}

      {/* Modal/Dialog for Adding Discipline */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            {/* Modal content */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Tilføj Disciplin
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Navn:
                  </label>
                  <input
                    type="text"
                    name="navn"
                    value={newDisciplin.navn}
                    onChange={handleInputChange}
                    className="px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50 w-full"
                    placeholder="Indtast navn"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Resultattype:
                  </label>
                  <input
                    type="text"
                    name="resultattype"
                    value={newDisciplin.resultattype}
                    onChange={handleInputChange}
                    className="px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50 w-full"
                    placeholder="Indtast resultattype"
                    required
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={toggleModal}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Annuller
                  </button>
                  <button
                    onClick={createDisciplin}
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
