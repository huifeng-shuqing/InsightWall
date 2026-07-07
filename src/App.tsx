import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import MainLayout from './pages/MainLayout';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;