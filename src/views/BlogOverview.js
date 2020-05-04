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
    focus: ["Total Confirmed Cases", "Total Deaths", "Total Recoveries", "New Confirmed Cases", "New Deaths", "New Recoveries"]
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
            {/* <FormSelect size="md" style={{ maxWidth: "260px" }} onChange={this.yourChangeHandler.bind(this)}>
                {this.state.countries.map((c, key) => (<option value={c} key={key}>{c}</option>))}
            </FormSelect> */}
  <div style={{width: '300px', zIndex: 2}}>

            <Select placeholder={this.state.country} value={this.state.country} style={{ width: 42}} onChange={this.handleChange.bind(this)} options={this.state.countries.map((c, _) => ({value: c, label: c === "US" ? "United States" : c}))}/>
</div>

          </Row>

          {this.getSmallStats()}
    
          <Row>
            {/* Users Overview */}
            <Col lg="8" md="12" sm="12" className="mb-4">
              <UsersOverview {...{
                'title': "Cases over Time",
                'chartData': {
                  labels: Array.from(this.state.overview[0].dates, (v, i) => ((new Date(v)).toLocaleDateString("en-US", {month: 'short', day: '2-digit'})+"  ")),
                  datasets: this.state.overview.map((stats, idx) => ({
                    label: stats.label,
                    fill: "start",
                    data: stats.series,
                    backgroundColor: stats.bgColor,
                    borderColor: stats.color,
                    pointBackgroundColor: stats.color,
                    pointHoverBackgroundColor: stats.color,
                    borderWidth: 1.5,
                    pointRadius: 0,
                    pointHoverRadius: 0
                  }))
                }}}
              />
            </Col>

    
            <Col lg="4" md="6" sm="12" className="mb-4">
              <UsersByDevice {...{
                    title: "World Comparison",
                    chartData: {
                      datasets:
                        this.state.focus.map(x => ({
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
    
            {this.state.focus.map((x, i) => (<Col lg="2" md="12" sm="12" className="mb-4">
              <TopReferrals {...{
                  key: i,
                  title: x,
                  referralData: this.state.table[x].map(x => ({'title': x.country, 'value': x.value}))
                }}/>
            </Col>))}
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
