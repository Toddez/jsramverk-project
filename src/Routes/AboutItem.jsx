import React from 'react';

import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import { Chart } from 'react-charts'; // eslint-disable-line no-unused-vars

class AboutItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    label: 'Test chart',
                    data: [[0, 1], [1, 2],[2, 4], [3, 2], [4, 7]]
                }
            ],
            axes: [
                {
                    primary: true,
                    type: 'linear',
                    position: 'bottom'
                },
                {
                    type: 'linear',
                    position: 'left'
                }
            ]
        };
    }

    render() {
        return (
            <div>
                <div className='chartBox' style={{
                    width: '400px',
                    height: '300px'
                }}>
                    <Chart data={this.state.data} axes={this.state.axes} dark></Chart>
                </div>
            </div>
        );
    }
}

export default withRouter(AboutItem);
