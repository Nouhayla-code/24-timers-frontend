import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";

// Definerer en funktionel komponent ved hjælp af React.FC
const ResultatKomponent: React.FC = () => {
  interface ResultatDto {
    id: string;
    resultattype: string;
    dato: string; // Dato håndteres som string i frontend
    resultatvaerdi: string;
    deltagerId: string; // Assuming deltagerId is a string
    disciplinId: string; // Assuming disciplinId is a string
  }

  // der angiver, at state-variablen error kan være af typen string eller null.
  const [data, setData] = useState<ResultatDto[] | null>(null);
  const [filteredData, setFilteredData] = useState<ResultatDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentResultatId, setCurrentResultatId] = useState<string>("");
  const [deltagerliste, setDeltagerliste] = useState<string[]>([]);
  const [disciplinliste, setDisciplinliste] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    const fetchDeltagere = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/deltager");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        setDeltagerliste(result);
      } catch (error) {
        setError(error.message);
        console.error("Fetching deltagere failed:", error);
      }
    };
    fetchDeltagere();

    const fetchDiscipliner = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/disciplin");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        setDisciplinliste(result);
      } catch (error) {
        setError(error.message);
        console.error("Fetching discipliner failed:", error);
      }
    };
    fetchDiscipliner();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/resultater");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      setFilteredData(result); // Initialize filtered data with fetched result
    } catch (error) {
      setError(error.message);
      console.error("Fetching resultater failed:", error);
    }
  };

  // Sorting function to sort by 'resultatvaerdi' (assuming it's a numerical value)
  const sortByResultatvaerdi = (order: "asc" | "desc") => {
    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = parseFloat(a.resultatvaerdi);
      const valueB = parseFloat(b.resultatvaerdi);
      return order === "asc" ? valueA - valueB : valueB - valueA;
    });
    setFilteredData(sortedData);
  };

  // Reset filtered data to original fetched data
  const resetFilters = () => {
    setFilteredData(data || []);
  };

  const findDeltagerNavn = (deltagerId: string) => {
    const deltager = deltagerliste.find(
      (deltager) => deltager.id === deltagerId
    );
    return deltager ? deltager.navn : "Ukendt deltager";
  };

  // Function to find disciplin navn based on disciplinId
  const findDisciplinNavn = (disciplinId: string) => {
    const disciplin = disciplinliste.find(
      (disciplin) => disciplin.id === disciplinId
    );
    return disciplin ? disciplin.navn : "Ukendt disciplin";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resultater</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => sortByResultatvaerdi("desc")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Sorter efter bedste
        </button>
        <button
          onClick={() => sortByResultatvaerdi("asc")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Sorter efter værste
        </button>

        <button
          onClick={resetFilters}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
        >
          Nulstil
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {filteredData && filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((resultat) => (
            <div
              key={resultat.id}
              className="bg-white border border-gray-300 shadow-md rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Resultattype:</span>{" "}
                  {resultat.resultattype}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Dato:</span> {resultat.dato}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Resultatværdi:</span>{" "}
                  {resultat.resultatvaerdi}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Deltager navn: </span>
                  {findDeltagerNavn(resultat.deltagerId)}
                </div>
                <div className="text-gray-800 mb-2">
                  <span className="font-semibold">Disciplin navn: </span>{" "}
                  {findDisciplinNavn(resultat.disciplinId)}
                </div>
              </div>
              <div className="mt-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Ingen resultater fundet</p>
      )}

      {showModal && (
        <Modal
          closeModal={() => setShowModal(false)}
          currentResultatId={currentResultatId}
        />
      )}
    </div>
  );
};

export default ResultatKomponent;
