import React from 'react';

import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars

class Invest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Link to="/about/1">Fond/Aktie 1</Link>
            </div>
        );
    }
}

export default withRouter(Invest);
