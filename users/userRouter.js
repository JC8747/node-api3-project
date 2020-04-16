const express = require("express");

const router = express.Router();

const users = require("./userDb");
const posts = require("../posts/postDb");

router.post("/", validateUser(), (req, res, next) => {
  users
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      next(error);
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  posts
    .insert({ ...req.body, user_id: req.id })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/", (req, res, next) => {
  console.log("req.query", req.query);
  users
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/:id", validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId(), (req, res, next) => {
  users
    .getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      next(error);
    });
});

router.delete("/:id", validateUserId(), (req, res, next) => {
  users
    .remove(req.params.id)
    .then(count => {
      res.status(200).json({ message: "The user has been deleted" });
    })
    .catch(error => {
      next(error);
    });
});
router.put("/:id", validateUser(), validateUserId(), (req, res, next) => {
  users
    .update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      next(error);
    });
});

function validateUserId(req, res, next) {
  return (req, res, next) => {
    users
      .getById(req.params.id)
      .then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({ message: "User ID invalid" });
        }
      })
      .catch(error => {
        next(error);
      });
  };
}

function validateUser(req, res, next) {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "User data not found" });
    } else if (!req.body.name) {
      return res.status(400).json({ message: "Required name not found" });
    }
    next();
  };
}

function validatePost(req, res, next) {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "Post data not found" });
    } else if (!req.body.text) {
      return res.status(400).json({ message: "Required text not found" });
    }
    next();
  };
}

module.exports = router;