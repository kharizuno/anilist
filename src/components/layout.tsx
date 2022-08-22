import { withRouter } from 'next/router'

import Meta from './partial/meta';
import Nav from './partial/nav';

const Layout = (props: any) => {
    return (
        <div>
            <Meta/>
            <Nav/>
            {props.children}
        </div>
    )
}

export default withRouter(Layout);