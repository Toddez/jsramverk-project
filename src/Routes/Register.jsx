import React from 'react';
import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import { api_url } from '../Models/config';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMsg: null
        };

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

        fetch(`${api_url}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
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

                this.props.history.push("/login");
            });
    }

    render() {
        return (
            <main>
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend>Bli kund</legend>

                        { this.state.errorMsg && <div className='error'>{this.state.errorMsg}</div> }

                        <label htmlFor="email">
                            Email
                            <input type="email" name="email" id="email" placeholder="example@gmail.com" required value={this.state.email} onChange={this.handleChange} />
                        </label>

                        <label htmlFor="password">
                            Lösenord
                            <input type="password" name="password" id="password" placeholder="******" required value={this.state.password} onChange={this.handleChange} />
                        </label>

                        <input type="submit" value="Registrera" />

                        Är du redan kund? <Link to='/login'>Logga in här</Link>.
                    </fieldset>
                </form>
            </main>
        );
    }
}

export default withRouter(Register);
