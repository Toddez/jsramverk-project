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
                current: {}
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
            }
        };

        this.toggleBuyWindow = this.toggleBuyWindow.bind(this);
        this.toggleSellWindow = this.toggleSellWindow.bind(this);
    }

    connect() {
        const socket = socketIOClient(socket_url);
        socket.on('connect', () => {
            socket.emit('stock connect', { id: this.state.data.id, latest: this.state.data.value[this.state.data.value.length - 1].date });
        });

        socket.on('stock correction', (message) => {
            if (this.state.data.id === message.id) {
                this.setState({data: {
                    ...this.state.data,
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

        fetch(`${api_url}/stocks/${this.props.match.params.id}`, {
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

                if (this._isMounted) {
                    this.setState({
                        data: {
                            name: res.name,
                            current: res.current,
                            id: res.id,
                            value: res.value
                        }
                    });

                    this.updateChart();
                    this.connect();
                }
            });
    }

    updateChart() {
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    toggleBuyWindow() {
        this.setState({buyWindowShown: !this.state.buyWindowShown});
    }

    toggleSellWindow() {
        this.setState({sellWindowShown: !this.state.sellWindowShown});
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
                    <div className='inv-info-item'>
                        <div className='inv-info-title'>Andel värde</div>
                        <div className='inv-info-value'>{this.state.data.current.value} kr</div>
                    </div>
                </div>

                {this.state.buyWindowShown ? <BuyWindow setParentState={this.setState} toggle={this.toggleBuyWindow} /> : null}
                {this.state.sellWindowShown ? <SellWindow setParentState={this.setState} toggle={this.toggleSellWindow} /> : null}

                <div className='chart-box'>
                    <Chart data={this.state.chartData} axes={this.state.chartAxes} series={this.state.chartSeries} dark />
                </div>
            </div>
        );
    }
}

export default withRouter(AboutItem);
