import estilos from '../static/Cadastro.module.css';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schemaCadastro = z.object({
    usuario: z.string().min(5, 'Mínimo de 5 caracteres').max(20, 'Máximo de 10 caracteres'),
    senha: z.string().min(6, 'Informe 6 caracteres').max(20, 'Máximo de 20 caracteres'),
});

export function Cadastro() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schemaCadastro)
    });

    async function cadastrarUsuario(data) {
        try {
            const response = await axios.post('https://gabrielfaiska.pythonanywhere.com/api/token/', {
                username: "smart_user",
                password: "123456"
            });
    
            const { access, refresh } = response.data; 
    
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
    
            const responseCadastro = await axios.post(`https://gabrielfaiska.pythonanywhere.com/api/create_user`, 
            {
                username: data.usuario,
                email: data.email,
                password: data.senha
            }, {
                headers: {
                    Authorization: `Bearer ${access}` 
                }
            });
    
            navigate('/informacoes_gerais');
        } catch (err) {
            console.error('Erro ao cadastrar usuário', err);
        }
    };
    

    return(
        <>
             <div className={estilos.formDiv}>
                
                <form action="#" className={estilos.form} onSubmit={handleSubmit(cadastrarUsuario)}>
                    <h1 className={estilos.loginTitle}>Cadastro</h1>

                    <div className={estilos.divInputs}>
                        <label htmlFor="usuario" className={estilos.textForm}>Usuário</label>
                        <input {...register('usuario')} name="usuario" placeholder='Insira o seu usuario' className={estilos.inputForm} required/>
                    </div>
                    {errors.usuario && (
                        <p className={estilos.mensagem}>{errors.usuario.message}</p>
                    )}

                    <div className={estilos.divInputs}>
                        <label htmlFor="email" className={estilos.textForm}>Email</label>
                        <input {...register('email')} type="email" name="email" placeholder='Insira o seu email' className={estilos.inputForm} required/>
                    </div>
                    
                    <div className={estilos.divInputs}>
                        <label htmlFor="senha" className={estilos.textForm}>Senha</label>
                        <input {...register('senha')} type="password" name="senha" placeholder='Insira a sua senha' className={estilos.inputForm} required/>
                    </div>

                    {errors.senha && (
                        <p className={estilos.mensagem}>{errors.senha.message}</p>
                    )}

                    <button className={estilos.buttonForm}>Cadastrar</button>
    
                </form>
            </div>
        </>
    )
}
