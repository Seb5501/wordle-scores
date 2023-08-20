// db.cjs
const sqlite3 = require('sqlite3').verbose();

// Create a new database
const db = new sqlite3.Database('./myDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the myDatabase database.');
});


// Create a new table
db.run('CREATE TABLE IF NOT EXISTS leaderboard (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, number INTEGER, triesOrX TEXT)', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Function to insert data into the leaderboard table
function insertScore(user, number, triesOrX) {
  db.run(`INSERT INTO leaderboard(user, number, triesOrX) VALUES(?, ?, ?)`, [user, number, triesOrX], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}

// Function to retrieve data from the leaderboard table
function getLeaderboard(callback) {
  db.all(`SELECT user, COUNT(*) as total, SUM(CASE WHEN triesOrX = 'X' THEN 1 ELSE 0 END) as x, SUM(CASE WHEN triesOrX = '6' THEN 1 ELSE 0 END) as six, SUM(CASE WHEN triesOrX = '5' THEN 1 ELSE 0 END) as five, SUM(CASE WHEN triesOrX = '4' THEN 1 ELSE 0 END) as four, SUM(CASE WHEN triesOrX = '3' THEN 1 ELSE 0 END) as three, SUM(CASE WHEN triesOrX = '2' THEN 1 ELSE 0 END) as two, SUM(CASE WHEN triesOrX = '1' THEN 1 ELSE 0 END) as one FROM leaderboard GROUP BY user`, [], (err, rows) => {
    if (err) {
      return console.log(err.message);
    }
    
    // Calculate the percentages and scores
    rows.forEach((row) => {
      row.xPercent = row.x / row.total * 100;
      row.sixPercent = row.six / row.total * 100;
      row.fivePercent = row.five / row.total * 100;
      row.fourPercent = row.four / row.total * 100;
      row.threePercent = row.three / row.total * 100;
      row.twoPercent = row.two / row.total * 100;
      row.onePercent = row.one / row.total * 100;
      
      // Calculate the score based on the user's personal table
      row.score = row.one * 6 + row.two * 5 + row.three * 4 + row.four * 3 + row.five * 2 + row.six * 1 + row.x * 0;
    });
    
    // Sort the rows by score in descending order
    rows.sort((a, b) => b.score - a.score);
    
    callback(rows);
  });
}


module.exports = { insertScore, getLeaderboard, db };
