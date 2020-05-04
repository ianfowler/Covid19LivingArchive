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
import { getEssays } from "../assets/ajax";
import ReactLoading from 'react-loading';

import PageTitle from "../components/common/PageTitle";

class BlogPosts extends React.Component {
  
  async componentDidMount() {

    const essays = await getEssays();
    console.log(essays);
    this.setState({PostsList: essays});
  }

  constructor(props) {
    super(props);

    this.state = {PostsList: []};
  }

  getUI = (() => {
    if (this.state.PostsList.length == 0) {
      return (

        <Container fluid className="main-content-container px-4">
          <ReactLoading  type={'bubbles'} color={"#aaaaaa"}/>
        </Container>
      );
    }
    return (
      

        <Row>
          {this.state.PostsList.map((post, idx) => (
            <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
              <Card small className="card-post h-100">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url('${post.backgroundImage}')` }}
                />
                <CardBody>
                  <h5 className="card-title">
                    <a className="text-fiord-blue" href="#">
                      {post.title}
                    </a>
                  </h5>
                  <p className="card-text">{post.subtitle}</p>
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

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Blog Posts" subtitle="Components" className="text-sm-left" />
        </Row>
        {this.getUI()}
    </Container>
    )
    
  }
}

export default BlogPosts;

