import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from 'react'
import { Login } from './Pages/Login.jsx'
import { Cadastro } from './Pages/Cadastro.jsx'
import { Informacoes } from './Pages/Informacoes.jsx'
import { Mapa } from './Pages/Mapa.jsx'
import { AlterarSensor } from './Pages/AlterarSensor.jsx'
import { CadastrarSensor } from './Pages/CadastrarSensor.jsx'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}> </Route>
          <Route path='/cadastro' element={<Cadastro />}> </Route>
          <Route path='/informacoes_gerais' element={<Informacoes />}> </Route>
          <Route path='/mapa' element={<Mapa />}> </Route>
          <Route path="informacoes_gerais/alterar_sensor/:id" element={<AlterarSensor />} />
          <Route path="informacoes_gerais/cadastrar_sensor" element={<CadastrarSensor />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
