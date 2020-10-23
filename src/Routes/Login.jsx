import React from 'react';
import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import auth from '../Models/auth';
import { api_url } from '../Models/config';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMsg: ''
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

        fetch(`${api_url}/auth/login`, {
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

                auth.setToken(res.data.token);
                auth.setEmail(res.data.email);

                this.props.onLogin();
                this.props.history.push("/");
            });
    }

    render() {
        return (
            <main>
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend>Logga in</legend>

                        { this.state.errorMsg && <div className='error'>{this.state.errorMsg}</div> }

                        <label htmlFor="email">
                            Email
                            <input type="email" name="email" id="email" placeholder="example@gmail.com" required value={this.state.email} onChange={this.handleChange} />
                        </label>

                        <label htmlFor="password">
                            Lösenord
                            <input type="password" name="password" id="password" placeholder="******" required value={this.state.password} onChange={this.handleChange} />
                        </label>

                        <input type="submit" value="Logga in" />

                        Har du inget konto? <Link to="/register">Registrera här</Link>.
                    </fieldset>
                </form>
            </main>
        );
    }
}

export default withRouter(Login);
