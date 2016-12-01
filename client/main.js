import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var namevar=event.target.fullname.value;
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var date_of_birth=event.target.dob.value;
        console.log("Form submitted.");
        Accounts.createUser({
          profile:{name:namevar,
          dob:date_of_birth,
          role:2},
          email: emailVar,
          password: passwordVar
        },function (error) {
          if(error){
            Router.go('/');
            alert(error)
          }
          else{
            Accounts.sendVerificationEmail
            Router.go('dashboard');
            alert("successfully Registerd Check Your Mail box And Verify the Email")
          }
        });
    }
});

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar,function (error) {
          if(error){
            Router.go('/');
            alert("Invalid email or password,Please Register");
          }
          else{
            Router.go('dashboard');
          }
        });
    }
});

Template.header1.events({
    'click .logout': function(event){
        event.preventDefault();
         Meteor.logout(function () {
           Router.go('/');
         });
        console.log("Logged Out")
    }
});

Template.forget.events({
  'submit form':function(event,template) {
    event.preventDefault();
    var options={};
      options.email = event.target.forgetEmail.value;
      Accounts.forgotPassword(options,function (error) {
        if(error){
          alert(error);
        }
        else{
          alert('check your mailbox');
          template.find("form").reset();
        }
      });

  }
})

Template.register.onRendered(function(){
    $("#register-validation").validate();
})
Template.AddUser.onRendered(function(){
    $("#add-validation").validate();
})

Template.login.onRendered(function(){
    $("#login-validation").validate();
})
Template.dashboard.onRendered(function(){
    $("#form-validation").validate();
})

Template.forget.onRendered(function(){
    $("#forget-validation").validate();
})
Template.resetpassword.onRendered(function(){
    $("#reset-validation").validate();
})

Router.route('/', function () {

  if(Meteor.userId()){
    this.render('dashboard');
  }
  else{
   this.render('register');
  }
});

Router.route('/login', function () {
  if(Meteor.userId()){
    this.render('dashboard');
  }
  else{
   this.render('login');
  }
});

Router.route('/dashboard', function () {
   if(!Meteor.userId()){
     this.render('login');
   }
   else{
     this.render('dashboard');
   }
});

Router.route('/forget', function () {
  if(Meteor.userId()){
    this.render('dashboard');
  }
  else{
   this.render('forget');
  }
});

Router.route('/reset-password/:token', function () {
  this.render('resetpassword');
  var token =this.params.token;
  console.log(token);
  Template.resetpassword.events({
    'submit form':function(event){
      event.preventDefault();
      newPassword=event.target.resetPassword.value;
      Accounts.resetPassword(token, newPassword, function(error){
        if(error){
          console.log(error);
        }
        else{
          alert("Password changed successfully");
          Router.go('dashboard');
        }
      })
    }
  })
});

Router.route('/verify-email/:id',function(){
  var token=this.params.id;
  Accounts.verifyEmail(token,function(error){
    if(error){
      console.log(error);
      alert("Verify email link expired");
    }
    else{
      alert("Your Email is successfully verified");
    }
  })
  var emails=[];
  if(emails.verified){
    this.render('dashboard');
  }
})

Router.route('/addnewuser',function(){
  if(!Meteor.userId()){
    this.render('login');
  }
  else{
    this.render('AddUser');
  }
})

Template.register.rendered=function() {
	$('#my-datepicker').datepicker();
}
Template.dashboard.rendered=function() {
	$('#my-datepicker').datepicker();
}
Template.AddUser.rendered=function() {
	$('#my-datepicker').datepicker();
}

Template.dashboard.helpers({
  'isReady':function(){
    return Meteor.users.find();
  },
  'rolename'(){
    var user = Meteor.user();
    if(user.profile.role==2){
      return "Normal User";
    }
    else if(user.profile.role==1){
      return "Sub Admin";
    }
    else{
      return "Super Admin";
    }
  }
})

Template.dashboard.events({
  'click .delete'(event){
    event.preventDefault();
    Meteor.users.remove(this._id,function(error){
      if(error){
        alert("Access Denied")
      }
      else{
        alert("Removed successfully");
      }
    });
  },
  'click .edit'(event){
    event.preventDefault();
    const full_name=this.profile.name;
    const dob=this.profile.dob;
    const role=this.profile.role;
    const id=this._id;
    // Session.set("currentUserId", this._id);
    $("#EditModal")
    .modal({
     	onApprove: function(){
        console.log("Click update button");
        var nameVar = $('input[name="fname"]').val();
        var date_of_birth = $('input[name="dob"]').val();
        var role=$('select[name="role"]').val();
        console.log(nameVar)
        Meteor.users.update({_id:id},{$set:{
          profile:{
            name:nameVar,
            dob:date_of_birth,
            role:role
          }
        }},function(error){
          if(error){
            alert("Access Denied")
          }
          else{
            alert("Updated successfully")
          }
        })
         $('#EditModal').modal('hide');
      }
    })
    .modal('show')
    .modal('refresh')
    ;
    $('input[name="fname"]').val(full_name);
    $('input[name="dob"]').val(dob);
    $('select[name="role"]').val(role);
  },
  'click #addUser'(event){
    event.preventDefault();
    Router.go('/addnewuser')
  }
})

// Template.exampleModal.events({
//   'submit form'(event){
//     console.log("im in update")
//     event.preventDefault();
//     var nameVar=event.target.fullname.value;
//     var date_of_birth=event.target.dob.value;
//     var id= Session.get("currentUserId");
//     Meteor.users.update({_id:id},{$set:{
//       profile:{
//         name:nameVar,
//         dob:date_of_birth
//       }
//     }})
//     Modal.hide();
//   }
// })

Template.AddUser.events({
  'submit form'(event,template){
    event.preventDefault();
    console.log("i m in adduser")
    var namevar=event.target.fullname.value;
    var emailVar = event.target.registerEmail.value;
    var passwordVar = event.target.registerPassword.value;
    var date_of_birth=event.target.dob.value;
    var role=event.target.role.value;
    Meteor.call('register',{email: emailVar,password: passwordVar,name:namevar,dob:date_of_birth,role:role},
     function(error, result){
      if(result){
        console.log(result)
        Router.go('/dashboard')
      }
      if(error){
        console.log(result)
      }
    });
      template.find("form").reset();
    }
  })

  Template.AddUser.helpers({
    'roletype'(){
      user=Meteor.user();
      if(user.profile.role==0){
        return true
      }
      else {
        return false
      }
    },
    'roletype1'(){
      user=Meteor.user();
      if(user.profile.role==1){
        return true
      }
      else{
        return false
      }
    }
  })
  Template.dashboard.helpers({
    'roletype'(){
      user=Meteor.user();
      if(user.profile.role==0){
        return true
      }
      else {
        return false
      }
    },
    'roletype1'(){
      user=Meteor.user();
      if(user.profile.role==1){
        return true
      }
      else{
        return false
      }
    }
  })
