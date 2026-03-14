import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/footer'; // Importamos el componente de Copyright

function App() {
  return (
    /* Usamos flex-col y min-h-screen para que el Footer siempre esté al fondo */
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Encabezado de la aplicación */}
      <Header />

      {/* Contenido principal que crece para empujar al footer */}
      <main className="flex-grow">
        <Home />
      </main>

      {/* Tu firma y Copyright */}
      <Footer />
      
    </div>
  );
}

export default App;