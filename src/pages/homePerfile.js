import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import update from "immutability-helper";
import '/src/perfile.css'
import user from '../img/icon-user.png'
import swal from 'sweetalert';
import Carousel from 'react-bootstrap/Carousel'
import { Alert } from "bootstrap";


class HomePerfile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: window.localStorage.getItem("user"),
            idUser: window.localStorage.getItem("iduser"),
            imagen: "https://res.cloudinary.com/jacrcam/image/upload/v1648158889/ProgramacionConcurrente/fond_epb0wo.jpg",
            imagenes: []
        }
    }

    componentDidMount() {
        if (!window.localStorage.getItem("token")){
            this.props.history.push("/");
        }else{
            this.obtenerFotos()
        }
    }

    changeField(e) {
        let field = e.target.name
        let value = e.target.value

        this.setState(update(this.state,{
            [field] : {$set : value}
        }))
    }

    salir(){
        window.localStorage.clear();
        this.props.history.push('/')
    }

    obtenerFotos(){
        let idUsuario = window.localStorage.getItem("iduser");

        axios.get('http://localhost:3001/get_Images?id='+idUsuario, {
            data : {
                id: idUsuario,
            }
        }).then(data => {

            let aux = []
            for (var i=0; i<data.data[1].length; i++){
                aux.push(data.data[1][i])
            }

            this.setState({ imagenes: aux})


        });

    }


    async enviar_fotos(){
        const formData = new FormData();
        const inputFile = document.getElementById("file");

        for (const file of inputFile.files) {
            formData.append("files", file, file.name);
        }
        const getFormDataSize = (formData) => [...formData].reduce((size, [name, value]) => size + (typeof value === 'string' ? value.length : value.size), 0);

        if (getFormDataSize(formData) > 0){
            await axios.post('http://localhost:3001/set_image2?id='+this.state.idUser,
                formData
            ).then(data => {
                if(data.data === "Recibido"){
                    this.obtenerFotos()
                    alert("Correcto");

                }else{
                    alert("Error", "No se pudieron subir las imagenes o no hay imagenes para subir", "error");
                }
            }).catch(e => {
                alert("Error", "No se pudo conectar al servidor", "error");
            });
        } else {
            alert("Error", "No ha agregado ninguna imagen", "error");
        }

    }

    render() {
        return(
            <>
                <form className="d-flex justify-content-end me-2 mb-lg-0 mb-lg-3 p-2 bd-highlight">
                            <img src={user} alt="cargando imagen..." className="icon-user"/>
                            <label>{this.state.username}</label>
                        </form>
               
                   
                  
                           
                      
                            <a onClick={this.salir.bind(this)} className="btn btn-outline-danger position-absolute top-0 start-0">
                                Salir</a>

                               
                      
                
                <div className="centrar">
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100 carousel-item active"
                                src={this.state.imagen}
                                alt="First slide"
                            />
                        </Carousel.Item>
                        {
                            this.state.imagenes.map(item => {
                                return <Carousel.Item className="carousel-inner">
                                    <img
                                        className="d-block w-100 carousel-item active"
                                        src={item}
                                        alt="Third slide"
                                        width="10px"
                                    />
                                </Carousel.Item>
                            })
                        }
                    </Carousel>
                </div>
        
                    <div>
                        <div className="content-file me-2 position-absolute top-100 start-50 translate-middle">
                            <div className="row justify-content-start ">
                                <input type="file" id="file" className="form-control col-4 col-sm-3" multiple/>
                                <button onClick={this.enviar_fotos.bind(this)} className="bton-file btn btn-outline-secondary col-4 col-sm-3" type="button">Subir</button>
                            </div>
                        </div>
                       
                    </div>
               
                
            </>
        );
    }
}

export default withRouter(HomePerfile);