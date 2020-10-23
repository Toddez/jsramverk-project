import React from 'react';

import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import { Chart } from 'react-charts'; // eslint-disable-line no-unused-vars
import BuyWindow from '../Components/BuyWindow'; // eslint-disable-line no-unused-vars
import SellWindow from '../Components/SellWindow'; // eslint-disable-line no-unused-vars

import socketIOClient from 'socket.io-client';

import { api_url, socket_url } from '../Models/config';
import auth from '../Models/auth';

class AboutItem extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            buyWindowShown: false,
            sellWindowShown: false,
            data: {
                id: this.props.match.params.id,
                current: {},
                amount: 0
            },
            chartData: [],
            chartAxes: [
                {
                    primary: true,
                    type: 'time',
                    position: 'bottom'
                },
                {
                    type: 'linear',
                    position: 'left'
                }
            ],
            chartSeries: {
                showPoints: false,
                type: 'area'
            },
            width: '0px'
        };

        this.toggleBuyWindow = this.toggleBuyWindow.bind(this);
        this.toggleSellWindow = this.toggleSellWindow.bind(this);
        this.getState = this.getState.bind(this);
        this.setAmount = this.setAmount.bind(this);
    }

    connect() {
        const socket = socketIOClient(socket_url);
        this.setState({socket: socket});

        socket.on('connect', () => {
            socket.emit('stock connect', { id: this.state.data.id });
        });

        socket.on('stock correction', (message) => {
            if (this.state.data.id === message.id) {
                this.setState({data: {
                    ...this.state.data,
                    name: message.name,
                    value: message.value,
                    current: message.value[message.value.length - 1]
                }});

                this.updateChart();
            }
        });

        socket.on('stock update', (message) => {
            if (this.state.data.id === message.id) {
                this.setState({data: {
                    ...this.state.data,
                    value: [...this.state.data.value, message.value],
                    current: message.value
                }});


                this.updateChart();
            }
        });

    }

    componentDidMount() {
        this._isMounted = true;

        this.connect();

        if (auth.authorized())
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

                    if (this._isMounted) {
                        const stock = res.inventory.find((value) => {
                            return value.id === this.state.data.id;
                        });

                        if (!stock) {
                            return;
                        }

                        this.setState({
                            data: {
                                ...this.state.data,
                                amount: stock.amount
                            }
                        });
                    }
                });
    }

    updateChart() {
        if (!this._isMounted)
            return;

        const chartData = this.state.data.value.map((value) => {
            return [new Date(value.date), value.value];
        });

        this.setState({
            chartData: [
                {
                    ...this.state.chartData[0],
                    data: chartData
                }
            ]
        });

        this.setState({width:'100%'});

    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.socket)
            this.state.socket.close();
    }

    toggleBuyWindow() {
        this.setState({buyWindowShown: !this.state.buyWindowShown});
    }

    toggleSellWindow() {
        this.setState({sellWindowShown: !this.state.sellWindowShown});
    }

    getState() {
        return this.state;
    }

    setAmount(amount) {
        this.setState({
            data: {
                ...this.state.data,
                amount: amount
            }
        });
    }

    render() {
        return (
            <div>
                <h2>{this.state.data.name}</h2>
                <div className='inv-info'>
                    {
                        auth.authorized() ?
                            <div className='inv-info-item'>
                                <div className='inv-info-big' onClick={this.toggleBuyWindow}>Köp</div>
                            </div> : null
                    }
                    {
                        auth.authorized() ?
                            <div className='inv-info-item'>
                                <div className='inv-info-big' onClick={this.toggleSellWindow}>Sälj</div>
                            </div> : null
                    }
                    {
                        auth.authorized() ?
                            <div className='inv-info-item'>
                                <div className='inv-info-title'>Ägda andelar</div>
                                <div className='inv-info-value'>{this.state.data.amount} st</div>
                            </div> : null
                    }
                    <div className='inv-info-item'>
                        <div className='inv-info-title'>Andel värde</div>
                        <div className='inv-info-value'>{this.state.data.current.value} kr</div>
                    </div>
                </div>

                {this.state.buyWindowShown ? <BuyWindow getParentState={this.getState} setAmount={this.setAmount} toggle={this.toggleBuyWindow} /> : null}
                {this.state.sellWindowShown ? <SellWindow getParentState={this.getState} setAmount={this.setAmount} toggle={this.toggleSellWindow} /> : null}

                <div className='chart-box' style={{
                    width: this.state.width
                }}>
                    <Chart data={this.state.chartData} axes={this.state.chartAxes} series={this.state.chartSeries} dark />
                </div>
            </div>
        );
    }
}

export default withRouter(AboutItem);
