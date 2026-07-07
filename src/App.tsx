import ErrorBoundary from './components/ui/ErrorBoundary';
import MainLayout from './pages/MainLayout';

function App() {
  return (
    <ErrorBoundary>
      <MainLayout />
    </ErrorBoundary>
  );
}

export default App;