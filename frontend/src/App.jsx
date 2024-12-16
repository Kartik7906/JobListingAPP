import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from './pages/Home';
import Newjob from './pages/Newjob';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/newjob' element={<Newjob/>}/>
          <Route path='/editjob/:id' element={<Newjob/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
