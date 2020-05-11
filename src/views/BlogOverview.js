import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, FormSelect} from "shards-react";
import ls from 'local-storage'

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
import UsersOverview from "./../components/blog/UsersOverview";
import UsersByDevice from "./../components/blog/UsersByDevice";
import TopReferrals from "./../components/common/TopReferrals";
import { getGlobalArr, updateDataIfNecessary, getCountriesList, getPie} from "../assets/ajax";
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
    pie: null,
    table: null,
    pieCutoff: 5,
    tableCutoff: 12,
    focus: ["Total Confirmed Cases", "Total Deaths", "Total Recoveries"]//, "New Confirmed Cases", "New Deaths", "New Recoveries"]
  };

  async componentDidMount() {
    var ct = ls.get('country') || null
    if (ct === null) {
      ct = "World"
      ls.set('country', ct)
    }
    console.log(ct)
    await updateDataIfNecessary();
    const ov = await getGlobalArr(ct);
    const cts = await getCountriesList();

    
    const pie = await getPie(this.state.pieCutoff);
    const table = await getPie(this.state.tableCutoff);
    this.setState({overview:ov, countries:cts, country:ct, pie:pie, table: table})
  };


  async yourChangeHandler(event) {
    const ct = event.target.value
    ls.set('country', ct)
    const ov = await getGlobalArr(ct);
    this.setState({overview: Object.assign([], ov)})
    window.location.reload(false)
  }

  async handleChange(selectedOption) {
    const ct = selectedOption.value
    ls.set('country', ct)
    const ov = await getGlobalArr(ct);
    this.setState({overview: Object.assign([], ov)})
    window.location.reload(false)

  }

  getPieChart() {
    if (this.state.pie) {
      return (
        <Col lg="4" md="6" sm="12" className="mb-4">
              <UsersByDevice {...{
                    title: "World Comparison",
                    chartData: {
                      datasets:
                        this.state.focus.map((x, key) => ({
                          key: key,
                          hoverBorderColor: "#ffffff",
                          data: this.state.pie[x].map(x => x.value),
                          title: x,
                          labels: this.state.pie[x].map(x => x.country),
                          backgroundColor: this.state.pie[x].map((x, ind) => "rgba(0,123,255," + String((ind+1.0)/this.state.pieCutoff) + ")")
                        }))
                    }
                  }}
              />
            </Col>
      );
    }
    
  }

  getTables() {
    if (this.state.table) {
      return  (
        this.state.focus.map((x, i) => (<Col lg="4" md="12" sm="12" className="mb-4">
        <TopReferrals {...{
            key: i,
            title: x,
            referralData: this.state.table[x].map((x, idx) => ({'title': x.country, 'value': x.value, 'key':idx}))
          }}/>
      </Col>))
      );
    }
    
  }

  getSmallStats() {
    const ov = this.state.overview
    return (
      <Row>
            {ov.map((stats, idx) => (
              <Col className="col-lg mb-4" key={idx}>
                <SmallStats
                  id={`small-stats-${idx}`}
                  variation="2"
                  chartData={[
                    {
                      label: "Today",
                      fill: "start",
                      borderWidth: 1.5,
                      backgroundColor: stats.bgColor,
                      borderColor: stats.color,
                      data: stats.series
                    }
                  ]}
                  chartLabels={Array(stats.series.length).fill(null)}
                  label={stats.label}
                  value={stats.series[stats.series.length -1]}
                  percentage={stats.percentDifference}
                  increase={stats.increase}
                  increaseIsGood={false}
                />
              </Col>
            ))}
          </Row> 
    )
  }

  render() {


    if (this.state.overview !== null && this.state.countries !== null) {
      return (
        <Container fluid className="main-content-container px-4">
          {/* Page Header */}
          <Row noGutters  className="page-header py-4">
            <PageTitle title="COVID-19 Tracker" subtitle="Daily Updates" className="text-sm-left mb-3" />
            
          </Row>
          <Row noGutters className="pb-4">
          <div style={{width: '300px', zIndex: 2}}>
            <Select placeholder={this.state.country} value={this.state.country} style={{ width: 42}} onChange={this.handleChange.bind(this)} options={this.state.countries.map((c, idx) => ({value: c, key:idx, label: c === "US" ? "United States" : c}))}/>
          </div>

          </Row>

          {this.getSmallStats()}
    
          <Row style={{flex:1}}>
          
            {/* Users Overview */}
            <Col style={{flex:1}}>
            <iframe style={{flex:1 }} width="100%"  height="390%" frameborder="0" scrolling="no" 
    marginHeight="0" marginWidth="0" title="2019-nCoV" 
    src="//arcgis.com/apps/Embed/index.html?webmap=14aa9e5660cf42b5b4b546dec6ceec7c&extent=77.3846,11.535,163.5174,52.8632&zoom=true&previewImage=false&scale=true&disable_scroll=true&theme=light"
  ></iframe>
            <a>{"Map: Johns Hopkins University"}</a>
            </Col>
            
          </Row>
        </Container>
      );
    } else {
      return (
        <Container fluid className="main-content-container px-4">
          <ReactLoading  type={'bubbles'} color={"#aaaaaa"}/>
        </Container>
        
      )
    };
    } 
    
  

  
}

export default BlogOverview;
