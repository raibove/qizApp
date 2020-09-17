import React from 'react';
import './App.css';

// This Class component is used to show the correct answer
class GetAnswer extends React.Component
{
 constructor(props){
   super(props);
   this.state = {data:this.props.data}
  }
 render(){
   const arr=[];  // arr array is used to storeindex of correct answer 
   const final =[]  //It is used to store value of corect answer
    const answers=this.state.data.answers;
    const optns = this.state.data.options;

    /*
      Object.values(object_name) gives array of values of given object. Here it will be of form array of array.       
    */
    const optn = Object.values(optns);

    // Here we implement the logic to store correct ans index in arr. Since answers is of form array of array
    // we use nested maps.
    answers.map((ans)=>{
      ans.map((item)=>{  
        arr.push(item)
      })
    });

    //Store correct answer value in final array
    for(var i=0;i<arr.length;i++){
          final.push(optn[i][arr[i]]);
    }
      
      const ansfinal = final.map((ans)=>{
        return <div key={ans}>
          <div className="ans">{ans}</div>
        </div>
      })

      return <div className="showAnswer">
              <div>Answers:</div>
              {console.log(arr)}
              {console.log(final)}
              {ansfinal}
            </div>
 }
}
/*
We use ActiveButton array to store the value of active button, i.e button clicked by the user so that we can change its 
color. In checkAnswer function we add that item clicked to activeButton.
activeButton.some(val => val === item ) is used to check if one of the value in array is equal to that of item.
*/
class Answer extends React.Component{
  constructor(props){
    super(props);
    this.state={data:this.props.data,activeButton:[]}
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  checkAnswer(item){
    this.setState(prevState=>({activeButton: [...prevState.activeButton , item.item]}));
    console.log(item.item,typeof(item),this.state.activeButton);
  }

  render(){
    const optns = this.state.data.options;
    return(
    <div>
      {Object.keys(optns).map((optn) => {
          return <div key={optn}>
            {
              optns[optn].map((item,index)=>{
                  return <button className="optn-button" style={{backgroundColor: this.state.activeButton.some(val => val === item ) ? 'red':'blue'}} key={index}
                   onClick={()=> {
                    this.checkAnswer({item});
                    console.log(item);
                  }
                }>{item}</button>
              })
            }
          </div>
        })}
    </div>
    )
  }
}

class Question extends React.Component{
  constructor(props){
    super(props);
    this.state = {data : this.props.data}
  }
  componentDidUpdate(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.data !== this.state.data) {
      this.setState({ data: nextProps.data });
    }
  }
  render(){
  return(
        <div className="question">{this.state.data.description}</div>
        )}
}

class App extends React.Component {
  data = '';
  //index=0
  constructor(props){
    super(props);
    this.state={data:'',loading:true,index:0,inrange:true,displayAnswer:false}
    this.nextQuestion = this.nextQuestion.bind(this);
    }
   nextQuestion(){
     {if(this.state.index <=8){
      this.setState((state)=>{return {index : state.index +1}},()=>{ this.setState({loading:false,data:this.data.data[this.state.index]}); {console.log("new:"+this.state.index)} })
      this.setState({loading:true,displayAnswer:false}); 
      {console.log(this.state.data)}
      {console.log(this.state.index)}
     }
     else{
       this.setState({inrange:false});
     }
    } 
  }
 
 async componentDidMount(){
   try{
   const response = await fetch("https://gre-verbal.p.rapidapi.com/api/v1/questions?subcat=TC&count=10", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "gre-verbal.p.rapidapi.com",
      "x-rapidapi-key": "16f155a489msh85c629274b6b403p1b5f38jsn77f376c963aa"
    }
  })
  this.data = await response.json();
  console.log(this.data);
  this.setState({loading:false, data:this.data.data[this.state.index],displayAnswer:false})
}
catch(err){
  throw err;
}
 }
  render(){  
    return (<div>
      {this.state.loading?<div>Loading</div> : this.state.inrange?<div className="App">{this.state.index+1}<Question data={this.state.data}/><Answer data={this.state.data}/><button className="getAnswer" onClick={()=>{console.log("button clicked");this.setState({displayAnswer:true});}}>Get Answer</button><button className="next" onClick={this.nextQuestion}>Next</button></div> :  <button className="playAgain" onClick={ ()=>window.location.reload(false)}>Play Again</button> }
     {this.state.displayAnswer? <GetAnswer data={this.state.data}/>:console.log("waiting")}
      </div>
      );
}
}
export default App;


