import type { NextPage } from 'next'
import Head from 'next/head'

type MetaData = {
    title?: string,
    keywords?: string,
    description?: string
}

const Meta: NextPage<MetaData> = ({title, keywords, description}) => {
    return (
        <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1'/>
            <meta name='keywords' content={keywords}/>
            <meta name='description' content={description}/>
            <meta charSet='utf-8'/>
            <link rel='icon' href='/favicon.ico'/>
            <title>{title}</title>
        </Head>
    )
}

Meta.defaultProps = {
    title: 'Anime Collection',
    keywords: 'Anime Collection',
    description: 'Anime Collection'
}

export default Meta;
