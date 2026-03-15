const User=require("../models/users.js");

module.exports.rendersignUp=(req,res)=>{
    res.render("users.ejs")
};

module.exports.signUp=async (req,res,next)=>{
   try{
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err)=>{
         if(err){
            return next(err);
         }
         req.flash("Success","Welcome!");
         res.redirect("/listings");
      });
   } catch(e){
      req.flash("error", e.message);
      res.redirect("/signup");
   }
};

module.exports.renderlogIn=(req,res)=>{
   res.render("loget.ejs")
};

module.exports.logIn=async(req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logOut=(req,res,next)=>{
   req.logout((err)=>{
      if(err){
         return next(err)
      }
      req.flash("Success","Logged Out!");
      res.redirect("/listings");
   });
}
