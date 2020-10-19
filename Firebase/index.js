const firebaseConfig = {
  apiKey: "AIzaSyDlvXkPZutmXYesO77BRQ5BdfYahgoOPWo",
  authDomain: "https://capstone-project-302e1.firebaseapp.com/__/auth/handler",
  databaseURL: "https://capstone-project-302e1.firebaseio.com",
  projectId: "capstone-project-302e1",
  storageBucket: "capstone-project-302e1.appspot.com",
  messagingSenderId: "184621354064",
  appId: "1:184621354064:web:cf4b050911c9fd3f019555",
  measurementId: "G-67JK9MY9ZN",
};

firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

const db = firebase.firestore();
const storage = firebase.storage();

let googleProvider = new firebase.auth.GoogleAuthProvider();
// let fbProvider = new firebase.auth.FacebookAuthProvider();
// let githubProvider = new firebase.auth.GithubAuthProvider();
// googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
googleProvider.setCustomParameters({
  login_hint: "user@example.com",
});

// fbProvider.setCustomParameters({
//   display: "popup",
// });

let User = JSON.parse(localStorage.getItem("User"));
let URI = window.location.origin;
let authProvider = localStorage.getItem("Provider");
let Blogs = [];

addEventListener("submit", (e) => {
  e.preventDefault();
  e.path[0].reset();
});

const adminContentLoad = () => {
  // getAllQueries();
  displayQueries();
  displayAllAdminBlogs();
};

const lpContentLoad = () => {
  getUserLocation();
  // getAllBlogs();
  displayLogoutBtn();
  displayLatestBlogs();
};

const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert("geolocation not supported");
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      console.log(position);
    },
    (err) => {
      console.log(err.message);
    }
  );
};

const pfBlogElement = (blog) => {
  let wrapper = document.getElementsByClassName("blogs-wrapper")[0];

  let Blog = document.createElement("div");
  Blog.setAttribute("class", "blog");
  let Pic = document.createElement("div");
  Pic.setAttribute("class", "my-pic");
  let Desc = document.createElement("div");
  Desc.setAttribute("class", "blog-desc");
  let Title = document.createElement("h1");
  let img = document.createElement("img");
  img.setAttribute("src", blog.data().BlogPic);
  img.setAttribute("width", "120px");
  img.setAttribute("height", "120px");
  let Link = document.createElement("a");
  Link.setAttribute("href", `../Pages/Blog.html`);
  Link.setAttribute("data-key", blog.id);
  Link.addEventListener("click", storeBlogID);
  Link.innerHTML = blog.data().BlogTitle;
  let createdAt = document.createElement("p");
  createdAt.innerHTML = blog.data().createdAt;
  let Summary = document.createElement("p");
  Summary.innerHTML = blog.data().BlogContent.slice(0, 24);
  wrapper.appendChild(Blog);
  Blog.appendChild(Pic);
  Pic.appendChild(img);
  Blog.appendChild(Desc);
  Desc.appendChild(Title);
  Desc.appendChild(createdAt);
  Desc.appendChild(Summary);
  Title.appendChild(Link);
};

const displayLatestBlogs = async () => {
  // Circular data error

  // let Blogs = localStorage.getItem("Blogs");
  // console.log(Blogs.docs);

  await db.collection("Blogs").onSnapshot((snapshot) => {
    snapshot.docs.forEach((blog) => {
      pfBlogElement(blog);
    });
  });
};

const allBlogsElement = (blog) => {
  let dashBlogsWrapper = document.getElementById("dash-wrapper");

  let Blog = document.createElement("div");
  Blog.setAttribute("class", "dash-blog");
  let Pic = document.createElement("div");
  Pic.setAttribute("class", "blog-img");
  let Desc = document.createElement("div");
  Desc.setAttribute("class", "blog-desc");
  let Title = document.createElement("h1");
  let img = document.createElement("img");
  img.setAttribute("src", blog.data().BlogPic);
  img.setAttribute("width", "120px");
  img.setAttribute("height", "120px");
  let Link = document.createElement("a");
  Link.setAttribute("href", `${URI}/Pages/Blog.html`);
  Link.setAttribute("data-key", blog.id);
  Link.addEventListener("click", storeBlogID);
  Link.innerHTML = blog.data().BlogTitle;
  let createdAt = document.createElement("p");
  createdAt.innerHTML = blog.data().createdAt;
  let Summary = document.createElement("p");

  Summary.innerHTML = blog.data().BlogContent.slice(0, 70);

  dashBlogsWrapper.appendChild(Blog);
  Blog.appendChild(Pic);
  Pic.appendChild(img);
  Blog.appendChild(Desc);
  Desc.appendChild(Title);
  Desc.appendChild(createdAt);
  Desc.appendChild(Summary);
  Title.appendChild(Link);
};

const displayAllBlogs = () => {
  db.collection("Blogs").onSnapshot((snapshot) => {
    snapshot.docs.forEach((blog) => {
      allBlogsElement(blog);
    });
  });
};

const adminBlogElement = (blog) => {
  let admDashBlogsWrapper = document.querySelector(".adm-dash-blogs-wrapper");
  let Blog = document.createElement("div");
  Blog.setAttribute("class", "adm-dash-blog");
  let Title = document.createElement("h1");
  let Link = document.createElement("a");
  let editLink = document.createElement("a");
  editLink.setAttribute("href", `${URI}/Pages/Admin/Addblog.html`);
  editLink.setAttribute("data-key", blog.id);
  editLink.addEventListener("click", storeEditID);
  Link.setAttribute("href", `${URI}/Pages/Blog.html`);
  Link.setAttribute("data-key", blog.id);
  Link.addEventListener("click", storeBlogID);
  Link.innerHTML = blog.data().BlogTitle;
  let editBtn = document.createElement("p");
  editBtn.setAttribute("class", "edit-btn");
  editLink.innerHTML = "Edit";
  let deleteBtn = document.createElement("p");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.setAttribute("class", "delete-btn");
  deleteBtn.setAttribute("data-key", blog.id);
  // editBtn.setAttribute("data-key", blog.id);
  deleteBtn.addEventListener("click", deleteBlog);

  admDashBlogsWrapper.appendChild(Blog);
  Blog.appendChild(Title);
  Title.appendChild(Link);
  Blog.appendChild(editBtn);
  editBtn.appendChild(editLink);
  Blog.appendChild(deleteBtn);
};

const displayAllAdminBlogs = () => {
  db.collection("Blogs").onSnapshot((snapshot) => {
    snapshot.docs.forEach((blog) => {
      adminBlogElement(blog);
    });
  });
};

const displayQueries = () => {
  let Queries = JSON.parse(localStorage.getItem("Queries"));
  console.log(Queries);

  let dashwrapper = document.getElementsByClassName("adm-dashboard")[1];

  let querrieswrapper = document.createElement("div");
  querrieswrapper.setAttribute("class", "adm-dash-queries-wrapper");

  db.collection("Queries")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      snapshot.docs.forEach((query) => {
        let dashQuery = document.createElement("div");
        dashQuery.setAttribute("class", "dash-query");
        let queryDesc = document.createElement("div");
        queryDesc.setAttribute("class", "query-desc");
        let queryOwner = document.createElement("h1");
        let queryLink = document.createElement("a");
        let Summary = document.createElement("p");
        let createdAt = document.createElement("p");

        queryLink.setAttribute("href", "../Admin/Query.html");
        queryLink.setAttribute("data-key", query.id);
        queryLink.addEventListener("click", storeQueryID);

        queryLink.innerHTML = query.data().Name;
        Summary.innerHTML = query.data().Message.slice(0, 24);
        createdAt.innerHTML = query.data().createdAt;

        dashwrapper.appendChild(querrieswrapper);
        querrieswrapper.appendChild(dashQuery);
        dashQuery.appendChild(queryDesc);
        queryDesc.appendChild(queryOwner);
        queryDesc.appendChild(Summary);
        queryDesc.appendChild(createdAt);
        queryOwner.appendChild(queryLink);
      });
    });
};

const checkAuth = () => {
  const URI = window.location.origin;
  if (!User) {
    window.location.href(`${URI}/Pages/Signin.html`);
  }
};

const contactQuery = () => {
  let Name = document.getElementById("contact-name").value;
  let Email = document.getElementById("contact-email").value;
  let Message = document.getElementById("contact-msg").value;

  db.collection("Queries")
    .add({
      Name,
      Email,
      Message,
      createdAt: Date.now(),
    })
    .then((result) => {
      alert("Query sent successfully", result);
    })
    .catch((err) => {
      alert("Error while sending query", err);
    });
};

const subscribe = () => {
  let Name = document.getElementById("subscribe-name").value;
  let Email = document.getElementById("subscribe-email").value;

  db.collection("Subscriptions")
    .add({
      Name,
      Email,
    })
    .then((result) => {
      console.log("Subscription successfull", result);
    })
    .catch((err) => {
      console.log("Subscription failed", err);
    });
};

const register = async () => {
  let Firstname = document.getElementById("fname").value;
  let Lastname = document.getElementById("lname").value;
  let Email = document.getElementById("user-email").value;
  let Password = document.getElementById("password").value;
  let Password2 = document.getElementById("password2").value;

  if (Password === Password2) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(Email, Password)
      .then((res) => {
        db.collection("Users")
          .add({
            Firstname,
            Lastname,
            Email,
            Password,
            createdAt: Date.now(),
          })
          .then((result) => {
            console.log("Upload successfull", result);
          })
          .catch((err) => {
            console.log("Uploading user failed", err);
          });
        console.log("details", res);
        alert("Success registering user");
        // window.location.replace(`${URI}/Pages/Portfolio.html`);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  } else alert("Passwords don't match");
};

const login = () => {
  let Email = document.getElementById("login-email").value;
  let Password = document.getElementById("login-pwd").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(Email, Password)
    .then((user) => {
      alert("Login successfull");
      window.localStorage.setItem("User", JSON.stringify(user));
      if (Email === "admin@admin.com") {
        window.location.replace(`${URI}/Pages/Admin`);
      } else {
        window.location.replace(`${URI}/Pages/Dashboard.html`);
      }
    })
    .catch((err) => {
      var errorCode = err.code;
      var errorMessage = err.message;
      console.log(errorMessage);
    });
};

const altLogin = () => {
  firebase
    .auth()
    .signInWithPopup(googleProvider)
    .then((res) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = res.credential.accessToken;
      // The signed-in user info.
      loggedUser = JSON.stringify(res.user);
      localStorage.setItem("User", loggedUser);
      console.log("logged user", loggedUser);
      window.location.replace(`${URI}/Pages/Dashboard.html`);
    })
    .catch((err) => {
      // Handle Errors here.
      var errorCode = err.code;
      var errorMessage = err.message;
      // The email of the user's account used.
      var email = err.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = err.credential;
      console.log(err);
    });
};

const displayLoginBtn = () => {
  if (User) {
    document.querySelector(".login-btn").style.display = "none";
  }
};

const displayLogoutBtn = () => {
  if (!User) {
    document.querySelector(".logout-btn").style.display = "none";
  }
};

const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("Successfully signed out");
      localStorage.removeItem("User");
      window.location.replace(`${URI}/Pages/Portfolio.html`);
    })
    .catch((err) => {
      console.log("Error while signing out", err);
    });
};

const addBlog = () => {
  let BlogTitle = document.getElementById("blogTitle").value;
  let BlogContent = CKEDITOR.instances.blogContent.getData();
  let BlogPic = document.getElementById("blogPic").files[0];

  let upload = storage.ref(`Images/${BlogPic.name}`).put(BlogPic);
  upload.on(
    "state_changed",
    (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Progress is ${progress}%`);
    },
    (err) => {
      console.log(err);
    },
    () => {
      upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
        db.collection("Blogs")
          .add({
            BlogTitle,
            BlogContent,
            BlogPic: downloadURL,
            Comments: [],
            createdAt: Date(Date.now()),
          })
          .then((res) => {
            alert("Blog added successfully");
            console.log("Blog added successfully", res);
          })
          .catch((err) => {
            console.log("Failed to add blog", err);
          });
      });
    }
  );
};

const addComment = () => {
  let docID = localStorage.getItem("docID");
  let commentContent = document.querySelector("#comment").value;
  let userInfo = getLoggedUser();
  console.log(userInfo);
  let commentOwner = `${userInfo.Firstname} ${userInfo.Lastname}`;

  if (userInfo) {
    if (commentContent) {
      db.collection("Blogs")
        .doc(docID)
        .set(
          {
            Comments: [
              ...Comments,
              {
                Owner: commentOwner,
                Content: commentContent,
                createdAt: Date.now(),
              },
            ],
          },
          {
            merge: true,
          }
        )
        .then((res) => {
          console.log("Comment added successfully", res);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    } else alert("Type comment");
  } else window.location.replace(`${URI}/Pages/Signin.html`);
};

const getLoggedUser = () => {
  if (User) {
    db.collection("Users")
      .where("Email", "==", User.user.email)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
        return querySnapshot;
      })
      .catch((err) => {
        console.log(err);
      });
  } else return false;
};

const updateBlog = (e) => {
  let BlogTitle = document.getElementById("blogTitle").value;
  let BlogContent = CKEDITOR.instances.blogContent.getData();
  // let BlogPic = document.getElementById("blogPic").value;
  let docID = localStorage.getItem("editID");
  db.collection("Blogs")
    .doc(docID)
    .set(
      {
        BlogTitle,
        BlogContent,
      },
      { merge: true }
    )
    .then((res) => {
      console.log("Blog updated successfully", res);
    })
    .catch((err) => {
      console.log("Failed to updated blog", err);
    });
};

const storeBlogID = (e) => {
  let docID = e.target.getAttribute("data-key");
  localStorage.setItem("docID", docID);
};

const storeQueryID = (e) => {
  let queryID = e.target.getAttribute("data-key");
  localStorage.setItem("queryID", queryID);
};

const storeEditID = (e) => {
  console.log(e.target);
  let editID = e.target.getAttribute("data-key");
  localStorage.setItem("editID", editID);
};

const loadEditContent = () => {
  let docID = localStorage.getItem("editID");
  if (docID) {
    let BlogTitle = document.getElementById("blogTitle");
    db.collection("Blogs")
      .doc(docID)
      .get()
      .then((doc) => {
        BlogTitle.value = doc.data().BlogTitle;
        CKEDITOR.instances.blogContent.setData(doc.data().BlogContent);
      })
      .catch((err) => {
        console.log(err);
      });
  } else location.reload();
};

const loadBlog = async () => {
  let docID = localStorage.getItem("docID");
  console.log(docID);

  let detailsWrapper = document.getElementById("blog-details");
  let contentWrapper = document.getElementsByClassName("blog-content")[0];
  let commentsWrapper = document.getElementsByClassName("comments-wrapper")[0];

  await db
    .collection("Blogs")
    .doc(docID)
    .onSnapshot((snapshot) => {
      let commentWrapper = document.createElement("div");
      commentWrapper.setAttribute("class", "comment");
      // let BlogPic = document.getElementsByClassName("blogPic").value;
      let blogTitle = document.createElement("h1");
      let createdAt = document.createElement("p");
      let blogContent = document.createElement("p");
      let commentOwner = document.createElement("h3");
      let commentContent = document.createElement("p");
      let commentTime = document.createElement("h6");

      detailsWrapper.appendChild(blogTitle);
      detailsWrapper.appendChild(createdAt);
      contentWrapper.appendChild(blogContent);

      blogTitle.innerHTML = snapshot.data().BlogTitle;
      createdAt.innerHTML = `posted on ${snapshot.data().createdAt}`;
      blogContent.innerHTML = snapshot.data().BlogContent;

      snapshot.data().Comments.forEach((comment) => {
        // commentOwner.innerHTML = "Jon Doe";
        commentOwner.innerHTML = comment.Owner;
        // commentContent.innerHTML = "It's my first comment!";
        commentContent.innerHTML = comment.Content;
        // commentTime.innerHTML = "12 min ago";
        commentTime.innerHTML = comment.createdAt;

        commentsWrapper.appendChild(commentWrapper);
        commentWrapper.appendChild(commentOwner);
        commentWrapper.appendChild(commentContent);
        commentWrapper.appendChild(commentTime);
      });
    });
};

const loadQuery = async () => {
  let queryID = localStorage.getItem("queryID");

  let queryWrapper = document.querySelector(".query-wrapper");
  let descWrapper = document.querySelector(".query-desc");
  let contentWrapper = document.querySelector(".query-content");

  await db
    .collection("Queries")
    .doc(queryID)
    .onSnapshot((snapshot) => {
      let queryOwner = document.createElement("h1");
      let createdAt = document.createElement("p");
      let queryContent = document.createElement("p");
      let emailPara = document.createElement("p");
      let emailLink = document.createElement("a");
      emailLink.setAttribute("href", `mailto:${snapshot.data().Email}`);

      queryWrapper.appendChild(descWrapper);
      queryWrapper.appendChild(contentWrapper);
      descWrapper.appendChild(queryOwner);
      descWrapper.appendChild(createdAt);
      contentWrapper.appendChild(queryContent);
      contentWrapper.appendChild(emailPara);
      emailPara.appendChild(emailLink);

      queryOwner.innerHTML = snapshot.data().Name;
      queryContent.innerHTML = snapshot.data().Message;
      emailLink.innerHTML = snapshot.data().Email;
      createdAt.innerHTML = `posted on ${snapshot.data().createdAt}`;
    });
};

const loadProfile = async () => {
  await db
    .collection("Blogs")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        allBlogs.push(doc.data());
      });
    })
    .catch((err) => {
      console.log(err);
    });
  localStorage.setItem("Blogs", JSON.stringify(allBlogs));
  let profilePic = document.getElementsByClassName("profile-image")[0];
  let adminEmail = document.getElementById("adm-email");
  let adminPassword = document.getElementById("adm-pwd");
  let blogCount = document.getElementsByClassName("blog-count")[0];
  let img = document.createElement("img");
  img.setAttribute("src", "../../Assets/profile.svg");
  img.setAttribute("alt", "Profile Pic");
  img.setAttribute("width", "120px");
  img.setAttribute("height", "120px");

  profilePic.prepend(img);
  adminEmail.value = "dummy@gmail.com";
  adminPassword.value = "dummy123";
  blogCount.innerHTML = allBlogs.length;
};

const updateProfile = async () => {
  let profilePic = document.getElementById("blogTitle").files[0];
  let adminEmail = document.getElementById("blogContent").value;
  let adminPassword = document.getElementById("blogPic").value;

  await db
    .collection("Users")
    .doc()
    .update({
      profilePic,
      adminEmail,
      adminPassword,
    })
    .then((res) => {
      console.log("Profile updated successfully", res);
    })
    .catch((err) => {
      console.log("Failed to updated profile", err);
    });
};

const deleteBlog = async (e) => {
  let docID = e.target.getAttribute("data-key");
  await db
    .collection("Blogs")
    .doc(docID)
    .delete()
    .then(() => {
      console.log("Blog removed successfully");
      window.location.reload();
    })
    .catch((err) => {
      console.log("Failed to remove blog", err);
    });
};

const removeEditID = () => {
  localStorage.removeItem("editID");
};

const removeDocID = () => {
  localStorage.removeItem("docID");
};

const removeQueryID = () => {
  localStorage.removeItem("queryID");
};

const blogUpdateOrAdd = () => {
  let blogForm = document.querySelector(".addblog-form");
  let editID = localStorage.getItem("editID");
  if (editID) {
    loadEditContent();
    blogForm.addEventListener("submit", updateBlog);
  }
  blogForm.addEventListener("submit", addBlog);
};

window.addEventListener("load", () => {
  displayLogoutBtn();
  displayLoginBtn();
});
