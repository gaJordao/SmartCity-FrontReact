import React from "react";
import estilos from "../static/Informacoes.module.css";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/Card";
import { Link } from 'react-router-dom';

export function Informacoes() {
  const [sensores, setSensores] = useState([]);
  const [error, setError] = useState(null);
  const [temperaturas, setTemperaturas] = useState([]);
  const idSalas = [11, 15, 17, 32]
  const [filters, setFilters] = useState({
    responsavel: "",
    status_operacional: false,
    tipo: "",
    localizacao: "",
  });


  useEffect(() => {
    async function fetchSensores() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "https://gabrielfaiska.pythonanywhere.com/api/sensores/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSensores(response.data);
      } catch (err) {
        setError(err);
      }
    }

    fetchSensores();
  }, []);

  useEffect(() => {
    idSalas.forEach(async (id) => {
      try {
        const response = await axios.post(
          `https://gabrielfaiska.pythonanywhere.com/api/temperatura_filter/`,
          {
            "sensor_id": id,
            "valor_gte": 10,
            "valor_lt": 80,
            "timestamp_gte": "2024-04-01T03:00:00Z",
            "timestamp_lt": "2024-04-01T03:01:00"
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setTemperaturas((prevTemperaturas) => [...prevTemperaturas, ...response.data]);
      } catch (err) {
        setError(err);
      }
    });
  }, []);


  if (error) {
    return <div>Erro ao carregar os dados: {error.message}</div>;
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "https://gabrielfaiska.pythonanywhere.com/api/sensor_filter/",
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSensores(response.data);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      setError(error);
    }
  };

  return (
    <>
      <Header />
      <div className={estilos.InformacoesDiv}>
        <div className={estilos.Informacoes}>
          <h1 className={estilos.tituloInformacoes}>Informações gerais</h1>

          <div className={estilos.allComponents}>
            <div className={estilos.divInformacoes}>
              <h3 className={estilos.tituloListas}>Temperatura das salas</h3>
              <div className={estilos.listas}>
                <ul>
                  {temperaturas.reduce((uniqueTemperaturas, temperatura) => {
                    if (!uniqueTemperaturas.some(temp => temp.sensor === temperatura.sensor)) {
                      uniqueTemperaturas.push(temperatura);
                    }
                    return uniqueTemperaturas;
                  }, []).map((temperatura) => (
                    <li key={temperatura.sensor} className={estilos.itensUl}>
                      {`Sensor ID ${temperatura.sensor}: ${temperatura.valor}°`}
                    </li>
                  ))}
                </ul>
              </div>

            </div>


            <div className={estilos.divInformacoes}>
              <h3 className={estilos.tituloListas}>Localização atual</h3>
              <ul>
                <li className={estilos.itensUl}>
                  Latitude: <span>-845656564115</span>
                </li>
                <li className={estilos.itensUl}>
                  Longitude: <span>-158456565641</span>
                </li>
              </ul>
              <a href="/mapa" className={estilos.linkMapa}>
                Veja o mapa!
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={estilos.allInformacoes}>
        <h1 className={estilos.tituloInformacoes}>Sensores Cadastrados</h1>
        <Link className={estilos.botaoCadastrar} to={`cadastrar_sensor`}>Cadastrar Novo Sensor</Link>
        <form onSubmit={handleSubmit} className={estilos.formulario}>
          <div className={estilos.filtros}>
            <label>Responsável</label>
            <input
              type="text"
              name="responsavel"
              value={filters.responsavel}
              onChange={handleChange}
            />
          </div>

          <div className={estilos.filtroCheck}>
            <label>Está em funcionamento</label>
            <input
              type="checkbox"
              name="status_operacional"
              checked={filters.status_operacional}
              onChange={handleChange}
            />
          </div>

          <div className={estilos.filtros}>
            <label>Tipo</label>
            <input
              type="text"
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
            />
          </div>

          <div className={estilos.filtros}>
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              value={filters.localizacao}
              onChange={handleChange}
            />
          </div>

          <button className={estilos.botaoFiltrar} type="submit">
            Filtrar
          </button>

        </form>

        <div className={estilos.Informacoes2}>
          {sensores.map((sensor) => (
            <Card
              id={sensor.id}
              tipo={sensor.tipo}
              localizacao={sensor.localizacao}
              latitude={sensor.latitude}
              longitude={sensor.longitude}
              responsavel={sensor.responsavel}
            />
          ))}
        </div>
      </div>
    </>
  );
}
