import React from 'react';
import './App.css';
import axios from 'axios';
import {Button} from '@material-ui/core';

class App extends React.Component {

  state={
    employees:[],
    id:0,
    first_name:'',
    last_name:'',
    email:''
  }

  // this method is useful when we want to update list(because after every post,put,delete we want see updated list)
  // another advantage here is that after form submit we initialize form value(i.e clear the form) 
  async load() {
    // fetch the data from backend-api
    const response =await axios.get("http://localhost:8080/api/employees/");

    // update the state 
    this.setState({
      employees:response.data,
      id:0,
      first_name:'',
      last_name:'',
      email:''  
    })
    console.log(this.state);    
  }

  componentDidMount() {
    this.load();
  }

  // when user click on edit link we fetch the current record from api & update the state
  // by updating state form is automatically prefilled using this update state property (value prop of <input>) because of re-rendering
  async edit (id) {
    const response =await axios.get(`http://localhost:8080/api/employees/${id}`);
    this.setState({
      id:response.data.id,
      first_name:response.data.first_name,
      last_name:response.data.last_name,
      email:response.data.email  
    })    
  }
 
  // add record to the db
  async post() {
    const responce = await axios.post("http://localhost:8080/api/employees/", {
      first_name:this.state.first_name,
      last_name:this.state.last_name,
      email: this.state.email
    })
    // see updated list & clear the form
    this.load();
  }  

  // update the record
  async put() {
    const responce = await axios.put("http://localhost:8080/api/employees/", {
      id: this.state.id,
      first_name:this.state.first_name,
      last_name:this.state.last_name,
      email: this.state.email
    })
    // see updated list & clear the form
    this.load();
  }  

  // delete the record
  async delete(id) {
    await axios.delete(`http://localhost:8080/api/employees/${id}`);
    // see updated list & clear the form
    this.load();
  }

  // onform submit we call this method
  submit(event, id) {
    event.preventDefault();

    if(id === 0) {
      this.post();
    }else {
      this.put();
    }  
  }

  render(){
    return (
      <div className="app">

        <div className="app_form">
          <form onSubmit={(e)=>this.submit(e, this.state.id)}>
            <input 
              type="text"
              placeholder="first_name"
              value={this.state.first_name}
              onChange={(e)=>this.setState({first_name:e.target.value})}
            />
            <input 
              type="text"
              placeholder="last_name"
              value={this.state.last_name}
              onChange={(e)=>this.setState({last_name:e.target.value})}
            />
            <input 
              type="text"
              placeholder="email"
              value={this.state.email}
              onChange={(e)=>this.setState({email:e.target.value})}
            />
            <Button type="submit">submit</Button>
          </form>
        </div>
 
        <table>
          <thead>
            <tr>
              <td>first name</td>
              <td>last name</td>
              <td>email</td>
              <td>edit</td>
              <td>delete</td>
            </tr>
          </thead>
          <tbody>
              {this.state.employees.map((employee)=>{
                return (
                  <tr key={employee.id}>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.email}</td>
                    <td><Button onClick={(e)=>{this.edit(employee.id)}} className="edit">Edit</Button></td>
                    <td><Button onClick={(e)=>{this.delete(employee.id)}} className="delete">Delete</Button></td>
                  </tr>
                )
              })}
          </tbody>
        </table>

      </div>
    );  
  }
}

export default App;
