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
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [filteredDeltagere, setFilteredDeltagere] = useState<Deltager[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Deltager>({
    id: "",
    navn: "",
    kon: "",
    alder: 0,
    klub: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterGender, setFilterGender] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        setDeltagere(result);
        setFilteredDeltagere(result);
      } catch (error) {
        setError(error.message);
        console.error("Fetching data failed:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortDeltagere();
  }, [deltagere, sortOrder, filterGender, searchTerm]);

  const filterAndSortDeltagere = () => {
    let updatedDeltagere = [...deltagere];

    if (filterGender) {
      updatedDeltagere = updatedDeltagere.filter(
        (deltager) => deltager.kon === filterGender
      );
    }

    if (searchTerm) {
      updatedDeltagere = updatedDeltagere.filter((deltager) =>
        deltager.navn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      updatedDeltagere.sort((a, b) => a.alder - b.alder);
    } else {
      updatedDeltagere.sort((a, b) => b.alder - a.alder);
    }

    setFilteredDeltagere(updatedDeltagere);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.id) {
      await updateDeltager();
    } else {
      await createDeltager();
    }
  };

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
      setDeltagere([...deltagere, newDeltager]);
      setShowModal(false);
      resetFormData();
    } catch (error) {
      console.error("Error creating deltager:", error);
    }
  };

  const updateDeltager = async () => {
    try {
      const { id, ...updatedData } = formData;
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
      const updatedDataArray = deltagere.map((deltager) =>
        deltager.id === id ? updatedDeltager : deltager
      );
      setDeltagere(updatedDataArray);
      setShowModal(false);
      resetFormData();
    } catch (error) {
      console.error("Error updating deltager:", error);
    }
  };

  const deleteDeltager = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/deltager/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      setDeltagere(deltagere.filter((deltager) => deltager.id !== id));
    } catch (error) {
      console.error("Error deleting deltager:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetFormData = () => {
    setFormData({
      id: "",
      navn: "",
      kon: "",
      alder: 0,
      klub: "",
    });
  };

  const editDeltager = (deltager: Deltager) => {
    setFormData({ ...deltager });
    setShowModal(true);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterGender(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Deltagere</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Tilføj Deltager
        </button>

        <div className="flex items-center">
          <label htmlFor="sortOrder" className="mr-2 font-semibold">
            Sorter efter alder:
          </label>
          <button
            id="sortOrder"
            onClick={handleSortOrderChange}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            {sortOrder === "asc" ? "Stigende" : "Faldende"}
          </button>

          <label htmlFor="filterGender" className="ml-4 mr-2 font-semibold">
            Filtrer efter køn:
          </label>
          <select
            id="filterGender"
            value={filterGender}
            onChange={handleFilterChange}
            className="bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 rounded"
          >
            <option value="">Alle</option>
            <option value="Mand">Mand</option>
            <option value="Kvinde">Kvinde</option>
          </select>

          <label htmlFor="search" className="ml-4 mr-2 font-semibold">
            Søg på navn:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 rounded"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{`Fejl: ${error}`}</p>}

      {filteredDeltagere.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeltagere.map((deltager) => (
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
                  onClick={() => editDeltager(deltager)}
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
        <p className="text-gray-600 text-center">Ingen deltagere fundet</p>
      )}

      <Modal
        showModal={showModal}
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        formData={formData}
      />
    </div>
  );
};

export default DeltagerKomponent;
