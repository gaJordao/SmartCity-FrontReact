import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import estilos from "../static/AlterarSensor.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//Schema de validação do formulário para checagem dos valores que foram colocados no form
const schemaAlterarSensor = z.object({
  mac_address: z.string().max(20, 'Máximo de 20 caracteres').nullable(),
  latitude: z.number().refine(val => !isNaN(parseFloat(val)), 'Latitude inválida'),
  longitude: z.number().refine(val => !isNaN(parseFloat(val)), 'Longitude inválida'),
  localizacao: z.string().max(100, 'Máximo de 100 caracteres'),
  responsavel: z.string().max(100, 'Máximo de 100 caracteres'),
  unidade_medida: z.string().max(20, 'Máximo de 20 caracteres').nullable(),
  status_operacional: z.boolean(),
  observacao: z.string().nullable(),
  tipo: z.string().optional() 
});

export function AlterarSensor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
      resolver: zodResolver(schemaAlterarSensor)//chamar o schema e ver os erros possoveis
  });
    
  const obterDadosSensor = async () => {
      try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get(`http://127.0.0.1:8000/api/sensores/${id}/`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          const sensorData = response.data;
          Object.keys(sensorData).forEach(key => {
              setValue(key, sensorData[key]);
          });
      } catch (err) {
          console.error('Erro ao obter o sensor', err);
      }
  };
   //exibo em tela os dados do id passado  
  useEffect(() => {
      obterDadosSensor();
  }, [id]);

  //pego os dados colocados no formulário e passo para o PUT!!o data aqui é o conj de info do form
  const onSubmit = async (data) => {

      console.log("Dados enviados para o PUT:", data);
      try {
          const token = localStorage.getItem('access_token');
          //chamo a api passando "data"
          await axios.put(`http://127.0.0.1:8000/api/sensores/${id}/`, data, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          alert('Sensor alterado com sucesso!');
          navigate('/informacoes_gerais');
      } catch (error) {
          console.error('Erro ao alterar o sensor', error);
      }
  };

  return (
    <>
      <Header />
      <form className={estilos.formulario} onSubmit={handleSubmit(onSubmit)}>
        <h1>Editar</h1>
        <div className={estilos.containerEditar}>

          <div className={estilos.opcoesEditar}>
            <label>Tipo</label>
            <select {...register("tipo")} className={estilos.campo}>
              <option value="">Selecione o tipo de sensor</option>
              <option value="Temperatura">Temperatura</option>
              <option value="Contador">Contador</option>
              <option value="Luminosidade">Luminosidade</option>
              <option value="Umidade">Umidade</option>
            </select>
            {errors.tipo && (
              <p className={estilos.mensagem}>{errors.tipo.message}</p>
            )}
          </div>

          <div className={estilos.opcoesEditar}>
            <label>Mac Address</label>
            <input {...register("mac_address")} className={estilos.campo} />
            {errors.mac_address && (
              <p className={estilos.mensagem}>{errors.mac_address.message}</p>
            )}
          </div>

          <div className={estilos.opcoesEditar}>
            <label>Latitude</label>
            <input {...register("latitude")} className={estilos.campo} />
            {errors.latitude && (
              <p className={estilos.mensagem}>{errors.latitude.message}</p>
            )}
          </div>

          <div className={estilos.opcoesEditar}>
            <label>Longitude</label>
            <input {...register("longitude")} className={estilos.campo} />
            {errors.longitude && (
              <p className={estilos.mensagem}>{errors.longitude.message}</p>
            )}
          </div>

        </div>

        <div className={estilos.containerEditar}>

          <div className={estilos.opcoesEditar}>
            <label>Localização</label>
            <input {...register("localizacao")} className={estilos.campo} />
            {errors.localizacao && (
              <p className={estilos.mensagem}>{errors.localizacao.message}</p>
            )}
          </div>

          <div className={estilos.opcoesEditar}>
            <label>Responsável</label>
            <input {...register("responsavel")} className={estilos.campo} />
            {errors.responsavel && (
              <p className={estilos.mensagem}>{errors.responsavel.message}</p>
            )}
          </div>

          <div className={estilos.opcoesEditar}>
            <label>Unidade Medida</label>
            <input {...register("unidade_medida")} className={estilos.campo} />
            {errors.unidade_medida && (
              <p className={estilos.mensagem}>
                {errors.unidade_medida.message}
              </p>
            )}
          </div>

          <div className={estilos.opcoesEditar}>
            <label>Está em funcionamento</label>
            <input {...register("status_operacional")} type="checkbox"/>
          </div>

        </div>

        <div className={estilos.opcoesEditar}>
          <label>Observação</label>
          <textarea
            {...register("observacao")}
            className={estilos.campo}
          ></textarea>
          {errors.observacao && (
            <p className={estilos.mensagem}>{errors.observacao.message}</p>
          )}
        </div>

        <button type="submit" className={estilos.botao}>
          Salvar Alterações
        </button>
      </form>
    </>
  );
}
