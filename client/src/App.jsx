import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Add from "./pages/Add"
import Books from "./pages/Books"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Update from "./pages/Update"


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books/>}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/update/:id" element={<Update/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
