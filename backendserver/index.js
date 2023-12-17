const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const client = require('./connection.js')
const crypto = require("crypto");
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

let globalEmail = "";
app.use(bodyParser.json());
app.use(cors());

app.get("/api/home", (req, res) => {

  const findContactID = 'select id from users WHERE email = $1';
  client.query(findContactID, [globalEmail], (err, result) => {
    if (err) {
      console.error('Error executing findContactID:', err);
      return;
    }

    const contact_id = result.rows[0].id;

      let getGroupChatInfoQuery = `select conv_name, conv_id from conversations WHERE contact_id = $1` 
      client.query(getGroupChatInfoQuery, [contact_id], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'An internal server error occurred on getGroupChatInfoQuery.' });
          return;
        }
  
        let chatInfo = result.rows;
      
        res.json({ message: "Refreshed", chatInfo});
    });
  });
});

app.get("/api/members", (req, res) => {

  const selectedGroupChatID = req.query.selectedGroupChatID;

  //console.log('Selected GroupChat id is: ' + selectedGroupChatID);

  let membersQuery = 'SELECT u.name FROM users u WHERE u.id IN ( SELECT c.contact_id FROM conversations c WHERE c.conv_id = $1)';
  client.query(membersQuery, [selectedGroupChatID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'An internal server error occurred on getting members query:' });
      return;
    }

    //membersCount can be gotten from here

    let names = result.rows;

    //console.log(names);

    res.json({ message: "Refreshed", names});
  });

});

app.get("/api/archives", (req, res) => {
  const selectedGroupChatID = req.query.selectedGroupChatID;

  if(selectedGroupChatID === 'Nothing'){
    res.json({message: "No groupchat selected."});
    return;
  }

  let archivesQuery = "select song, sender, score, artist from archives where conv_id = $1";
  client.query(archivesQuery, [selectedGroupChatID], (err, result) => {
    if(err){
      console.error("Error in archivesQuery: ", err);
    }

    let archivesData = result.rows;

    res.json({message:"Archives Query Complete", archivesData});

  });
});

app.get("/api/songStatus", (req, res) => {

  const selectedGroupChatID = req.query.selectedGroupChatID;
  //console.log("THIS IS SELECTED GROUPCHAT ID: " + selectedGroupChatID);

  if(selectedGroupChatID === 'Nothing'){
    res.json({message: "No groupchat selected."});
    return;
  }

  let songNotRated = true;

  let songExist = "select song_id from archives where conv_id = $1";
  client.query(songExist, [selectedGroupChatID], (err, result) => {
    if(err) {
      console.error('Error executing songExist: ', err);
      return;
    }

    if(result.rows.length === 0){
      songNotRated = true;
      console.log("No songs in archive.");
      let songName = "Send your first song!";
      let songArtist = '';
      res.json({message: "No songs in archive.", songNotRated, songName, songArtist });
      return;
    }

    let songMaxIDQuery = "select COALESCE(MAX(song_id), 0) from archives where conv_id = $1 AND legacy = 'no'";
    client.query(songMaxIDQuery, [selectedGroupChatID], (err, result) => {
    if (err) {
      console.error('Error executing songMaxIDQuery:', err);
      return;
    }

    let songMaxID = result.rows[0].coalesce;

    //console.log("song max id: " + songMaxID );

    let songNameQuery = "select song, artist from archives where song_id = $1 and conv_id = $2"
    let songNameQueryValues = [songMaxID, selectedGroupChatID];
    client.query(songNameQuery, songNameQueryValues, (err, result) => {
      if(err) {
        console.error('Error executing songNameQuery:', err);
        return;
      }

      let songName = result.rows[0].song;
      let songArtist = "by " + result.rows[0].artist;
      //console.log("Song Artist is " + songArtist);
      //console.log(songName);
      let membersQuery = 'SELECT count(u.name) FROM users u WHERE u.id IN ( SELECT c.contact_id FROM conversations c WHERE c.conv_id = $1)';
      client.query(membersQuery, [selectedGroupChatID], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'An internal server error occurred on getting members query:' });
          return;
        };

        let totalMembers = result.rows[0].count - 1;

        //console.log("number of members are " + totalMembers);

        let getCurrentCounterQuery = `SELECT count(rate) FROM songrating WHERE song_id = $1 AND conv_id = $2`;
        client.query(getCurrentCounterQuery, [songMaxID, selectedGroupChatID], (err, result) => {
          if (err) {
            console.log('Error getCurrentCounterQuery:', err);
            return;
          }
        let totalRated = result.rows[0].count;

        //console.log("total number of ratings are: " + totalRated);

        let getCurrentScoreQuery = 'select score, url from archives where song_id = $1 and conv_id = $2';
        client.query(getCurrentScoreQuery, [songMaxID, selectedGroupChatID], (err, result) => {
          if(err) {
            console.log('Error in getCurrentScoreQuery: ', err);
            return;
          }

          let currentScore = result.rows[0].score;
          let currentLink = result.rows[0].url;

          //console.log("Current Score is: " + currentScore);

            if(totalRated == totalMembers){
              songNotRated = true;
              songName = "Send a Song to Rate !"
              currentScore = '';
              songArtist = '';
              currentLink = '';
              res.json({ message: "Song is rated", songNotRated, songName, currentScore, songArtist })
            }
            else{
              songNotRated = false;
              res.json({message: "Song still grading", songNotRated, songName, currentScore, songArtist, currentLink })
            }

            });
          });
        });
      });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  globalEmail = email;
  console.log('Received login request:', { email, password });
  let verificationQuery = 'SELECT password FROM users WHERE email = $1'
  
  let getNameQuery = 'SELECT name FROM users WHERE email = $1'
  client.query(getNameQuery, [email], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'An internal server error occurred.' });
      return;
    }
    
  if (result.rows.length === 0) {
    console.log('No user found with the provided email.');
    res.status(401).json({ message: 'No user found with the provided email.' });
    return;
  }
  const nameofUser = result.rows[0].name;
  console.log('Name: ', { nameofUser});

  client.query(verificationQuery,[email],(err,result) =>{
  if (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
    return;
  }

  const databasePassword = result.rows[0].password;

  const hashPassword = (password) => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  };

  const hashedPassword = hashPassword(password);
  
  if(hashedPassword != databasePassword){
      console.log('incorrect password');
      res.status(401).json({ message: 'incorrect password' });
      return;
  }
  res.json({ message: "Login successful", name: nameofUser });
  });
});
});

app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received registration request:', { username, email, password });

  let uniqueUserQuery = 'select from users where name = $1'
  client.query(uniqueUserQuery, [username], (err, result) => {
    if(err) {
      console.error('Error running uniqueUserQuery:', err);
    }
    
    if (result.rows.length != 0) {
      console.log('User already exists.');
      res.status(200).json({ error: 'User already exists!' });
      return;
    }

  let verificationQuery = 'SELECT password FROM users WHERE email = $1'

  client.query(verificationQuery,[email],(err,result1) =>{

    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    if (result1.rows.length != 0) {
      console.log('Email already exists.');
      res.status(200).json({ error: 'Email already exists!' });
      return;
    }

    let maxidQuery = 'select MAX(id) from users';
    client.query(maxidQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
    const maxId = result.rows[0].max;
    const id = maxId !== null ? maxId + 1 : 1;

    let insertQuery = `INSERT INTO users (id, name, email, password)
                       VALUES ($1, $2, $3, $4)`;
    const values = [id, username, email, password];
    client.query(insertQuery, values, (err, result) => {
      if (!err) {
        console.log('Registration successful');
        res.status(200).json({ message: "Registration successful" });
      } else {
        console.error('Error occurred during registration:', err);
        res.status(500).send('Error occurred during registration');
      }
          });
        });
      });
    });
  });

  app.post('/api/home', (req, res) => {
    const { formType, song, artist, sender, score, chatTitle, chatDescription, usedEmailValue, usedSelectedGroupchat, 
            usedSelectedTitleBio, nameofNewMember, usedSelectedGroupchatID, usedSongName, usedArtistName, usedRating, 
            usedSongURL, usedNameofRemoveSong, usedNameofRemoveArtist, usedNameofRemoveMember } = req.body;
    
    let tempSelectedChat = usedSelectedGroupchat.selectedGroupchat;
    let tempSelectedChatID = usedSelectedGroupchatID.selectedConvoID;

    if(formType === 'formLegacy'){
      console.log('Received legacy submission:', { song, artist, sender, score, tempSelectedChatID });

      if(tempSelectedChat === 'Nothing'){
        res.status(400).json({ message: 'No groupchat selected' });
        return
      }

      if(song === ''){
        res.status(400).json({ message: 'Please input a song!' });
        return
      }
      
      if(artist === ''){
        res.status(400).json({ message: 'Please input an artist!' });
        return
      }
      
      if(sender === ''){
        res.status(400).json({ message: 'Please input a sender!' });
        return
      }
      
      if(score === ''){
        res.status(400).json({ message: 'Please input a score!' });
        return
      }

      let songAmountQuery= `select count(song_id) from archives where conv_id = $1`;
      client.query(songAmountQuery, [tempSelectedChatID], (err, result) => {
        if (err) {
          console.error('Error executing current query:', err);
          return;
        }
      let songAmountInSpecifiedChat = result.rows[0].count;
      console.log('Received legacy submission:', { songAmountInSpecifiedChat });
      
      let sentSongAlter = song;
      sentSongAlter = sentSongAlter.replace(/[ ']/g, '').toLowerCase();
      
      const checkExistenceQuery = `SELECT song FROM archives WHERE conv_id = $1`
      client.query(checkExistenceQuery, [tempSelectedChatID], (err, result) => {
        if (err) {
            console.error('Error executing checkExistenceQuery:', err); 
            return;
        } 
      const songsInChatAlready = result.rows.map(row => row.song.replace(/[ ']/g, '').toLowerCase());

      if(songsInChatAlready.includes(sentSongAlter)){
        res.status(400).json({ message: 'Song has been sent' });
        return
      }

      const yes = 'yes';
      const insertIntoArchivesQuery = `INSERT INTO archives (song_id, conv_id, song, artist, sender, score, legacy)
                                  VALUES ($1, $2, $3, $4, $5, $6, $7)`;
      const insertIntoArchivesValues = [songAmountInSpecifiedChat,tempSelectedChatID,song,artist,sender,score,yes];
      client.query(insertIntoArchivesQuery, insertIntoArchivesValues, (err, result) => {
        if (err) {
            console.error('Error executing fillInTableQuery:', err); 
            return;
        } 

        res.status(200).json({ message: 'Legacy submission successful', song, artist, sender, score });
      });
      });
      });
    
    } else if (formType === 'formNewChat'){      

      let maxidQuery = 'select MAX(conv_id) from conversations';
      client.query(maxidQuery, (err, result) => {

        if (err) {
          console.error('Error executing query:', err);
          return;
        }

        const maxId = result.rows[0].max;
        const id = maxId !== null ? maxId + 1 : 1;

        
        let tempEmail = usedEmailValue.usedEmail;
        
        const findContactID = 'select id from users WHERE email = $1';
        const findContactIDValues = [tempEmail];
        client.query(findContactID, findContactIDValues, (err, result) => {
          if (err) {
            console.error('Error executing findContactID:', err);
            return;
          }

          const contact_id = result.rows[0].id;

          const insertInTableQuery = `INSERT INTO conversations (conv_id, conv_name, contact_id)
                                      VALUES ($1, $2, $3)`;
          const insertInTablevalues = [id, chatTitle, contact_id];
          client.query(insertInTableQuery, insertInTablevalues, (err, result) => {
            if (err) {
                console.error('Error executing fillInTableQuery:', err); 
                return;
            } 

            res.status(200).json({ message: 'New chat made successfully', chatTitle, chatDescription });
            
          });
        });
      });
      console.log('New chat made successfully', { chatTitle, chatDescription });

    } else if (formType === 'formNewMember'){

      if(tempSelectedChat === 'Nothing'){
        res.status(400).json({ message: 'No groupchat selected' });
        return
      }

      if(nameofNewMember === ''){
        res.status(400).json({ message: 'Please input a username!' });
        return
      }

      const findContactID = 'select id from users WHERE name = $1';
      client.query(findContactID, [nameofNewMember], (err, result) => {
        if (err) {
          console.error('Error executing findContactID:', err);
          return;
        }

        if (result.rows.length === 0) {
          console.log('No user found with the provided name.');
          res.status(401).json({ message: 'No user found with the provided name.' });
          return;
        }
        const contact_id = result.rows[0].id;

        const checksIfUserIsInGroupChatQuery = `SELECT conv_id FROM conversations WHERE contact_id = $1 AND conv_id = $2`;
        client.query(checksIfUserIsInGroupChatQuery, [contact_id, usedSelectedGroupchatID.selectedConvoID], (err, result) => {
        if (err) {
          console.error('Error executing checksIfUserIsInGroupChatQuery:', err);
          return;
        } 
    
        if (result.rows.length !== 0) {
          res.status(400).json({ message: 'This user is already in this group chat!' });
          return;
        }
        
        const insertInNewMemberTableQuery = `INSERT INTO conversations (conv_id, conv_name, contact_id)
                                             VALUES ($1, $2, $3)`;
          const insertInNewMemberTablevalues = [usedSelectedGroupchatID.selectedConvoID, tempSelectedChat, contact_id];

          client.query(insertInNewMemberTableQuery, insertInNewMemberTablevalues, (err, result) => {
            if (err) {
                console.error('Error executing fillInTableQuery:', err); 
                return;
            } 

          res.status(200).json({ message: 'New member added to chat successfully'});
      });
    });
    });
    } else if (formType === 'formNewSong'){

      let selectedSong = usedSongName.nameofSong;
      let selectedArtist = usedArtistName.nameofArtist;
      let senderEmail = usedEmailValue.usedEmail;
      let sentURL = usedSongURL.songURL;

      if(tempSelectedChat === 'Nothing'){
        res.status(400).json({ message: 'No groupchat selected' });
        return
      }

      if(selectedSong === ''){
        res.status(400).json({ message: 'No song selected' });
        return;
      }

      if(selectedArtist === ''){
        res.status(400).json({ message: 'No artist selected' });
        return;
      }

      if(sentURL === undefined){
        res.status(400).json({ message: 'No URL attached' });
        return;
      }

      let sentSongSenderAlter = selectedSong;
      sentSongSenderAlter = sentSongSenderAlter.replace(/[ ']/g, '').toLowerCase();
      const checkExistenceSenderQuery = `SELECT song FROM archives WHERE conv_id = $1`
      client.query(checkExistenceSenderQuery, [tempSelectedChatID], (err, result) => {
        if (err) {
            console.error('Error executing checkExistenceQuery:', err); 
            return;
        } 
      const songsInChatAlreadySender = result.rows.map(row => row.song.replace(/[ ']/g, '').toLowerCase());

      console.log("songsInChatAlreadySender " + songsInChatAlreadySender);
      if(songsInChatAlreadySender.includes(sentSongSenderAlter)){
        res.status(400).json({ message: 'Song has been sent' });
        return
      }

      let songAmountQuery= `select count(song_id) from archives where conv_id = $1`;
      client.query(songAmountQuery, [tempSelectedChatID], (err, result) => {
        if (err) {
          console.error('Error executing current query:', err);
          return;
        }
        
        let songAmountInSpecifiedChat = result.rows[0].count;

        let userQuery = 'select name from users where email = $1';
        client.query(userQuery, [senderEmail], (err, result1) => {
          if(err) {
            console.log('Error selecting from users table:', err);
            return;
          }

          let user = result1.rows[0].name;

          let insertQuery = `INSERT INTO archives (song_id, conv_id, song, sender, legacy, artist, score, url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
          let insertQueryValues = [songAmountInSpecifiedChat, tempSelectedChatID, selectedSong, user, 'no', selectedArtist, '', sentURL];
          client.query(insertQuery, insertQueryValues, (err, result) => {
            if (err) {
              console.log('Error adding song from sender into archives:', err);
              return;
            }

            res.status(200).json({ message: 'New song added to archives successfully'});

          })
      });
      });
      });
  }  else if (formType === 'formGrader'){
      const conv_IDG = tempSelectedChatID;
      const userRatingG = usedRating.rating;
      const userEmailG = usedEmailValue.usedEmail;

      //Check if user inputted nothing
      if(usedRating.rating === ''){
          res.status(400).json({ message: 'No grade given' });
          return;
        }
      
      //Checks if user selectedGroupchat
      if(tempSelectedChatID === 'Nothing'){
        res.status(400).json({ message: 'No groupchat selected' });
        return
      }

      //Get username from inputted email
      let userQueryG = 'select name from users where email = $1';
      client.query(userQueryG, [userEmailG], (err, result) => {
        if(err) {
          console.log('Error selecting from users table:', err);
          return;
        }
      let userG = result.rows[0].name;
      
      //Get song_id
      let maxSongIDQuery = `SELECT MAX(song_id) FROM archives WHERE conv_id = $1 AND legacy = 'no' `;
        client.query(maxSongIDQuery, [conv_IDG], (err, result) => {
          if (err) {
            console.log('Error maxSongIDQuery:', err);
            return;
          }
          let maxSongID = result.rows[0].max;

          if(maxSongID === null){
            res.status(400).json({ message: 'No Song Sent' });
            return;
          }
          //console.log(maxSongID);

      //Get sender of the song
      let getSenderQuery = `SELECT sender FROM archives WHERE song_id = $1 AND conv_id = $2`;
      client.query(getSenderQuery, [maxSongID, conv_IDG], (err, result) => {
        if (err) {
          console.log('Error getCurrentScoreQuery:', err);
          return;
        }    
      let songSender = result.rows[0].sender;
        if(songSender === userG){
          res.status(400).json({ message: 'You sent this song! No grading allowed' });
          return;
        }

      //Check if user has already graded
      let insertOrUpdateIntoSongRatingQuery;
      let insertOrUpdateIntoSongRatingValues;
      let gradedAlreadyCheckQuery = `SELECT "name" FROM songrating WHERE song_id = $1 AND conv_id = $2`;
      client.query(gradedAlreadyCheckQuery, [maxSongID, conv_IDG], (err, result) => {
        if (err) {
          console.log('Error insertIntoSongRatingQuery:', err);
          return;
        }
      const gradersSoFar = result.rows.map(row => row.name);
      let changedRating = userRatingG*10;
      
      //Insert into the songrating table or update if already graded
      if(gradersSoFar.includes(userG)){
        insertOrUpdateIntoSongRatingQuery = `UPDATE songrating SET rate = $1
                                             WHERE song_id = $2 AND conv_id = $3 AND name = $4`;
        insertOrUpdateIntoSongRatingValues = [changedRating, maxSongID, conv_IDG, userG];

        console.log("Updating");
      }else{
        insertOrUpdateIntoSongRatingQuery = `INSERT INTO songrating (song_id, conv_id, name, rate)
                                             VALUES ($1, $2, $3, $4) `;
        insertOrUpdateIntoSongRatingValues = [maxSongID, conv_IDG, userG, changedRating];    
        console.log("Inserting");
      } 

      client.query(insertOrUpdateIntoSongRatingQuery, insertOrUpdateIntoSongRatingValues, (err, result) => {
        if (err) {
          console.log('Error insertIntoSongRatingQuery:', err);
          return;
        }
        
      //Get the sum of all ratings for this specific song
      let getCurrentScoreQuery = `SELECT sum(rate) FROM songrating WHERE song_id = $1 AND conv_id = $2`;
      client.query(getCurrentScoreQuery, [maxSongID, conv_IDG], (err, result) => {
        if (err) {
          console.log('Error getCurrentScoreQuery:', err);
          return;
        }
      let totalScore = result.rows[0].sum;
      totalScore = totalScore/10;

      //Get the total amount of ratings for this song
      let getCurrentCounterQuery = `SELECT count(rate) FROM songrating WHERE song_id = $1 AND conv_id = $2`;
      client.query(getCurrentCounterQuery, [maxSongID, conv_IDG], (err, result) => {
        if (err) {
          console.log('Error getCurrentCounterQuery:', err);
          return;
        }
      let totalCount = result.rows[0].count;
      totalCount = totalCount*10; 
      let ArchivesScoreInput = totalScore + '/' + totalCount;

      //Update the archives table with each grade submission
      let addScoreToArchives = `UPDATE archives SET score = $1 where song_id = $2 AND conv_id = $3`;
      client.query(addScoreToArchives, [ArchivesScoreInput, maxSongID, conv_IDG], (err, result) => {
        if (err) {
          console.log('Error addScoreToArchives:', err);
          return;
        }

        res.status(200).json({ message: 'Grading success'});
        });
        });
        });
        });
        });
        });
        });
        });
    } else if (formType === 'formLeaving'){    

      let tempSelectedChat = usedSelectedGroupchat.selectedGroupchat;
      if(tempSelectedChat === 'Nothing'){
        res.status(400).json({ message: 'No groupchat selected' });
        return
      }

      let userEmailL = usedEmailValue.usedEmail;
      //Get username from inputted email
      let userQueryL = 'select id from users where email = $1';
      client.query(userQueryL, [userEmailL], (err, result) => {
        if(err) {
          console.log('Error selecting from users table:', err);
          return;
        }
      let userL = result.rows[0].id;    
      let groupIDL = usedSelectedGroupchatID.selectedConvoID;

      let leaveGroupChatQuery = 'DELETE FROM conversations WHERE contact_id = $1 AND conv_id = $2';
      client.query(leaveGroupChatQuery, [userL, groupIDL], (err, result) => {
        if(err) {
          console.log('Error selecting from users table:', err);
          return;
        }

      res.status(200).json({ message: 'Leaving success'});
      });
      });
    } else if (formType === 'formMemberKick'){    
      
      let tempSelectedChat = usedSelectedGroupchat.selectedGroupchat;
      if(tempSelectedChat === 'Nothing'){
        res.status(400).json({ message: 'No groupchat selected' });
        return
      }

      let removeUser = usedNameofRemoveMember.nameofRemoveMember;
      
      let removeUserKickQuery = 'SELECT id FROM users WHERE name = $1';
      client.query(removeUserKickQuery, [removeUser], (err, result) => {
        if(err) {
          console.log('Error selecting from users table:', err);
          return;
        }
      let userK = result.rows[0].id;  
      
      let groupIDK = usedSelectedGroupchatID.selectedConvoID;
      let leaveGroupChatQuery = 'DELETE FROM conversations WHERE contact_id = $1 AND conv_id = $2';
      client.query(leaveGroupChatQuery, [userK, groupIDK], (err, result) => {
        if(err) {
          console.log('Error selecting from users table:', err);
          return;
        }
        
      res.status(200).json({ message: 'Kicking success'});
      });
      });
    }
    else {
      // Handle cases where the formType is not recognized.
      res.status(400).json({ message: 'Invalid formType' });
    }

  });

app.listen(PORT, () => {
  client.connect();
  console.log(`Server listening on ${PORT}`);
});