import React from 'react';
import { withRouter, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars

class FrontPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <h2>Projekt - JSRAMVERK</h2>
                <div className='contentLeft'>
                    <p>Investera dina pengar i olika aktier och fonder.</p>
                    <div className='customerStart'>
                        <Link className='becomeCustomer' to='/register'>Bli Kund idag</Link>
                        <Link className='alreadyCustomer' to='/login'>Redan kund? Logga in</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(FrontPage);
