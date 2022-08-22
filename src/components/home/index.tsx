import { withRouter } from 'next/router'
import Link from 'next/link';

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { mediaQuery } from '../../graphql/media';

import * as actPost from '../../redux/actions/post';

import styled from '@emotion/styled';

const Container = styled.div`
    max-width: 80%;
    margin: 0 auto;
    margin-top: 10px;

    @media only screen and (max-width: 1600px) {
        max-width: 90%;
    }

    @media only screen and (max-width: 1280px) {
        max-width: 98%;
    }

    @media only screen and (max-width: 768px) {
        margin-top: 5px;
    }
`

const BoxInfo = styled.div`
    width: 100%;

    .info {
        background-color: #fff;
        margin: 10px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
    }
`

const BoxAnime = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: start;
`

const ChildAnime = styled.div`
    display: flex;
    flex: 0 20%;

    @media only screen and (max-width: 992px) {
        flex: 0 33.33%;
    }

    @media only screen and (max-width: 350px) {
        flex: 0 50%;
    }
`

const CoverAnime = styled.div`
    position: relative;
    width: 100%;
    height: 450px;
    background-color: #fff;

    margin: 10px;
    padding: 10px;

    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
    transition: all 0.2s ease;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    }

    :hover {
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
        transition: all 0.2s ease;
        transform: scale(1.05);
        z-index: 9;
    }

    @media only screen and (max-width: 1600px) {
        height: 400px;
    }

    @media only screen and (max-width: 1280px) {
        height: 350px;
    }
    
    @media only screen and (max-width: 992px) {
        height: 400px;
    }

    @media only screen and (max-width: 768px) {
        height: 350px;
        margin: 5px;
        padding: 8px;
    }

    @media only screen and (max-width: 650px) {
        height: 280px;
        margin: 3px;
        padding: 5px;
    }

    @media only screen and (max-width: 550px) {
        height: 240px;
    }

    @media only screen and (max-width: 450px) {
        height: 200px;
    }

    @media only screen and (max-width: 350px) {
        height: 240px;
    }
`

const TitleAnime = styled.div`
    position: absolute;
    left: 0;
    bottom: 20px;
    color: #fff;
    margin: 0 18px;
    text-shadow: 1px 1px 0px rgba(0,0,0,0.4);

    @media only screen and (max-width: 550px) {
        font-size: 14px;
    }

    @media only screen and (max-width: 450px) {
        margin: 0 10px;
        bottom: 10px;
    }

    @media only screen and (max-width: 400px) {
        margin: 0 8px;
        bottom: 8px;
    }
`

const EpisodeAnime = styled.div`
    position: absolute;
    right: 0;
    top: 15px;
    color: #fff;
    margin: 0 18px;
    font-size: 20px;
    text-shadow: 1px 1px 0px rgba(0,0,0,0.4);

    span {
        font-size: 16px;
    }

    @media only screen and (max-width: 550px) {
        font-size: 14px;

        span {
            font-size: 12px;
        }
    }

    @media only screen and (max-width: 450px) {
        margin: 0 10px;
        top: 8px;
    }
`

const Paginate = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 20px;

    ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        margin: 0;
        padding: 0;

        li {
            list-style: none;

            a {
                display: flex;
                min-width: 40px;
                padding: 10px 15px;
                margin: 5px 5px;
                border-radius: 6px;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                cursor: pointer;
            }

            &.selected {
                a {
                    color: #fff;
                    background-color: #141414;
                }
            }
        }
    }

    @media only screen and (max-width: 550px) {
        font-size: 14px;
    }
`

interface DataProps extends PropsFromRedux {
    router: any;
    postList: any;
}

interface DataState { }

export class Home extends Component<DataProps, DataState> {
    constructor(props: any) {
        super(props);

        this.state = {

        }
    }

    async loadData(page: number) {
        this.props.actPost.clearPost();

        const client = new ApolloClient({
            uri: 'https://graphql.anilist.co/',
            cache: new InMemoryCache
        });


        client.query({
            query: mediaQuery,
            variables: {
                page: page,
                perpage: 10,
                type: 'ANIME'
            }
        }).then((result) =>
            this.props.actPost.loadPost(result)
        )
    }

    handlePageClick = (page: any) => {
        this.loadData(page.selected + 1);
    }

    render() {
        const { postList } = this.props;

        return (
            <Container>
                <BoxAnime>
                    {
                        postList ?
                            (postList && postList.data) ?
                                (postList.data.Page.pageInfo.total > 0) ?
                                    <>
                                        {
                                            postList.data.Page.media.map((v: any, i: number) => {
                                                return (
                                                    <ChildAnime key={i}>
                                                        <Link href={{ pathname: '/detail/' + v.id }}>
                                                            <a>
                                                                <CoverAnime>
                                                                    <picture>
                                                                        <img src={v.coverImage.large} alt={v.title.userPreferred} />
                                                                    </picture>
                                                                    <TitleAnime>{v.title.userPreferred}</TitleAnime>
                                                                    <EpisodeAnime><span>Episodes</span> {v.episodes}</EpisodeAnime>
                                                                </CoverAnime>
                                                            </a>
                                                        </Link>
                                                    </ChildAnime>
                                                )
                                            })
                                        }

                                        {
                                            postList.data.Page.pageInfo.lastPage > 1 &&
                                            <Paginate>
                                                <ReactPaginate
                                                    breakLabel="..."
                                                    nextLabel="Next"
                                                    forcePage={postList.data.Page.pageInfo.currentPage - 1}
                                                    onPageChange={this.handlePageClick}
                                                    marginPagesDisplayed={1}
                                                    pageRangeDisplayed={4}
                                                    pageCount={postList.data.Page.pageInfo.lastPage}
                                                    previousLabel="Previous"
                                                    disableInitialCallback={true}
                                                />
                                            </Paginate>
                                        }
                                    </>

                                    :
                                    <BoxInfo>
                                        <div className='info'>
                                            Sorry, Anime is not available
                                        </div>
                                    </BoxInfo>
                                :
                                <BoxInfo>
                                    <div className='info'>
                                        Something Wrong
                                    </div>
                                </BoxInfo>
                            :
                            <BoxInfo>
                                <div className='info'>
                                    Loading...
                                </div>
                            </BoxInfo>
                    }
                </BoxAnime>
            </Container>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        postList: state.post.postList
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        actPost: bindActionCreators(actPost, dispatch)
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(Home));