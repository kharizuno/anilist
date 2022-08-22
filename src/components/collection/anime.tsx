import { withRouter } from 'next/router'

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { mediaQuery } from '../../graphql/media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';

import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, TextField, InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';

import * as actAnime from '../../redux/actions/anime';
import * as actCollection from '../../redux/actions/collection';

import styled from '@emotion/styled';
import moment from 'moment';

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

    &.cancel {
        background-color: #D3D3D3;
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

const AddNew = styled.div`
    margin-top: 10px;
    color: #ffbf00;
    cursor: pointer;

    span {
        display: block;
        color: #141414;
        font-size: 12px;
    }
`

const BoxAnime = styled.div`
    display: flex;
    max-height: 440px;
    margin-top: 15px;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: start;
    justify-content: start;
    overflow: auto;
`

const ContentAnime = styled.div`
    display: flex;
    flex: 0 100%;
    flex-wrap: wrap;
    flex-direction: row;

    margin: 5px 0;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;

    @media only screen and (max-width: 500px) {
        margin: 5px;
    }
`

const DetailAnime = styled.div`
    display: flex;
    flex: 0 80%;
    justify-content: space-between;

    @media only screen and (max-width: 500px) {
        flex: 0 70%;
        flex-wrap: wrap;
        flex-direction: row;
    }
`

const CoverAnime = styled.div`
    display: flex;
    flex: 0 20%;

    padding: 10px;
    height: 100px;

    picture {
        width: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    @media only screen and (max-width: 500px) {
        flex: 0 30%;
    }
`

const TitleAnime = styled.div`
    display: flex;
    flex: 0 100%;
    flex-wrap: wrap;
    flex-decoration: row;

    padding: 15px 15px 15px 0;
    font-size: 14px;

    align-items: center;
    justify-content: space-between;

    .episode {
        font-size: 12px;
    }

    @media only screen and (max-width: 500px) {
        padding: 5px;
    }
`

const SelectAnime = styled.div`
    display: flex;
    align-items: center;

    padding: 10px 25px;
    background-color: #D3D3D3;  

    cursor: pointer;
    font-size: 14px;

    &.selected {
        background-color: #ffbf00;
    }

    @media only screen and (max-width: 500px) {
        height: 30px;
        flex: 0 100%;
        padding: 0 10px;
        justify-content: right;
    }
`

interface DataProps extends PropsFromRedux {
    router: any;
    modal: boolean;
    modalClick: any;
    animeList: any;
    dataId?: number;
}

interface DataState {
    data: any;
    addNew: boolean;
    alert: boolean;
    alertType: string;
    alertMessage: string;
    formType: string;
    formData: any;
}

export class AnimeCollection extends Component<DataProps, DataState> {
    constructor(props: any) {
        super(props);

        this.state = {
            data: false,
            addNew: false,
            alert: false,
            alertType: '',
            alertMessage: '',
            formType: '',
            formData: {
                id: '',
                collection: '',
                animeSelect: [],
            }
        }
    }

    componentDidMount() {
        let data = localStorage.getItem('collection');
        this.setState({ data: (data === null) ? [] : JSON.parse(data) });
    }

    async loadData(page: number) {
        this.props.actAnime.clearAnime();

        const client = new ApolloClient({
            uri: 'https://graphql.anilist.co/',
            cache: new InMemoryCache
        });

        let variables = {
            page: page,
            perpage: 50,
            type: 'ANIME'
        }

        if (this.props.dataId) {
            Object.assign(variables, {
                id: this.props.dataId
            })
        }

        client.query({
            query: mediaQuery,
            variables: variables
        }).then((result) =>
            this.props.actAnime.loadAnime(result)
        )
    }

    modalClick() {
        this.props.modalClick();
    }

    addNew() {
        this.setState({
            formType: (this.state.addNew) ? '' : 'add',
            addNew: (this.state.addNew) ? false : true
        })
    }

    updateState(e: any) {
        let formData = this.state.formData;

        let name = e.target.name;
        let value = e.target.value;

        if (name === 'collection') {
            formData[name] = value.replace(/[^a-zA-Z0-9 ]/g, '');
        } else {
            let data: any = localStorage.getItem('collection');
            data = (data === null) ? [] : JSON.parse(data);

            let checkIdx = this.checkData(data, value);
            if (checkIdx >= 0) {
                formData.animeSelect = data[checkIdx].anime;
                if (this.props.dataId && formData.animeSelect.indexOf(this.props.dataId) < 0) {
                    formData.animeSelect.push(this.props.dataId)
                }
            }

            formData.id = value;
            this.loadData(1);
        }

        this.setState({ formData })
    }

    actionData(type?: string) {
        let formData = this.state.formData;

        let datetime: any = moment().utc();
        datetime = datetime.unix();

        let data: any = localStorage.getItem('collection');
        data = (data === null) ? [] : JSON.parse(data);

        let alertMessage = '';
        if (type === 'add') {
            let checkName = this.checkData(data, formData.collection, 'name');
            if (checkName >= 0) {
                this.setState({
                    alert: true,
                    alertType: 'error',
                    alertMessage: 'Collection name already exists'
                })
            } else {
                data.push({
                    id: datetime,
                    name: formData.collection,
                    anime: []
                })

                alertMessage = 'Collection successfullly inserted';

                this.setState({
                    data,
                    addNew: false,
                    formType: '',
                    formData: { id: '', collection: '', animeSelect: [] },
                    alert: true,
                    alertType: 'success',
                    alertMessage: alertMessage
                })

                localStorage.setItem('collection', JSON.stringify(data));
                this.props.actCollection.loadCollection(data);
            }
        } else {
            let checkIdx = this.checkData(data, formData.id);
            if (checkIdx >= 0) {
                data[checkIdx].anime = formData.animeSelect;
                alertMessage = 'Anime collection successfullly inserted';

                this.setState({
                    data,
                    addNew: false,
                    formType: '',
                    formData: { id: '', collection: '', animeSelect: [] },
                    alert: true,
                    alertType: 'success',
                    alertMessage: alertMessage
                })

                localStorage.setItem('collection', JSON.stringify(data));
                this.props.actCollection.loadCollection(data);

                // this.props.modalClick();
            }
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

    animeSelect(id: string) {
        let formData = this.state.formData;
        let idx = formData.animeSelect.indexOf(id);

        if (idx < 0) {
            formData.animeSelect.push(id);
        } else {
            formData.animeSelect.splice(idx, 1);
        }

        this.setState({ formData });
    }

    render() {
        const { animeList, modal } = this.props;
        const { data, addNew, alert, alertType, alertMessage, formType, formData } = this.state;

        return (
            <>
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
                                    addNew ?
                                        'Add Collection'
                                        :
                                        'Add Anime to Collection'
                                }
                            </ModalTitle>
                        </DialogTitle>
                        <DialogContent>
                            <ModalContent>
                                {
                                    addNew ?
                                        <TextField name='collection' value={formData.collection}
                                            label="Collection Name" variant="outlined"
                                            fullWidth onChange={(e) => this.updateState(e)} />
                                        :
                                        <>
                                            <FormControl fullWidth>
                                                <InputLabel id='collection'>Select Collection</InputLabel>
                                                <Select
                                                    name='selectCollection'
                                                    value={formData.id}
                                                    id='collection'
                                                    label='Select Collection'
                                                    onChange={(e) => this.updateState(e)}
                                                >
                                                    {
                                                        (data && data.length > 0) &&
                                                        data.map((v: any, i: number) => {
                                                            return (
                                                                <MenuItem value={v.id} key={i}>
                                                                    {v.name}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <AddNew onClick={() => this.addNew()}>
                                                <span>Collection not found?</span>
                                                Create New Collection
                                            </AddNew>

                                            {
                                                formData.id &&
                                                <BoxAnime>
                                                    {
                                                        animeList ?
                                                            (animeList && animeList.data) ?
                                                                (animeList.data.Page.pageInfo.total > 0) ?
                                                                    animeList.data.Page.media.map((v: any, i: number) => {
                                                                        let selected = formData.animeSelect.indexOf(v.id) >= 0 ? 'selected' : '';

                                                                        return (
                                                                            <ContentAnime key={i}>
                                                                                <CoverAnime>
                                                                                    <picture>
                                                                                        <img src={v.coverImage.large} alt={v.title.userPreferred} />
                                                                                    </picture>
                                                                                </CoverAnime>
                                                                                <DetailAnime>
                                                                                    <TitleAnime>
                                                                                        <div className='title'>
                                                                                            {v.title.userPreferred}
                                                                                        </div>
                                                                                        <div className='episode'>
                                                                                            Episodes {v.episodes}
                                                                                        </div>
                                                                                    </TitleAnime>
                                                                                    <SelectAnime className={selected} onClick={() => this.animeSelect(v.id)}>
                                                                                        {(selected) ? 'Selected' : 'Select'}
                                                                                    </SelectAnime>
                                                                                </DetailAnime>
                                                                            </ContentAnime>
                                                                        )
                                                                    })
                                                                    :
                                                                    'Sorry, Anime is not available'
                                                                :
                                                                'Something Wrong'
                                                            :
                                                            'Loading Data Anime...'
                                                    }
                                                </BoxAnime>
                                            }
                                        </>
                                }
                            </ModalContent>
                        </DialogContent>
                        <DialogActions>
                            <BoxButton>
                                {
                                    addNew ?
                                    <Button className='cancel' onClick={() => this.addNew()}>
                                        <FontAwesomeIcon icon={faClose} size='1x' />
                                        Cancel
                                    </Button>
                                    :
                                    <Button className='cancel' onClick={() => this.modalClick()}>
                                        <FontAwesomeIcon icon={faClose} size='1x' />
                                        Close
                                    </Button>
                                }
                                <Button onClick={() => this.actionData(formType)}>
                                    <FontAwesomeIcon icon={faSave} size='1x' />
                                    Save
                                </Button>
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
            </>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        animeList: state.anime.animeList
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        actAnime: bindActionCreators(actAnime, dispatch),
        actCollection: bindActionCreators(actCollection, dispatch)
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(AnimeCollection));