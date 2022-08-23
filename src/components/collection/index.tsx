import { withRouter } from 'next/router'
import Link from 'next/link';

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { mediaQuery } from '../../graphql/media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faSave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
    margin-bottom: 20px;
`

const ChildCollect = styled.div`
    position: relative;
    display: flex;
    flex: 0 33.33%;

    @media only screen and (max-width: 768px) {
        flex: 0 50%;
    }

    @media only screen and (max-width: 550px) {
        flex: 0 100%;
    }
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
        color: #fff;
        font-size: 14px;
        width: 15px;
        height: 15px;
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
            }
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

    async loadData() {
        this.props.actPost.clearPost();

        const client = new ApolloClient({
            uri: 'https://graphql.anilist.co/',
            cache: new InMemoryCache
        });


        client.query({
            query: mediaQuery,
            variables: {
                page: 1,
                perpage: 10,
                type: 'ANIME'
            }
        }).then((result) =>
            this.props.actPost.loadPost(result)
        )
    }

    modalClick(type?: string, dt?: any) {
        let state = {
            formType: (type) ? type : '',
            formData: {
                id: '',
                collection: '',
            },
            modal: (this.state.modal) ? false : true
        };

        if (dt) {
            state.formData.id = dt.id;
            state.formData.collection = dt.name;
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

    deleteData() {
        let formData = this.state.formData;

        let data: any = localStorage.getItem('collection');
        data = (data === null) ? [] : JSON.parse(data);

        let idx = this.checkData(data, formData.id);
        if (idx >= 0) {
            data.splice(idx, 1);

            this.setState({
                data,
                modal: false,
                formData: { id: '', collection: '' },
                alert: true,
                alertType: 'success',
                alertMessage: 'Collection successfully deleted'
            })

            localStorage.setItem('collection', JSON.stringify(data));
        }
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
            if (type === 'add') {
                data.push({
                    id: datetime,
                    name: formData.collection,
                    anime: []
                })

                alertMessage = 'Collection successfullly inserted';
            } else {
                if (checkIndex >= 0) {
                    data[checkIndex].name = formData.collection
                    alertMessage = 'Collection successfullly updated';
                }
            }

            this.setState({
                data,
                modal: false,
                formData: { id: '', collection: '' },
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

    render() {
        const { postList } = this.props;
        const { data, modal, alert, alertType, alertMessage, formType, formData } = this.state;

        return (
            <Container>
                {
                    (data) ?
                        <>
                            <BoxButton>
                                <Button onClick={() => this.modalClick('add')}>
                                    <FontAwesomeIcon icon={faAdd} size='1x' />
                                    Add Collection
                                </Button>
                            </BoxButton>
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
                                                                        <BtnIcon className='edit' onClick={() => this.modalClick('edit', v)}>
                                                                            <FontAwesomeIcon icon={faEdit} size='1x' />
                                                                        </BtnIcon>
                                                                        <BtnIcon className='delete' onClick={() => this.modalClick('delete', v)}>
                                                                            <FontAwesomeIcon icon={faTrash} size='1x' />
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
                                            {`Do you want to delete this collection "${formData.collection}"?`}
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
                                        <Button className='delete' onClick={() => this.deleteData()}>
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