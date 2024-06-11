import estilos from '../static/Header.module.css';

export function Header(){
    return(
        <>
            <div className={estilos.header}>
                <h3 className={estilos.titleLogo}>Smart<span className={estilos.spanLogo}>City</span></h3>

                <div className={estilos.linksHeader}>
                    <a href="/informacoes_gerais">Informações</a>
                    <a href="/mapa">Mapa</a>
                    <a href="/">Logout</a>
                </div>
            </div>
        </>
    )
}
