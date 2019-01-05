/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
const MarkdownBlock = CompLibrary.MarkdownBlock /* Used to read markdown */
const Container = CompLibrary.Container
const GridBlock = CompLibrary.GridBlock

const siteConfig = require(process.cwd() + '/siteConfig.js')

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a
          className="button home-page-button"
          href={this.props.href}
          target={this.props.target}
        >
          {this.props.children}
        </a>
      </div>
    )
  }
}

Button.defaultProps = {
  target: '_self'
}

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
)

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
)

const ProjectTitle = props => (
  <h2 className="projectTitle">
    <img src="img/logo_blue.svg" style={{ height: '1.3em' }} />{' '}
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
)

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
)

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || ''
    return (
      <SplashContainer>
        {/* <Logo img_src={imgUrl('sqorn.svg')} /> */}
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            {/* <Button href="#try">Try It Out</Button> */}
            <Button href={'https://github.com/sqorn/sqorn'}>Github</Button>
            <Button href={docUrl('about.html', language)}>Documentation</Button>
            <Button href={'demo.html'}>Demo</Button>
            {/* <Button href={docUrl('examples.html', language)}>Examples</Button> */}
            {/* <Button href={docUrl('demo.html', language)}>Demo</Button> */}
            <Button href={'benchmarks.html'}>Benchmarks</Button>
            {/* <Button href={docUrl('benchmarks.html', language)}>
              Benchmarks
            </Button> */}
          </PromoSection>
        </div>
      </SplashContainer>
    )
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
)

const queries = [
  {
    sq: "sq.from`person`({ firstName: 'Rob' })`id`",
    text: "select id from person where first_name = 'Rob'"
  }
]

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        // image: imgUrl('docusaurus.svg'),
        title: 'Boilerplate-Free',
        imageAlign: 'top',
        content: `CRUD operations are dead simple

${'```js'}
${'const Person = sq.from`person`, Book = sq.from`book`'}

// SELECT
${'const children = await Person`age < ${13}`'}
"select * from person where age < 13"

// DELETE
${'const [deleted] = await Book({ id: 7 })`title`.delete'}
"delete from book where id = 7 returning title"

// INSERT
${"await Person.insert({ firstName: 'Rob' })"}
"insert into person (first_name) values ('Rob')"

// UPDATE
${"await Person({ id: 23 }).set({ name: 'Rob' })"}
"update person where id = 23 set name = 'Rob'"

// RAW
sq.sql\`select * from book where id = \${8}\`
"select * from book where id = 8"
${'```'}
`
      },
      {
        title: 'Composable',
        // image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        content: `Build complex queries from simple parts
${'```js'}
// CHAIN QUERIES
sq.from\`book\`
  .return\`distinct author\`
  .where({ genre: 'Fantasy' })
  .where({ language: 'French' })
"select distinct author from book \\
 where language = 'French' and genre = 'Fantasy'"

// EXTEND QUERIES
sq.extend(
  sq.from\`book\`,
  sq.return\`distinct author\`,
  sq.where({ genre: 'Fantasy' }),
  sq.where({ language: 'French' })
)
"select distinct author from book \\
 where language = 'French' and genre = 'Fantasy'"

// EMBED Queries
sq.return\`now() today, (\${sq.return\`now() + '1 day'\`}) tomorrow\`
"select now() today, (select now() + '1 day') tomorrow"
${'```'}
`
      }
    ]}
  </Block>
)

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}
  >
    <h2>Features</h2>
    <ul style={{ margin: 'auto', fontSize: '1.15em' }}>
      {[
        'Simple, Consistent, Ergonomic API',
        'Composable, Immutable, Extendable Query Builder',
        'Boilerplate Free',
        'Fast - 10x faster than Knex.js',
        'Secure Parameterized Queries',
        'Typescript Declarations',
        'Supports Postgres',
        'Transactions'
      ].map(feature => (
        <li style={{ textAlign: 'left' }}>{feature}</li>
      ))}
    </ul>
  </div>
)

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: 'Talk about learning how to use this',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Learn How'
      }
    ]}
  </Block>
)

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: 'Talk about trying this out',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'left',
        title: 'Try it Out'
      }
    ]}
  </Block>
)

const Description = props => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Description'
      }
    ]}
  </Block>
)

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      )
    })

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  )
}

class Index extends React.Component {
  render() {
    let language = this.props.language || ''

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer" style={{ paddingTop: 0 }}>
          <Features />
          <FeatureCallout />
          {/* <LearnHow />
          <TryOut />
          <Description /> */}
          {/* <Showcase language={language} /> */}
        </div>
      </div>
    )
  }
}

module.exports = Index
