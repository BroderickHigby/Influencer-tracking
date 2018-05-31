import React, {Component} from 'react';
import CheckboxOrRadioGroup from './CheckboxOrRadioGroup';
import SingleInput from './SingleInput';
import TextArea from './TextArea';
import Select from './Select';
import './campaignStyles.css';
import PropTypes from 'prop-types';
import data from './campaign_options.json'
import pin from './icons/pin.svg'
import couple from './icons/couple.svg'
import kids from './icons/children.svg'
import review from './icons/review.svg'
import goal from './icons/goal.svg'
import chat from './icons/chat.svg'
import coin from './icons/coins.svg'
import industry from './icons/industry.svg'
import rate from './icons/rate.svg'
import file from './icons/file.svg'
import { getAttributes } from '../../libs/awsLib';


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

class CampaignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      location: '',
      goalSelections: [],
      selectedGoals: [],
      ageOptions: [],
      ownerAgeRangeSelection: '',
      MPAAOptions: [],
      mpaaSelection: [],
      currentBudget: 0,
      description: '',
      industrySelections: [],
      selectedIndustry: [],
      feelOptions: []
    };

    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleBudgetChange = this.handleBudgetChange.bind(this);
    this.handleAgeRangeSelect = this.handleAgeRangeSelect.bind(this);
    this.handleGoalSelection = this.handleGoalSelection.bind(this);
    this.handleIndustrySelection = this.handleIndustrySelection.bind(this);
    this.handleMPAASelection = this.handleMPAASelection.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleFeelSelection = this.handleFeelSelection.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.getPrettyArray = this.getPrettyArray.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);

  }
  componentDidMount() {
    //Fix fetch!
    //fetch('./campaign_options.json')
      //.then(res => res.json())
      //.then(data => {
        this.setState({
          step: 1,

          location: data.location,
          goalSelections: data.goalSelections,
          selectedGoals: data.selectedGoals,
          ageOptions: data.ageOptions,
          ownerAgeRangeSelection: data.ownerAgeRangeSelection,
          MPAAOptions: data.MPAAOptions,
          mpaaSelection: data.mpaaSelection,
          currentBudget: data.currentBudget,
          description: data.description,
          industrySelections: data.industrySelections,
          selectedIndustry: data.selectedIndustry,
          feelOptions: data.feelOptions,
          selectedFeel: data.selectedFeel
        });
      //});
  }

  handleLocationChange(e) { this.setState({ location: e.target.value }); }
  handleBudgetChange(e) {  this.setState({ currentBudget: e.target.value }); }
  handleAgeRangeSelect(e) { this.setState({ ownerAgeRangeSelection: e.target.value }); }
  handleDescriptionChange(e) { this.setState({ description: e.target.value }); }

  handleGoalSelection(e) {
    const goalSelection = e.target.value;
    let goalSelectionArray;
    if(this.state.selectedGoals.indexOf(goalSelection) > -1) {
      goalSelectionArray = this.state.selectedGoals.filter(s => s !== goalSelection)
    } else {
      goalSelectionArray = [...this.state.selectedGoals, goalSelection];
    }
    this.setState({ selectedGoals: goalSelectionArray });
  }

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

  handleFeelSelection(e) {
    const feelSelection = e.target.value;
    let feelSelectionArray;
    if(this.state.selectedFeel.indexOf(feelSelection) > -1) {
      feelSelectionArray = this.state.selectedFeel.filter(s => s !== feelSelection)
    } else {
      feelSelectionArray = [...this.state.selectedFeel, feelSelection];
    }
    this.setState({ selectedFeel: feelSelectionArray });
  }

  handleMPAASelection(e) {
    const mpaaSelection = e.target.value;
    let mpaaSelectionArray;
    if(this.state.mpaaSelection.indexOf(mpaaSelection) > -1) {
      mpaaSelectionArray = this.state.mpaaSelection.filter(s => s !== mpaaSelection)
    } else {
      mpaaSelectionArray = [...this.state.mpaaSelection, mpaaSelection];
    }
    this.setState({ mpaaSelection: mpaaSelectionArray });  }

  handleClearForm() {
    this.setState({
      location: data.location,
      goalSelections: data.goalSelections,
      selectedGoals: data.selectedGoals,
      ageOptions: data.ageOptions,
      ownerAgeRangeSelection: data.ownerAgeRangeSelection,
      MPAAOptions: data.MPAAOptions,
      mpaaSelection: data.mpaaSelection,
      currentBudget: data.currentBudget,
      description: data.description,
      industrySelections: data.industrySelections,
      selectedIndustry: data.selectedIndustry,
      feelOptions: data.feelOptions,
      selectedFeel: data.selectedFeel
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

  async goToNext() {
    const { step } = this.state;
    if (step !== 9) {
      this.setState({ step: step + 1 });
    } else {
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
        location: this.state.location,
        age_demographic: this.state.ownerAgeRangeSelection,
        industries: this.state.selectedIndustry,
        goals: this.state.selectedGoals,
        mpaa_rating: this.state.mpaaSelection,
        brand_feel: this.state.selectedFeel,
        budget: this.state.currentBudget,
        other_info: this.state.description
      };

      let axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      };

      let currentComponent = this;

      // TODO: MARK FIX ENDPOINT

      axios.post("http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:6963", postData, axiosConfig)
      .then(function (response) {
        this.handleClearForm();
        this.setState({ step: step + 1 });
      })
      .catch(function (error) {
        //Catch Error
      });
    }
  }

  render() {
    switch (this.state.step) {
      case 1:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={pin} style={iconStyle} /> </a>
          <br />
        <SingleInput
          inputType={'text'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          title={'Tell us the region that you would like to reach out to'}
          name={'location'}
          controlFunc={this.handleLocationChange}
          content={this.state.location}
          level={1.0}
          total={9.0}
          placeholder={'Ex: Germany, San Diego, Worldwide...'} />
        </center>
        </div>;
      case 2:
        return <div>
          <center>
            <a href={"_blank"} target="_blank"><img src={couple} style={iconStyle} /> </a>
            <a href={"_blank"} target="_blank"><img src={kids} style={iconStyle} /> </a>
            <br />
          <Select
          name={'ageRange'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          placeholder={'Choose your age demographic'}
          controlFunc={this.handleAgeRangeSelect}
          options={data.ageOptions}
          level={2.0}
          total={9.0}
          selectedOption={this.state.ownerAgeRangeSelection} />
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
          <a href={"_blank"} target="_blank"><img src={goal} style={iconStyle} /> </a>
          <br />
        <CheckboxOrRadioGroup
          title={'What are your goals?'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          setName={'goals'}
          type={'checkbox'}
          level={4.0}
          total={9.0}
          controlFunc={this.handleGoalSelection}
          options={this.state.goalSelections}
          selectedOptions={this.state.selectedGoals} />
          </center>
          </div>;
      case 5:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={review} style={iconStyle} /> </a>
          <br />
        <CheckboxOrRadioGroup
          title={'What MPAA Ratings are you targetting?'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          setName={'MPAA'}
          level={5.0}
          total={9.0}
          controlFunc={this.handleMPAASelection}
          type={'checkbox'}
          options={this.state.MPAAOptions}
          selectedOptions={this.state.mpaaSelection} />
          </center>
          </div>;
      case 6:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={rate} style={iconStyle} /> </a>
          <br />
        <CheckboxOrRadioGroup
          title={'What brand "feel" are you trying to advertise?'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          setName={'feel'}
          level={6.0}
          total={9.0}
          controlFunc={this.handleFeelSelection}
          type={'checkbox'}
          options={this.state.feelOptions}
          selectedOptions={this.state.selectedFeel} />
          </center>
          </div>;
      case 7:
        return <div>
        <center>
          <a href={"_blank"} target="_blank"><img src={coin} style={iconStyle} /> </a>
          <br />
        <SingleInput
          inputType={'number'}
          onSubmit={this.goToNext}
          onBack={this.goToPrevious}
          title={'What is your budget?'}
          name={'budget'}
          level={7.0}
          total={9.0}
          controlFunc={this.handleBudgetChange}
          content={this.state.currentBudget}
          placeholder={'Enter value in $'} />
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
          placeholder={'If you have anything else you would like to tell our team, let us know here.'} />
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
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Location: </b>{this.state.location} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Ages: </b>{this.state.ownerAgeRangeSelection} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Goals: </b>{this.getPrettyArray(this.state.selectedGoals)} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>MPAA Ratings: </b>{this.getPrettyArray(this.state.mpaaSelection)} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Industry: </b>{this.getPrettyArray(this.state.selectedIndustry)} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Brand Feel: </b>{this.getPrettyArray(this.state.selectedFeel)} </p>
          <p style={{fontSize: '1.2em', padding: '5px'}}> <b>Budget: </b>${this.state.currentBudget} </p>
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

export default CampaignForm;
