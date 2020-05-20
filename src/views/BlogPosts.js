/* eslint jsx-a11y/anchor-is-valid: 0 */
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button
} from "shards-react";
import { getEssays, isWebsite, isGoogleID} from "../assets/ajax";
import ReactLoading from 'react-loading';

import PageTitle from "../components/common/PageTitle";

class BlogPosts extends React.Component {
  state = {
    resource:null
  }

  async componentDidMount() {
    const essays = await getEssays();
    this.setState({posts: essays});
  }
   
  constructor(props) {
    super(props);
    this.state = {posts: []};
  }

  isUrl(url) {
    // var pattern = new RegExp("/(ftp|http|https):\/\/[\w#!:.?+=&%@!\-\/]*/"); // fragment locator
    const patternMatches = url.includes("http://") || url.includes("ftp://") || url.includes("https://")
    console.log(url);
    console.log(patternMatches);
    return patternMatches
  }


  handleClick(resource, author, title) {
    if (this.isUrl(resource)) {
      window.open(resource, '_blank');
    } else if (!this.isUrl(resource) && isGoogleID(resource)) { 
      this.setState({resource:resource, title:title.trim(), subtitle:author.replace('"',"").replace('"',"").trim()})
    }
  }
  getUI = (() => {
    if (this.state.posts.length == 0) {
      return (
        <Container fluid className="main-content-container px-4">
          <ReactLoading  type={'bubbles'} color={"#aaaaaa"}/>
        </Container>
      );
    } else {
      try {
        return (
          <Row>
            {this.state.posts.map((post, idx) => (
              <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
                <Card small className="card-post h-100">
                   <div
                    className="card-post__image"
                    style={{ backgroundImage: `url('${post.backgroundImage}')` }}
                  />
                  <CardBody>
                    <h5 className="card-title">
                      <a 
                        className="text-fiord-blue" 
                        // href={this.isUrl(post.resource) ? post.resource : "#"} 
                        href={"#"} 
                        onClick={this.handleClick.bind(this, post.resource, post.author, post.title)}
                        >
                        {post.title}
                      </a>
                    </h5>
                    <p className="card-text">{post.subtitle.replace('"',"").replace('"',"")}</p>
                  </CardBody> 
                  <CardFooter className="text-muted border-top py-3">
                    <span className="d-inline-block">
                      {"By " + post.author}
                    </span>
                  </CardFooter>
                </Card>
              </Col>
            ))}
          </Row>
        );
      } catch (e) {
        return (
          <Container fluid className="main-content-container px-4">
            <Row>
              <h3>Oh no! It looks like there's something messed up in the Google Sheet. Did someone break the rules?</h3>
            </Row>
          </Container>
        )
        
      }
      
    }
  })

  render() {
    console.log("Rendering")
    if (this.state.resource != null) {
      return (
        <Container fluid className="main-content-container px-4" style={{ display:"table", height:"100vh"}}>
          {/* Page Header */}
          <Row  className="page-header py-4">
              <PageTitle sm="4" title={this.state.title} subtitle={this.state.subtitle} className="text-sm-left" />
          </Row>
          <Row   className="page-header py-4" style={{margin:0, padding:0}}>
              <a className="text-fiord-blue" href="#" onClick={() => {this.setState({resource:null}) }}>{"Back"}</a>
            </Row>
          <div style={{ display:"table-row", height: "100%"}} >
            {<iframe src={"https://docs.google.com/document/d/e/"+this.state.resource+"/pub?embedded=true"}  frameBorder="no" style={{ width:"100%", height:"100%"}}></iframe>}
          </div>
        </Container>
      )
    } else {
        return (
        <Container fluid className="main-content-container px-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle sm="4" title="Blog Posts" subtitle="Covid-19 Living Archive" className="text-sm-left" />
          </Row>
          {this.getUI()}
        </Container>
      )
    }
    
    
  }
}

export default BlogPosts;

