import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, FormSelect} from "shards-react";
import ls from 'local-storage'

import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import UsersOverview from "../components/blog/UsersOverview";
import UsersByDevice from "../components/blog/UsersByDevice";
import TopReferrals from "../components/common/TopReferrals";
import { getSummary, refreshSummary } from "../assets/ajax";
import ReactLoading from 'react-loading';
import Select from 'react-select'


class BlogOverview extends React.Component { 
  static propTypes = {
    smallStats: PropTypes.array
  };

  state = {
    overview: null,
    country: 'World',
    countries: null,
    // pie: null,
    // table: null,
    // pieCutoff: 5,
    // tableCutoff: 12,
    focus: ["Total Confirmed", "Total Deaths", "Total Recovered"]//, "New Confirmed Cases", "New Deaths", "New Recoveries"]
  };

  async componentDidMount() {
    var ct = ls.get('country') || null
    if (ct === null) {
      ct = "World"
      ls.set('country', ct)
    }

    const ov = await getSummary();
    try {
      const cts = ov["Countries"].map(x => x["Country"])
      this.setState({overview:ov, countries: cts, country: ct}) 
    } catch (e) {
      
    }
  };

  getSelectedCountryData() {
    if (this.state.country === "World") {
      return this.state.overview["Global"]
    }
    return this.state.overview["Countries"].filter(obj => {
      return obj["Country"] === this.state.country
    })[0]
    
  }

  async yourChangeHandler(event) {
    const ct = event.target.value
    ls.set('country', ct)
    const ov = await getSummary();
    this.setState({overview: Object.assign([], ov), country: ct})
    window.location.reload(false)
  }

  async handleChange(selectedOption) {
    const ct = selectedOption.value
    ls.set('country', ct)
    const ov = await getSummary();
    this.setState({overview: Object.assign([], ov), country: ct})
    window.location.reload(false)

  }

  getTop() {
    const ov = this.state.overview
    if (ov && this.state.countries.length > 0 && Object.keys(ov).length > 0) {
      return (
        <div>
        <Row noGutters className="pb-4">
            <div style={{width: '300px', zIndex: 2}}>
              <Select placeholder={this.state.country} value={this.state.country} style={{ width: 42}} onChange={this.handleChange.bind(this)} options={this.state.countries.map((c, idx) => ({value: c, key:idx, label: c === "US" ? "United States" : c}))}/>
            </div>
        </Row>
        <Row>
              {this.state.focus.map((f, idx) => (
                <Col className="col-lg mb-4" key={idx}>
                  <SmallStats
                    id={`small-stats-${idx}`}
                    variation="1"
                    label={f}
                    value={this.getSelectedCountryData()[f.replace(" ","")]}
                    percentage={this.getSelectedCountryData()[f.replace(" ","").replace("Total","New")]}
                   />
                </Col>
              ))}
            </Row> </div>
      )
    }
    
  }


  // async refresh() {
  //   refreshSummary()
  //   const summary = await getSummary()
  //   if (summary) {
  //     const cts = summary["Countries"].map(x => x["Country"])
  //     BlogOverview.setState({overview:summary, countries: cts}) 
  //   }
   
  // }
  render() {


      return (
        <Container fluid className="main-content-container px-4">
          {/* Page Header */}
          <Row noGutters  className="page-header py-4">
            <PageTitle title="COVID-19 Tracker" subtitle="Daily Updates" className="text-sm-left mb-3" />
            
          </Row>
          

          {this.getTop()}

          {/* <button onClick={this.refresh}>
            Activate Lasers
          </button> */}
    
          <Row style={{flex:1}}>
          
            {/* Users Overview */}
            <Col style={{flex:1}}>
            <iframe style={{flex:1 }} width="100%"  height="390%" frameBorder="0" scrolling="no" 
    marginHeight="0" marginWidth="0" title="2019-nCoV" 
    src="//arcgis.com/apps/Embed/index.html?webmap=14aa9e5660cf42b5b4b546dec6ceec7c&extent=77.3846,11.535,163.5174,52.8632&zoom=true&previewImage=false&scale=true&disable_scroll=true&theme=light"
  ></iframe>
            <a>{"Credit: Johns Hopkins University"}</a>
            </Col>
            
          </Row>
        </Container>
      );
    
    }

  
}

export default BlogOverview;
