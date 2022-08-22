import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { withRouter } from 'next/router'

import { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { mediaQuery } from '../../src/graphql/mediaDetail';

import * as actPost from '../../src/redux/actions/post';

import Anime from '../../src/components/anime'

interface Props extends PropsFromRedux {
	router: any;
    animeList: any;
}

const Detail: NextPage<Props> = (props: Props) => {
    // console.log(props);

	useEffect(() => {
		if (props.animeList) {
			props.actPost.loadPost(props.animeList);
		}
	})

	return (
		<Anime />
	)
}

export const getStaticProps: GetStaticProps = async (context: any) => {
	const client = new ApolloClient({
		uri: 'https://graphql.anilist.co/',
		cache: new InMemoryCache
	});

	const data = await new Promise(resolve => {
		client.query({
			query: mediaQuery,
			variables: {
                id: context.params.slug,
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

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
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

export default connector(withRouter(Detail));
