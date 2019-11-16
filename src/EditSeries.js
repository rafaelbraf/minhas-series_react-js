import React, {Component} from 'react';
import api from './Api'
import {Redirect} from 'react-router-dom';
import { red } from 'ansi-colors';

const statuses = {
    "watched": "Assistido",
    "watching": "Assistindo",
    "toWatch": "Assistir"
}

class EditSeries extends Component {

    constructor() {
        super();
        this.state = {
            genres: [],
            isLoading: false,
            redirect: false,
            series: {}
        }
        this.saveSeries = this.saveSeries.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading:true })
        api.loadSeriesById(this.props.match.params.id).then((res) => {
            this.setState({ series: res.data });
            this.refs.name.value = this.state.series.name;
            this.refs.genre.value = this.state.series.genre;
            this.refs.comment.value = this.state.series.comment;
            this.refs.status.value = this.state.series.status;
        })
        api.loadGenres().then((res) => {
            this.setState({
                isLoading: false,
                genres: res.data
            })
        })
    }

    saveSeries() {

        const NewSeries = {
            id: this.props.match.params.id,
            name: this.refs.name.value,
            status: this.refs.status.value,
            genre: this.refs.genre.value,
            comment: this.refs.comment.value
        }
        api.updateSeries(NewSeries).then((res) => this.setState({
            redirect: '/series/'+this.refs.genre.value
        }))
    }

    render(){
        return(            
            <section className="intro-section">
                {this.state.redirect &&
                    <Redirect to={this.state.redirect}></Redirect>
                }
                <h1>Editar Série</h1>
                
                <form>
                    Nome: <input type="text" ref="name" className="form-control"></input>
                    <br></br>
                    Status: 
                    <select ref="status">
                        {
                            Object.keys(statuses).map(key => <option key={key} value={key}>{statuses[key]}</option>)
                        }
                    </select>
                    <br></br>
                    Genêro: 
                    <select ref="genre">
                        {
                            this.state.genres.map(key => <option key={key} value={key}>{key}</option>)
                        }
                    </select>
                    <br></br>
                    Comentários: <textarea className="form-control" ref="comment"></textarea><br></br>
                    <button type="button" onClick={this.saveSeries}>Salvar</button>
                </form>
            </section>
        );
    }
}

export default EditSeries