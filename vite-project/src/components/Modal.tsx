import React from "react";

interface ModalProps {
  showModal: boolean;
  toggleModal: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
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
  // Close modal on outside click (backdrop click)
  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return (
    <div>
      {/* Modal/Dialog for Adding or Editing Deltager */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
          <div
            className="relative w-auto max-w-lg mx-auto my-6"
            onClick={handleBackdropClick}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-300">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {formData.id ? "Rediger Deltager" : "Tilføj Deltager"}
                </h2>
                {/* Form Inputs */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="navn"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Navn:
                    </label>
                    <input
                      type="text"
                      id="navn"
                      name="navn"
                      value={formData.navn}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Indtast navn"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="kon"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Køn:
                    </label>
                    <select
                      id="kon"
                      name="kon"
                      value={formData.kon}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                      htmlFor="alder"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Alder:
                    </label>
                    <input
                      type="number"
                      id="alder"
                      name="alder"
                      value={formData.alder}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Indtast alder"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="klub"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Klub:
                    </label>
                    <input
                      type="text"
                      id="klub"
                      name="klub"
                      value={formData.klub}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Indtast klub"
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
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal/Dialog */}
    </div>
  );
};

export default Modal;
