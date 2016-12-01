import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  smtp = {
  username: 'xxxxx',   // eg: username@gmail.com
  password: 'xxxxx',   // eg: sfvgjsdgfkjsgkfgksf
  server:   'smtp.gmail.com',  // eg: mail.gandi.net
  port: 465
}
   process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
   Accounts.emailTemplates.resetPassword.text = function(user, url){
     url = url.replace('#/', '')
     return "Click this link to reset your password: " + url
   }
   Accounts.emailTemplates.verifyEmail.text = function(user, url){
     url = url.replace('#/', '')
     return "To verify your account email, simply click the link  " + url
   }
   Accounts.config({
           sendVerificationEmail: true
       });
       Meteor.users.allow({
       remove: function(userId, doc) {
         if(doc._id=="DFLWmRi8hiyfnGd8m"){
           return false;
         }
         else{
           var user=Meteor.user()
           console.log(doc.profile.role);
           if(user.profile.role==2){
             if(doc.profile.role==0 || doc.profile.role==1){
               return false;
             }
             else{
               return true;
             }
           }
           else if (user.profile.role==1) {
             if(doc.profile.role==0){
               return false;
             }
             else{
               return true;
             }
           }
           else{
             return true;
           }
         }


         },
       update:function(userId,doc){
         if(doc._id=="DFLWmRi8hiyfnGd8m"){
           return false;
         }
         else{
         var user=Meteor.user()
         if(user.profile.role==2){
           if(doc.profile.role==0 || doc.profile.role==1){
             return false;
           }
           else{
             return true;
           }
         }
         else if (user.profile.role==1) {
           if(doc.profile.role==0){
             return false;
           }
           else{
             return true;
           }
         }
         else{
           return true;
         }
       }
     }
     });
     Meteor.methods({
       register:function(data){
         try{
           console.log("Register data");
           console.log(data);
           user = Accounts.createUser({
             profile:{
               name:data.name,
               dob:data.dob,
               role:data.role
             },
             email:data.email,
             password:data.password
           })
           return{
             "userId":user
           }
         }
         catch(e){
           throw e;
         }
       }
     })
});
