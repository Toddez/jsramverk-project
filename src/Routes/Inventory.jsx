import React from 'react';

import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import DepositWindow from '../Components/DepositWindow'; // eslint-disable-line no-unused-vars

import { api_url } from '../Models/config';
import auth from '../Models/auth';

class Inventory extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            depositWindowShown: false,
            balance: auth.data.balance || 0
        };

        this.toggleDepositWindow = this.toggleDepositWindow.bind(this);
        this.setBalance = this.setBalance.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        fetch(`${api_url}/transaction/inventory`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.getToken()
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.errors) {
                    return;
                }

                auth.data.balance = res.balance;
                auth.data.inventory = res.inventory;

                if (this._isMounted) {
                    this.setState({
                        balance: auth.data.balance,
                        inventory: auth.data.inventory
                    });
                }
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setBalance(balance) {
        this.setState({balance: balance});
    }

    toggleDepositWindow() {
        this.setState({depositWindowShown: !this.state.depositWindowShown});
    }

    render() {
        return (
            <div>
                <h2>Min depå</h2>
                <div className='inv-deposit' onClick={this.toggleDepositWindow}>Sätt in pengar</div>

                {this.state.depositWindowShown ? <DepositWindow setBalance={this.setBalance} toggle={this.toggleDepositWindow} authorized={this.props.authorized} /> : null}

                <h3>Översikt</h3>
                <div className='inv-info'>
                    <div className='inv-info-item'>
                        <div className='inv-info-title'>Totalt värde</div>
                        <div className='inv-info-value'>6 792 kr</div>
                    </div>
                    <div className='inv-info-item'>
                        <div className='inv-info-title'>Tillgängligt för köp</div>
                        <div className='inv-info-value'>{this.state.balance} kr</div>
                    </div>
                </div>

                <div className='savings'>
                    <div className='savings-header'>
                        <h3>Sparande</h3>
                        <span className='savings-total'>6 400 kr</span>
                    </div>
                    <div className='inv-list'>
                        <div className='inv-list-item'>
                            <div className='inv-list-title'><Link to='/about/1'>Fond/aktie 1</Link></div>
                            <div className='inv-list-value'>1 600 kr</div>
                        </div>
                        <div className='inv-list-item'>
                            <div className='inv-list-title'><Link to='/about/2'>Fond/aktie 2</Link></div>
                            <div className='inv-list-value'>1 600 kr</div>
                        </div>
                        <div className='inv-list-item'>
                            <div className='inv-list-title'><Link to='/about/3'>Fond/aktie 3</Link></div>
                            <div className='inv-list-value'>1 600 kr</div>
                        </div>
                        <div className='inv-list-item'>
                            <div className='inv-list-title'><Link to='/about/4'>Fond/aktie 4</Link></div>
                            <div className='inv-list-value'>1 600 kr</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Inventory);
