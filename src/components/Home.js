import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { FormGroup, ThemeProvider, createTheme, Box, CardContent, Card, TableFooter, TableCell, TableRow } from '@mui/material';
import { Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import { format } from 'date-fns';
import MaterialTable, { MTableBody } from 'material-table';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const history = useNavigate();
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [selectedSalida, setSelectedSalida] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaSucursales, setListaSucursales] = useState([]);
  const [listaSalidas, setListaSalidas] = useState([]);
  const [detalleSalida, setDetalleSalida] = useState([]);
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [salidaRecibida, setSalidaRecibida] = useState(null);
  const [salidaARecibir, setSalidaARecibir] = useState(null);

  const columnas = [
    { title: 'Numero Salida', field: 'id' },
    { title: 'Fecha Salida', field: 'fechaCreado', render: rowData => new Date(rowData.fechaCreado).toLocaleDateString() },
    { title: 'Usuario', field: 'usuarioCrea' },
    { title: 'Sucursal', field: 'sucursalId' },
    { title: 'Encabezado', field: 'encabezado' },
    { title: 'Detalle', field: 'detalle' },
    { title: 'Estado', field: 'estado' },
    {
      title: 'Fecha Recibido', field: 'fechaRecibido', render: (rowData) => (rowData.fechaRecibido !== null ?
        (new Date(rowData.fechaRecibido).toLocaleDateString()
        ) : null
      ),
    },
    { title: 'Recibido por', field: 'usuarioRecibe' },
    {
      title: 'Recibir',
      render: (rowData) => (
        rowData.fechaRecibido === null ? (
          <Button style={{ textAlign: 'center', borderColor: 'black', width: '50%', height: '35px' }} onClick={() => setSalidaARecibir(rowData.id)}>Recibir</Button>
        ) : null
      ),
    }
  ]

  const mcolumnas = [
    { title: 'Producto', field: 'nombreProducto' },
    { title: 'Precio Unitario', field: 'precioProducto' },
    { title: 'Cantidad', field: 'cantidad' },
    { title: 'Costo', field: 'costo' },
  ]

  const totalUnidades = detalleSalida.reduce((total, rowData) => {
    return total + rowData.cantidad;
  }, 0)

  const montoSalida = detalleSalida.reduce((total, rowData) => {
    return total + rowData.costo;
  }, 0)

  ////funciones api
  const sucursales = async () => {
    try {
      const response = await axios.get(`https://localhost:7261/api/Salidas/sucursales`);
      setListaSucursales(response.data);
    } catch (error) {
      console.error('Error con sucursales:', error);
    }
  }

  const salidas = async () => {
    try {
      const response = await axios.get(`https://localhost:7261/api/Salidas/salidas`);
      setListaSalidas(response.data);
    } catch (error) {
      console.error('Error con salidas:', error);
    }
  }

  const salidasFiltradas = async (fechaD, fechaH, sucursal) => {
    try {
      const response = await axios.get(`https://localhost:7261/api/Salidas/salidafiltrada?fechaD=${fechaD}&fechaF=${fechaH}&sucursal=${sucursal}`);
      setListaSalidas(response.data);
    } catch (error) {
      console.error('Error con salidas:', error);
    }
  }

  const detalle = async (salida) => {
    try {
      const response = await axios.get(`https://localhost:7261/api/Salidas/detalleSalida?salida=${salida}`);
      setDetalleSalida(response.data);
    } catch (error) {
      console.error('Error con detalles:', error);
    }
  }

  const recibir = async (usuario, salida) => {
    try {
      const response = await axios.get(`https://localhost:7261/api/Salidas/recibido?usuario=${usuario}&salida=${salida}`);
      setSalidaRecibida(response.data);
    } catch (error) {
      console.error('Error con recibir:', error);
    }
  }

  ////funciones fuera de api
  const customMaterialTheme = createTheme({
    palette: {
      primary: {
        main: '#1976D2',
      },
      secondary: {
        main: '#FFC107',
      },
    },
  });

  const handleRowClick = (e, rowData) => {
    setSelectedSalida(rowData.id);
  }

  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSucursal = (event) => {
    setSelectedSucursal(event.target.value);
  }

  const handleFechaInicioChange = date => {
    const formattedDate = format(date._d, 'yyyy-MM-dd');
    setFechaDesde(formattedDate);
  };

  const handleFechaFinalChange = date => {
    const lastDate = format(date._d, 'yyyy-MM-dd');
    setFechaHasta(lastDate);
  }

  const moverSalida = () => {
    history('/crear')
  }

  ////useEffect
  useEffect(() => {
    sucursales();
  }, []);

  useEffect(() => {
    salidas();
  }, []);

  useEffect(() => {
    if (selectedSalida) {
      openModal()
      detalle(selectedSalida)
    }
  }, [selectedSalida]);

  useEffect(() => {
    if (salidaARecibir) {
      recibir(localStorage.getItem("usuario"), salidaARecibir);
    }
  }, [salidaARecibir]);

  useEffect(() => {
    salidas()
  }, [salidaRecibida])

  return (
    <>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5' }}>
        <FormGroup style={{ width: '200px' }}>
          <Label>Fecha de Inicio</Label>
          <Datetime
            inputProps={{ placeholder: 'Seleccionar fecha', style: { width: '100%', height: '20px', padding: '5px' } }}
            onChange={handleFechaInicioChange}
          />
        </FormGroup>
        <FormGroup style={{ width: '200px' }}>
          <Label>Fecha final</Label>
          <Datetime
            inputProps={{ placeholder: 'Seleccionar fecha', style: { width: '100%', height: '20px', padding: '5px'  } }}
            onChange={handleFechaFinalChange}
          />
        </FormGroup>
        <FormGroup style={{ width: '200px' }}>
          <Label>Sucursal</Label>
          <Input
            type="select"
            onChange={handleSucursal}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          >
            <option value={0}>Seleccione la sucursal</option>
            {listaSucursales.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombreSucursal}
              </option>
            ))}
          </Input>
        </FormGroup>
        <Button
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginTop: '20px'
          }}
          onClick={() => salidasFiltradas(fechaDesde, fechaHasta, selectedSucursal)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'} 
        >
          Filtrar
        </Button>
        {localStorage.getItem('perfilId') === '1' && (
          <Button
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginTop: '20px'
            }}
            onClick={() => moverSalida()}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2195F0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
          >
            Crear Salida
          </Button>
        )}
      </div>
      <div style={{ width: '95%', padding: '40px', backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <ThemeProvider theme={customMaterialTheme}>
          <MaterialTable
            columns={columnas}
            data={listaSalidas}
            title="Salidas"
            options={{
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 20, 50],
            }}
            onRowClick={handleRowClick}
            cellStyle={{ textAlign: 'right' }}
          />
        </ThemeProvider>
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={openModal}
          contentLabel="Detalles Salida"
          style={{
            overlay: {
              zIndex: 600,
              position: 'fixed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            content: {
                height: 'auto',
                width: '80%', 
                top: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(0%, -50%)',
            },
          }}
        >
          <div>
            <Card>
              <CardContent>
                <Box>
                  <ThemeProvider theme={customMaterialTheme}>
                    <MaterialTable
                      columns={mcolumnas}
                      data={detalleSalida}
                      title="Detalles"
                      options={{
                        paging: true,
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10, 20, 50]
                      }}
                      components={{
                        Body: (props) => (
                          <>
                            <MTableBody {...props} />
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left' fontSize="12px">
                                  Total
                                </TableCell>
                                <TableCell align='left'>
                                  {totalUnidades}
                                </TableCell>
                                <TableCell align='left'>
                                  {montoSalida}
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </>
                        )
                      }}
                    />
                  </ThemeProvider>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Home;
