import React from 'react';

import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars

import { api_url } from '../Models/config';
import auth from '../Models/auth';

class Invest extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            stocks: []
        };
    }

    componentDidMount() {
        this._isMounted = true;

        fetch(`${api_url}/stocks`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.errors) {
                    return;
                }

                auth.data.stocks = res.stocks;

                if (this._isMounted) {
                    this.setState({
                        stocks: auth.data.stocks
                    });
                }
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className='stock-list'>
                <h3>Aktier</h3>
                <div className='stock-item'>
                    <div>Namn</div>
                    <div className='stock-value'>Pris/andel</div>
                </div>
                {
                    this.state.stocks.map((value, index) => {
                        return (
                            <div className='stock-item' key={index}>
                                <Link to={`/about/${value.id}`}>{value.name}</Link>
                                <div className='stock-value'>{value.current} kr</div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default withRouter(Invest);
