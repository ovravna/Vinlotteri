import React, {Component, useEffect, useState} from 'react';

export const TicketTable = (props) => {

    const [errorMessages, setErrorMessages] = useState("")

    const [content, setContent] = useState(<p><em>Loading...</em></p>)
    
    const loadDataAsync = async () => {
            setErrorMessages("")
            const response = await fetch('ticket/users');
            const data = await response.json();
            setContent(renderTicketTable(data))
        }

    useEffect(loadDataAsync, [])

    const ComponentInput = (props) => {
        const [value, setValue] =  useState("")
        const onKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                summit(value)
            }
        }
        const summit = (value) => {
            props.onClick(value)
            setValue("")
        }
        return (
            <div style={{flexDirection:"row"}}>
                <input 
                    onKeyDown={onKeyDown}
                    placeholder={props.placeholder ||''} 
                    value={value} 
                    onChange={e => setValue(e.target.value)} 
                    type="text"/>
                
                <button onClick={summit}>+</button>
            </div>
            )
    }
    
    const addTicketAsync = async (username, number) => {
        const response = await fetch(`ticket?name=${username}&number=${number}`, {
            method : 'POST'
        });
        if (response.ok)
            await loadDataAsync(); 
        else {
            const text = await response.text(); 
            setErrorMessages(text)
        }
        
    }

    const addUserAsync = async (username) => {

        const response = await fetch(`ticket/user?name=${username}`, {
            method : 'POST'
        });
        if (response.ok) 
            await loadDataAsync();
        else {
            const text = await response.text();
            setErrorMessages(text)
        }
    };
    
    const renderTicketTable = (data) => {
        return (
            <div>

                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tickets</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(t =>
                        <tr key={t.id}>
                            <td>{t.name}</td>
                            <td>{t.tickets.map(t => t.number).join(" ")}</td>
                            <td>
                                <ComponentInput placeholder="Ticket Number" onClick={(value) => addTicketAsync(t.name, value)}></ComponentInput>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <ComponentInput placeholder="Name" onClick={(value) => addUserAsync(value)}></ComponentInput>
         
            </div>

        );
    }

    

    return (
        <div>
            <h1 id="tabelLabel">Tickets</h1>
            {content}
            {errorMessages}
        </div>
    );
}
