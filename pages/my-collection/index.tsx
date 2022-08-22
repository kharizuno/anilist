import type { NextPage } from 'next'
import { withRouter } from 'next/router'

import { connect, ConnectedProps } from 'react-redux';
// import { bindActionCreators } from 'redux';

import Collection from '../../src/components/collection'

interface Props extends PropsFromRedux {
	router: any;
}

const MyCollection: NextPage<Props> = (props: Props) => {
	return (
		<Collection />
	)
}

const mapStateToProps = (state: any) => {
    return {}
}

const mapDispatchToProps = (dispatch: any) => {
    return {}
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(MyCollection));
