import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  // Display users data
  employees = [{name:"", salary:"", department:""}];

  // Create new user
  user={
    name:"",
    salary:"",
    department:""
  };

  constructor() { }

  ngOnInit() {
    this.populateUsers();
  }

  saveUser(){
    if(this.user.name.length > 0 && this.user.department.length>0){
      fetch('api/createUser',{
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({name:this.user.name, salary:this.user.salary, department:this.user.department}),
      }).then(function(data){
        return data.json();
      }).then((json)=>{
        this.populateUsers();
      });
    }
  }

  populateUsers(){
    fetch('api/allUsers').then(function(data){
      return data.json();
    }).then((json)=>{
      this.employees = json;
    });
  }

  editUser(){
    fetch('api/oneUser/'+this.user.name).then(function(dataOld){
      return dataOld.json();
    }).then((jsonOld)=>{
      fetch('api/users/'+jsonOld._id,{
        method: 'PUT',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({name:this.user.name, salary:this.user.salary, department:this.user.department}),
    }).then(function(dataUpdated){
      return dataUpdated.json();
    }).then((jsonUpdated)=>{
      this.populateUsers();
    });
    });
  }

  deleteUser(name:string){
    fetch('api/oneUser/'+name).then(function(dataUser){
      return dataUser.json();
    }).then((jsonUser)=>{
      fetch('api/users/'+jsonUser._id,{method: 'DELETE'}).then(function(dataDeleted){
      return dataDeleted.json();
    }).then((jsonDeleted)=>{
      this.populateUsers();
    });
    });
  }
}
