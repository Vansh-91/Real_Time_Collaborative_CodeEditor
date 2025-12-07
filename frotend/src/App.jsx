import './App.css'
import EditorPage from './pages/EditorPage';
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position='top-center'/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/editor/:roomId' element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
