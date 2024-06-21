import React from "react";

interface ModalProps {
  showModal: boolean;
  toggleModal: () => void;
  handleSubmit: () => void;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  formData: {
    id: string;
    navn: string;
    kon: string;
    alder: string;
    klub: string;
  };
}

const Modal: React.FC<ModalProps> = ({
  showModal,
  toggleModal,
  handleSubmit,
  handleInputChange,
  formData,
}) => {
  return (
    <div>
      {/* Modal/Dialog for Adding or Editing Deltager */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-lg mx-auto my-6">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-300">
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {formData.id ? "Rediger Deltager" : "Tilføj Deltager"}
                  </h2>
                  {/* Form Inputs */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="navn"
                    >
                      Navn:
                    </label>
                    <input
                      type="text"
                      id="navn"
                      name="navn"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Indtast navn"
                      value={formData.navn}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="kon"
                    >
                      Køn:
                    </label>
                    <select
                      id="kon"
                      name="kon"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={formData.kon}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Vælg køn</option>
                      <option value="mand">Mand</option>
                      <option value="kvinde">Kvinde</option>
                      <option value="anden">Andet</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="alder"
                    >
                      Alder:
                    </label>
                    <input
                      type="number"
                      id="alder"
                      name="alder"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Indtast alder"
                      value={formData.alder}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="klub"
                    >
                      Klub:
                    </label>
                    <input
                      type="text"
                      id="klub"
                      name="klub"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Indtast klub"
                      value={formData.klub}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Annuller
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Gem
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* End Modal/Dialog */}
    </div>
  );
};

export default Modal;
