import App from 'next/app';
import { withRouter } from 'next/router'

import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../src/store/index';

import '../styles/globals.css';
import Layout from '../src/components/layout';

class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;

		// console.log('APP', this.props,);
		// console.log('SSR', pageProps);

		return (
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</Provider>
		)
	}
}

export default withRouter(MyApp);