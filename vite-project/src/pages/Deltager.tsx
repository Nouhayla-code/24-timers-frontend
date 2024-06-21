import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";

interface Deltager {
  id: string;
  navn: string;
  kon: string;
  alder: number;
  klub: string;
}

const DeltagerKomponent: React.FC = () => {
  const [data, setData] = useState<Deltager[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    navn: "",
    kon: "",
    alder: "",
    klub: "",
  });

  // Hent alle deltagerne fra backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/deltager");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
        console.error("Fetching data failed:", error);
      }
    };
    fetchData();
  }, []);

  // Funktion til at oprette en ny deltager
  const createDeltager = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/deltager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const newDeltager: Deltager = await response.json();
      setData([...data, newDeltager]);
      setShowModal(false); // Luk modal efter oprettelse
      resetFormData(); // Nulstil form data efter oprettelse
    } catch (error) {
      console.error("Error creating deltager:", error);
    }
  };

  // Funktion til at opdatere en deltager
  const updateDeltager = async (id: string) => {
    try {
      const updatedData = {
        navn: formData.navn,
        kon: formData.kon,
        alder: parseInt(formData.alder),
        klub: formData.klub,
      };

      const response = await fetch(`http://localhost:8080/api/deltager/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const updatedDeltager: Deltager = await response.json();

      // Update local state data array with updatedDeltager
      const updatedDataArray = data.map((deltager) =>
        deltager.id === id ? updatedDeltager : deltager
      );

      setData(updatedDataArray); // Update state with updated data
      setShowModal(false); // Close modal after successful update
      resetFormData(); // Nulstil form data efter opdatering
    } catch (error) {
      console.error("Error updating deltager:", error);
    }
  };

  // Funktion til at slette en deltager
  const deleteDeltager = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/deltager/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      setData(data.filter((deltager) => deltager.id !== id));
    } catch (error) {
      console.error("Error deleting deltager:", error);
    }
  };

  // Skift modalens synlighed
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Håndter ændringer i inputfelter
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Nulstil form data
  const resetFormData = () => {
    setFormData({
      id: "",
      navn: "",
      kon: "",
      alder: "",
      klub: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Deltagere</h1>

      {/* Tilføj deltager knap */}
      <div className="flex justify-end mt-4">
        <button
          onClick={toggleModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Tilføj Deltager
        </button>
      </div>

      {/* Vis fejlbesked hvis der er fejl */}
      {error && <p className="text-red-500 mb-4">{`Fejl: ${error}`}</p>}

      {/* Vis data hvis det er blevet hentet */}
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((deltager) => (
            <div
              key={deltager.id}
              className="bg-white border border-gray-300 shadow-md rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Navn:</span> {deltager.navn}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Køn:</span> {deltager.kon}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Alder:</span> {deltager.alder}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Klub:</span> {deltager.klub}
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                  onClick={() => updateDeltager(deltager.id)}
                >
                  REDIGER
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => deleteDeltager(deltager.id)}
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

      {/* Modal komponent for at tilføje eller redigere en deltager */}
      <Modal
        showModal={showModal}
        toggleModal={toggleModal}
        handleSubmit={
          formData.id ? () => updateDeltager(formData.id) : createDeltager
        }
        handleInputChange={handleInputChange}
        formData={formData}
      />
    </div>
  );
};

export default DeltagerKomponent;
