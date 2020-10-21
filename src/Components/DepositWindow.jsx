import React from 'react';

import { withRouter } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import auth from '../Models/auth';
import { api_url } from '../Models/config';

class DepositWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0
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

        fetch(`${api_url}/transaction/deposit`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.getToken()
            },
            body: JSON.stringify({
                amount: this.state.amount
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.errors) {
                    return;
                }

                const balance = res.balance;
                auth.data.balance = balance;

                this.props.setBalance(balance);
                this.props.toggle();
            });
    }

    handleClick() {
        this.props.toggle();
    }

    render() {
        return (
            <div className='modal deposit-window'>
                <div className='modal-content'>
                    <span className='close' onClick={this.handleClick}>
                        &times;
                    </span>
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>Sätt in pengar</legend>

                            <label htmlFor="amount">
                                Antal kronor
                                <input type="number" name="amount" id="amount" placeholder="Kronor..." required value={this.state.password} onChange={this.handleChange} />
                            </label>

                            <input type="submit" value="Sätt in pengar på konto" />
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(DepositWindow);
