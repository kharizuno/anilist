import { withRouter } from 'next/router'
import Link from 'next/link';

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import * as actPost from '../../redux/actions/post';
import * as actCollection from '../../redux/actions/collection';

import AnimeCollection from '../collection/anime';
import HTMLReactParser from 'html-react-parser';
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

const HeaderBanner = styled.div<DataStyle>`
    position: relative;
    width: 100%;
    height: 400px;
    background: url(${(props: any) => props.src}) no-repeat;
    background-position: center center;
    background-size: cover;
    box-shadow: rgba(0, 0, 0, 0.5) 0px -150px 150px -35px inset;

    .collection {
        position: absolute;
        bottom: 8%;
        right: 8%;

        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid #fff;
        background-color: rgb(211, 47, 47);

        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        svg {
            color: #fff;
            font-size: 20px;
            width: 22px;
            height: 22px;
        }

        &.active,
        :hover {
            border: 2px solid rgb(211, 47, 47);
            background-color: #fff;

            svg {
                color: rgb(211, 47, 47);
            }
        }
    }

    @media only screen and (max-width: 992px) {
        height: 200px;
    }

    @media only screen and (max-width: 500px) {
        height: 150px;

        .collection {
            width: 40px;
            height: 40px;

            svg {
                font-size: 16px;
                width: 15px;
                height: 15px;
            }
        }
    }
`

const CoverAnime = styled.div`
    display: flex;
    flex: 0 20%;

    img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 8px;
    }

    @media only screen and (max-width: 992px) {
        display: none;
    }
`;

const DetailAnime = styled.div`
    display: flex;
    flex: 0 80%;
    flex-wrap: wrap;
    flex-direction: row;

    @media only screen and (max-width: 992px) {
        flex: 0 100%;
    }
`;

const TitleAnime = styled.h1`
    flex: 0 100%;
    font-size: 18px;
    color: rgba(92,114,138);
    margin: 15px;
`

const DescAnime = styled.p`
    font-size: 14px;
    color: rgba(92,114,138);
    margin: 0px 15px 15px 15px;
    line-height: 20px;
`

const SideAnime = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    width: 100%;
    margin: 15px;

    .detail {
        display: flex;
        flex: 0 20%;
        flex-wrap: wrap;
        flex-direction: row;
        

        font-size: 14px;
        color: rgba(92,114,138);
        margin: 15px 0;

        .title {
            flex: 0 100%;
            font-size: 14px;
            font-weight: bold;
        }
    }

    @media only screen and (max-width: 600px) {
        .detail {
            flex: 0 33.33%;
        }
    }

    @media only screen and (max-width: 500px) {
        .detail {
            flex: 0 50%;
        }
    }
`

const Collection = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 15px;

    .title {
        flex: 0 100%;
        color: rgba(92,114,138);
        margin-bottom: 10px;
    }

    .tag {
        margin: 4px;
        padding: 8px;
        font-size: 12px;
        background-color: #ffbf00;
        border-radius: 6px;
    }
`

const CharAnime = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    width: 100%;
    margin: 15px 0;

    .title {
        display: flex;
        flex: 0 100%;
        color: rgba(92,114,138);
        margin: 0 15px;
    }
`

const CharChild = styled.div`
    display: flex;
    flex: 0 33.33%;

    @media only screen and (max-width: 1100px) {
        flex: 0 50%;
    }

    @media only screen and (max-width: 768px) {
        flex: 0 100%;
    }
`

const CharCard = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-decoration: row;
    justify-content: space-between;

    width: 100%;
    margin: 10px;

    background-color: #fff;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;

    img {
        display: flex;
        flex: 0 20%;
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;

        @media only screen and (max-width: 768px) {
            height: 130px;
        }

        @media only screen and (max-width: 600px) {
            height: 100px;
        }
    }

    .desc {
        display: flex;
        flex: 0 28%;
        align-items: center;
        justify-content: start;

        color: rgba(92,114,138);
        font-size: 14px;

        &.right {
            text-align: right;
            align-items: center;
            justify-content: end;
        }

        .detail {
            margin: 5px;

            span {
                display: block;
                font-size: 12px;
                text-transform: Capitalize;
            }
        }
    }
`

interface DataStyle {
    src: string;
}

interface DataProps extends PropsFromRedux {
    router: any;
    postList: any;
    collectionList: any;
}

interface DataState {
    data: any;
    modal: boolean;
}

export class Anime extends Component<DataProps, DataState> {
    constructor(props: any) {
        super(props);

        this.state = {
            data: false,
            modal: false
        }
    }

    componentDidMount() {
        let data = localStorage.getItem('collection');
        this.setState({ data: (data === null) ? [] : JSON.parse(data) });
    }

    componentDidUpdate() {
        if (this.props.collectionList) {
            this.props.actCollection.clearCollection();

            let data = localStorage.getItem('collection');
            this.setState({ data: (data === null) ? [] : JSON.parse(data) });
        }
    }

    collection() {
        this.setState({ modal: (this.state.modal) ? false : true });
    }

    render() {
        const { postList } = this.props;
        const { data, modal } = this.state;

        let idx: number = 0;
        if (postList && postList.data && postList.data.Page.pageInfo.total > 0) {
            idx = postList.data.Page.media[0].id;
        }

        let collection: any = [];
        if (data.length > 0) {
            data.map((v: any) => {
                if (v.anime.indexOf(idx) >= 0) {
                    collection.push(v);
                }
            })
        }

        return (
            <>
                {
                    postList ?
                        (postList && postList.data) ?
                            (postList.data.Page.pageInfo.total > 0) ?
                                <>
                                    {
                                        postList.data.Page.media.map((v: any, i: number) => {
                                            return (
                                                <section key={i}>
                                                    <HeaderBanner src={v.bannerImage}>
                                                        <div className={(collection.length > 0) ? 'collection active' : 'collection'} onClick={() => this.collection()}>
                                                            <FontAwesomeIcon icon={faHeart} size='1x' />
                                                        </div>
                                                    </HeaderBanner>
                                                    <Container>
                                                        <BoxAnime>
                                                            <CoverAnime>
                                                                <picture>
                                                                    <img src={v.coverImage.large} alt={v.title.userPreferred} />
                                                                </picture>
                                                            </CoverAnime>
                                                            <DetailAnime>
                                                                <TitleAnime>{v.title.userPreferred}</TitleAnime>
                                                                <DescAnime>{HTMLReactParser((v.description) ? v.description : '')}</DescAnime>

                                                                <SideAnime>
                                                                    <div className='detail'>
                                                                        <div className='title'>Format</div>
                                                                        {v.format}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Episodes</div>
                                                                        {v.episodes}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Episode Duration</div>
                                                                        {v.duration}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Status</div>
                                                                        {v.status}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Season</div>
                                                                        {v.season}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Average Score</div>
                                                                        {v.averageScore} %
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Mean Score</div>
                                                                        {v.meanScore} %
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Popularity</div>
                                                                        {v.popularity}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Favourites</div>
                                                                        {v.favourites}
                                                                    </div>
                                                                    <div className='detail'>
                                                                        <div className='title'>Genre</div>
                                                                        {v.genres.join(', ')}
                                                                    </div>
                                                                </SideAnime>

                                                                {
                                                                    collection.length > 0 &&
                                                                    <Collection>
                                                                        <div className='title'>Your Collections</div>
                                                                        {
                                                                            collection.map((v1: any, i1: number) => {
                                                                                return (
                                                                                    <Link href={{pathname: '/collection/' + v1.id}} key={i1}>
                                                                                        <a>
                                                                                            <div className='tag'>
                                                                                                {v1.name}
                                                                                            </div>
                                                                                        </a>
                                                                                    </Link>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Collection>
                                                                }
                                                            </DetailAnime>
                                                            <CharAnime>
                                                                <div className='title'>Characters</div>
                                                                {
                                                                    (v.characterPreview && v.characterPreview.edges) &&
                                                                    v.characterPreview.edges.map((v1: any, i1: number) => {
                                                                        return (
                                                                            <CharChild key={i1}>
                                                                                <CharCard>
                                                                                    <picture>
                                                                                        <img src={v1.node.image.large} alt={v1.node.name.userPreferred} />
                                                                                    </picture>
                                                                                    <div className='desc'>
                                                                                        <div className='detail'>
                                                                                            {v1.node.name.userPreferred}
                                                                                            <span>{v1.role}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='desc right'>
                                                                                        <div className='detail'>
                                                                                            {v1.voiceActors[0].name.userPreferred}
                                                                                            <span>{v1.voiceActors[0].language}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <picture>
                                                                                        <img src={v1.voiceActors[0].image.large} alt={v1.voiceActors[0].name.userPreferred} />
                                                                                    </picture>
                                                                                </CharCard>
                                                                            </CharChild>
                                                                        )
                                                                    })
                                                                }
                                                            </CharAnime>
                                                        </BoxAnime>
                                                    </Container>
                                                </section>
                                            )
                                        })
                                    }
                                </>

                                :
                                <Container>
                                    <BoxInfo>
                                        <div className='info'>
                                            Sorry, Anime is not available
                                        </div>
                                    </BoxInfo>
                                </Container>
                            :
                            <Container>
                                <BoxInfo>
                                    <div className='info'>
                                        Something Wrong
                                    </div>
                                </BoxInfo>
                            </Container>
                        :
                        <Container>
                            <BoxInfo>
                                <div className='info'>
                                    Loading...
                                </div>
                            </BoxInfo>
                        </Container>
                }

                {
                    modal &&
                    <AnimeCollection modal={modal} modalClick={() => this.collection()} dataId={idx} />
                }
            </>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        postList: state.post.postList,
        collectionList: state.collection.collectionList
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        actPost: bindActionCreators(actPost, dispatch),
        actCollection: bindActionCreators(actCollection, dispatch)
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(Anime));