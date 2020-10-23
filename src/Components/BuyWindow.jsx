import React from 'react';

import { withRouter } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import auth from '../Models/auth';
import { api_url } from '../Models/config';

class BuyWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: ''
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log('SUBMIT');
    }

    handleClick() {
        this.props.toggle();
    }

    render() {
        return (
            <div className='modal buy-window'>
                <div className='modal-content'>
                    <span className='close' onClick={this.handleClick}>
                        &times;
                    </span>
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>Köp andelar</legend>

                            { this.state.errorMsg && <div className='error'>{this.state.errorMsg}</div> }

                            <label htmlFor="amount">
                                Antal andelar
                                <input type="number" name="amount" id="amount" placeholder="Antal..." required value={this.state.amount} onChange={this.handleChange} />
                            </label>

                            <input type="submit" value="Köp andelar" />
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(BuyWindow);
