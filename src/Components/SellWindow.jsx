import React from 'react';

import { withRouter } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import auth from '../Models/auth';
import { api_url } from '../Models/config';

class SellWindow extends React.Component {
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

        fetch(`${api_url}/transaction/sell`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.getToken()
            },
            body: JSON.stringify({
                amount: this.state.amount,
                id: this.props.getParentState().data.id
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.errors) {
                    this.setState({
                        errorMsg: res.errors.reduce((res, err) => {
                            return res + err.message;
                        }, '')
                    });
                    return;
                }

                this.props.setAmount(res.amount);
                this.props.toggle();
            });
    }

    handleClick() {
        this.props.toggle();
    }

    render() {
        return (
            <div className='modal sell-window'>
                <div className='modal-content'>
                    <span className='close' onClick={this.handleClick}>
                        &times;
                    </span>
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>Sälj andelar</legend>

                            { this.state.errorMsg && <div className='error'>{this.state.errorMsg}</div> }

                            <label htmlFor="amount">
                                Antal andelar
                                <input type="number" name="amount" id="amount" placeholder="Antal..." required value={this.state.amount} onChange={this.handleChange} />
                            </label>

                            <input type="submit" value="Sälj andelar" />
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(SellWindow);
