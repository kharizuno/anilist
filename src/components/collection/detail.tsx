import { withRouter } from 'next/router'
import Link from 'next/link';

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { mediaQuery } from '../../graphql/media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';

import * as actPost from '../../redux/actions/post';
import * as actCollection from '../../redux/actions/collection';

import styled from '@emotion/styled';
import moment from 'moment';

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

const BoxButton = styled.div`
    display: flex;
    flex-direction: row;
`

const Button = styled.button`
    display: flex;
    background-color: #ffbf00;
    margin: 10px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #fff;
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
    cursor: pointer;
    
    &.delete {
        color: #fff;
        background-color: rgb(211, 47, 47);
    }

    svg {
        margin-right: 5px;
        width: 15px;
        height: 15px;
    }
`

const ModalTitle = styled.div`
    font-size: 16px;
    text-transform: Capitalize;

    .delete {
        text-transform: none;
    }
`

const ModalContent = styled.div`
    margin: 15px 0;
`;

const BoxCollect = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: start;
`

const ChildCollect = styled.div`
    position: relative;
    display: flex;
    flex: 0 100%;
`

const CoverCollect = styled.div`
    width: 100%;
    background-color: #fff;

    margin: 10px;
    padding: 10px;

    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
    transition: all 0.2s ease;

    img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
    }

    @media only screen and (max-width: 768px) {
        margin: 5px;
    }
`

const TitleCollect = styled.div`

    color: #141414;
    margin: 5px 10px;
    margin-top: 20px;

    @media only screen and (max-width: 550px) {
        font-size: 14px;
    }
`

const AnimeCollect = styled.div`
    color: #141414;
    margin: 0 10px;
    margin-bottom: 15px;
    font-size: 12px;

    @media only screen and (max-width: 550px) {
        font-size: 10px;
    }
`

const BoxAction = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
`

const BtnAction = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: end;
    margin: 30px 30px;

    &.leftPosition {
        justify-content: start;
    }
`

const BtnIcon = styled.div`
    display: flex;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
    cursor: pointer;

    &.edit {
        background-color: rgb(245, 124, 0);
        margin-right: 5px;
    }
    
    &.delete {
        background-color: rgb(211, 47, 47);
    }

    svg {
        width: 15px;
        height: 15px;
        color: #fff;
        font-size: 14px;
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
    position: relative;
    display: flex;
    flex: 0 20%;

    a {
        margin: 10px;
    }

    @media only screen and (max-width: 992px) {
        flex: 0 33.33%;
    }

    @media only screen and (max-width: 768px) {
        a {
            margin: 5px;
        }
    }

    @media only screen and (max-width: 650px) {
        a {
            margin: 3px;
        }
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
        padding: 8px;
    }

    @media only screen and (max-width: 650px) {
        height: 280px;
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
    collectionList: any;
}

interface DataState {
    data: any;
    modal: boolean;
    alert: boolean;
    alertType: string;
    alertMessage: string;
    formType: string;
    formData: any;
    animeDelete: any;
}

export class Collection extends Component<DataProps, DataState> {
    constructor(props: any) {
        super(props);

        this.state = {
            data: false,
            modal: false,
            alert: false,
            alertType: '',
            alertMessage: '',
            formType: '',
            formData: {
                id: '',
                collection: '',
            },
            animeDelete: {
                id: '',
                name: '',
            }
        }
    }

    componentDidMount() {
        this.loadCollection();
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.router != prevProps.router) {
            this.loadCollection();
        }

        if (this.props.collectionList) {
            this.props.actCollection.clearCollection();
            this.loadCollection();
        }
    }

    loadCollection() {
        let data: any = localStorage.getItem('collection');
        data = (data === null) ? [] : JSON.parse(data);

        let router = this.props.router;
        let query = router.query;

        let id = parseInt(query.id);
        let idx = this.checkData(data, id);

        if (idx >= 0) {
            let formData = {
                id: data[idx].id,
                collection: data[idx].name,
                anime: data[idx].anime
            }

            data = [data[idx]];
            this.setState({ data, formData });

            let _this = this;
            setTimeout(() => {
                _this.loadData(1);
            }, 100)
        }
    }

    async loadData(page: number) {
        this.props.actPost.clearPost();

        const client = new ApolloClient({
            uri: 'https://graphql.anilist.co/',
            cache: new InMemoryCache
        });

        let variables = {
            page: page,
            perpage: 10,
            type: 'ANIME'
        };

        if (this.state.data.length > 0) {
            Object.assign(variables, { idIn: this.state.data[0].anime });
        }

        client.query({
            query: mediaQuery,
            variables: variables
        }).then((result) =>
            this.props.actPost.loadPost(result)
        )
    }

    handlePageClick = (page: any) => {
        this.loadData(page.selected + 1);
    }

    modalClick(type?: string, dt?: any) {
        let state = {
            formType: (type) ? type : '',
            modal: (this.state.modal) ? false : true
        };

        if (dt) {
            let animeDelete = this.state.animeDelete;
            animeDelete.id = dt.id;
            animeDelete.name = dt.title.userPreferred;

            Object.assign(state, {
                animeDelete
            })
        }

        this.setState(state)
    }

    updateState(e: any) {
        let formData = this.state.formData;

        let name = e.target.name;
        let value = e.target.value;

        formData[name] = value.replace(/[^a-zA-Z0-9 ]/g, '');

        this.setState({ formData })
    }

    actionData(type?: string) {
        let formData = this.state.formData;

        let datetime: any = moment().utc();
        datetime = datetime.unix();

        let data: any = localStorage.getItem('collection');
        data = (data === null) ? [] : JSON.parse(data);

        let checkIndex = this.checkData(data, formData.id);
        let checkName = this.checkData(data, formData.collection, 'name');

        if (checkIndex === checkName) checkName = -1;

        if (checkName >= 0) {
            this.setState({
                alert: true,
                alertType: 'error',
                alertMessage: 'Collection name already exists'
            })
        } else {
            let alertMessage = '';
            if (checkIndex >= 0) {
                data[checkIndex].name = formData.collection
                alertMessage = 'Collection successfullly updated';
            }

            this.setState({
                data: [data[checkIndex]],
                modal: false,
                alert: true,
                alertType: 'success',
                alertMessage: alertMessage
            })

            localStorage.setItem('collection', JSON.stringify(data));
        }

        let _this = this;
        setTimeout(() => {
            _this.setState({
                alert: false
            })
        }, 6000)
    }

    checkData(arr: any, value: any, field?: string) {
        return arr.indexOf(
            arr.filter((v: any) => {
                if (field === 'name') {
                    return v.name.toLowerCase() === value.toLowerCase();
                } else {
                    return v.id === value;
                }
            })[0]
        );
    }

    animeRemove() {
        let formData = this.state.formData;
        let animeDelete = this.state.animeDelete;

        let data: any = localStorage.getItem('collection');
        data = (data === null) ? [] : JSON.parse(data);

        let idx = this.checkData(data, formData.id);
        if (idx >= 0) {
            let animeIndex = data[idx].anime.indexOf(animeDelete.id);
            if (animeIndex >= 0) {
                data[idx].anime.splice(animeIndex, 1);
                formData.anime = data[idx].anime;

                this.setState({
                    data: [data[idx]],
                    modal: false,
                    formData,
                    alert: true,
                    alertType: 'success',
                    alertMessage: 'Anime collection successfully deleted'
                })

                localStorage.setItem('collection', JSON.stringify(data));

                let postList = this.props.postList;
                let newList: any = [];
                postList.data.Page.media.map((v: any) => {
                    if (v.id !== animeDelete.id) {
                        newList.push(v);
                    }
                })

                postList = {
                    data: {
                        Page: {
                            pageInfo: postList.data.Page.pageInfo,
                            media: newList
                        }
                    }
                }
                this.props.actPost.loadPost(postList);
            }
        }
    }

    render() {
        const { postList } = this.props;
        const { data, modal, alert, alertType, alertMessage, formType, formData, animeDelete } = this.state;

        return (
            <Container>
                {
                    (data) ?
                        <>
                            {
                                (data.length > 0) ?
                                    <>
                                        <BoxCollect>
                                            {
                                                data.map((v: any, i: number) => {
                                                    return (
                                                        <ChildCollect key={i}>
                                                            <CoverCollect>
                                                                <Link href={{ pathname: '/collection/' + v.id }}>
                                                                    <a>
                                                                        <picture>
                                                                            <img src='/collection.jpeg' alt='collection' />
                                                                        </picture>
                                                                        <TitleCollect>{v.name}</TitleCollect>
                                                                        <AnimeCollect>{v.anime.length} Animes</AnimeCollect>
                                                                    </a>
                                                                </Link>

                                                                <BoxAction>
                                                                    <BtnAction>
                                                                        <BtnIcon className='edit' onClick={() => this.modalClick('edit')}>
                                                                            <FontAwesomeIcon icon={faEdit} size='1x' />
                                                                        </BtnIcon>
                                                                    </BtnAction>
                                                                </BoxAction>
                                                            </CoverCollect>
                                                        </ChildCollect>
                                                    )
                                                })
                                            }
                                        </BoxCollect>
                                    </>
                                    :
                                    <BoxInfo>
                                        <div className='info'>
                                            Create your first collection
                                        </div>
                                    </BoxInfo>
                            }
                        </>
                        :
                        <BoxInfo>
                            <div className='info'>
                                Loading...
                            </div>
                        </BoxInfo>
                }

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

                                                        <BoxAction>
                                                            <BtnAction className='leftPosition'>
                                                                <BtnIcon className='delete' onClick={() => this.modalClick('delete', v)}>
                                                                    <FontAwesomeIcon icon={faTrash} size='1x' />
                                                                </BtnIcon>
                                                            </BtnAction>
                                                        </BoxAction>
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

                {
                    modal &&
                    <Dialog
                        fullWidth={true}
                        aria-labelledby="customized-dialog-title"
                        onClose={() => this.modalClick()}
                        open={modal}
                    >
                        <DialogTitle>
                            <ModalTitle>
                                {
                                    formType !== 'delete' ?
                                        `${formType} Collection`
                                        :
                                        <div className='delete'>
                                            {`Do you want to delete this anime "${animeDelete.name}"?`}
                                        </div>
                                }
                            </ModalTitle>
                        </DialogTitle>
                        {
                            formType !== 'delete' &&
                            <DialogContent>
                                <ModalContent>
                                    <TextField name='collection' value={formData.collection}
                                        label="Collection Name" variant="outlined"
                                        fullWidth onChange={(e) => this.updateState(e)} />
                                </ModalContent>
                            </DialogContent>
                        }
                        <DialogActions>
                            <BoxButton>
                                {
                                    formType === 'delete' ?
                                        <Button className='delete' onClick={() => this.animeRemove()}>
                                            <FontAwesomeIcon icon={faTrash} size='1x' />
                                            Delete
                                        </Button>
                                        :
                                        <Button onClick={() => this.actionData(formType)}>
                                            <FontAwesomeIcon icon={faSave} size='1x' />
                                            {(formType === 'add') ? 'Save' : 'Update'}
                                        </Button>
                                }
                            </BoxButton>
                        </DialogActions>
                    </Dialog>
                }

                {
                    alert &&
                    <Snackbar
                        open={alert}
                        autoHideDuration={6000}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert severity={(alertType === 'error') ? 'error' : 'success'} variant='filled'>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                }
            </Container>
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

export default connector(withRouter(Collection));