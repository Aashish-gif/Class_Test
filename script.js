const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 8000;

// MongoDB connection details
const uri = "mongodb+srv://tajcg29082024:5ZhSPsxe4ZzKR98@cluster0.v8o4x.mongodb.net/"; 
const dbName = "classtest";

// Middleware
app.use(express.json());
app.use(cors());
let db, students, users, repositories, issues, pullRequests, commits, forks, stars; // Declare all collections

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        students = db.collection("students");
        users = db.collection("users"); // Initialize users collection
        repositories = db.collection("repositories"); // Initialize repositories collection
        issues = db.collection("issues"); // Initialize issues collection
        pullRequests = db.collection("pullRequests"); // Initialize pullRequests collection
        commits = db.collection("commits"); // Initialize commits collection
        forks = db.collection("forks"); // Initialize forks collection
        stars = db.collection("stars"); // Initialize stars collection

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all users
app.get('/users', async (req, res) => { 
    try {
        const allUsers = await users.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// GET: Fetch a specific user by userId
app.get('/users/:userId', async (req, res) => { 
    try {
        const { userId } = req.params;
        const user = await users.findOne({ userId: userId });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching user: " + err.message);
    }
});

// GET: Retrieve all repositories
app.get('/repositories', async (req, res) => {
    try {
        const allRepositories = await repositories.find().toArray();
        res.status(200).json(allRepositories);
    } catch (err) {
        res.status(500).send("Error fetching repositories: " + err.message);
    }
});

// GET: Fetch a specific repository by repoId
app.get('/repositories/:repoId', async (req, res) => { 
    try {
        const { repoId } = req.params;
        const repository = await repositories.findOne({ repoId: repoId });

        if (repository) {
            res.status(200).json(repository);
        } else {
            res.status(404).send("Repository not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching repository: " + err.message);
    }
});

// GET: Retrieve all commits for a specific repository
app.get('/commits/:repoId', async (req, res) => {
    try {
        const { repoId } = req.params;
        const commitsList = await commits.find({ repoId: repoId }).toArray();

        if (commitsList.length > 0) {
            res.status(200).json(commitsList);  // Return the list of commits
        } else {
            res.status(404).send("No commits found for this repository");
        }
    } catch (err) {
        res.status(500).send("Error fetching commits: " + err.message);
    }
});

// POST: Add a new commit
app.post('/commits', async (req, res) => {
    try {
        const newCommit = req.body;
        const result = await commits.insertOne(newCommit);
        res.status(201).send(`Commit added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding commit: " + err.message);
    }
});

// POST: Add a new fork
app.post('/forks', async (req, res) => {
    try {
        const newFork = req.body;
        const result = await forks.insertOne(newFork);
        res.status(201).send(`Fork added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding fork: " + err.message);
    }
});

// POST: Add a new star
app.post('/stars', async (req, res) => {
    try {
        const newStar = req.body;
        const result = await stars.insertOne(newStar);
        res.status(201).send(`Star added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding star: " + err.message);
    }
});

// POST: Add a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await users.insertOne(newUser);
        res.status(201).send(`User added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

// POST: Add a new repository
app.post('/repositories', async (req, res) => {
    try {
        const newRepo = req.body;
        const result = await repositories.insertOne(newRepo);
        res.status(201).send(`Repository added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding repository: " + err.message);
    }
});

// POST: Add a new pull request
app.post('/pullRequests', async (req, res) => {
    try {
        const newPullRequest = req.body;
        const result = await pullRequests.insertOne(newPullRequest);
        res.status(201).send(`Pull Request added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding pull request: " + err.message);
    }
});

// DELETE: Remove a commit by commitId
app.delete('/commits/:commitId', async (req, res) => {
    try {
        const { commitId } = req.params;  // Get commitId from the URL parameters
        const result = await commits.deleteOne({ commitId });

        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} commit(s) deleted`);
        } else {
            res.status(404).send("Commit not found");
        }
    } catch (err) {
        res.status(500).send("Error deleting commit: " + err.message);
    }
});

// DELETE: Remove a fork by forkId
app.delete('/forks/:forkId', async (req, res) => {
    try {
        const { forkId } = req.params;
        const result = await forks.deleteOne({ forkId });

        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} fork(s) deleted`);
        } else {
            res.status(404).send("Fork not found");
        }
    } catch (err) {
        res.status(500).send("Error deleting fork: " + err.message);
    }
});

// DELETE: Remove a star by starId
app.delete('/stars/:starId', async (req, res) => {
    try {
        const { starId } = req.params;
        const result = await stars.deleteOne({ starId });

        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} star(s) deleted`);
        } else {
            res.status(404).send("Star not found");
        }
    } catch (err) {
        res.status(500).send("Error deleting star: " + err.message);
    }
});

// DELETE: Remove a user by userId
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await users.deleteOne({ userId });

        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).send("Error deleting user: " + err.message);
    }
});

// DELETE: Remove a repository by repoId
app.delete('/repositories/:repoId', async (req, res) => {
    try {
        const { repoId } = req.params;
        const result = await repositories.deleteOne({ repoId });

        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} repository(ies) deleted`);
        } else {
            res.status(404).send("Repository not found");
        }
    } catch (err) {
        res.status(500).send("Error deleting repository: " + err.message);
    }
});

