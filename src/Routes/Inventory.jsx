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
            balance: auth.data.balance || 0,
            inventory: [],
            investmentValue: 0
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

                const totalInvestment = res.inventory.reduce((a, b) => {
                    return a + b.amount * b.value;
                }, 0);

                if (this._isMounted) {
                    this.setState({
                        balance: auth.data.balance,
                        inventory: auth.data.inventory,
                        investmentValue: totalInvestment
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

                {this.state.depositWindowShown ? <DepositWindow setBalance={this.setBalance} toggle={this.toggleDepositWindow} /> : null}

                <h3>Översikt</h3>
                <div className='inv-info'>
                    <div className='inv-info-item'>
                        <div className='inv-info-title'>Totalt värde</div>
                        <div className='inv-info-value'>{this.state.investmentValue + this.state.balance} kr</div>
                    </div>
                    <div className='inv-info-item'>
                        <div className='inv-info-title'>Tillgängligt för köp</div>
                        <div className='inv-info-value'>{this.state.balance} kr</div>
                    </div>
                </div>

                <div className='savings'>
                    <div className='savings-header'>
                        <h3>Investeringar</h3>
                        <span className='savings-total'>{this.state.investmentValue} kr</span>
                    </div>
                    <div className='inv-list'>
                        {this.state.inventory.map((value, index) => {
                            if (value.amount === 0) {
                                return null;
                            }

                            return (
                                <div className='inv-list-item' key={index}>
                                    <div className='inv-list-title'><Link to={`/about/${value.id}`}>{value.name}</Link></div>
                                    <div className='inv-list-value'>{value.amount * value.value} kr</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Inventory);
