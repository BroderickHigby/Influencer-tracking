import React, {Component} from 'react';
import CheckboxOrRadioGroup from './CheckboxOrRadioGroup';
import SingleInput from './SingleInput';
import TextArea from './TextArea';
import Select from './Select';
import './campaignStyles.css';
import PropTypes from 'prop-types';
import data from './physical_campaign_options.json'
import { getAttributes } from '../../libs/awsLib';


import pin from './icons/pin.svg'
import cal from './icons/date.svg'
import party from './icons/event.svg'
import review from './icons/review.svg'
import industry from './icons/industry.svg'
import coin from './icons/coins.svg'
import device from './icons/computer.svg'

import chat from './icons/chat.svg'
import rate from './icons/rate.svg'
import file from './icons/file.svg'

import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';


import axios from 'axios';

var lightColor = '#66b2b2';
var darkColor = '#008080';
var lightGray = '#E8E8E8';

const buttonStyle = {
  backgroundColor: lightColor,
  borderRadius: '20px',
  color: 'white',
  padding: '5px',
  paddingLeft: '15px',
  paddingRight: '15px',
  border: '0',
  fontSize: '1em',
  display: 'inline-block'
}

const prevbuttonStyle = {
  backgroundColor: lightColor,
  borderRadius: '15px',
  color: 'white',
  padding: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  border: '0',
  fontSize: '.8em',
  marginRight: '5px',
  display: 'inline-block'
}

const iconStyle = {
  height: '250px',
  marginBottom: '5px',
  maringTop: '5px',
  paddingBottom: '25px',
  display: 'inline-block'
}

const fixTime = (str) => {
  var toReturn = ""
  var i = 0
  var spaces = 0;
  for (i = 0; i < str.length; i++) {
    if (str.charAt(i) === ' ') {
      spaces++;
      if (spaces === 1 || spaces === 3) {
        toReturn += ','
      }
    }

    if (spaces < 4) {
      toReturn += str.charAt(i);
    }
  }
  return toReturn;
}

class PhysicalCampaignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      eventType: '',
      location: '',
      startDate: '',
      endDate: '',
      focusedInput: null,
      hardwareOptions: [],
      ownerhardwareRangeSelection: '',
      currentBudget: 0,
      description: '',
      industrySelections: [],
      selectedIndustry: [],
      influencerOptions: [],
      influencers: "",
    };

    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleeventTypeChange = this.handleeventTypeChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);

    this.goToNext = this.goToNext.bind(this);
    this.getPrettyArray = this.getPrettyArray.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);

    this.handleBudgetChange = this.handleBudgetChange.bind(this);
    this.handlehardwareRangeSelect = this.handlehardwareRangeSelect.bind(this);
    this.handleIndustrySelection = this.handleIndustrySelection.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleinfluencerSelection = this.handleinfluencerSelection.bind(this);
    this.getInfluencers = this.getInfluencers.bind(this);


  }
  componentDidMount() {
    //Fix fetch!
    //fetch('./campaign_options.json')
      //.then(res => res.json())
      //.then(data => {
      console.log(data.hardwareOptions);
        this.setState({
          step: 1,
          focusedInput: null,
          eventType: data.eventType,
          location: data.location,
          startDate: data.startDate,
          endDate: data.endDate,
          industrySelections: data.industrySelections,
          influencerOptions: data.influencerOptions,

          hardwareOptions: data.hardwareOptions,
          ownerhardwareRangeSelection: data.ownerhardwareRangeSelection,

          currentBudget: data.currentBudget,
          description: data.description,
          selectedIndustry: data.selectedIndustry,
          selectedinfluencer: data.selectedinfluencer
        });
      //});
  }

  handleeventTypeChange(e) { this.setState({ eventType: e.target.value }); }
  handleLocationChange(e) { this.setState({ location: e.target.value }); }
  handleStartDateChange(e) { this.setState({ date: e.target.value }); }

  handleBudgetChange(e) {  this.setState({ currentBudget: e.target.value }); }
  handlehardwareRangeSelect(e) { this.setState({ ownerhardwareRangeSelection: e.target.value }); }
  handleDescriptionChange(e) { this.setState({ description: e.target.value }); }

  handleIndustrySelection(e) {
    const indusSelection = e.target.value;
    let indusSelectionArray;
    if(this.state.selectedIndustry.indexOf(indusSelection) > -1) {
      indusSelectionArray = this.state.selectedIndustry.filter(s => s !== indusSelection)
    } else {
      indusSelectionArray = [...this.state.selectedIndustry, indusSelection];
    }
    this.setState({ selectedIndustry: indusSelectionArray });
  }

  handleinfluencerSelection(e) {
    const influencerSelection = e.target.value;
    let influencerSelectionArray;
    if(this.state.selectedinfluencer.indexOf(influencerSelection) > -1) {
      influencerSelectionArray = this.state.selectedinfluencer.filter(s => s !== influencerSelection)
    } else {
      influencerSelectionArray = [...this.state.selectedinfluencer, influencerSelection];
    }
    this.setState({ selectedinfluencer: influencerSelectionArray });
  }


  handleClearForm() {
    this.setState({
      focusedInput: null,
      eventType: data.eventType,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      industrySelections: data.industrySelections,
      influencerOptions: data.influencerOptions,

      hardwareOptions: data.hardwareOptions,
      ownerhardwareRangeSelection: data.ownerhardwareRangeSelection,

      currentBudget: data.currentBudget,
      description: data.description,
      selectedIndustry: data.selectedIndustry,
      selectedinfluencer: data.selectedinfluencer
    });
  }

  goToPrevious() {
    const { step } = this.state;
    if (step !== 1) {
      this.setState({ step: step - 1 });
    } else {

    }
  }

  getPrettyArray(arr) {
    if (arr.length < 2) {
      return "";
    }

    var toReturn = arr[1]
    var i = 0;
    for (i = 2; i < arr.length; i++) {
      toReturn += ", " + arr[i]
    }
    return toReturn;
  }

  getInfluencers() {
    console.log("Pulling influencers");
    const postData = {
      eventType: this.state.eventType,
      location: this.state.location,
      industries: this.state.selectedIndustry,
      startDate: fixTime(this.state.startDate._d.toString()),
      endDate: fixTime(this.state.endDate._d.toString()),
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    var funcResponse = "";

    let currentComponent = this;

    // TODO: MARK FIX ENDPOINT

    axios.post("http://ec2.com", postData, axiosConfig)
    .then(function (response) {
      currentComponent.setState({influencers: response.data.influencers})
      //TODO: FIX response data
    })
    .catch(function (error) {
      console.log("Return with error");
      currentComponent.setState({influencers: "Error"})

    });
    this.setState({ loading: false });
  }

  async goToNext() {
    const { step } = this.state;

    if (step === 6) {
      this.getInfluencers();
    }

    if (step !== 9) {
      this.setState({ step: step + 1 });
    }
    else {
      var emailUser = "";

      var attributes = await getAttributes();
      var i =0;

      for( i = 0; i< attributes.length; i++){
        if(attributes[i].Name === "email") {
          emailUser = attributes[i].Value;
        }
      }

      const postData = {
        user_email: emailUser,
        eventType: this.state.eventType,
        location: this.state.location,
        hardware_req: this.state.ownerhardwareRangeSelection,
        industries: this.state.selectedIndustry,
        brand_influencer: this.state.selectedinfluencer,
        budget: this.state.currentBudget,
        other_info: this.state.description,
        startDate: fixTime(this.state.startDate._d.toString()),
        endDate: fixTime(this.state.endDate._d.toString()),

      };

      let axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      };

      let currentComponent = this;

      // TODO: MARK FIX ENDPOINT

      axios.post(" ", postData, axiosConfig)
      .then(function (response) {
        this.handleClearForm();
        this.setState({ step: step - 1})
        this.setState({ step: step + 1 });
      })
      .catch(function (error) {
        //Catch Error
      });

      // console.log('Send this in a POST request:', postData)
    }
  }



  /*  <form className="container" onSubmit={this.handleFormSubmit}>
    <br /> */

  render() {
    switch (this.state.step) {
      case 1:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={party} style={iconStyle} /> </a>
          <br />
        <SingleInput
          inputType={'text'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          title={'Tell us the type of event being hosted'}
          name={'eventType'}
          controlFunc={this.handleeventTypeChange}
          content={this.state.eventType}
          level={1.0}
          total={9.0}
          placeholder={'Ex: Farmer\'s Market, Concert...'} />
        </center>
        </div>;
      case 2:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={cal} style={iconStyle} /> </a>
          <br />
          <DateRangePicker
            startDate={this.state.startDate} // momentPropTypes.momentObj or null,
            startDateId="starting" // PropTypes.string.isRequired,
            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
            endDateId="ending" // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          />
          <br />
          <div className="strike-through" style={{display: 'inline-block', width: "13.2%", border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '-4px'}}></div>
          <div className="strike-through" style={{display: 'inline-block', width: "46.8%", border: "solid 5px #E8E8E8", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginRight: '10px', zIndex: '-1'}}></div>
          <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> 22% </p> </div>
          <button onClick={this.goToPrevious} style={prevbuttonStyle}> Prev </button>
          <button onClick={this.goToNext} style={buttonStyle}> Next </button>
        </center>
        </div>;
      case 3:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={industry} style={iconStyle} /> </a>
          <br />
          <CheckboxOrRadioGroup
          title={'Which industries are you targetting?'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          setName={'industry'}
          type={'checkbox'}
          level={3.0}
          total={9.0}
          controlFunc={this.handleIndustrySelection}
          options={this.state.industrySelections}
          selectedOptions={this.state.selectedIndustry} />
          </center>
          </div>;
      case 4:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={pin} style={iconStyle} /> </a>
          <br />
        <SingleInput
          inputType={'text'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          title={'Tell us the region that the event is occurring in'}
          name={'location'}
          controlFunc={this.handleLocationChange}
          content={this.state.location}
          level={4.0}
          total={9.0}
          placeholder={'Ex: Germany, San Diego, Worldwide...'} />
        </center>
        </div>;
      case 5:
      return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={device} style={iconStyle} /> </a>
          <br />
        <Select
        name={'hardwareRange'}
        onSubmit={this.goToNext}
        onBack={this.goToPrevious}
        placeholder={'Do you require hardware for physical traffic measurements?'}
        controlFunc={this.handlehardwareRangeSelect}
        options={data.hardwareOptions}
        level={5.0}
        total={9.0}
        selectedOption={this.state.ownerhardwareRangeSelection} />
        </center>
        </div>;
      case 6:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={coin} style={iconStyle} /> </a>
          <br />
        <SingleInput
          inputType={'number'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          title={'What is your influencer budget?'}
          name={'budget'}
          level={6.0}
          total={9.0}
          controlFunc={this.handleBudgetChange}
          content={this.state.currentBudget}
          placeholder={'Enter value in $'} />
          </center>
          </div>;
      case 7:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={rate} style={iconStyle} /> </a>
          <br />
          {
            this.state.influencers ? (
                (this.state.influencers === "Error") ? (
                  <div>
                  <h3> An error has occurred finding influencers, please contact us </h3>
                  <center>
                  <div style={{width: '100%'}}>
                  <div className="strike-through" style={{display: 'inline-block', width: '43%', border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '-4px'}}></div>
                  <div className="strike-through" style={{display: 'inline-block', width: '12%', border: "solid 5px #E8E8E8", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginRight: '10px', zIndex: '-1'}}></div>
                  <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> 78% </p> </div>
                  <button onClick={this.goToPrevious} style={prevbuttonStyle}> Prev </button>
                  <button onClick={this.goToNext} style={buttonStyle}> Next </button>
                  </div>
                  </center>
                  </div>
                ) : (
                  <CheckboxOrRadioGroup
                    title={'What brand influencer would you like?'}
                    onSubmit={this.goToNext}
                    onBack={this.goToPrevious}
                    setName={'influencer'}
                    level={7.0}
                    total={9.0}
                    controlFunc={this.handleinfluencerSelection}
                    type={'checkbox'}
                    options={this.influencers}
                    selectedOptions={this.state.selectedinfluencer} />
                )
            ) : (
              <div>
              <h3> Loading influencers... please wait </h3>
              <center>
              <div style={{width: '100%'}}>
              <div className="strike-through" style={{display: 'inline-block', width: '43%', border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '-4px'}}></div>
              <div className="strike-through" style={{display: 'inline-block', width: '12%', border: "solid 5px #E8E8E8", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginRight: '10px', zIndex: '-1'}}></div>
              <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> 78% </p> </div>
              <button onClick={this.goToPrevious} style={prevbuttonStyle}> Prev </button>
              <button onClick={this.goToNext} style={buttonStyle}> Next </button>
              </div>
              </center>
              </div>
            )
          }
          </center>
          </div>;
      case 8:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={chat} style={iconStyle} /> </a>
          <br />
        <TextArea
          title={'Other information'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          rows={5}
          level={8.0}
          total={9.0}
          resize={false}
          content={this.state.description}
          name={'currentPetInfo'}
          controlFunc={this.handleDescriptionChange}
          placeholder={"If you have anything else you would like to tell our team, let us know here. \nThis includes the best way to contact you!"} />
          </center>
          </div>;
      case 9:
        return <div> <center>
          <a href={"_blank"} target="_blank"><img src={file} style={iconStyle} /> </a>
          <br />
          <p style={{fontWeight: 'bold', fontSize: '1.7em'}}> Review the Form </p>
          <br />
          </center>

          <div style={{width: '50%', minWidth: '250px', marginLeft: '25%'}}>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Event Type: </b>{this.state.eventType} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Needs Hardware: </b>{this.state.ownerhardwareRangeSelection} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Start Date: </b>{fixTime(this.state.startDate._d.toString())} until {fixTime(this.state.endDate._d.toString())} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Location: </b>{this.state.location} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Industry: </b>{this.getPrettyArray(this.state.selectedIndustry)} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Budget: </b>${this.state.currentBudget} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Brand influencer: </b>{this.getPrettyArray(this.state.selectedinfluencer)} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Other Information: </b>{this.state.description} </p>
          </div>

          <center>
          <div style={{width: '100%'}}>
          <div className="strike-through" style={{display: 'inline-block', width: '55%', border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '3px'}}></div>
          <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> 100% </p> </div>
          <button onClick={this.goToPrevious} style={prevbuttonStyle}> Prev </button>
          <button onClick={this.goToNext} style={buttonStyle}> Next </button>
          </div>
          </center>

        </div>;
      case 10:
        return <div> <center>
          <br /> <br />
            <h3> Your form has been successfully sent! <br/> We will get back to you shortly.</h3>
        </center>
        </div>;
    }
  }
}

export default PhysicalCampaignForm;
