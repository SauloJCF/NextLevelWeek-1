import React from  'react';

interface HeaderProps{
    title: string;//obrigatória
}

const Header: React.FC<HeaderProps> = (props) => {//funcion component, generic
    return (
        <header>
            <h1>{ props.title }</h1>
        </header>
    )
}

export default Header;