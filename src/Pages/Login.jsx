import estilos from '../static/Login.module.css';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schemaLogin = z.object({
    usuario: z.string().min(5, 'Mínimo de 5 caracteres').max(20, 'Máximo de 10 caracteres'),
    senha: z.string().min(6, 'Informe 6 caracteres').max(20, 'Máximo de 20 caracteres'),
});

export function Login() {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schemaLogin)
    });

    async function obterDadosFormulario(data) {
        try {
            const response = await axios.post('https://gabrielfaiska.pythonanywhere.com/api/token/', {
                username: data.usuario,
                password: data.senha
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            console.log('Login bem-sucedido!');
            navigate('/informacoes_gerais'); 
        } catch (error) {
            console.error('Erro de autenticação', error);
        }
    }
    
    return(
        <>
            <div className={estilos.formDiv}>
                
                <form action="#" className={estilos.form} onSubmit={handleSubmit(obterDadosFormulario)}>
                    <h1 className={estilos.loginTitle}>Login</h1>

                    <div className={estilos.divInputs}>
                        <label htmlFor="usuario" className={estilos.textForm}>Email</label>
                        <input  {...register('usuario')} placeholder='Insira o seu email' className={estilos.inputForm} required/>
                    </div>
                    {errors.usuario && (
                    <p className={estilos.mensagem}>{errors.usuario.message}</p>
                )}
                    
                    <div className={estilos.divInputs}>
                        <label htmlFor="senha" className={estilos.textForm}>Senha</label>
                        <input type="password" {...register('senha')} placeholder='Insira a sua senha' className={estilos.inputForm} required/>
                    </div>

                    {errors.senha && (
                    <p className={estilos.mensagem}>{errors.senha.message}</p>
                    )}

        
                    <div className={estilos.links}>
                        <button className={estilos.buttonForm}>Entrar</button>
                        <a href="/cadastro" className={estilos.linkCadastro}>Cadastre-se</a>
                    </div>

                </form>
            </div>
        </>
    )
}