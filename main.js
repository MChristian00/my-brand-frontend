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
const storage = firebase.storage();

let queryRoute = "https://my-brand-backend.herokuapp.com/api/queries/";
// let queryRoute = "http://localhost:3000/api/queries/";
let blogRoute = "https://my-brand-backend.herokuapp.com/api/blogs/";
// let blogRoute = "http://localhost:3000/api/blogs/";
let userRoute = "https://my-brand-backend.herokuapp.com/api/auth/";
// let userRoute = "http://localhost:3000/api/auth/";
let subscriptionRoute =
  "https://my-brand-backend.herokuapp.com/api/subscription/";
// let subscriptionRoute = "http://localhost:3000/api/subscription/";

let User = JSON.parse(localStorage.getItem("User"));
let URI = `${window.location.origin}/my-brand-frontend`;
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
  img.setAttribute("src", blog.Picture);
  img.setAttribute("width", "120px");
  img.setAttribute("height", "120px");
  let Link = document.createElement("a");
  Link.setAttribute("href", `../Pages/Blog.html`);
  Link.setAttribute("data-key", blog._id);
  Link.addEventListener("click", storeBlogID);
  Link.innerHTML = blog.Title;
  let createdAt = document.createElement("p");
  createdAt.innerHTML = blog.createdAt;
  let Summary = document.createElement("p");
  Summary.innerHTML = blog.Content.slice(0, 24);
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
  axios
    .get(`${blogRoute}`)
    .then((res) => {
      res.data.Blogs.slice(0, 4).map((blog) => {
        pfBlogElement(blog);
      });
    })
    .catch((error) => {
      console.log(error);
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
  img.setAttribute("src", blog.Picture);
  img.setAttribute("width", "120px");
  img.setAttribute("height", "120px");
  let Link = document.createElement("a");
  Link.setAttribute("href", `${URI}/Pages/Blog.html`);
  Link.setAttribute("data-key", blog._id);
  Link.addEventListener("click", storeBlogID);
  Link.innerHTML = blog.Title;
  let createdAt = document.createElement("p");
  createdAt.innerHTML = blog.createdAt;
  let Summary = document.createElement("p");

  Summary.innerHTML = blog.Content.slice(0, 70);

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
  axios
    .get(`${blogRoute}`)
    .then((res) => {
      res.data.Blogs.forEach((blog) => {
        allBlogsElement(blog);
      });
    })
    .catch((error) => {
      console.log(error);
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
  editLink.setAttribute("data-key", blog._id);
  editLink.addEventListener("click", storeEditID);
  Link.setAttribute("href", `${URI}/Pages/Blog.html`);
  Link.setAttribute("data-key", blog._id);
  Link.addEventListener("click", storeBlogID);
  Link.innerHTML = blog.Title;
  let editBtn = document.createElement("p");
  editBtn.setAttribute("class", "edit-btn");
  editLink.innerHTML = "Edit";
  let deleteBtn = document.createElement("p");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.setAttribute("class", "delete-btn");
  deleteBtn.setAttribute("data-key", blog._id);
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
  axios
    .get(`${blogRoute}`)
    .then((res) => {
      res.data.Blogs.forEach((blog) => {
        adminBlogElement(blog);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const displayQueries = () => {
  let dashwrapper = document.getElementsByClassName("adm-dashboard")[1];

  let querrieswrapper = document.createElement("div");
  querrieswrapper.setAttribute("class", "adm-dash-queries-wrapper");

  axios
    .get(`${queryRoute}`, {
      headers: {
        Authorization: `Bearer ${User.data.Token}`,
      },
    })
    .then((res) => {
      res.data.Queries.forEach((query) => {
        let dashQuery = document.createElement("div");
        dashQuery.setAttribute("class", "dash-query");
        let queryDesc = document.createElement("div");
        queryDesc.setAttribute("class", "query-desc");
        let queryOwner = document.createElement("h1");
        let queryLink = document.createElement("a");
        let Summary = document.createElement("p");
        let createdAt = document.createElement("p");

        queryLink.setAttribute("href", "../Admin/Query.html");
        queryLink.setAttribute("data-key", query._id);
        queryLink.addEventListener("click", storeQueryID);

        queryLink.innerHTML = query.QueryOwner;
        Summary.innerHTML = query.QueryContent.slice(0, 24);
        createdAt.innerHTML = query.createdAt;

        dashwrapper.appendChild(querrieswrapper);
        querrieswrapper.appendChild(dashQuery);
        dashQuery.appendChild(queryDesc);
        queryDesc.appendChild(queryOwner);
        queryDesc.appendChild(Summary);
        queryDesc.appendChild(createdAt);
        queryOwner.appendChild(queryLink);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const checkAuth = () => {
  const URI = window.location.origin;
  if (!User) {
    window.location.href(`${URI}/Pages/Signin.html`);
  }
};

const contactQuery = () => {
  let QueryOwner = document.getElementById("contact-name").value;
  let Email = document.getElementById("contact-email").value;
  let QueryContent = document.getElementById("contact-msg").value;

  axios
    .post(`${queryRoute}/add`, {
      QueryOwner,
      Email,
      QueryContent,
    })
    .then((res) => {
      console.log(res);
      alert("Query sent successfully");
    })
    .catch((err) => {
      console.log(err);
      alert("Error while sending query");
    });
};

const subscribe = async () => {
  let Name = document.getElementById("subscribe-name").value;
  let Email = document.getElementById("subscribe-email").value;

  await axios
    .post(`${subscriptionRoute}add`, {
      Name,
      Email,
    })
    .then((result) => {
      alert("Subscription successfull");
      console.log("Subscription successfull", result);
    })
    .catch((err) => {
      alert("Error subscribing ");
      console.log("Subscription failed", err);
    });
};

const register = async () => {
  let Firstname = document.getElementById("fname").value;
  let Lastname = document.getElementById("lname").value;
  let Email = document.getElementById("user-email").value;
  let Password = document.getElementById("password").value;
  let retype_Password = document.getElementById("password2").value;

  await axios
    .post(`${userRoute}register`, {
      Firstname,
      Lastname,
      Email,
      Password,
      retype_Password,
    })
    .then((result) => {
      alert("Registering user successfull");
      console.log("Upload successfull", result);
      window.location.replace(`${URI}/Pages/signin.html`);
    })
    .catch((err) => {
      alert("Registering user failed");
      console.log("Registering user failed", err);
    });
};

const login = () => {
  let Email = document.getElementById("login-email").value;
  let Password = document.getElementById("login-pwd").value;

  axios
    .post(`${userRoute}signin`, { Email, Password })
    .then((user) => {
      let userData = JSON.parse(atob(user.data.Token.split(".")[1]));
      alert("Login successfull");
      window.localStorage.setItem("User", JSON.stringify(user));
      if (userData.Role === "admin") {
        window.location.replace(`${URI}/Pages/Admin`);
      } else {
        window.location.replace(`${URI}/Pages/Dashboard.html`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const altLogin = () => {};

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
  axios
    .get(`${userRoute}logout`, {
      headers: {
        Authorization: `Bearer ${User.data.Token}`,
      },
    })
    .then(() => {
      localStorage.removeItem("User");
      alert("Successfully signed out");
      window.location.replace(`${URI}/Pages/Portfolio.html`);
    })
    .catch((err) => {
      alert("Error occured while logging out");
      console.log("Error while signing out", err);
    });
};

const addBlog = () => {
  let Title = document.getElementById("blogTitle").value;
  let Content = CKEDITOR.instances.blogContent.getData();
  let Pic = document.getElementById("blogPic").files[0];

  let upload = storage.ref(`Images/${Pic.name}`).put(Pic);
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
        axios
          .post(
            `${blogRoute}add`,
            {
              Title,
              Content,
              Picture: downloadURL,
            },
            {
              headers: {
                Authorization: `Bearer ${User.data.Token}`,
              },
            }
          )
          .then((res) => {
            alert("Blog added successfully");
            window.location.replace(`${URI}/Pages/Admin`);
            console.log("Blog added successfully", res);
          })
          .catch((err) => {
            alert("Error adding blog");
            console.log("Failed to add blog", err);
          });
      });
    }
  );
};

const addComment = () => {
  let docID = localStorage.getItem("docID");
  let userData = JSON.parse(localStorage.getItem("User"));
  let commentContent = document.querySelector("#comment").value;
  console.log(userData);

  if (userData) {
    if (commentContent) {
      axios
        .put(
          `${blogRoute}comment/${docID}`,
          {
            Content: commentContent,
          },
          {
            headers: {
              Authorization: `Bearer ${userData.data.Token}`,
            },
          }
        )
        .then((res) => {
          alert("Comment added successfully");
          console.log("Comment added successfully", res);
        })
        .catch((err) => {
          alert("Error adding comment");
          console.log("Error", err);
        });
    } else alert("Type comment");
  } else window.location.replace(`${URI}/Pages/Signin.html`);
};

const updateBlog = async (e) => {
  let Title = document.getElementById("blogTitle").value;
  let Content = CKEDITOR.instances.blogContent.getData();
  // let BlogPic = document.getElementById("blogPic").value;
  let docID = localStorage.getItem("editID");
  await axios
    .put(
      `${blogRoute}${docID}`,
      {
        Title,
        Content,
      },
      {
        headers: {
          Authorization: `Bearer ${User.data.Token}`,
        },
      }
    )
    .then((res) => {
      alert("Blog updated successfully");
      window.location.replace(`${URI}/Pages/Admin`);
      console.log("Blog updated successfully", res);
    })
    .catch((err) => {
      alert("Failed to updated blog");
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
  let editID = e.target.getAttribute("data-key");
  localStorage.setItem("editID", editID);
};

const loadEditContent = async () => {
  let editID = localStorage.getItem("editID");
  if (editID) {
    let Title = document.getElementById("blogTitle");
    await axios
      .get(`${blogRoute}${editID}`)
      .then((res) => {
        Title.value = res.data.Blog.Title;
        CKEDITOR.instances.blogContent.setData(res.data.Blog.Content);
      })
      .catch((err) => {
        console.log(err);
      });
  } else location.reload();
};

const loadBlog = async () => {
  let docID = localStorage.getItem("docID");

  let detailsWrapper = document.getElementById("blog-details");
  let contentWrapper = document.getElementsByClassName("blog-content")[0];
  let commentsWrapper = document.getElementsByClassName("comments-wrapper")[0];

  await axios
    .get(`${blogRoute}${docID}`)
    .then((res) => {
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

      blogTitle.innerHTML = res.data.Blog.Title;
      createdAt.innerHTML = `posted on ${res.data.Blog.createdAt}`;
      blogContent.innerHTML = res.data.Blog.Content;

      res.data.Blog.Comments.forEach((comment) => {
        commentOwner.innerHTML = comment.Owner;
        commentContent.innerHTML = comment.Content;
        commentTime.innerHTML = comment.createdAt;

        commentsWrapper.appendChild(commentWrapper);
        commentWrapper.appendChild(commentOwner);
        commentWrapper.appendChild(commentContent);
        commentWrapper.appendChild(commentTime);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const loadQuery = async () => {
  let queryID = localStorage.getItem("queryID");

  let queryWrapper = document.querySelector(".query-wrapper");
  let descWrapper = document.querySelector(".query-desc");
  let contentWrapper = document.querySelector(".query-content");

  await axios
    .get(`${queryRoute}${queryID}`, {
      headers: {
        Authorization: `Bearer ${User.data.Token}`,
      },
    })
    .then((res) => {
      let queryOwner = document.createElement("h1");
      let createdAt = document.createElement("p");
      let queryContent = document.createElement("p");
      let emailPara = document.createElement("p");
      let emailLink = document.createElement("a");
      emailLink.setAttribute("href", `mailto:${res.data.Query.Email}`);

      queryWrapper.appendChild(descWrapper);
      queryWrapper.appendChild(contentWrapper);
      descWrapper.appendChild(queryOwner);
      descWrapper.appendChild(createdAt);
      contentWrapper.appendChild(queryContent);
      contentWrapper.appendChild(emailPara);
      emailPara.appendChild(emailLink);

      queryOwner.innerHTML = res.data.Query.QueryOwner;
      queryContent.innerHTML = res.data.Query.QueryContent;
      emailLink.innerHTML = res.data.Query.Email;
      createdAt.innerHTML = `posted on ${res.data.Query.createdAt}`;
    });
};

const loadProfile = async () => {
  let adminData = JSON.parse(atob(User.data.Token.split(".")[1]));
  let profilePic = document.getElementsByClassName("profile-image")[0];
  let adminEmail = document.getElementById("adm-email");
  let adminPassword = document.getElementById("adm-pwd");
  let blogCount = document.getElementsByClassName("blog-count")[0];
  let img = document.createElement("img");
  img.setAttribute("class", "old-profile-pic");
  img.setAttribute("src", `${adminData.Picture}`);
  img.setAttribute("alt", "Profile Pic");
  img.setAttribute("width", "120px");
  img.setAttribute("height", "120px");

  profilePic.prepend(img);
  console.log(adminData);
  adminEmail.value = adminData.Email;
  adminPassword.value = adminData.Password;

  await axios
    .get(`${blogRoute}`)
    .then((res) => {
      blogCount.innerHTML = res.data.Blogs.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProfileData = async () => {
  let adminEmail = document.getElementById("adm-email").value;
  let adminPassword = document.getElementById("adm-pwd").value;
  let oldProfilePic = JSON.parse(atob(User.data.Token.split(".")[1])).Picture;
  let newProfilePic = document.getElementById("new-profile-pic").files[0];
  if (oldProfilePic && !newProfilePic) {
    return uploadProfileData({
      adminEmail,
      adminPassword,
      picURL: oldProfilePic,
    });
  }
  // let picPromise = await uploadImage(newProfilePic);
  // console.log("promise", picPromise);
  // if (picPromise) {
  // picPromise
  // .then((downloadURL) => {
  // uploadProfileData({ adminEmail, adminPassword, picURL: downloadURL });
  // })
  // .catch((err) => {
  //   alert("Error uploading picture");
  //   console.log(err);
  // });
  // };
  else if (newProfilePic) {
    uploadImage({ adminEmail, adminPassword, newProfilePic });
  } else return uploadProfileData({ adminEmail, adminPassword, picURL: null });
};

const uploadImage = ({ adminEmail, adminPassword, newProfilePic }) => {
  let upload = storage.ref(`Images/Pic`).put(newProfilePic);
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
        // return downloadURL;
        uploadProfileData({ adminEmail, adminPassword, picURL: downloadURL });
      });
    }
  );
};

const uploadProfileData = async (args) => {
  console.log(args);
  let { adminEmail, adminPassword, picURL } = args;
  let { _id } = JSON.parse(atob(User.data.Token.split(".")[1]));
  let userID = _id;

  axios
    .put(
      `${userRoute}edit/${userID}`,
      {
        Picture: picURL,
        Email: adminEmail,
        Password: adminPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${User.data.Token}`,
        },
      }
    )
    .then((res) => {
      alert("Profile updated successfully");
      // window.location.replace(`${URI}/Pages/Admin`);
      console.log("Profile updated successfully", res);
    })
    .catch((err) => {
      alert("Failed to updated profile");
      console.log("Failed to updated profile", err);
    });
};

const deleteBlog = async (e) => {
  let docID = e.target.getAttribute("data-key");
  await axios
    .delete(`${blogRoute}${docID}`, {
      headers: {
        Authorization: `Bearer ${User.data.Token}`,
      },
    })
    .then(() => {
      alert("Blog removed successfully");
      window.location.reload();
    })
    .catch((err) => {
      alert("Failed to remove blog");
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
