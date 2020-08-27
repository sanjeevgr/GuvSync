var bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	express = require("express"),
	app = express();

mongoose.connect("mongodb://localhost:27017/asuBlog", { useNewUrlParser: true,
useUnifiedTopology: true
});
mongoose.set("useFindAndModify", false);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))

//mongodb schema...
var blogSchema = new mongoose.Schema({
	title: String,
	category: String, 
	studentID: Number,
	name: String, 
	timeStamp: {type: Date, default: Date.now},
	avi: {type: String, default: "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"},
	content: String
});
//compile schema into model
var Blog = mongoose.model("Blog", blogSchema);
//create first db entry
//LANDING PAGE
app.get("/", function(req, res){
	res.render("welcome");
})
//RESTful Routes...
//1) INDEX (GET)
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		}
		else{
			res.render("index", {blogs: blogs});
		}
	});
});
//2) NEW (GET)
app.get("/blogs/new", function(req, res){
		res.render("new");
});
//3) CREATE (POST)
app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.send(err);
			console.log("UNABLE TO CREATE NEW BLOG");
		}
		else{
			res.redirect("/blogs");
		}
	});
});
//4) SHOW (GET) 
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("UNABLE TO GET TO BLOG");
		}
		else{
			res.render("show", {blog: foundBlog})
		}
	});
});
//5) EDIT (GET)
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("UNABLE TO GO TO BLOG");
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	})
});
//6) UPDATE (PUT)
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
})
//7) DESTROY (DELETE)
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, removedBlog){
		if(err){
			res.send("ERROR IN DELETION");
		}
		else{
			res.redirect("/blogs")
		}
	});
});






app.listen(3000, function(){
	console.log("ASU BLOG CONNECTED TO SERVER!");
});