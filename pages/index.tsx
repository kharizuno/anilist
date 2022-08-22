import type { GetStaticProps, NextPage } from 'next'
import { withRouter } from 'next/router'

import { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { mediaQuery } from '../src/graphql/media';

import * as actPost from '../src/redux/actions/post';

import Home from '../src/components/home'

interface Props extends PropsFromRedux {
	router: any;
	animeList: any;
}

const HomePage: NextPage<Props> = (props: Props) => {
	// console.log(props);

	useEffect(() => {
		if (props.animeList) {
			props.actPost.loadPost(props.animeList);
		}
	})

	return (
		<Home />
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const client = new ApolloClient({
		uri: 'https://graphql.anilist.co/',
		cache: new InMemoryCache
	});

	const data = await new Promise(resolve => {
		client.query({
			query: mediaQuery,
			variables: {
				page: 1,
				perpage: 10,
				type: 'ANIME'
			}
		}).then((result) => resolve(result))
	});

	return {
		props: {
			animeList: data
		}
	}
}

const mapStateToProps = (state: any) => {
    return {}
}

const mapDispatchToProps = (dispatch: any) => {
    return {
		actPost: bindActionCreators(actPost, dispatch)
	}
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(HomePage));
