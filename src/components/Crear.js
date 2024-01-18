import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { FormGroup, ThemeProvider, createTheme, Box, CardContent, Card, TableFooter, TableCell, TableRow } from '@mui/material';
import { Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import { format } from 'date-fns';
import MaterialTable, { MTableBody } from 'material-table';
import Modal from 'react-modal';
import { InputTwoTone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Crear = () => {
    const history = useNavigate();
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [listaSucursales, setListaSucursales] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [encabezado, setEncabezado] = useState('');
    const [detalle, setDetalle] = useState('');
    const [salidaCreada, setSalidaCreada] = useState(null);
    const [detalleCreada, setDetalleCreada] = useState(null);

    const columnas = [
        { title: 'Codigo', field: 'id', editable: 'never' },
        { title: 'Producto', field: 'nombreProducto', editable: 'never' },
        { title: 'Precio', field: 'precioProducto', editable: 'never' },
        { title: 'Cantidad', field: 'cantidad' },
    ]

    const handleSucursal = (event) => {
        setSelectedSucursal(event.target.value);
    }

    const crearSalida = () => {
        if (encabezado === '') {
            alert("Llene todos los campos");
        } else {
            salida(localStorage.getItem("usuario"), selectedSucursal, encabezado, detalle);
        }
    };

    const sucursales = async () => {
        try {
            const response = await axios.get(`https://localhost:7261/api/Salidas/sucursales`);
            setListaSucursales(response.data);
        } catch (error) {
            console.error('Error con sucursales:', error);
        }
    }

    const productos = async () => {
        try {
            const response = await axios.get(`https://localhost:7261/api/Salidas/productos`);
            setListaProductos(response.data);
        } catch (error) {
            console.error('Error con productos:', error);
        }
    }

    const salida = async (usuario, sucursal, encabezado, detalle) => {
        try {
            const response = await axios.get(`https://localhost:7261/api/Salidas/crearSalida?usuario=${usuario}&sucursal=${sucursal}&encabezado=${encabezado}&detalle=${detalle}`);
            setSalidaCreada(response.data[0].id);
        } catch (error) {
            console.error('No se pudo crear salida', error);
        }
    }

    const detalleSalida = async (salida, producto, cantidad) => {
        try {
            const response = await axios.get(`https://localhost:7261/api/Salidas/crearDetalle?salida=${salida}&Producto=${producto}&cantidad=${cantidad}`);
            setDetalleCreada(response.data[0].salidaId);
        } catch (error) {
            console.error('No se pudo crear salida', error);
        }
    }

    const customMaterialTheme = createTheme({
        typography: {
            fontSize: 12,
        }
    });

    useEffect(() => {
        sucursales();
        productos();
    }, []);

    useEffect(() => {
        if (salidaCreada) {
            selectedRow.forEach((row) => {
                detalleSalida(salidaCreada, row.id, row.cantidad);
            });
            alert("Se creó la salida, pendiente de recibir")
            history('/home');
        }
    }, [salidaCreada]);
    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
            <div style={{ marginTop: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Label>Encabezado</Label>
                        <Input
                            type="text"
                            value={encabezado}
                            onChange={(e) => setEncabezado(e.target.value)}
                        />
                        <Label>Detalle</Label>
                        <Input
                            type="text"
                            value={detalle}
                            onChange={(e) => setDetalle(e.target.value)}
                        />
                        <Label>Sucursal</Label>
                        <Input type="select" onChange={handleSucursal}>
                            <option value={0}>Seleccione la sucursal</option>
                            {listaSucursales.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nombreSucursal}
                                </option>
                            ))}
                        </Input>
                    </div>
                    <Button
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',            
                            border: 'none',            
                            padding: '10px 20px',      
                            borderRadius: '5px',       
                            cursor: 'pointer',         
                            transition: 'background-color 0.3s ease',
                        }}
                        onClick={() => crearSalida()}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'} 
                    >
                        Crear Salida
                    </Button>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <ThemeProvider theme={customMaterialTheme}>
                        <MaterialTable
                            columns={columnas}
                            data={listaProductos}
                            title={"Productos"}
                            options={{
                                paging: true,
                                pageSize: 5,
                                emptyRowsWhenPaging: false,
                                pageSizeOptions: [10, 15, 20],
                            }}
                            cellStyle={{ textAlign: 'left' }}
                            onRowClick={(event, rowData) => {
                                if (event.detail === 2) {
                                    const exists = selectedRow.some(selected => selected.id === rowData.id);

                                    if (!exists) {
                                        setSelectedRow(prevSelectedRows => [...prevSelectedRows, rowData]);
                                    }
                                }
                            }}
                            style={{ flex: 1 }}
                        />
                    </ThemeProvider>
                    <ThemeProvider theme={customMaterialTheme}>
                        <MaterialTable
                            columns={columnas}
                            data={selectedRow}
                            title={"Fila Seleccionada"}
                            options={{
                                paging: false,
                            }}
                            cellStyle={{ textAlign: 'left' }}
                            onRowClick={(event, rowData) => {
                                if (event.detail === 2) {
                                    const updatedRows = selectedRow.filter(row => row.id !== rowData.id);
                                    setSelectedRow(updatedRows);
                                }
                            }}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            const dataUpdate = [...selectedRow];
                                            const index = oldData.tableData.id;
                                            dataUpdate[index] = newData;
                                            setSelectedRow([...dataUpdate]);

                                            resolve();
                                        }, 1000)
                                    }),
                            }}
                            style={{ flex: 1 }}
                        />
                    </ThemeProvider>
                </div>
            </div>
        </>
    );
};

export default Crear;