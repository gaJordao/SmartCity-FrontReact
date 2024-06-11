import { Header } from '../components/Header';
import estilo from '../static/Mapa.module.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapaLocation from '../components/MapaLocation';

export function Mapa(){
    const [pontos, setPontos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSensores() {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('https://gabrielfaiska.pythonanywhere.com/api/sensores/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const sensores = response.data;
                const pontos = sensores.map(sensor => ({
                    latitude: sensor.latitude,
                    longitude: sensor.longitude,
                    tipo: sensor.tipo,
                    localizacao: sensor.localizacao,
                }));
                setPontos(pontos);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }

        fetchSensores();
    }, []);

    return(
        <>
            <Header />
            <div className={estilo.divAll}>
                <h1 className={estilo.titleMap}>Mapa</h1>
                    <MapaLocation pontos={pontos} />
            </div>
        </>
    )
}