import { withRouter } from 'next/router'
import Link from 'next/link';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons';

import styled from '@emotion/styled';
import AnimeCollection from '../collection/anime';

const Container = styled.div`
    background-color: #141414;
    width: 100%;
    height: 64px;
    padding: 0 20px;

    @media only screen and (max-width: 768px) {
        height: 54px;
        padding: 0 10px;
    }

    @media only screen and (max-width: 650px) {
        height: 44px;
        adding: 0 8px;
    }
`;

const MainNav = styled.div`
    display: flex;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
`

const Nav1 = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const NavChild1 = styled.div`
    display: flex;
    color: #fff;
    padding: 0 15px;
    cursor: pointer;

    svg {
        color: #ffbf00;

        margin-right: 10px;
        width: 18px;
        height: 18px;
    }

    &.active {
        color: #ffbf00;
    }

    @media only screen and (max-width: 768px) {
        padding: 0 10px;
        font-size: 15px;

        svg {
            margin-right: 8px;
        }
    }

    @media only screen and (max-width: 650px) {
        font-size: 12px;

        svg {
            margin-right: 5px;
            width: 15px;
            height: 15px;
        }
    }
`

const Nav = (props: any) => {
    const [modal, setModal] = useState(false);
    const collection = () => {
        setModal((modal) ? false : true);
    }

    return (
        <Container>
            <MainNav>
                <Nav1>
                    <NavChild1 className={(props.router.route === '/') ? 'active' : ''}>
                        <Link href={{ pathname: '/' }}>
                            <a>Home</a>
                        </Link>
                    </NavChild1>
                    <NavChild1 className={(props.router.route.indexOf('/collection') >= 0) ? 'active' : ''}>
                        <Link href={{ pathname: '/collection' }}>
                            <a>
                                My Collection
                            </a>
                        </Link>
                    </NavChild1>
                </Nav1>
                <Nav1>
                    <NavChild1 onClick={() => collection()}>
                        <FontAwesomeIcon icon={faAdd} size='1x' />
                        Anime Collection
                    </NavChild1>
                </Nav1>
            </MainNav>

            {
                modal &&
                <AnimeCollection modal={modal} modalClick={() => collection()}/>
            }
        </Container>
    )
}

export default withRouter(Nav);