import React from 'react';
import { BrowserRouter as Router, NavLink, Link, Route, Switch, Redirect } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import FrontPage from './Routes/FrontPage.jsx'; // eslint-disable-line no-unused-vars
import Invest from './Routes/Invest.jsx'; // eslint-disable-line no-unused-vars
import Inventory from './Routes/Inventory.jsx'; // eslint-disable-line no-unused-vars
import Auth from './Routes/Auth.jsx'; // eslint-disable-line no-unused-vars

import auth from './Models/auth';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authorized: auth.authorized(),
            email: null
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin() {
        this.setState({
            authorized: auth.authorized(),
            email: auth.getEmail()
        });
    }

    handleLogout() {
        auth.setToken(undefined);
        auth.setEmail(undefined);

        this.setState({
            authorized: false,
            email: null
        });
    }

    render() {
        return (
            <Router>
                <div className='App'>
                    <nav>
                        <NavLink exact={true} className='site-title' to='/'>PROJEKT</NavLink>
                        <ul>
                            <li>
                                <NavLink exact={true} activeClassName='active' to='/invest'>Investera</NavLink>
                            </li>
                            {
                                this.state.authorized ? <li><NavLink exact={true} activeClassName='active' to='/inventory'>Portfolio</NavLink></li> : ''
                            }
                            <li>
                                {
                                    this.state.authorized
                                        ? <div className='authorized'>
                                            <div className='email'>{this.state.email}</div>
                                            <Link className='logout' to='/login' onClick={this.handleLogout}>Logout</Link>
                                        </div>
                                        : <NavLink className='login' isActive={(match, location) => ['/login', '/register'].includes(location.pathname)} activeClassName='active' to='/login'>Logga in</NavLink>
                                }
                            </li>
                        </ul>
                    </nav>
                    <div className='content'>
                        <Route exact path='/' component={FrontPage} />
                        <Route path='/invest' render={() => <Invest authorized={this.state.authorized} />} />
                        {
                            this.state.authorized
                                ? <Switch>
                                    <Route exact path='/inventory' render={() => <Inventory authorized={this.state.authorized} />} />
                                    <Redirect strict from='/login' to='/'/>
                                    <Redirect strict from='/register' to='/'/>
                                </Switch>
                                : <Switch>
                                    <Route exact path='/login' render={() => <Auth onLogin={this.handleLogin} />} />
                                    <Route exact path='/register' component={Auth} />
                                    <Redirect strict from='/inventory' to='/login'/>
                                </Switch>
                        }
                    </div>
                    <footer>
                        <div className='footer-text'>
                            Denna sida används för utbildningsändamål i kursen <i>jsramverk</i> på <a href='https://bth.se'>Blekinge Tekniska Högskola</a>
                        </div>
                    </footer>
                </div>
            </Router>
        );
    }
}

export default App;
