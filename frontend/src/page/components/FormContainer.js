import React, {Component} from 'react';
import CheckboxOrRadioGroup from './CheckboxOrRadioGroup';
import SingleInput from './SingleInput';
import TextArea from './TextArea';
import Select from './Select';
import './campaignStyles.css';
import PropTypes from 'prop-types';
import data from './campaign_options.json'

var lightColor = '#66b2b2';
var darkColor = '#008080';
var lightGray = '#E8E8E8';

const ButtonStyle = {
  backgroundColor: lightColor,
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em',
  display: 'none'
}

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleBudgetChange = this.handleBudgetChange.bind(this);
    this.handleAgeRangeSelect = this.handleAgeRangeSelect.bind(this);
    this.handleGoalSelection = this.handleGoalSelection.bind(this);
    this.handleIndustrySelection = this.handleIndustrySelection.bind(this);
    this.handleMPAASelection = this.handleMPAASelection.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleFeelSelection = this.handleFeelSelection.bind(this);
  }
  componentDidMount() {
    //Fix fetch!
    //fetch('./campaign_options.json')
      //.then(res => res.json())
      //.then(data => {
      console.log(data.MPAAOptions);
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
      //});
  }

  handleLocationChange(e) {
    this.setState({ location: e.target.value });
  }

  handleBudgetChange(e) {
    this.setState({ currentBudget: e.target.value });
  }

  handleAgeRangeSelect(e) {
    this.setState({ ownerAgeRangeSelection: e.target.value });
  }

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

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
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
    });
  }
  handleFormSubmit(e) {
    e.preventDefault();

    const formPayload = {
      location: this.state.location,
      goalSelections: this.state.goalSelections,
      selectedGoals: this.state.selectedGoals,
      ageOptions: this.state.ageOptions,
      ownerAgeRangeSelection: this.state.ownerAgeRangeSelection,
      MPAAOptions: this.state.MPAAOptions,
      mpaaSelection: this.state.mpaaSelection,
      currentBudget: this.state.currentBudget,
      description: this.state.description,
      industrySelections: this.state.industrySelections,
      selectedIndustry: this.state.selectedIndustry,
      feelOptions: this.state.feelOptions,
      selectedFeel: this.state.selectedFeel
    };

    console.log('Send this in a POST request:', formPayload)
    this.handleClearForm(e);
  }
  render() {
    return (
      <form className="container" onSubmit={this.handleFormSubmit}>
      <br />
        <SingleInput
          inputType={'text'}
          title={'Location'}
          name={'location'}
          controlFunc={this.handleLocationChange}
          content={this.state.location}
          placeholder={'Enter a location you would like to target'} />
          <br />

        <Select
          name={'ageRange'}
          placeholder={'Choose your age demographic'}
          controlFunc={this.handleAgeRangeSelect}
          options={this.state.ageOptions}
          selectedOption={this.state.ownerAgeRangeSelection} />
          <br />

        <CheckboxOrRadioGroup
          title={'Which industries are you targetting?'}
          setName={'industry'}
          type={'checkbox'}
          controlFunc={this.handleIndustrySelection}
          options={this.state.industrySelections}
          selectedOptions={this.state.selectedIndustry} />
          <br />

        <CheckboxOrRadioGroup
          title={'What are your goals?'}
          setName={'goals'}
          type={'checkbox'}
          controlFunc={this.handleGoalSelection}
          options={this.state.goalSelections}
          selectedOptions={this.state.selectedGoals} />
          <br />

        <CheckboxOrRadioGroup
          title={'What MPAA Ratings are you targetting?'}
          setName={'MPAA'}
          controlFunc={this.handleMPAASelection}
          type={'checkbox'}
          options={this.state.MPAAOptions}
          selectedOptions={this.state.mpaaSelection} />
          <br />

        <CheckboxOrRadioGroup
          title={'What brand "feel" are you trying to advertise?'}
          setName={'feel'}
          controlFunc={this.handleFeelSelection}
          type={'checkbox'}
          options={this.state.feelOptions}
          selectedOptions={this.state.selectedFeel} />
          <br />

        <SingleInput
          inputType={'number'}
          title={'What is your budget?'}
          name={'budget'}
          controlFunc={this.handleBudgetChange}
          content={this.state.currentBudget}
          placeholder={'Enter your budget'} />
          <br />

        <TextArea
          title={'Other information'}
          rows={5}
          resize={false}
          content={this.state.description}
          name={'currentPetInfo'}
          controlFunc={this.handleDescriptionChange}
          placeholder={'If you have anything else you would like to tell our team, let us know here.'} />
          <br />

        <input
          type="submit"
          className="btn btn-primary float-right"
          value="Launch Campaign"/>
          <br />

        <button
          className="btn btn-link float-left"
          onClick={this.handleClearForm}>Clear form</button>
      </form>
    );
  }
}

export default FormContainer;
