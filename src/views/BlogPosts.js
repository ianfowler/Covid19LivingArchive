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

  getUI = (() => {
    if (this.state.posts.length == 0) {
      return (
        <Container fluid className="main-content-container px-4">

          <ReactLoading  type={'bubbles'} color={"#aaaaaa"}/>

        </Container>
      );
    }
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
                    
                    <a className="text-fiord-blue" href={isWebsite(post.resource) ? post.resource : "#"} onClick={() => {
                      if (isWebsite(post.resource)) {

                      } else if (isGoogleID(post.resource)) {
                        this.setState({resource:post.resource, title:post.title, subtitle:post.subtitle.replace('"',"").replace('"',"")})
                      }


                      
                      }}>
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
  })
  // resource:"2PACX-1vQBfwkjz4dSf0hg6wgQ7M2f184a4KcH_tm_qL2dV6aCIks30xPzb4DAxyu8TmmBNapE2QzGhBpYMskq"

  render() {
    console.log(this.state)
    if (this.state.resource != null) {
      return (
        <Container fluid className="main-content-container px-4" style={{ height:"100%",scrolling:"no" }}>
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
              <PageTitle sm="4" title={this.state.title} subtitle={this.state.subtitle} className="text-sm-left" />
          </Row>
          <Row  noGutters className="page-header py-4" style={{margin:0, padding:0}}>
              <a className="text-fiord-blue" href="#" onClick={() => {this.setState({resource:null}) }}>{"Back"}</a>
            </Row>
          <Row noGutters style={{ flex:1, height:"100%", border:"none", margin:0, padding:0, scrolling:"no"}} >
            {<iframe src={"https://docs.google.com/document/d/e/"+this.state.resource+"/pub?embedded=true"} style={{ flex:1, border:"none", margin:0, padding:0}} ></iframe>}
          </Row>
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

