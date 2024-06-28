import React from "react";
import Deltager from "./pages/Deltager";
import Discipliner from "./pages/Discipliner";
import Resultater from "./pages/Resultater";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Atletikstævne
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Hjem
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Log ind
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Log ud
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Deltager />
        <Discipliner />
        <Resultater />
      </main>
      <Footer />
    </div>
  );
}

export default App;
