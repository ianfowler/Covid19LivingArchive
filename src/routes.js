import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";

export default [
  {
    path: "/Covid19LivingArchive",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/blog-posts" />
  },
  {
    path: "/Covid19LivingArchive/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/Covid19LivingArchive/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/Covid19LivingArchive/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/Covid19LivingArchive/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/Covid19LivingArchive/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/Covid19LivingArchive/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/Covid19LivingArchive/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
