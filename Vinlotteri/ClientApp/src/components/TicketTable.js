import React, {Component, useEffect, useState} from 'react';

export const TicketTable = (props) => {

    const [errorMessages, setErrorMessages] = useState("")
    const [drawnTicket, setDrawnTicket] = useState(null);

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

    const drawAsync = async () => {

        const response = await fetch(`ticket/draw`, {
            method : 'POST'
        });
        if (response.ok){
            var data = await response.json();
            setDrawnTicket(data);
            await loadDataAsync();
        }
        else {
            const text = await response.text();
            setErrorMessages(text)
        }
    };
    
    const resetDrawAsync = async () => {

        const response = await fetch(`ticket/resetdraw`, {
            method : 'POST'
        });
        if (response.ok){
            setDrawnTicket(null)
            await loadDataAsync();
        }
        else {
            const text = await response.text();
            setErrorMessages(text)
        }
    }
    
    const resetTicketsAsync = async () => {

        const response = await fetch(`ticket/resettickets`, {
            method : 'POST'
        });
        if (response.ok){
            await loadDataAsync();
        }
        else {
            const text = await response.text();
            setErrorMessages(text)
        }
    }
    
    const resetUsersAsync = async () => {

        const response = await fetch(`ticket/resetusers`, {
            method : 'POST'
        });
        if (response.ok){
            await loadDataAsync();
        }
        else {
            const text = await response.text();
            setErrorMessages(text)
        }
    }
    const renderTicketTable = (data) => {
        return (
            <div>

                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tickets</th>
                        <th>Drawn Tickets</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(t =>
                        <tr key={t.id}>
                            <td>{t.name}</td>
                            <td>{t.tickets.filter(t => !t.hasBeenDrawn).map(t => t.number).sort().join(" ")}</td>
                            <td>{t.tickets.filter(t => t.hasBeenDrawn).map(t => t.number).sort().join(" ")}</td>
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
            <div style={{display: "flex" , flexDirection: "row", padding: "10px"}}>
                <h1 id="tabelLabel">Tickets</h1>
                <div style={{width: "70%"}}></div>
                <button style={{margin: "10px"}} onClick={resetTicketsAsync}>Reset Tickets</button>
                <button style={{margin: "10px"}} onClick={resetUsersAsync}>Reset Users</button>
            </div>
            {content}
            <button style={{margin: "10px"}} onClick={drawAsync}>Draw</button>
            <button style={{margin: "10px"}} onClick={resetDrawAsync}>Reset draw</button>
            {drawnTicket == null ? "" : `${drawnTicket.user.name} has won with the ticket ${drawnTicket.number}!!!` }
            <br/>
            {errorMessages}
        </div>
    );
}
