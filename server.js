import express from "express";
import bodyParser from "body-parser";
import short from "shortid";

const app = express();
const port = 3000;

let posts = [];

// foloseste fisiere statice (html,css,javascript)
app.use(express.static("public"));

// foloseste bodyParser pentru a obtine datele din formulare
app.use(bodyParser.urlencoded({ extended:true }));

// Get Home Page where blog posts will be shown
app.get("/", (req, res) => {
    res.render("index.ejs",{posts});
})

// Get new Post Page where you can post a blog by completing a form 
app.get("/newPost", (req, res) => {
    res.render("newPost.ejs");
})

// Post your new blog post
app.post("/submit", (req,res) => {
    posts.push({
        id:short(),
        name: req.body["name"],
        title: req.body["title"],
        content: req.body["content"]
    });
    res.redirect("/");
});

// Delete a blog post
app.get("/delete", (req, res) => {
    let postId = req.body.postId;
    let postToDelete = posts.filter(post => post.id === postId);
    posts.splice(postToDelete.indexOf,1);
    res.redirect("/");
});

// Get edit page where you can edit your post from a form 
app.get("/edit",(req, res) => {
    const Id = req.query.idPost;
    let postToUpdate = [];
    for(let i=0;i<posts.length;i++){
        if(posts[i].id === Id){
            postToUpdate.push({
                Id: posts[i].id,
                Title: posts[i].title,
                Name: posts[i].name,
                Content: posts[i].content
            });
        } 
    }
    res.render("editPost.ejs",{postToUpdate});
})

// Post your edited blog post
app.post("/editPost",(req, res) => {
    const postId = req.body.postId;
    const postToUpdate = posts.find(post => post.id === postId);
    if (postToUpdate) {
        postToUpdate.title = req.body.title;
        postToUpdate.name =  req.body.name;
        postToUpdate.content =  req.body.content;
    }
    res.redirect("/");
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});