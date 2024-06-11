import estilos from '../static/Card.module.css';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

export function Card({id, tipo, localizacao, latitude, longitude, responsavel}) {

    async function deletarSensor(id) {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/sensores/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            alert('Sensor deletado com sucesso!');
            window.location.href = '/informacoes_gerais';
        } catch (error) {
            console.error('Erro ao deletar sensor:', error);
        }
    }

    return(
        <div className={estilos.cardSensor} id={id}>
            <h1>Tipo: {tipo}</h1>
            <h1>Local: {localizacao}</h1>
            <h1>Latitude: {latitude}</h1>
            <h1>Longitude: {longitude}</h1>
            <h1>Responsaveis: <br />{responsavel}</h1>
            <div className={estilos.botaoDiv}>
                <Link className={estilos.button} to={`alterar_sensor/${id}`}>Editar</Link>
                <button className={estilos.button} onClick={() => deletarSensor(id)}>Deletar</button>
            </div>
        </div>
    );
}
