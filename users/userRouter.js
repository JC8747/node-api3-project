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

router.post(
  "/:id/posts",
  validateUserId(),
  validatePost(),
  (req, res, next) => {
    const { text } = req.body;
    const { id: user_id } = req.params;
    posts
      .insert({ text, user_id })
      .then(user => {
        res.status(200).json(user);
      })
      .catch(error => {
        next(error);
      });
  }
);

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
          res.status(404).json({ message: "invalid user id" });
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
      return res.status(400).json({ message: "missing user data" });
    } else if (!req.body.name) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  };
}

function validatePost(req, res, next) {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "missing post data" });
    } else if (!req.body.text) {
      return res.status(400).json({ message: "missing required text field" });
    }
    next();
  };
}

module.exports = router;